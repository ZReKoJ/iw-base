function createArray(length) {
    let arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        let args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function codeDesign() {
	
	let codeMirror = document.getElementById("codeText");
	
	let codeMirrorEditor = CodeMirror.fromTextArea(codeMirror, {
		lineNumbers : true,
		mode : "javascript",
		theme : "lucario",
		indentUnit : 4,
		tabSize : 4,
		smartIndent : true,
		maxHighlightLength : Infinity,
		extraKeys: {"Ctrl-Space": "autocomplete"}
	});
	
	codeMirrorEditor.setValue(document.documentElement.innerHTML);
	
	$(".btn-glyphicon-title").change(function() {
	    let fileInput = document.getElementById('fileSent');
	    let file = fileInput.files[0];
	    $("#codeFileName").val(file.name);
	        
        let fileReader = new FileReader();
		fileReader.readAsText(file);
        fileReader.onload = function (e) {
        	codeMirrorEditor.setValue(fileReader.result);
		}
	});
	
}

function login(){
	
	$('#login-form-link').click(function(e) {
		$("#login-form").delay(100).fadeIn(100);
 		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	
	$('#register-form-link').click(function(e) {
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	
}

function profile() {
	
    let buttons = $('#responsive');
    let links = buttons.find('a');
 
    links.click(function(e) {
    	
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
        
        let index = $(this).index();
        
        $("div.user-menu>div.user-menu-content").removeClass("active");
        $("div.user-menu>div.user-menu-content").eq(index).addClass("active");
        
    });

    $("[rel='tooltip']").tooltip();    
 
    $('.view').hover(
    		
        function(){
            $(this).find('.caption').slideDown(250); //.fadeIn(250)
        },
        
        function(){
            $(this).find('.caption').slideUp(250); //.fadeOut(205)
        }
        
        
    ); 
}

function home(){

	$(".main.button.homeMenu").mousedown(function(){
		$(".menu").toggleClass("closed");
		
		if($(".menu").hasClass("closed")) {
			$(".main.button").text("Menu");
			$(".profile.button").text(" ");
			$(".ranking.button").text(" ");
			$(".code.button").text(" ");
			$(".mapd.button").text(" ");
			$(".profile.button").removeAttr("href");
			$(".ranking.button").removeAttr("href");
			$(".code.button").removeAttr("href");
			$(".mapd.button").removeAttr("href");
		} else {
			$(".main.button").text("Close");
			$(".profile.button").text("Profile");
			$(".ranking.button").text("Ranking");
			$(".code.button").text("Code Design");
			$(".mapd.button").text("Map Design");
			$(".profile.button").attr("href", "profile");
			$(".ranking.button").attr("href", "ranking");
			$(".code.button").attr("href", "code-design");
			$(".mapd.button").attr("href", "map-design");
			
		}
	});
	
}

function setCanvasSize(canvas, width, height){
	canvas.width = width;
	canvas.height = height;
}

class Point {
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
	
	relativeLocation(oldRectangle, newRectangle){
		this.x = Math.floor(newRectangle.width * this.x / oldRectangle.width),
		this.y = Math.floor(newRectangle.height * this.y / oldRectangle.height)
	}
}

class Rectangle {
	constructor(width, height) {
		this.width = width;
		this.height = height;
	}
	
	get center() {
		return this.calculateCenter();
	}
	
	get area() {
		return this.calculateArea();
	}
	
	get diagonal() {
		return this.calculateDiagonal();
	}
	
	calculateCenter(){
		return new Point(Math.floor(this.width / 2), Math.floor(this.height / 2));
	}
	
	calculateArea(){
		return this.width * this.height;
	}
	
	calculateDiagonal(){
		return Math.sqrt(this.width * this.width + this.height * this.height);
	}
	
	distancesTo(point){
		return {
			left: point.x,
			right: this.width - point.x,
			top: point.y,
			down: this.height - point.y
		};
	}
	
	isMoreThan(rectangle){
		return this.width > rectangle.width && this.height > rectangle.height;
	}
	
	isLessThan(rectangle){
		return this.width < rectangle.width && this.height < rectangle.height;
	}
	
	isMoreEqual(rectangle){
		return this.width >= rectangle.width && this.height >= rectangle.height;
	}
	
	isLessEqual(rectangle){
		return this.width <= rectangle.width && this.height <= rectangle.height;
	}
	
}

class Square extends Rectangle {
	constructor(width, height){
		super(width, height);
		let min = Math.min(width, height);
		this.width = min;
		this.height = min;
	}
	
	zoomIn(value){
		this.width += value;
		this.height += value;
	}
	
	zoomOut(value){
		this.width -= value;
		this.height -= value;
	}
}

class BattleGround {
	constructor(canvas, numRows, numCols){
		// canvas 
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		// numCells
		this.rows = numRows;
		this.cols = numCols;
		// Blocks
		this.BLOCKS = Object.freeze({
			"NOTHING": 0,
			"PLATFORM": 205,
			"GROUND": 206,
			"GRASS": 207,
			"WATER": 208,
			"BARRIER": 195
			});
		// status 
		this.frame = new Rectangle(canvas.width, canvas.height);
		this.cell = new Square(Math.floor(this.frame.width / this.cols), Math.floor(this.frame.height / this.rows));
		this.table = new Square(this.cols * this.cell.width, this.rows * this.cell.height);
		// the center of the battleGround
		this.mapCenter = this.table.center;
		
		this.zoomScale = 1,
		this.moveScale = 5,
		this.lineDash = 0,
		this.lineWidth = 1,
		this.zoomZone = 0.6,
		this.margin = undefined;
		
		this.defineMapFeature();
		
		this.mapContent = createArray(this.cols, this.rows);
		
		this.mouseAt = {
			windowPosition: { x: "x", y: "y" },
			mapPosition: { x: "x", y: "y" },
			cellPosition: { x: "x", y: "y" }
		}
		
		this.robots = new Map();
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
		this.robots.set(robot.name, robot);
	}
	
	checkPosition(point){
		let mouseAt = this.defineMouseAt(
			this.margin.left + this.table.width * point.x,
			this.margin.top + this.table.height * point.y);
		if (0 <= mouseAt.cellPosition.x && mouseAt.cellPosition.x < this.cols && 
			0 <= mouseAt.cellPosition.y && mouseAt.cellPosition.y < this.rows) {
			return this.mapContent[mouseAt.cellPosition.x][mouseAt.cellPosition.y].index;
		}
		else return this.BLOCKS.NOTHING;
	}
	
	canIMoveOn(cell) {
		let moveOn = [
			this.BLOCKS.PLATFORM,
			this.BLOCKS.GRASS,
			this.BLOCKS.GROUND
		];
		let yes = false;
		for (let i in moveOn) {
			yes = yes || (cell == moveOn[i]);
		}
		return yes;
	}
	
	canIShotBulletOn(cell) {
		let shotBulletOn = [
			this.BLOCKS.NOTHING,
			this.BLOCKS.BARRIER
		];
		let yes = false;
		for (let i in shotBulletOn) {
			yes = yes || (cell == shotBulletOn[i]);
		}
		return yes;
	}
	
	setImageOnCell(x, y, image, index){
		if (0 <= x && x < this.cols && 0 <= y && y < this.rows){
			this.mapContent[x][y] = {
	    			image: $('.selected')[0],
	    			index: index
	    	}
		}
	}
	
	drawCell(x, y, image=undefined){
	    this.ctx.fillStyle = "#00FFEE";
		if (0 <= x && x < this.cols && 0 <= y && y < this.rows) {
			if (image == undefined)
				this.ctx.fillRect(x * this.cell.width + this.margin.left, y * this.cell.height + this.margin.top, this.cell.width, this.cell.height);
			else this.ctx.drawImage(image, x * this.cell.width + this.margin.left, y * this.cell.height + this.margin.top, this.cell.width, this.cell.height);
		}
	}
	
	drawMapContent(){
	    for (let i = 0; i < this.cols; i++)
	        for (let j = 0; j < this.rows; j++)
	            if (this.mapContent[i][j] != undefined)
	                this.drawCell(i, j, this.mapContent[i][j].image);
	    for (let [key, value] of this.robots) {
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
		this.ctx.fillText("[" + this.mouseAt.windowPosition.x + ", " + this.mouseAt.windowPosition.y + "]", 10, 20);
		this.ctx.fillText("[" + this.mouseAt.mapPosition.x + ", " + this.mouseAt.mapPosition.y + "]", 10, 40);
		this.ctx.fillText("[" + this.mouseAt.cellPosition.x + ", " + this.mouseAt.cellPosition.y + "]", 10, 60);
		this.ctx.font = "15px Arial";
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
		return this;
	}
	
	json(){
		let result = {
			cellDim : undefined,
			data : undefined
		}
		
		result.cellDim = {
			x : this.cols,
			y : this.rows
		}
		
		result.data = createArray(this.rows, this.cols);
		
		for (let i = 0; i < this.cols; i++){
	        for (let j = 0; j < this.rows; j++){
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
		this.table = new Square(this.cols * this.cell.width, this.rows * this.cell.height);
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

function mapDesign() {
	
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");
	let parent = $(canvas).parent();
	let grid = document.getElementById("grid-element");

	setCanvasSize(canvas, parent.width(), parent.width());
	grid.style.height = canvas.height + "px";
	
	let battleGround = new BattleGround(canvas, 100, 100);
	
	let index;
	let drag = false;
	
	canvas.addEventListener('mousemove', function(event) {
		let rect = canvas.getBoundingClientRect();
		let x = Math.floor((event.clientX - rect.left) * (canvas.width / rect.width));
        let y = Math.floor((event.clientY - rect.top) * (canvas.height / rect.height));
		battleGround.mouseAt = battleGround.defineMouseAt(x, y);

		if (drag) battleGround.setImageOnCell(battleGround.mouseAt.cellPosition.x, battleGround.mouseAt.cellPosition.y, $('.selected')[0], index);
		
	    battleGround.clear().drawCellMap().drawMapContent().writeInfo();
	    battleGround.drawCell(battleGround.mouseAt.cellPosition.x, battleGround.mouseAt.cellPosition.y);
	    
	    event.returnValue = false;
	});

	canvas.addEventListener('mousedown', function(event) {

		drag = true;
		
		battleGround.setImageOnCell(battleGround.mouseAt.cellPosition.x, battleGround.mouseAt.cellPosition.y, $('.selected')[0], index);
	    
		event.returnValue = false;
	    
	});

	canvas.addEventListener('mouseup',function(event){

	    drag = false;
	    
	    event.returnValue = false;
	    
	});

	canvas.addEventListener('wheel', function(event){
		
		if (event.deltaY < 0) battleGround.zoomIn();
		else battleGround.zoomOut();
		
        let oldTable = battleGround.table;
        battleGround.table = new Rectangle(battleGround.cols * battleGround.cell.width, battleGround.rows * battleGround.cell.height);
        battleGround.mapCenter.relativeLocation(oldTable, battleGround.table);
        battleGround.defineMapFeature();
        battleGround.clear().drawCellMap().drawMapContent().writeInfo();
	    battleGround.drawCell(battleGround.mouseAt.cellPosition.x, battleGround.mouseAt.cellPosition.y);
	    
	    event.returnValue = false;
	    
	});
	
	window.onresize = function() {

		setCanvasSize(canvas, parent.width(), parent.width());
		grid.style.height = canvas.height + "px";
		battleGround.reset(canvas);
	    battleGround.clear().drawCellMap().drawMapContent().writeInfo();
    
    };

	let path;
	for (let x = 0; x < 325; x++){
		path = "<img class='icon' src='/static/img/map2/component (" + x + ").png'>";
		$('#grid-element').append(path)
	}
    
	let imgs = $('#grid-element').find('img');
	
	imgs.click(function(e) {
		$(this).addClass("selected"); 
		$(this).siblings('img.icon.selected').removeClass("selected");
		index = $(this).index();
	});
	
	imgs.mouseover(function(){
		$(this).attr("style", "border: 2px solid white");
		$(this).siblings('img.icon').removeAttr( "style" );
	});
	
	document.getElementById("test").addEventListener("click", function(){
		console.log(battleGround.json());
	});
	
	document.getElementById("upload").addEventListener("click", function(){
		$.post("/createMap", {
			"_csrf" : csrf_data.token, 
			"json" : battleGround.json(),
			"mapFileName": document.getElementById("mapFileName").value});
		console.log(battleGround.json());
	});
	
    battleGround.drawCellMap().writeInfo();
}

function isFullScreen(){
	if (document.fullscreenElement) return true;
    else if (document.webkitFullscreenElement) return true;
    else if (document.mozFullScreenElement) return true;
    else return false;
}

function fullscreen(){
    
	if(canvas.webkitRequestFullScreen) 
		canvas.webkitRequestFullScreen();
	else canvas.mozRequestFullScreen();
	
}

function readTextFile(file, callback) {
    let rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200")
            callback(rawFile.responseText);
    }
    rawFile.send(rawFile.responseText);
}

function playing() {

	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");
	let parent = $(canvas).parent();
	
	setCanvasSize(canvas, parent.width(), parent.width());
	/*
	let something = undefined;
	
	readTextFile("/static/json/test100.json", function(text){
	    let data = JSON.parse(text);
	    let a = "";
	    for (let i = 0; i < data.cellDim.x; i++){
	    	for (let j = 0; j < data.cellDim.y; j++){
	    		a += data.data[i][j] + " ";
	    	}
	    	a += "\n";
	    }
	    something = a;
	});
	something.onload = function(){

		console.log(this);
	}
	*/
	let data = '{"cellDim":{"x":100,"y":100},"data":' +
	'[[0,0,0,0,0,0,0,0,0,0,205,205,205,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[0,0,0,0,0,0,0,0,0,0,205,205,205,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[0,0,0,0,0,0,0,0,0,0,205,205,205,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0,0,0,0,0,0,0,0,0,0,0,0,0,0,205,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[0,0,0,0,0,0,0,0,0,0,205,205,205,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,205,205,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,205,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[205,205,205,205,205,205,0,0,0,0,205,205,205,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,205,205,0,0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0,0,0,0,0,0,205,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[205,205,205,205,205,205,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0,0,0,205,0,0,0,0,0,0,0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[205,205,0,0,0,0,0,0,0,0,205,205,205,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,205,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,205,0,205,0,0,0,0,0,0,0,0,0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0],' +
	'[205,205,0,0,0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0,205,205,205,0,205,0,205,205,205,0,0,0,0,0,0,0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0],' +
	'[205,205,0,0,0,0,0,0,0,0,205,205,205,0,0,0,0,0,0,0,0,0,0,0,205,0,0,0,0,0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0,205,0,205,0,205,0,205,0,205,205,0,0,0,0,0,0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0],' +
	'[205,205,0,0,0,0,0,0,0,0,205,205,205,0,0,0,0,0,0,0,0,0,0,0,205,0,0,0,0,0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0,0,0,0,0,0,0,0,0,0,0,205,0,205,205,205,0,205,0,0,205,0,0,0,0,0,0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0],' +
	'[205,205,205,205,205,205,205,205,205,205,205,205,205,0,0,0,0,0,0,0,0,0,0,0,205,0,0,0,0,0,0,0,0,0,0,205,205,0,0,0,0,0,0,0,0,0,0,0,0,205,0,0,0,0,205,205,205,205,205,205,205,0,0,205,0,0,0,205,0,205,0,0,205,0,0,0,0,0,0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0],' +
	'[205,205,205,205,205,205,205,205,205,205,205,205,205,0,0,0,0,0,0,0,0,0,0,0,205,0,0,0,0,0,0,0,0,0,0,205,205,0,0,0,0,0,0,0,0,0,0,0,0,205,0,0,0,0,205,0,0,0,0,0,205,205,205,205,0,205,205,205,0,205,205,0,205,0,0,0,0,0,0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0],' +
	'[205,205,205,205,205,205,205,205,205,205,205,205,205,0,0,0,0,0,0,0,0,0,0,0,205,0,0,0,0,0,0,0,0,0,0,205,205,0,0,0,0,0,0,0,0,0,0,0,0,205,0,0,205,205,205,205,205,205,205,0,205,0,0,205,0,205,0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0],' +
	'[0,0,0,0,0,0,0,0,0,0,205,205,205,0,0,0,0,0,0,205,205,205,205,0,205,0,0,0,0,0,0,0,0,0,0,205,205,0,0,0,0,0,0,0,0,0,0,0,0,205,0,0,0,0,0,0,0,0,205,0,205,0,0,205,0,205,205,205,205,205,205,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0],' +
	'[0,0,0,0,0,0,0,0,0,0,205,205,205,0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0,0,205,205,205,205,205,0,205,0,205,205,0,205,0,0,0,0,0,0,205,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0],' +
	'[0,0,0,0,0,0,0,0,0,0,205,205,205,0,0,0,0,0,0,205,205,205,205,0,0,0,0,0,0,0,0,0,0,0,0,205,205,0,0,0,0,0,0,0,0,0,0,0,0,205,0,0,205,0,0,0,205,0,205,0,0,205,0,205,0,205,205,205,205,205,205,0,205,0,0,205,0,0,0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0],' +
	'[0,0,0,0,0,0,0,0,0,0,205,205,205,0,0,0,0,0,0,205,205,205,205,0,0,0,0,0,0,0,0,0,0,0,0,205,205,0,0,0,0,0,0,0,0,0,0,0,0,205,0,0,205,205,205,0,205,0,205,0,205,205,0,205,0,205,0,0,0,0,0,0,205,0,0,205,0,0,0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0],' +
	'[0,0,0,0,0,0,0,0,0,0,205,205,205,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,205,205,0,0,0,0,0,0,0,0,0,0,0,0,205,0,0,0,0,205,0,205,0,205,0,0,0,0,205,0,205,205,205,205,205,205,0,205,0,0,205,0,0,0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0],' +
	'[0,0,0,0,0,0,0,0,0,0,205,205,205,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,205,205,0,0,0,0,0,0,0,0,0,0,0,0,205,0,0,205,205,205,0,205,205,205,0,205,205,205,205,0,0,0,0,0,0,205,0,205,0,0,205,0,0,0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0],' +
	'[0,0,0,0,0,0,0,0,0,0,205,205,205,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,205,205,0,0,0,0,0,0,0,0,0,0,0,0,205,0,0,205,0,0,0,0,0,0,0,205,0,0,0,0,0,0,0,0,0,205,205,205,0,0,205,0,0,0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0],' +
	'[0,0,0,0,0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0,0,0,0,0,0,0,0,205,0,0,0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0],' +
	'[0,0,0,0,0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0,0,0,0,0,0,0,0,205,0,0,0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0],' +
	'[0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0],' +
	'[0,0,0,205,0,0,0,0,0,0,0,0,0,0,0,0,205,205,0,0,0,0,205,205,0,0,0,0,0,0,0,0,0,0,0,0,0,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,207,207,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0],' +
	'[0,0,0,205,0,0,0,0,0,0,0,0,0,0,0,0,205,205,0,0,0,0,205,205,0,0,0,0,0,0,0,0,0,0,0,0,0,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,207,207,207,205,205,205,205,205,205,205,205,205,205,205,205,205,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[0,0,0,205,0,0,0,205,205,205,205,205,0,0,0,0,205,205,0,0,0,0,205,205,0,0,0,0,0,0,0,0,0,0,0,0,0,206,206,206,206,206,206,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,205,205,205,205,205,205,205,205,205,205,205,205,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[0,0,0,205,0,0,0,205,0,0,0,205,0,0,0,0,205,205,0,0,0,0,205,205,0,0,0,0,0,0,0,0,0,0,0,0,0,206,206,206,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,205,205,205,205,205,205,205,205,205,205,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[0,0,0,205,0,0,0,205,0,0,0,205,0,0,0,0,205,205,0,0,0,0,205,205,0,0,0,0,0,0,0,0,0,0,0,0,0,206,206,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,206,206,206,206,206,206,206,206,206,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[0,0,0,205,0,0,0,205,0,0,0,205,0,0,0,0,205,205,0,0,0,0,205,205,0,0,0,0,0,0,0,0,0,0,0,0,0,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,207,206,206,206,206,206,206,206,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[0,0,0,205,0,0,0,205,0,0,0,205,0,0,0,0,205,205,0,0,0,0,205,205,0,0,0,0,0,0,0,0,0,0,0,0,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,206,206,206,206,206,206,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[0,0,0,205,0,0,0,205,0,0,0,205,0,0,0,0,205,205,205,205,205,205,205,205,0,0,0,0,0,0,0,0,0,0,0,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,207,206,206,206,206,206,206,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[0,0,0,205,0,0,0,205,0,0,0,205,0,0,0,0,205,205,205,205,205,205,205,205,0,0,0,0,0,0,0,0,0,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,206,206,206,206,206,206,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[0,0,0,205,0,0,0,205,0,0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,0,0,0,0,0,0,0,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,206,206,206,206,206,206,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[0,0,0,205,0,0,0,205,0,0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,0,0,0,0,0,0,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,206,206,206,206,206,206,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[0,0,205,205,205,205,205,205,205,205,205,0,0,0,0,0,205,205,205,205,205,205,205,205,0,0,0,0,0,0,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,207,206,206,206,206,206,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[0,0,205,0,0,0,0,0,0,0,205,0,0,0,0,0,0,206,206,206,206,206,206,0,0,0,0,0,0,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,207,207,206,206,206,206,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[205,205,205,0,0,0,0,0,0,0,205,0,0,0,0,0,0,206,206,206,206,206,206,0,0,0,0,206,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,207,207,206,206,206,206,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[205,0,0,0,0,0,0,205,205,205,205,205,0,0,0,0,0,206,206,206,206,206,206,0,0,0,0,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,207,207,207,206,206,206,206,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[205,0,0,0,0,0,0,205,0,0,0,205,0,0,0,0,0,206,206,206,206,206,206,0,0,0,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,207,206,206,206,206,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[205,0,0,0,0,0,0,205,0,0,0,205,0,0,0,0,0,206,206,206,206,206,206,0,0,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,207,206,206,206,206,206,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[205,205,205,205,205,205,205,205,205,0,0,205,0,0,0,0,0,206,206,206,206,206,206,0,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,207,206,206,206,206,206,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[205,0,0,0,205,0,0,0,205,205,205,205,0,0,0,0,0,206,206,206,206,206,206,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,207,207,206,206,206,206,206,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[205,0,0,0,205,0,0,0,0,0,0,0,0,0,0,0,0,206,206,206,206,206,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,207,207,206,206,206,206,206,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[205,0,0,205,205,0,0,0,0,0,0,0,0,0,0,0,206,206,206,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,207,207,206,206,206,206,206,206,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[205,0,205,205,205,0,0,0,0,0,0,0,0,0,0,0,206,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,207,207,206,206,206,206,206,206,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[205,0,205,0,205,0,0,0,0,0,0,0,0,0,0,0,206,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,207,207,206,206,206,206,206,206,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[205,0,205,0,205,205,205,205,205,0,0,0,0,0,0,206,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,207,207,206,206,206,206,206,206,206,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[205,0,205,0,0,0,0,0,205,0,0,0,0,0,206,206,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,207,207,206,206,206,206,206,206,206,206,206,0,0,0,0,0,0,0,0,0,0,0,0,0],' +
	'[205,0,205,0,205,0,0,0,205,0,0,0,0,206,206,206,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,207,207,207,206,206,206,206,206,206,206,206,206,206,206,206,206,0,0,0,0,0,0,0,0,0],' +
	'[205,205,205,205,205,205,205,205,205,0,0,0,0,206,206,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,207,207,207,207,206,206,206,206,206,206,206,206,206,206,206,206,206,0,0,0,0,0,0,0,0,0],' +
	'[205,0,0,0,205,0,0,0,205,0,0,0,206,206,206,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,207,207,207,207,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,0,0,0,0,0,0,0],' +
	'[205,0,0,0,205,0,0,0,205,0,0,0,206,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,207,207,207,207,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,0,0,0,0,0,0],' +
	'[205,0,0,0,205,205,205,205,205,0,0,206,206,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,207,207,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,0,0,0,0,0,0],' +
	'[205,0,0,0,205,0,0,0,0,0,0,206,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,207,207,207,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,0,0,0,0,0],' +
	'[205,0,0,0,205,0,0,0,0,0,0,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,207,207,207,207,207,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,0,0,0,0],' +
	'[205,0,0,0,205,0,0,0,0,0,206,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,0],' +
	'[205,205,0,0,205,0,0,0,0,0,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,0],' +
	'[0,205,0,0,205,0,0,0,0,206,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206],' +
	'[0,205,205,205,205,0,0,0,0,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,206,206,206,206,206,206,206,206,206,206,206],' +
	'[0,0,205,0,0,0,0,0,0,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,206,206,206,206,206,195,195,206,206,206,206,206,206,206,206,206,195,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206],' +
	'[0,0,205,0,0,0,0,0,0,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,206,206,206,206,206,206,195,195,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206],' +
	'[0,0,205,0,0,0,0,0,0,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206],' +
	'[0,0,205,0,0,0,0,0,0,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206],' +
	'[0,0,205,0,0,0,0,0,0,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206],' +
	'[0,0,205,0,0,0,0,0,0,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,206,206,206,206,206,206,206],' +
	'[0,0,205,0,0,0,0,0,0,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206],' +
	'[0,0,205,0,0,0,0,0,0,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,206,206,206,206,206,206,206,195,206,206,206,206,206,206,206,206,206,206,195,195,195,195,195,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206],' +
	'[0,0,205,0,0,0,0,0,0,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,195,195,195,195,195,195,195,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206],' +
	'[0,0,205,0,0,0,0,0,0,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,195,195,195,195,195,195,195,195,195,195,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206],' +
	'[0,0,205,0,0,0,0,0,0,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,195,195,195,195,195,195,195,195,195,195,195,195,195,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206],' +
	'[0,0,205,0,0,0,0,0,0,0,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206],' +
	'[0,0,205,0,0,0,0,0,0,0,206,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206],' +
	'[0,0,205,205,205,205,205,205,0,0,0,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206],' +
	'[0,0,0,205,0,0,0,205,0,0,0,0,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206],' +
	'[0,0,0,205,0,0,0,205,0,0,0,0,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206],' +
	'[0,0,0,205,0,0,0,205,0,0,0,0,0,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,207],' +
	'[205,0,0,205,0,0,0,205,0,0,0,0,0,0,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,206,206,206,206,206,206,195,206,206,206,206,206,206,206,207,207],' +
	'[205,0,0,0,0,0,0,205,205,0,0,0,0,0,0,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,208,208,208,208,206,206,206,206,206,206,206,206,206,206,206,206,195,195,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,206,206,206,206,206,206,206,206,206,206,206,206,206,207,207,207],' +
	'[205,205,205,205,205,0,0,0,205,0,0,0,0,0,0,206,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,208,208,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,195,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,206,206,206,206,206,206,206,206,206,206,206,206,206,207,207,207],' +
	'[0,0,0,0,205,0,0,0,205,0,0,0,0,0,0,0,206,206,206,206,206,206,208,208,208,208,208,208,208,208,208,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,206,206,206,206,206,206,206,206,206,206,206,206,207,207,207,207],' +
	'[0,0,0,0,205,0,0,0,205,205,205,205,205,205,205,205,205,205,206,206,206,206,206,206,208,208,208,208,208,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,206,206,206,206,206,206,206,206,206,206,206,206,195,195,195,195,195,195,195,195,195,195,195,195,195,195,195,206,206,206,206,206,206,206,206,206,206,206,206,207,207,207,207,207],' +
	'[0,0,0,0,205,205,205,205,205,0,0,205,0,0,0,0,0,205,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,195,195,195,195,195,195,195,195,195,195,195,195,206,206,206,206,206,206,206,206,206,206,206,206,207,207,207,207,207,207],' +
	'[0,0,0,0,205,0,0,0,0,0,0,205,0,0,0,0,0,205,0,0,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,195,195,195,195,195,195,195,195,195,206,206,206,206,206,206,206,206,206,206,206,206,206,207,207,207,207,207,207,207],' +
	'[0,0,0,0,205,0,0,0,0,0,0,205,205,205,205,205,205,205,0,0,0,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,195,195,195,195,195,195,206,206,206,206,206,206,206,206,206,206,206,206,206,206,207,207,207,207,207,207,207,207],' +
	'[0,0,0,0,205,0,0,0,0,0,0,205,0,0,0,0,0,205,0,0,0,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,195,195,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,207,207,207,207,207,207,207,207],' +
	'[205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0,0,205,0,0,0,0,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,195,195,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,207,207,207,207,207,207,207,207,207],' +
	'[205,0,0,0,205,0,0,0,0,205,0,0,0,0,205,0,0,205,0,0,0,0,0,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,207,207,207,207,207,207,207,207,207],' +
	'[205,0,0,0,205,0,0,0,0,205,0,0,0,0,205,0,0,205,0,0,0,0,0,0,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,207,207,207,207,207,207,207,207,207,207,207],' +
	'[205,0,0,0,205,0,0,0,0,205,0,0,0,0,205,0,0,205,0,0,0,0,0,0,0,0,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,207,207,207,207,207,207,207,207,207,207,207,207],' +
	'[205,0,0,0,205,205,0,0,0,205,205,205,205,205,205,0,0,205,205,205,205,0,0,0,0,0,0,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,207,207,207,207,207,207,207,207,207,207,207,207,207,207],' +
	'[205,0,0,0,0,205,0,0,0,0,205,0,0,0,205,0,0,0,0,0,205,205,0,0,0,0,0,0,206,206,206,206,206,206,206,206,206,206,206,206,206,195,206,206,206,206,206,206,206,195,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,207,207,207,207,207,207,207,207,207,207,207,207,207],' +
	'[205,0,0,0,0,205,205,205,205,205,205,0,0,0,205,0,0,0,0,0,0,205,0,0,0,0,0,0,0,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,207,207,207,207,207,207,207,207,207,207,207,207],' +
	'[205,0,0,0,0,0,0,0,205,0,0,0,0,0,205,0,0,0,0,0,0,205,0,0,0,0,0,0,0,0,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,195,206,206,206,206,206,206,195,206,206,206,206,206,206,207,207,207,207,207,207,207,207,207,207,207,207],' +
	'[205,0,0,0,0,0,0,0,205,0,0,0,0,0,205,0,0,0,0,0,0,205,0,0,0,0,0,0,0,0,0,0,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,207,207,207,207,207,207,207,207,207,207,207,207,207],' +
	'[205,0,0,0,0,0,0,0,205,0,0,0,0,0,205,205,205,205,205,205,205,205,0,0,0,0,0,0,0,0,0,0,0,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,195,206,206,206,206,206,206,206,206,206,206,206,206,206,207,207,207,207,207,207,207,207,207,207,207,207,207],' +
	'[205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0,0,205,0,0,0,205,0,0,0,0,0,0,0,0,0,0,0,0,0,0,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,195,206,195,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,207,207,207,207,207,207,207,207,207,207,207,207,207,207],' +
	'[0,0,0,0,0,0,205,0,0,0,0,0,0,0,0,0,0,205,0,0,0,205,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,207,207,207,207,207,207,207,207,207,207,207,207,207,207],' +
	'[0,0,0,0,0,0,205,0,0,0,0,0,0,0,0,0,0,205,0,0,0,205,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207],' +
	'[0,0,0,0,0,0,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207],' +
	'[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,206,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207,207]]}';
	data = JSON.parse(data);

	let battleGround = new BattleGround(canvas, data.cellDim.x, data.cellDim.y);
	
	let set = new Set();
	for (let i = 0; i < data.cellDim.x; i++)
    	for (let j = 0; j < data.cellDim.y; j++)
    		set.add(data.data[i][j]);
	
	let dict = new Map();
	let imagesLoaded = 0;
	for (let item of set){
		let img = document.createElement("img");
		img.onload = function(){
			imagesLoaded++;
			if (imagesLoaded == set.size)  {
				battleGround.drawMapContent();
				start(battleGround);
			}
		}
		img.src = "/static/img/map2/component (" + item + ").png";
		dict.set(item, img);
	}
	
	for (let i = 0; i < battleGround.cols; i++){
    	for (let j = 0; j < battleGround.rows; j++){
    		battleGround.mapContent[i][j] = {
    			image : undefined,
    			index : data.data[i][j]
    		}
    		battleGround.mapContent[i][j].image = dict.get(data.data[i][j]);
    	}
    }

	canvas.addEventListener('mousemove', function(event) {
		let rect = canvas.getBoundingClientRect();
		let x = Math.floor((event.clientX - rect.left) * (canvas.width / rect.width));
        let y = Math.floor((event.clientY - rect.top) * (canvas.height / rect.height));
        battleGround.mouseAt = battleGround.defineMouseAt(x, y);
		
	    battleGround.clear().drawMapContent();
	    battleGround.drawCell(battleGround.mouseAt.cellPosition.x, battleGround.mouseAt.cellPosition.y);
	    
	    event.returnValue = false;
	});

	canvas.addEventListener('wheel', function(event){
		
		if (event.deltaY < 0) battleGround.zoomIn();
		else battleGround.zoomOut();
		
        let oldTable = battleGround.table;
        battleGround.table = new Rectangle(battleGround.cols * battleGround.cell.width, battleGround.rows * battleGround.cell.height);
        battleGround.mapCenter.relativeLocation(oldTable, battleGround.table);
        battleGround.defineMapFeature();
        battleGround.clear().drawMapContent();
	    battleGround.drawCell(battleGround.mouseAt.cellPosition.x, battleGround.mouseAt.cellPosition.y);
	    
	    event.returnValue = false;
	    
	});

	window.onresize = function() {
		
		if (isFullScreen()) setCanvasSize(canvas, window.innerWidth, window.innerHeight);
		else setCanvasSize(canvas, parent.width(), parent.width());
		
		battleGround.reset(canvas);
	    battleGround.clear().drawMapContent();
    
    };

	document.getElementById("fullscreen").addEventListener("click", fullscreen);

}

function toRadians (angle) {
  return angle * (Math.PI / 180);
}

class ImageLoader{
	constructor(){
		this.images = new Map();
		this.imagesLoaded = 0;
		this.loaded = true;

		let bulletPath = "/static/img/map2/component (12).png";
		let explosionPath = "/static/img/map2/component (2).png";
		this.loadImage("bullet", bulletPath);
		this.loadImage("explosion", explosionPath);
	}
	
	loadImage(name, path){
		let self = this;
		let img = document.createElement("img");
		img.onload = function(){
			self.imagesLoaded++;
			if (self.imagesLoaded == self.images.size){
				self.loaded = true;
			}
		}
		img.src = path;
		this.images.set(name, img);
	}
}

var imageLoader = new ImageLoader();

function start(battleGround){
	let robots = new Map();
	robots.set("Zihao", new Robot("Zihao", "/static/img/map2/component (132).png", battleGround).setFollow(true));
	robots.set("Cesar", new Robot("Cesar", "/static/img/map2/component (58).png", battleGround));
	robots.set("Lorenzo", new Robot("Lorenzo", "/static/img/map2/component (102).png", battleGround));
	//for (let i = 25; i < 159; i++)
	//	robots.set(i.toString(), new Robot(i, "/static/img/map2/component (" + i + ").png", battleGround));
	
	let imagesLoaded = 0;
	for (let [key, value] of robots) {
		let img = document.createElement("img");
		img.onload = function(){
			imagesLoaded++;
			if (imagesLoaded == robots.size){
				for (let [k, v] of robots) {
					battleGround.addRobot(v);
					battleGround.clear().drawMapContent();
				}
			}
		}
		img.src = value.path;
		value.image = img;
	}
	
	let left = false, right = false, up = false, down = false, space = false;
	
	window.onkeydown = function(e) {
		let key = e.keyCode ? e.keyCode : e.which;
		event.returnValue = false;
		
		switch (key){
		case 32: space = true; break;
		case 37: left = true; break;
		case 38: up = true; break;
		case 39: right = true; break;
		case 40: down = true; break;
		default: event.returnValue = true; break;
		}
	}
	
	window.onkeyup = function(e) {
		let key = e.keyCode ? e.keyCode : e.which;
		event.returnValue = false;
		
		switch (key){
		case 32: space = false; break;
		case 37: left = false; break;
		case 38: up = false; break;
		case 39: right = false; break;
		case 40: down = false; break;
		default: event.returnValue = true; break;
		}
		
		moving();
	}
	
	function moving(){
		if (space) {
			robots.get("Zihao").fireBullet(battleGround);
			space = false;
		}
		if (left) robots.get("Zihao").moveToLeft(battleGround);
		if (right) robots.get("Zihao").moveToRight(battleGround);
		if (up) robots.get("Zihao").moveToUp(battleGround);
		if (down) robots.get("Zihao").moveToDown(battleGround);
	}
	
	let code = "let rand = Math.random();\n" + 
		"if (0 <= rand && rand < 0.6) this.moveToUp(battleGround);\n" + 
		"else if (0.6 <= rand && rand < 0.75) this.moveToLeft(battleGround);\n" + 
		"else if (0.75 <= rand && rand < 0.9) this.moveToRight(battleGround);\n" + 
		"else if (0.9 <= rand && rand < 0.95) this.moveToDown(battleGround);\n" + 
		"else if (0.95 <= rand && rand < 1) this.fireBullet(battleGround);\n" + 
		"else alert('error');";
	
	function loop(timestamp) {
		var progress = (timestamp - lastRender)
		
		for (let [key, value] of robots) {
			if (key != "Zihao") value.makeMove(battleGround, code);
		}
		moving();
		
		battleGround.clear().drawMapContent();
		  
		lastRender = timestamp
		window.requestAnimationFrame(loop);
	}
	var lastRender = 0;
	window.requestAnimationFrame(loop);
	
}

class Robot {
	constructor(name, path, battleGround){
		this.name = name;
		this.path = path;
		this.image = undefined;
		this.width = 0.5;
		this.height = 0.5;
		this.proportionX = 1 / battleGround.table.width;
		this.proportionY = 1 / battleGround.table.height;
		this.rotationScale = 3;
		this.rotation = 0;
		this.x = 0.97;
		this.y = 0.97;
		this.topRightCorner = undefined;
		this.downRightCorner = undefined;
		this.downLeftCorner = undefined;
		this.topLeftCorner = undefined;
		this.diagonal = battleGround.cell.diagonal / 4;
		this.follow = false;
		this.calculateCorners(battleGround);
		this.bullets = [];
	}
	
	fireBullet(){
		this.bullets.push(new Bullet(this));
	}
	
	makeMove(battleGround, code){
		eval(code);
	}
	
	calculateCorners(battleGround){
		this.diagonal = battleGround.cell.diagonal / 4;
		this.topRightCorner = new Point(
				this.diagonal / battleGround.table.width * Math.cos(toRadians(this.rotation + 315)) + this.x,
				this.diagonal / battleGround.table.height * Math.sin(toRadians(this.rotation + 315)) + this.y);
		this.downRightCorner = new Point(
				this.diagonal / battleGround.table.width * Math.cos(toRadians(this.rotation + 45)) + this.x,
				this.diagonal / battleGround.table.height * Math.sin(toRadians(this.rotation + 45)) + this.y);
		this.downLeftCorner = new Point(
				this.diagonal / battleGround.table.width * Math.cos(toRadians(this.rotation + 135)) + this.x,
				this.diagonal / battleGround.table.height * Math.sin(toRadians(this.rotation + 135)) + this.y);
		this.topLeftCorner = new Point(
				this.diagonal / battleGround.table.width * Math.cos(toRadians(this.rotation + 225)) + this.x,
				this.diagonal / battleGround.table.height * Math.sin(toRadians(this.rotation + 225)) + this.y);
	}
	
	setFollow(follow){
		this.follow = follow;
		return this;
	}
	
	changeRotation(degrees, battleGround){
		this.rotation += degrees;
		this.calculateCorners(battleGround);
	}
	
	moveTo(x, y, battleGround){
		this.x += x;
		this.y += y;
		
		this.calculateCorners(battleGround);
		
		let movementsAvailable = {
			topRight : battleGround.canIMoveOn(battleGround.checkPosition(this.topRightCorner)),
			downRight : battleGround.canIMoveOn(battleGround.checkPosition(this.downRightCorner)),
			downLeft : battleGround.canIMoveOn(battleGround.checkPosition(this.downLeftCorner)),
			topLeft : battleGround.canIMoveOn(battleGround.checkPosition(this.topLeftCorner))
		}
		
		if (!movementsAvailable.topRight || !movementsAvailable.downLeft){
			this.moveToLeft(battleGround);
		}
		else if (!movementsAvailable.downRight || !movementsAvailable.topLeft){
			this.moveToRight(battleGround);
		}
		
		if (!(movementsAvailable.topRight &&
			movementsAvailable.downRight &&
			movementsAvailable.downLeft &&
			movementsAvailable.topLeft)){
			this.x -= x;
			this.y -= y;
		}
		
		if (this.follow){
			battleGround.mapCenter.x = Math.floor(battleGround.table.width * this.x);
			battleGround.mapCenter.y = Math.floor(battleGround.table.width * this.y);
			battleGround.defineMapFeature();
		}
	}
	
	moveToLeft(battleGround){
		this.changeRotation(-this.rotationScale, battleGround);
	}
	
	moveToUp(battleGround){
		this.moveTo(
			this.proportionX * Math.sin(toRadians(this.rotation)),
			-this.proportionY * Math.cos(toRadians(this.rotation)),
			battleGround);
	}
	
	moveToRight(battleGround){
		this.changeRotation(this.rotationScale, battleGround);
	}
	
	moveToDown(battleGround){
		this.moveTo(
			-this.proportionX * Math.sin(toRadians(this.rotation)),
			this.proportionY * Math.cos(toRadians(this.rotation)),
			battleGround);
	}
}

class Bullet {
	constructor(robot) {
		this.x = robot.x;
		this.y = robot.y;
		this.width = 0.1;
		this.height = 0.1;
		this.rotation = robot.rotation;
		this.proportionX = robot.proportionX * 2;
		this.proportionY = robot.proportionY * 2;
		this.STATES = Object.freeze({
			"MOVING": 1,
			"EXPLODE": 2,
			"DELETE": 3
			});
		this.state = this.STATES.MOVING;
	}
	
	get image(){
		switch (this.state){
		case this.STATES.MOVING:
			return imageLoader.images.get("bullet");
			break;
		case this.STATES.EXPLODE:
			this.width = 0.5;
			this.height = 0.5;
			return imageLoader.images.get("explosion");
			break;
		case this.STATES.DELETE:
			this.width = 1;
			this.height = 1;
			return imageLoader.images.get("explosion");
			break;
		default: break;
		}
	}
	
	next(battleGround){
		switch (this.state){
		case this.STATES.MOVING:
			this.x += this.proportionX * Math.sin(toRadians(this.rotation));
			this.y -= this.proportionY * Math.cos(toRadians(this.rotation));
			if (battleGround.canIShotBulletOn(battleGround.checkPosition(new Point(this.x, this.y)))){
				this.state = this.STATES.EXPLODE;
				this.x -= this.proportionX * Math.sin(toRadians(this.rotation));
				this.y += this.proportionY * Math.cos(toRadians(this.rotation));
			}
			break;
		case this.STATES.EXPLODE:
			this.state = this.STATES.DELETE;
			break;
		case this.STATES.DELETE:
			break;
		default: break;
		}
	}
}