'use strict';

class BattleGround {
	constructor(canvas, numRows, numCols){
		// canvas 
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		// numCells
		this.rows = numRows;
		this.cols = numCols;
		// BLOCKS
		this.BLOCKS = Object.freeze(mapProperties);
		// status 
		this.frame = new Rectangle(canvas.width, canvas.height);
		this.cell = new Square(Math.floor(this.frame.width / this.cols), Math.floor(this.frame.height / this.rows));
		this.table = new Rectangle(this.cols * this.cell.width, this.rows * this.cell.height);
		// the center of the battleGround
		this.mapCenter = this.table.center;
		
		this.zoomScale = 1,
		this.moveScale = 5,
		this.lineDash = 0,
		this.lineWidth = 1,
		this.zoomZone = 0.6,
		this.margin = undefined;
		
		this.defineMapFeature();
		
		this.mapContent = createArray(this.rows, this.cols);
		
		this.mouseAt = {
			windowPosition: { x: "x", y: "y" },
			mapPosition: { x: "x", y: "y" },
			cellPosition: { x: "x", y: "y" }
		}
		
		this.robots = new Map();
		this.followRobot = null;
	}
	
	defineMouseAt(x, y){
		let mouseAt = {
			windowPosition: { x: "x", y: "y" },
			mapPosition: { x: "x", y: "y" },
			cellPosition: { x: "x", y: "y" }
		}
		mouseAt.windowPosition.x = x;
		mouseAt.windowPosition.y = y;
		mouseAt.mapPosition.x = mouseAt.windowPosition.x - this.margin.left;
		mouseAt.mapPosition.y = mouseAt.windowPosition.y - this.margin.top;
		mouseAt.cellPosition.x = Math.floor(mouseAt.mapPosition.x / this.cell.width);
		mouseAt.cellPosition.y = Math.floor(mouseAt.mapPosition.y / this.cell.height);
		if (0 > mouseAt.mapPosition.x || mouseAt.mapPosition.x > this.table.width) mouseAt.mapPosition.x = "x";
		if (0 > mouseAt.mapPosition.y || mouseAt.mapPosition.y > this.table.height) mouseAt.mapPosition.y = "y";
		if (0 > mouseAt.cellPosition.x || mouseAt.cellPosition.x > this.cols) mouseAt.cellPosition.x = "x";
		if (0 > mouseAt.cellPosition.y || mouseAt.cellPosition.y > this.rows) mouseAt.cellPosition.y = "y";
		return mouseAt;
	}
	
	defineMapFeature(){
		this.lineDash = (this.table.width < this.frame.width || this.table.height < this.frame.height) ? 0 : 1; 
		
		let windowDistancesTo = this.frame.distancesTo(this.frame.center);
		let mapDistancesTo = this.table.distancesTo(this.mapCenter);
		this.margin = {
	        left : windowDistancesTo.left - mapDistancesTo.left,
	        right : windowDistancesTo.right - mapDistancesTo.right,
	        top : windowDistancesTo.top - mapDistancesTo.top,
	        down : windowDistancesTo.down - mapDistancesTo.down
	    }
	}
	
	zoomIn(){
		let windowCenter = this.frame.center;
		let horizontal = this.mouseAt.windowPosition.x - windowCenter.x;
		let vertical = this.mouseAt.windowPosition.y - windowCenter.y;
		if (Math.abs(horizontal) < windowCenter.x * this.zoomZone && Math.abs(vertical) < windowCenter.y * this.zoomZone){
			this.cell.zoomIn(this.zoomScale);
            if (this.frame.isLessThan(new Rectangle(this.cell.width * 10, this.cell.height * 10)))
                this.cell.zoomOut(this.zoomScale);
		}
		else {
			this.mapCenter.x += (horizontal > 0) ? this.moveScale : this.moveScale * -1;
			this.mapCenter.y += (vertical > 0) ? this.moveScale : this.moveScale * -1;
		}
	}
	
