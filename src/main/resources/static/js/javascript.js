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
	
	calculateCenter(){
		return new Point(Math.floor(this.width / 2), Math.floor(this.height / 2));
	}
	
	calculateArea(){
		return this.width * this.height;
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
}

class Cell extends Square {
	constructor(rows, columns, width, height){
		super(width, height);
		this.rows = rows;
		this.columns = columns;
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

function defineMapFeature(mapCenter, mapStatus, windowStatus){
	let feature = {
		zoomScale: 1,
		moveScale: 5,
		lineDash: 0,
		lineWidth: 1,
		zoomZone: 0.6,
		margin: undefined
	}
	
	feature.lineDash = (mapStatus.width < windowStatus.width || mapStatus.height < windowStatus.height) ? 0 : 1; 
	
	let windowDistancesTo = windowStatus.distancesTo(windowStatus.center);
	let mapDistancesTo = mapStatus.distancesTo(mapCenter);
	feature.margin = {
        left : windowDistancesTo.left - mapDistancesTo.left,
        right : windowDistancesTo.right - mapDistancesTo.right,
        top : windowDistancesTo.top - mapDistancesTo.top,
        down : windowDistancesTo.down - mapDistancesTo.down
    }
	return feature;
}

function defineMouseAt(event, canvas, mapFeature, cellStatus){
	let rect = canvas.getBoundingClientRect();
	let mouseAt = {
		windowPosition: undefined,
		mapPosition: undefined,
		cellPosition: undefined
	}
	
    mouseAt.windowPosition = {
        x: Math.floor((event.clientX - rect.left) * (canvas.width / rect.width)),
        y: Math.floor((event.clientY - rect.top) * (canvas.height / rect.height))
    }
    
	mouseAt.mapPosition = {
    	x: mouseAt.windowPosition.x - mapFeature.margin.left,
    	y: mouseAt.windowPosition.y - mapFeature.margin.top
    }
    
	mouseAt.cellPosition = {
    	x: Math.floor(mouseAt.mapPosition.x / cellStatus.width),
    	y: Math.floor(mouseAt.mapPosition.y / cellStatus.height)
    }
	
	return mouseAt;
}

function drawCellMap(ctx, cellStatus, mapStatus, windowStatus, mapFeature) {

    ctx.setLineDash([mapFeature.lineDash, mapFeature.lineDash]);
    ctx.lineWidth = mapFeature.lineWidth;
    ctx.strokeStyle = "gray";
    
	let coord = {
    	left : (mapFeature.margin.left > 0) ? mapFeature.margin.left : 0,
        right : (mapFeature.margin.right > 0) ? windowStatus.width - mapFeature.margin.right : windowStatus.width,
		up : (mapFeature.margin.top > 0) ? mapFeature.margin.top : 0,
        down : (mapFeature.margin.down > 0) ? windowStatus.height - mapFeature.margin.down : windowStatus.height
	}
    
    let i = (mapFeature.margin.left > 0) ? mapFeature.margin.left : cellStatus.width - Math.abs(mapFeature.margin.left % cellStatus.width);
    let j = (mapFeature.margin.top > 0) ? mapFeature.margin.top : cellStatus.height - Math.abs(mapFeature.margin.top % cellStatus.height);

    while (i <= coord.right){
        ctx.moveTo(i + 0.5, coord.up);
        ctx.lineTo(i + 0.5, coord.down);
        i += cellStatus.width;
    }

    while (j <= coord.down){
        ctx.moveTo(coord.left, j + 0.5);
        ctx.lineTo(coord.right, j + 0.5);
        j += cellStatus.height;
    }
    
    ctx.stroke();
}

function drawMapContent(ctx, mapContent, cellStatus, mapFeature){
    for (let i = 0; i < cellStatus.columns; i++){
        for (let j = 0; j < cellStatus.rows; j++){
            if (mapContent[i][j] != undefined) {
                ctx.drawImage(mapContent[i][j].image, i * cellStatus.width + mapFeature.margin.left, j * cellStatus.height + mapFeature.margin.top, cellStatus.width, cellStatus.height);
            }
        }
    }
}

function writeMapContentValues(mapContent, cellStatus){
	let result = {
		cellDim : undefined,
		data : undefined
	}
	
	result.cellDim = {
		x : mapContent.length,
		y : mapContent[0].length
	}
	
	result.data = createArray(result.cellDim.x, result.cellDim.y);
	
	for (let i = 0; i < cellStatus.columns; i++){
        for (let j = 0; j < cellStatus.rows; j++){
            if (mapContent[i][j] != undefined) {
            	result.data[i][j] = mapContent[i][j].index;
            }
            else {
            	result.data[i][j] = 0;
            }
        }
	}
	console.log(JSON.stringify(result));
}

function drawMapContentColour(ctx, mapContent, cellStatus, mapFeature){
	ctx.fillStyle = "#FFDC27";
    for (let ii = 0; ii < cellStatus.columns; ii++){
        for (let jj = 0; jj < cellStatus.rows; jj++){
            if (mapContent[ii][jj] != undefined) {
                ctx.fillRect(ii * cellStatus.width + mapFeature.margin.left, jj * cellStatus.height + mapFeature.margin.top, cellStatus.width, cellStatus.height);
            }
        }
    }
}

function drawMouseAtCell(ctx, mouseAt, cellStatus, mapFeature){
    ctx.fillStyle = "#00FFEE";
	if (0 <= mouseAt.cellPosition.x && mouseAt.cellPosition.x < cellStatus.columns && 0 <= mouseAt.cellPosition.y && mouseAt.cellPosition.y < cellStatus.rows) {
        ctx.fillRect(mouseAt.cellPosition.x * cellStatus.width + mapFeature.margin.left, mouseAt.cellPosition.y * cellStatus.height + mapFeature.margin.top, cellStatus.width, cellStatus.height);
    }
}

function writeText(ctx, mouseAt, mapCenter, cellStatus, mapStatus, windowStatus, mapFeature){
	let distancesTo;
	ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("[" + mouseAt.windowPosition.x + ", " + mouseAt.windowPosition.y + "]", 10, 20);
    ctx.fillText("[" + mouseAt.mapPosition.x + ", " + mouseAt.mapPosition.y + "]", 10, 40);
    ctx.fillText("[" + mouseAt.cellPosition.x + ", " + mouseAt.cellPosition.y + "]", 10, 60);
    ctx.font = "15px Arial";
    ctx.fillText("Dimension win [" + windowStatus.width + ", " + windowStatus.height + "]", 10, 80);
    ctx.fillText("Dimension map [" + mapStatus.width + ", " + mapStatus.height + "]", 10, 100);
    ctx.fillText("Dimension cell [" + cellStatus.width + ", " + cellStatus.height + "]", 10, 120);
	distancesTo = windowStatus.distancesTo(windowStatus.center);
    ctx.fillText("Distance win [" + distancesTo.left + ", " + distancesTo.right + ", " + distancesTo.top + ", " + distancesTo.down + "]", 10, 140);
    distancesTo = mapStatus.distancesTo(mapCenter);
    ctx.fillText("Distance map [" + distancesTo.left + ", " + distancesTo.right + ", " + distancesTo.top + ", " + distancesTo.down + "]", 10, 160);
    ctx.fillText("Center [" + mapCenter.x + ", " + mapCenter.y + "]", 10, 180);
    ctx.fillText("Margin [" + mapFeature.margin.left + ", " + mapFeature.margin.right + ", " + mapFeature.margin.top + ", " + mapFeature.margin.down + "]", 10, 200);
    ctx.fillText("Canvas [" + canvas.width + ", " + canvas.height + "]", 10, 220);
}

function clearCanvasContext(ctx, canvas) {
    ctx.save();
    ctx.beginPath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

function zoom(mouseAt, mapCenter, cellStatus, mapStatus, windowStatus, mapFeature){
	let windowCenter = windowStatus.center;
	let horizontal = mouseAt.windowPosition.x - windowCenter.x;
	let vertical = mouseAt.windowPosition.y - windowCenter.y;
    
	if (Math.abs(horizontal) < windowCenter.x * mapFeature.zoomZone && Math.abs(vertical) < windowCenter.y * mapFeature.zoomZone){
        if (event.deltaY < 0) {
        	cellStatus.zoomIn(mapFeature.zoomScale);
            if (windowStatus.isLessThan(new Rectangle(cellStatus.width * 10, cellStatus.height * 10))){
                cellStatus.zoomOut(mapFeature.zoomScale);
            }
        }
        else {
        	cellStatus.zoomOut(mapFeature.zoomScale);
            if (windowStatus.isMoreThan(mapStatus)){
            	cellStatus.zoomIn(mapFeature.zoomScale);
            }
        }
    }
    else {
    	let zoomValue = (event.deltaY < 0) ? mapFeature.moveScale : mapFeature.moveScale * -1;
    	mapCenter.x += (horizontal > 0) ? zoomValue : zoomValue * -1;
    	mapCenter.y += (vertical > 0) ? zoomValue : zoomValue * -1;
    }
}

function mapDesign() {
	
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");
	let parent = $(canvas).parent();
	let grid = document.getElementById("grid-element");

	setCanvasSize(canvas, parent.width(), parent.width());
	grid.style.height = canvas.height + "px";
	
	numCell = {
		x: 100,
		y: 100
	}
	var index;
	
	let windowStatus = new Rectangle(canvas.width, canvas.height);
	let cellStatus = new Cell(numCell.y, numCell.x, Math.floor(windowStatus.width / numCell.x), Math.floor(windowStatus.height / numCell.y));
	let mapStatus = new Rectangle(cellStatus.columns * cellStatus.width, cellStatus.rows * cellStatus.height);
	let mapCenter = mapStatus.center;
	let mapFeature = defineMapFeature(mapCenter, mapStatus, windowStatus);
	let mapContent = createArray(cellStatus.columns, cellStatus.rows);
	let mouseAt = {
		windowPosition: { x: "x", y: "y" },
		mapPosition: { x: "x", y: "y" },
		cellPosition: { x: "x", y: "y" }
	}

	let drag = false;

	canvas.addEventListener('mousemove', function(event) {
		mouseAt = defineMouseAt(event, canvas, mapFeature, cellStatus);
	    
	    if (drag && 0 <= mouseAt.cellPosition.x && mouseAt.cellPosition.x < cellStatus.columns && 0 <= mouseAt.cellPosition.y && mouseAt.cellPosition.y < cellStatus.rows){
	    	if ($('.selected')[0] != undefined){
		    	mapContent[mouseAt.cellPosition.x][mouseAt.cellPosition.y] = {
		    			image: $('.selected')[0],
		    			index: index
		    	}
	    	}
	    }
		
	    clearCanvasContext(ctx, canvas);
	    drawCellMap(ctx, cellStatus, mapStatus, windowStatus, mapFeature);
	    drawMapContent(ctx, mapContent, cellStatus, mapFeature);
	    writeText(ctx, mouseAt, mapCenter, cellStatus, mapStatus, windowStatus, mapFeature);
	    drawMouseAtCell(ctx, mouseAt, cellStatus, mapFeature);
	    
	    event.returnValue = false;
	});

	canvas.addEventListener('mousedown', function(event) {

		drag = true;
	    
	    if (0 <= mouseAt.cellPosition.x && mouseAt.cellPosition.x < cellStatus.columns && 0 <= mouseAt.cellPosition.y && mouseAt.cellPosition.y < cellStatus.rows){
	    	if ($('.selected')[0] != undefined){
		    	mapContent[mouseAt.cellPosition.x][mouseAt.cellPosition.y] = {
		    			image: $('.selected')[0],
		    			index: index
		    	}
	    	}
	    }
	    
	    event.returnValue = false;
	})

	canvas.addEventListener('mouseup',function(event){

	    drag = false;
	    
	    event.returnValue = false;
	    
	});

	canvas.addEventListener('wheel', function(event){

		zoom(mouseAt, mapCenter, cellStatus, mapStatus, windowStatus, mapFeature);
	    
        clearCanvasContext(ctx, canvas);
        let oldMapStatus = mapStatus;
        mapStatus = new Rectangle(cellStatus.columns * cellStatus.width, cellStatus.rows * cellStatus.height);
    	mapCenter.relativeLocation(oldMapStatus, mapStatus);
        mapFeature = defineMapFeature(mapCenter, mapStatus, windowStatus);
	    drawCellMap(ctx, cellStatus, mapStatus, windowStatus, mapFeature);
	    drawMapContent(ctx, mapContent, cellStatus, mapFeature);
	    writeText(ctx, mouseAt, mapCenter, cellStatus, mapStatus, windowStatus, mapFeature);
	    drawMouseAtCell(ctx, mouseAt, cellStatus, mapFeature);
	    
	    event.returnValue = false;
	    
	});

	window.onresize = function() {

		setCanvasSize(canvas, parent.width(), parent.width());
		grid.style.height = canvas.height + "px";
	    windowStatus = new Rectangle(canvas.width, canvas.height);
	    cellStatus = new Cell(numCell.y, numCell.x, Math.floor(windowStatus.width / numCell.x), Math.floor(windowStatus.height / numCell.y));
		mapStatus = new Rectangle(cellStatus.columns * cellStatus.width, cellStatus.rows * cellStatus.height);
    	mapCenter = mapStatus.center;
		mapFeature = defineMapFeature(mapCenter, mapStatus, windowStatus);
	    drawCellMap(ctx, cellStatus, mapStatus, windowStatus, mapFeature);
	    drawMapContent(ctx, mapContent, cellStatus, mapFeature);
	    writeText(ctx, mouseAt, mapCenter, cellStatus, mapStatus, windowStatus, mapFeature);
    
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
		writeMapContentValues(mapContent, cellStatus);
	});

    drawCellMap(ctx, cellStatus, mapStatus, windowStatus, mapFeature);
    writeText(ctx, mouseAt, mapCenter, cellStatus, mapStatus, windowStatus, mapFeature);

}

function isFullScreen(){
	if (document.fullscreenElement) {
        return true;
    }
    else if (document.webkitFullscreenElement) {
        return true;
    }
    else if (document.mozFullScreenElement) {
        return true;
    }
    else {
    	return false;
    }
}

function fullscreen(){
    
	if(canvas.webkitRequestFullScreen) {
		canvas.webkitRequestFullScreen();
	}
	else {
		canvas.mozRequestFullScreen();
	}
	
}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(rawFile.responseText);
}

let blocks = Object.freeze({
			"205" : {
				"" : ""
			},
			"206" : {
				"" : ""
			},
			"207" : {
				"" : ""
			}
		});

function playing() {

	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");
	let parent = $(canvas).parent();
	
	setCanvasSize(canvas, parent.width(), parent.width());
	
	/*
	readTextFile("/static/test.json", function(text){
	    var data = JSON.parse(text);
	    for (let i = 0; i < data.numCell.x; i++){
	    	for (let j = 0; j < data.numCell.y; j++){
	    		a += data.data[i][j] + " ";
	    	}
	    	a += "\n";
	    }
		console.log(a);
	});
	 */

	let numCell = {
		x : 100,
	    y : 100
	}
	
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

	numCell = {
		x : data.cellDim.x,
	    y : data.cellDim.y
	}

	let windowStatus = new Rectangle(canvas.width, canvas.height);
	let cellStatus = new Cell(numCell.y, numCell.x, Math.floor(windowStatus.width / numCell.x), Math.floor(windowStatus.height / numCell.y));
	let mapStatus = new Rectangle(cellStatus.columns * cellStatus.width, cellStatus.rows * cellStatus.height);
	let mapCenter = mapStatus.center;
	let mapFeature = defineMapFeature(mapCenter, mapStatus, windowStatus);
	let mapContent = createArray(cellStatus.columns, cellStatus.rows);
	
	for (let i = 0; i < numCell.x; i++){
    	for (let j = 0; j < numCell.y; j++){
    		mapContent[i][j] = {
    			image : undefined,
    			index : data.data[i][j]
    		}
    		let img = document.createElement("img");
    		img.src = "/static/img/map2/component (" + mapContent[i][j].index + ").png";
    		mapContent[i][j].image = img;
    	}
    }
	console.log(mapContent);
	
	let mouseAt = {
		windowPosition: { x: "x", y: "y" },
		mapPosition: { x: "x", y: "y" },
		cellPosition: { x: "x", y: "y" }
	}

	canvas.addEventListener('mousemove', function(event) {
		mouseAt = defineMouseAt(event, canvas, mapFeature, cellStatus);
		
	    clearCanvasContext(ctx, canvas);
	    //drawCellMap(ctx, cellStatus, mapStatus, windowStatus, mapFeature);
	    drawMapContent(ctx, mapContent, cellStatus, mapFeature);
	    drawMouseAtCell(ctx, mouseAt, cellStatus, mapFeature);
	    
	    event.returnValue = false;
	});

	canvas.addEventListener('mousedown', function(event) {
	    
	    event.returnValue = false;
	})

	canvas.addEventListener('mouseup',function(event){
	    
	    event.returnValue = false;
	    
	});

	canvas.addEventListener('wheel', function(event){

		zoom(mouseAt, mapCenter, cellStatus, mapStatus, windowStatus, mapFeature);
	    
        clearCanvasContext(ctx, canvas);
        let oldMapStatus = mapStatus;
        mapStatus = new Rectangle(cellStatus.columns * cellStatus.width, cellStatus.rows * cellStatus.height);
    	mapCenter.relativeLocation(oldMapStatus, mapStatus);
        mapFeature = defineMapFeature(mapCenter, mapStatus, windowStatus);
	    //drawCellMap(ctx, cellStatus, mapStatus, windowStatus, mapFeature);
	    drawMapContent(ctx, mapContent, cellStatus, mapFeature);
	    drawMouseAtCell(ctx, mouseAt, cellStatus, mapFeature);
	    
	    event.returnValue = false;
	    
	});

	window.onresize = function() {
		
		if (isFullScreen()){
			setCanvasSize(canvas, window.innerWidth, window.innerHeight);
		}
		else {
			setCanvasSize(canvas, parent.width(), parent.width());
		}
		
		windowStatus = new Rectangle(canvas.width, canvas.height);
	    cellStatus = new Cell(numCell.y, numCell.x, Math.floor(windowStatus.width / numCell.x), Math.floor(windowStatus.height / numCell.y));
		mapStatus = new Rectangle(cellStatus.columns * cellStatus.width, cellStatus.rows * cellStatus.height);
    	mapCenter = mapStatus.center;
		mapFeature = defineMapFeature(mapCenter, mapStatus, windowStatus);
	    //drawCellMap(ctx, cellStatus, mapStatus, windowStatus, mapFeature);
	    drawMapContent(ctx, mapContent, cellStatus, mapFeature);
    
    };

	document.getElementById("full-screen").addEventListener("click", fullscreen);

	drawCellMap(ctx, cellStatus, mapStatus, windowStatus, mapFeature);
	drawMapContent(ctx, mapContent, cellStatus, mapFeature);

}


