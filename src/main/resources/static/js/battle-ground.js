'use strict';

class BattleGround {
	constructor(canvas, numRows, numCols){
		// canvas 
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		// numCells
		this.rows = numRows;
		this.cols = numCols;
		// The different sorts of ground the map has defined in map-properties.js
		this.BLOCKS = Object.freeze(mapProperties);
		// Status : The window frame, the map and cell dimensions
		this.frame = new Rectangle(canvas.width, canvas.height);
		this.cell = new Square(Math.floor(this.frame.width / this.cols), Math.floor(this.frame.height / this.rows));
		this.table = new Rectangle(this.cols * this.cell.width, this.rows * this.cell.height);
		// the center of the battleGround
		this.mapCenter = this.table.center;
		
		// For zoom
		this.zoomScale = 1,
		// For the camera movements
		this.moveScale = 5,
		
		// When designing, line features
		this.lineDash = 0,
		this.lineWidth = 1,
		
		// Only the 60% of the window (internal) can be used for zoom, the others are for movements
		this.zoomZone = 0.6,
		
		// Borders
		this.margin = undefined;
		this.defineMapFeature();
		
		// Çreating map content
		this.mapContent = createArray(this.rows, this.cols);
		
		// Mouse info
		this.mouseAt = {
			windowPosition: { x: "x", y: "y" },
			mapPosition: { x: "x", y: "y" },
			cellPosition: { x: "x", y: "y" }
		}
		
		// Map (key, value) which contains the robots in the game
		this.robots = new Map();
		// If theres a robot that has to be followed
		this.followRobot = null;
		// Boolean that says if it is real playing or just a test
		this.play = true;
	}
	
	// Calculations for where the mouse is at
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
	
	// Redefining all measures for the map
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
	
	// Zooming in 
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
	
	// Zooming out
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
	
	// Adds a robot to the map (key, value)
	addRobot(robot){
		this.robots.set("robot_" + robot.info.id, robot);
	}
	
	// Fills the map content with data
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
		callback();
	}
	
	// Search an empty cell, if theres no empty cell, it will return null
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
	
	// Transform relative position to real
	toRealPosition(point){
		return new Point(Math.floor(this.table.width * point.x), Math.floor(this.table.height * point.y));
	}
	
	// Given a point, returns the cell this point is at
	getCellPosition(point){
		let mouseAt = this.defineMouseAt(
			this.margin.left + this.table.width * point.x,
			this.margin.top + this.table.height * point.y);
		return new Point(mouseAt.cellPosition.x, mouseAt.cellPosition.y);
	}
	
	// Checks the ground a point is at
	checkPosition(point){
		point = this.getCellPosition(point);
		if (0 <= point.x && point.x < this.cols && 0 <= point.y && point.y < this.rows) {
			return this.mapContent[point.y][point.x].index;
		}
		else return this.BLOCKS.NOTHING.id;
	}
	
	// Checks if a robot can move through this cell
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
	
	// Checks if a bullet can explode on this cell
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
	
	// While designing a map, sets an image to the cell
	setImageOnCell(x, y, image, index){
		if (0 <= x && x < this.rows && 0 <= y && y < this.cols){
			this.mapContent[x][y] = {
	    			image: image,
	    			index: (image == null) ? 0 : index
	    	}
		}
	}
	
	// Draws a cell with an image in an especified position
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
	
	// Draws all map content
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
	    let self = this;
	    // Here draws all robots
	    this.robots.forEach(function(value, key) {
	    	if (value.hp > 0) {
			    self.ctx.save();
		    	self.ctx.translate(
	    			self.margin.left + Math.floor(self.table.width * value.x),
	    			self.margin.top + Math.floor(self.table.height * value.y));
			    self.ctx.rotate(toRadians(value.rotation));
		    	self.ctx.drawImage(value.image, -self.cell.center.x * value.width, -self.cell.center.y * value.height, self.cell.width * value.width, self.cell.height * value.height);
		    	self.ctx.restore();
		    	// Here draws all bullets
		    	for (let x in value.bullets) {
		    		value.bullets[x].next(self);
		    		if (value.bullets[x].state != value.bullets[x].STATES.DELETE) {
			    	    self.ctx.save();
				    	self.ctx.translate(
			    			self.margin.left + Math.floor(self.table.width * value.bullets[x].x),
			    			self.margin.top + Math.floor(self.table.height * value.bullets[x].y));
					    self.ctx.rotate(toRadians(value.bullets[x].rotation));
					    self.ctx.drawImage(value.bullets[x].image, -self.cell.center.x * value.bullets[x].width, -self.cell.center.y * value.bullets[x].height, self.cell.width * value.bullets[x].width, self.cell.height * value.bullets[x].height);
				    	self.ctx.restore();
		    		}
		    		else {
		    			value.bullets.splice(x, 1);
		    		}
		    	}
	    	}
	    	// If the robot has no hp left then adds a loss to the robot, and if it has only one robot left then add win to that robot
	    	else {
	    		if (self.play) {
		    		$.post( "/addLoss", { "id": value.info.creatorId, "_csrf": csrf_data.token });
	    		}
	    		self.robots.delete(key);
	    		if (self.robots.size == 1) {
	    			 self.robots.forEach(function(valueWinner, keyWinner){
	    				 if (self.play) {
	    					 $.post( "/addWin", {"id": valueWinner.info.creatorId,  "_csrf": csrf_data.token });
	    				 }
	    				 notifier.success("" + valueWinner.info.name + "/" + valueWinner.info.creatorName + " has won!!!");
	    			 });

    				 if (self.play) {
    					 document.getElementById("playagain-button").classList.remove("disabled");
    				 }
	    		}
	    	}
	    });
	    return this;
	}
	
	// Draw the matrix of the cell map when designing
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
	
	// Function which shows some info for the user to draw map while designing
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
	
	// Translate all data to json
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
	
	// Reset sizes 
	reset(canvas){
		this.canvas = canvas;
		this.frame = new Rectangle(canvas.width, canvas.height);
		this.cell = new Square(Math.floor(this.frame.width / this.cols), Math.floor(this.frame.height / this.rows));
		this.table = new Rectangle(this.cols * this.cell.width, this.rows * this.cell.height);
		this.mapCenter = this.table.center;
		this.defineMapFeature();
	}
	
	// Clear all data 
	clear() {
	    this.ctx.save();
	    this.ctx.beginPath();
	    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
	    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	    this.ctx.restore();
	    return this;
	}
}