	zoomOut(){
		let windowCenter = this.frame.center;
		let horizontal = this.mouseAt.windowPosition.x - windowCenter.x;
		let vertical = this.mouseAt.windowPosition.y - windowCenter.y;
		if (Math.abs(horizontal) < windowCenter.x * this.zoomZone && Math.abs(vertical) < windowCenter.y * this.zoomZone){
			this.cell.zoomOut(this.zoomScale);
            if (this.frame.isMoreThan(this.table))
                this.cell.zoomIn(this.zoomScale);
		}
		else {
			this.mapCenter.x += (horizontal > 0) ? this.moveScale * -1 : this.moveScale;
	    	this.mapCenter.y += (vertical > 0) ? this.moveScale * -1 : this.moveScale;
		}
	}
	
	addRobot(robot){
		this.robots.set("robot_" + robot.info.id, robot);
	}
	
	fillContent(data, callback){
		let set = new Set();
		for (let i = 0; i < data.cellDim.rows; i++)
	    	for (let j = 0; j < data.cellDim.cols; j++)
	    		set.add(data.data[i][j]);
		
		for (let item of set){
			imageLoader.loadImage("map_" + item, "/static/img/map/component (" + item + ").png", callback);
		}
		
		for (let i = 0; i < this.rows; i++){
	    	for (let j = 0; j < this.cols; j++){
	    		this.mapContent[i][j] = {
	    			image : imageLoader.image("map_" + data.data[i][j]),
	    			index : data.data[i][j],
	    			robot : false
	    		}
	    	}
	    }
	}
	
	findEmptyCell(){
		let x = Math.floor((Math.random() * (this.rows - 1)));
		let y = Math.floor((Math.random() * (this.cols - 1)));
		let block = undefined;
		for (let i = 0; i < this.rows; i++){
	    	for (let j = 0; j < this.cols; j++){
	    		block = this.mapContent[(x + i) % this.rows][(y + j) % this.cols];
	    		if (this.canIMoveOn(block.index) && !block.robot){
	    			let pI = (y + j) % this.cols;
	    			let pJ = (x + i) % this.rows;
	    			block.robot = true;
	    			return new Point((pI * this.cell.width + this.cell.center.x) / this.table.width,
	    					(pJ * this.cell.height + this.cell.center.y) / this.table.height);
	    		}
	    	}
		}
		return null;
	}
	
	toRealPosition(point){
		return new Point(Math.floor(this.table.width * point.x), Math.floor(this.table.height * point.y));
	}
	
	getCellPosition(point){
		let mouseAt = this.defineMouseAt(
			this.margin.left + this.table.width * point.x,
			this.margin.top + this.table.height * point.y);
		return new Point(mouseAt.cellPosition.x, mouseAt.cellPosition.y);
	}
	
	checkPosition(point){
		point = this.getCellPosition(point);
		if (0 <= point.x && point.x < this.cols && 0 <= point.y && point.y < this.rows) {
			return this.mapContent[point.y][point.x].index;
		}
		else return this.BLOCKS.NOTHING.id;
	}
	
	canIMoveOn(cell) {
		let moveOn = [
			this.BLOCKS.PLATFORM,
			this.BLOCKS.GRASS,
			this.BLOCKS.GROUND,
			this.BLOCKS.BRIDGE,
			this.BLOCKS.MAGMA
		];
		let yes = false;
		for (let i in moveOn) {
			yes = yes || (cell == moveOn[i].id);
		}
		return yes;
	}
	
	canIShotBulletOn(cell) {
		let shotBulletOn = [
			this.BLOCKS.NOTHING,
			this.BLOCKS.BARRIER_7,
			this.BLOCKS.BARRIER_8,
			this.BLOCKS.BARRIER_9,
			this.BLOCKS.BARRIER_10,
			this.BLOCKS.BARRIER_11,
			this.BLOCKS.BARRIER_12,
			this.BLOCKS.BARRIER_13,
			this.BLOCKS.BARRIER_14,
			this.BLOCKS.BARRIER_15,
			this.BLOCKS.BARRIER_16,
			this.BLOCKS.BARRIER_17,
			this.BLOCKS.BARRIER_18,
			this.BLOCKS.BARRIER_19,
			this.BLOCKS.BARRIER_20,
			this.BLOCKS.BARRIER_21,
			this.BLOCKS.BARRIER_22,
			this.BLOCKS.BARRIER_23,
			this.BLOCKS.BARRIER_24,
			this.BLOCKS.BARRIER_25,
			this.BLOCKS.BARRIER_26,
			this.BLOCKS.BARRIER_27,
			this.BLOCKS.BARRIER_28,
			this.BLOCKS.BARRIER_29,
			this.BLOCKS.BARRIER_30
		];
		let yes = false;
		for (let i in shotBulletOn) {
			yes = yes || (cell == shotBulletOn[i].id);
		}
		return yes;
	}
	
	setImageOnCell(x, y, image, index){
		if (0 <= x && x < this.rows && 0 <= y && y < this.cols){
			this.mapContent[x][y] = {
	    			image: image,
	    			index: (image == null) ? 0 : index
	    	}
		}
	}
	
	drawCell(x, y, image){
	    this.ctx.fillStyle = "#00FFEE";
		if (0 <= x && x < this.cols && 0 <= y && y < this.rows) {
			x = x * this.cell.width + this.margin.left;
			y = y * this.cell.height + this.margin.top;
			if (-this.cell.width <= x && x <= this.frame.width && -this.cell.height <= y && y <= this.frame.height){
				if (image == undefined || image == null)
					this.ctx.fillRect(x, y, this.cell.width, this.cell.height);
				else this.ctx.drawImage(image, x, y, this.cell.width, this.cell.height);
			}
		}
	}
	
	drawMapContent(){
		if (this.followRobot != null) {
			let robot = this.robots.get("robot_" + this.followRobot);
			if (robot != null) {
				this.mapCenter.x = Math.floor(this.table.width * robot.x);
				this.mapCenter.y = Math.floor(this.table.height * robot.y);
				this.defineMapFeature();
			}
		}
	    for (let i = 0; i < this.rows; i++)
	        for (let j = 0; j < this.cols; j++)
	            if (this.mapContent[i][j] != undefined && this.mapContent[i][j].image != undefined)
	                this.drawCell(j, i, this.mapContent[i][j].image);
	    this.robots.forEach(function(value, key) {
	    	if (value.hp > 0) {
			    this.ctx.save();
		    	this.ctx.translate(
	    			this.margin.left + Math.floor(this.table.width * value.x),
	    			this.margin.top + Math.floor(this.table.height * value.y));
			    this.ctx.rotate(toRadians(value.rotation));
		    	this.ctx.drawImage(value.image, -this.cell.center.x * value.width, -this.cell.center.y * value.height, this.cell.width * value.width, this.cell.height * value.height);
		    	this.ctx.restore();
		    	for (let x in value.bullets) {
		    		value.bullets[x].next(this);
		    		if (value.bullets[x].state != value.bullets[x].STATES.DELETE) {
			    	    this.ctx.save();
				    	this.ctx.translate(
			    			this.margin.left + Math.floor(this.table.width * value.bullets[x].x),
			    			this.margin.top + Math.floor(this.table.height * value.bullets[x].y));
					    this.ctx.rotate(toRadians(value.bullets[x].rotation));
					    this.ctx.drawImage(value.bullets[x].image, -this.cell.center.x * value.bullets[x].width, -this.cell.center.y * value.bullets[x].height, this.cell.width * value.bullets[x].width, this.cell.height * value.bullets[x].height);
				    	this.ctx.restore();
		    		}
		    		else {
		    			value.bullets.splice(x, 1);
		    		}
		    	}
	    	}
	    	else {
	    		$.post( "/addLoss", { "id": value.info.creatorId, "_csrf": csrf_data.token });
	    		this.robots.delete(key);
	    		if (this.robots.size == 1) {
	    			 for (let [keyWinner, valueWinner] of this.robots) {
	    				 $.post( "/addWin", {"id": valueWinner.info.creatorId,  "_csrf": csrf_data.token });
	    			 }
	    			 document.getElementById("playagain-button").classList.remove("disabled");
	    		}
	    	}
	    });
	    return this;
	}
	
	drawCellMap() {

	    this.ctx.setLineDash([this.lineDash, this.lineDash]);
	    this.ctx.lineWidth = this.lineWidth;
	    this.ctx.strokeStyle = "gray";
	    
		let coord = {
	    	left : (this.margin.left > 0) ? this.margin.left : 0,
	        right : (this.margin.right > 0) ? this.frame.width - this.margin.right : this.frame.width,
			up : (this.margin.top > 0) ? this.margin.top : 0,
	        down : (this.margin.down > 0) ? this.frame.height - this.margin.down : this.frame.height
		}
	    
	    let i = (this.margin.left > 0) ? this.margin.left : this.cell.width - Math.abs(this.margin.left % this.cell.width);
	    let j = (this.margin.top > 0) ? this.margin.top : this.cell.height - Math.abs(this.margin.top % this.cell.height);

	    while (i <= coord.right){
	    	this.ctx.moveTo(i + 0.5, coord.up);
	    	this.ctx.lineTo(i + 0.5, coord.down);
	        i += this.cell.width;
	    }

	    while (j <= coord.down){
	    	this.ctx.moveTo(coord.left, j + 0.5);
	    	this.ctx.lineTo(coord.right, j + 0.5);
	        j += this.cell.height;
	    }
	    
	    this.ctx.stroke();
	    return this;
	}
	
	writeInfo(){
		let distancesTo;
		this.ctx.fillStyle = "white";
		this.ctx.font = "20px Arial";
		this.ctx.fillText("[" + this.mouseAt.cellPosition.y + ", " + this.mouseAt.cellPosition.x + "]", 10, 20);
		this.ctx.fillText("[" + this.mouseAt.mapPosition.y + ", " + this.mouseAt.mapPosition.x + "]", 10, 40);
		this.ctx.fillText("[" + this.mouseAt.windowPosition.y + ", " + this.mouseAt.windowPosition.x + "]", 10, 60);
		/*this.ctx.font = "15px Arial";
		this.ctx.fillText("Dimension win [" + this.frame.width + ", " + this.frame.height + "]", 10, 80);
		this.ctx.fillText("Dimension battleGround [" + this.table.width + ", " + this.table.height + "]", 10, 100);
		this.ctx.fillText("Dimension cell [" + this.cell.width + ", " + this.cell.height + "]", 10, 120);
		distancesTo = this.frame.distancesTo(this.frame.center);
		this.ctx.fillText("Distance win [" + distancesTo.left + ", " + distancesTo.right + ", " + distancesTo.top + ", " + distancesTo.down + "]", 10, 140);
		distancesTo = this.table.distancesTo(this.mapCenter);
		this.ctx.fillText("Distance battleGround [" + distancesTo.left + ", " + distancesTo.right + ", " + distancesTo.top + ", " + distancesTo.down + "]", 10, 160);
		this.ctx.fillText("Center [" + this.mapCenter.x + ", " + this.mapCenter.y + "]", 10, 180);
		this.ctx.fillText("Margin [" + this.margin.left + ", " + this.margin.right + ", " + this.margin.top + ", " + this.margin.down + "]", 10, 200);
		this.ctx.fillText("Canvas [" + this.canvas.width + ", " + this.canvas.height + "]", 10, 220);
		*/return this;
	}
	
	json(){
		let result = {
			cellDim : undefined,
			data : undefined
		}
		
		result.cellDim = {
			rows : this.rows,
			cols : this.cols
		}
		
		result.data = createArray(this.rows, this.cols);
		
		for (let i = 0; i < this.rows; i++){
	        for (let j = 0; j < this.cols; j++){
	            if (this.mapContent[i][j] != undefined) 
	            	result.data[i][j] = this.mapContent[i][j].index;
	            else result.data[i][j] = 0;
	        }
		}
		return JSON.stringify(result);
	}
	
	reset(canvas){
		this.canvas = canvas;
		this.frame = new Rectangle(canvas.width, canvas.height);
		this.cell = new Square(Math.floor(this.frame.width / this.cols), Math.floor(this.frame.height / this.rows));
		this.table = new Rectangle(this.cols * this.cell.width, this.rows * this.cell.height);
		this.mapCenter = this.table.center;
		this.defineMapFeature();
	}
	
	clear() {
	    this.ctx.save();
	    this.ctx.beginPath();
	    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
	    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	    this.ctx.restore();
	    return this;
	}
}