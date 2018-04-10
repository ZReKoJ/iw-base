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

function getCanvas() {
	return document.getElementById("canvas");
}

function setCanvasSize(canvas, width, height){
	let max = Math.max(width, height);
	canvas.width = max;
	canvas.height = max;
}

function defineCellStatus(cellNumber, windowStatus) {
	let status = {
		number: undefined,
		dimension: undefined
	}
	
	status.number = {
		x: cellNumber.x,
		y: cellNumber.y
	}
	
	status.dimension = {
		width : Math.floor(windowStatus.dimension.width / status.number.x),
	    height : Math.floor(windowStatus.dimension.height / status.number.y)
	}
	
	return status;
}

function defineWindowStatus(width, height) {
	let status = {
		dimension: undefined,
		center: undefined,
		margin: undefined
	}

	status.dimension = {
		width: width,
		height: height
	}
	
	status.center = {
		x: Math.floor(status.dimension.width / 2),
		y: Math.floor(status.dimension.height / 2)
	}
	
	status.margin = {
		left: status.center.x,
		right: status.dimension.width - status.center.x,
		top: status.center.y,
		down: status.dimension.height - status.center.y
	}
	
	return status;
}

/**
 * 
 * @param cellStatus
 * @param dimensionStatus Could be mapStatus or windowStatus
 * @returns
 */
function defineMapStatus(cellStatus, dimensionStatus){
	let status = {
		dimension: undefined,
		center: undefined,
		margin: undefined
	}
	
	status.dimension = {
		width: cellStatus.number.x * cellStatus.dimension.width,
		height: cellStatus.number.y * cellStatus.dimension.height
	}
	
	status.center = {
		x: Math.floor(status.dimension.width * dimensionStatus.center.x / dimensionStatus.dimension.width),
		y: Math.floor(status.dimension.height * dimensionStatus.center.y / dimensionStatus.dimension.height)
	}
	
	status.margin = {
		left: status.center.x,
		right: status.dimension.width - status.center.x,
		top: status.center.y,
		down: status.dimension.height - status.center.y
	}
	
	return status;
}

function defineMapFeature(mapStatus, windowStatus){
	let feature = {
		zoomScale: 1,
		moveScale: 5,
		lineDash: 0,
		lineWidth: 1,
		margin: undefined
	}
	
	feature.lineDash = (mapStatus.dimension.width < windowStatus.dimension.width || mapStatus.dimension.height < windowStatus.dimension.height) ? 0 : 1; 

	feature.margin = {
        left : windowStatus.margin.left - mapStatus.margin.left,
        right : windowStatus.margin.right - mapStatus.margin.right,
        top : windowStatus.margin.top - mapStatus.margin.top,
        down : windowStatus.margin.down - mapStatus.margin.down
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
    	x: Math.floor(mouseAt.mapPosition.x / cellStatus.dimension.width),
    	y: Math.floor(mouseAt.mapPosition.y / cellStatus.dimension.height)
    }
	
	return mouseAt;
}

function drawCellMap(ctx, cellStatus, mapStatus, windowStatus, mapFeature) {

    ctx.setLineDash([mapFeature.lineDash, mapFeature.lineDash]);
    ctx.lineWidth = mapFeature.lineWidth;
    ctx.strokeStyle = "gray";
    
	let coord = {
    	left : (mapFeature.margin.left > 0) ? mapFeature.margin.left : 0,
        right : (mapFeature.margin.right > 0) ? windowStatus.dimension.width - mapFeature.margin.right : windowStatus.dimension.width,
		up : (mapFeature.margin.top > 0) ? mapFeature.margin.top : 0,
        down : (mapFeature.margin.down > 0) ? windowStatus.dimension.height - mapFeature.margin.down : windowStatus.dimension.height
	}
    
    let i = (mapFeature.margin.left > 0) ? mapFeature.margin.left : cellStatus.dimension.width - Math.abs(mapFeature.margin.left % cellStatus.dimension.width);
    let j = (mapFeature.margin.top > 0) ? mapFeature.margin.top : cellStatus.dimension.height - Math.abs(mapFeature.margin.top % cellStatus.dimension.height);

    while (i <= coord.right){
        ctx.moveTo(i + 0.5, coord.up);
        ctx.lineTo(i + 0.5, coord.down);
        i += cellStatus.dimension.width;
    }

    while (j <= coord.down){
        ctx.moveTo(coord.left, j + 0.5);
        ctx.lineTo(coord.right, j + 0.5);
        j += cellStatus.dimension.height;
    }
    
    ctx.stroke();
}

function drawMapContent(ctx, mapContent, cellStatus, mapFeature){
    for (let ii = 0; ii < cellStatus.number.x; ii++){
        for (let jj = 0; jj < cellStatus.number.y; jj++){
            if (mapContent[ii][jj] != undefined) {
                ctx.drawImage(mapContent[ii][jj], ii * cellStatus.dimension.width + mapFeature.margin.left, jj * cellStatus.dimension.height + mapFeature.margin.top, cellStatus.dimension.width, cellStatus.dimension.height);
            }
        }
    }
}

function drawMapContentColour(ctx, mapContent, cellStatus, mapFeature){
	ctx.fillStyle = "#FFDC27";
    for (let ii = 0; ii < cellStatus.number.x; ii++){
        for (let jj = 0; jj < cellStatus.number.y; jj++){
            if (mapContent[ii][jj] != undefined) {
                ctx.fillRect(ii * cellStatus.dimension.width + mapFeature.margin.left, jj * cellStatus.dimension.height + mapFeature.margin.top, cellStatus.dimension.width, cellStatus.dimension.height);
            }
        }
    }
}

function drawMouseAtCell(ctx, mouseAt, cellStatus, mapFeature){
    ctx.fillStyle = "#00FFEE";
	if (0 <= mouseAt.cellPosition.x && mouseAt.cellPosition.x < cellStatus.number.x && 0 <= mouseAt.cellPosition.y && mouseAt.cellPosition.y < cellStatus.number.y) {
        ctx.fillRect(mouseAt.cellPosition.x * cellStatus.dimension.width + mapFeature.margin.left, mouseAt.cellPosition.y * cellStatus.dimension.height + mapFeature.margin.top, cellStatus.dimension.width, cellStatus.dimension.height);
    }
}

function writeText(ctx, mouseAt, cellStatus, mapStatus, windowStatus, mapFeature){
	ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("[" + mouseAt.windowPosition.x + ", " + mouseAt.windowPosition.y + "]", 10, 20);
    ctx.fillText("[" + mouseAt.mapPosition.x + ", " + mouseAt.mapPosition.y + "]", 10, 40);
    ctx.fillText("[" + mouseAt.cellPosition.x + ", " + mouseAt.cellPosition.y + "]", 10, 60);
    ctx.font = "15px Arial";
    ctx.fillText("Dimension win [" + windowStatus.dimension.width + ", " + windowStatus.dimension.height + "]", 10, 80);
    ctx.fillText("Dimension map [" + mapStatus.dimension.width + ", " + mapStatus.dimension.height + "]", 10, 100);
    ctx.fillText("Dimension cell [" + cellStatus.dimension.width + ", " + cellStatus.dimension.height + "]", 10, 120);
    ctx.fillText("Distance win [" + windowStatus.margin.left + ", " + windowStatus.margin.right + ", " + windowStatus.margin.top + ", " + windowStatus.margin.down + "]", 10, 140);
    ctx.fillText("Distance map [" + mapStatus.margin.left + ", " + mapStatus.margin.right + ", " + mapStatus.margin.top + ", " + mapStatus.margin.down + "]", 10, 160);
    ctx.fillText("Center [" + mapStatus.center.x + ", " + mapStatus.center.y + "]", 10, 180);
    ctx.fillText("Margin [" + mapFeature.margin.left + ", " + mapFeature.margin.right + ", " + mapFeature.margin.top + ", " + mapFeature.margin.down + "]", 10, 200);
}

function clearCanvasContext(ctx, canvas) {
    ctx.save();
    ctx.beginPath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

function zoom(mouseAt, cellStatus, mapStatus, windowStatus, mapFeature){
	let horizontal = mouseAt.windowPosition.x - windowStatus.center.x;
	let vertical = mouseAt.windowPosition.y - windowStatus.center.y;
    
	if (Math.abs(horizontal) < windowStatus.center.x * 0.6 && Math.abs(vertical) < windowStatus.center.y * 0.6){
        if (event.deltaY < 0) {
            cellStatus.dimension.width += mapFeature.zoomScale;
            cellStatus.dimension.height += mapFeature.zoomScale;
            if (cellStatus.dimension.width > (windowStatus.dimension.width / 10) || cellStatus.dimension.height > (windowStatus.dimension.height / 10)){
                cellStatus.dimension.width -= mapFeature.zoomScale;
                cellStatus.dimension.height -= mapFeature.zoomScale;
            }
        }
        else {
            cellStatus.dimension.width -= mapFeature.zoomScale;
            cellStatus.dimension.height -= mapFeature.zoomScale;
            if (mapStatus.dimension.width < windowStatus.dimension.width || mapStatus.dimension.height < windowStatus.dimension.height){
                cellStatus.dimension.width += mapFeature.zoomScale;
                cellStatus.dimension.height += mapFeature.zoomScale;
            }
        }
    }
    else {
    	let zoomValue = (event.deltaY < 0) ? mapFeature.moveScale : mapFeature.moveScale * -1;
    	mapStatus.center.x += (horizontal > 0) ? zoomValue : zoomValue * -1;
    	mapStatus.center.y += (vertical > 0) ? zoomValue : zoomValue * -1;
    }
}

function mapDesign() {
	
	let canvas = getCanvas();
	let ctx = canvas.getContext("2d");
	let parent = $(canvas).parent();
	let grid = document.getElementById("grid-element");

	setCanvasSize(canvas, parent.width(), parent.height());
	grid.style.height = canvas.height + "px";
	
	numCell = {
		x: 100,
		y: 100
	}
	
	let windowStatus = defineWindowStatus(canvas.width, canvas.height);
	let cellStatus = defineCellStatus(numCell, windowStatus);
	let mapStatus = defineMapStatus(cellStatus, windowStatus);
	let mapFeature = defineMapFeature(mapStatus, windowStatus);
	let mapContent = createArray(cellStatus.number.x, cellStatus.number.y);
	let mouseAt = {
		windowPosition: { x: "x", y: "y" },
		mapPosition: { x: "x", y: "y" },
		cellPosition: { x: "x", y: "y" }
	}

	let drag = false;

	canvas.addEventListener('mousemove', function(event) {
		mouseAt = defineMouseAt(event, canvas, mapFeature, cellStatus);
	    
	    if (drag && 0 <= mouseAt.cellPosition.x && mouseAt.cellPosition.x < cellStatus.number.x && 0 <= mouseAt.cellPosition.y && mouseAt.cellPosition.y < cellStatus.number.y){
	    	mapContent[mouseAt.cellPosition.x][mouseAt.cellPosition.y] = $('.selected')[0];
	    }
		
	    clearCanvasContext(ctx, canvas);
	    drawCellMap(ctx, cellStatus, mapStatus, windowStatus, mapFeature);
	    drawMapContent(ctx, mapContent, cellStatus, mapFeature);
	    writeText(ctx, mouseAt, cellStatus, mapStatus, windowStatus, mapFeature);
	    drawMouseAtCell(ctx, mouseAt, cellStatus, mapFeature);
	    
	    event.returnValue = false;
	});

	canvas.addEventListener('mousedown', function(event) {

		drag = true;
	    
	    if (0 <= mouseAt.cellPosition.x && mouseAt.cellPosition.x < cellStatus.number.x && 0 <= mouseAt.cellPosition.y && mouseAt.cellPosition.y < cellStatus.number.y){
	    	mapContent[mouseAt.cellPosition.x][mouseAt.cellPosition.y] = $('.selected')[0];
	    }
	    
	    event.returnValue = false;
	})

	canvas.addEventListener('mouseup',function(event){

	    drag = false;
	    
	    event.returnValue = false;
	    
	});

	canvas.addEventListener('wheel', function(event){

		zoom(mouseAt, cellStatus, mapStatus, windowStatus, mapFeature);
	    
        clearCanvasContext(ctx, canvas);
        mapStatus = defineMapStatus(cellStatus, mapStatus);
    	mapFeature = defineMapFeature(mapStatus, windowStatus);
	    drawCellMap(ctx, cellStatus, mapStatus, windowStatus, mapFeature);
	    drawMapContent(ctx, mapContent, cellStatus, mapFeature);
	    writeText(ctx, mouseAt, cellStatus, mapStatus, windowStatus, mapFeature);
	    drawMouseAtCell(ctx, mouseAt, cellStatus, mapFeature);
	    
	    event.returnValue = false;
	    
	});

	window.onresize = function() {

		setCanvasSize(canvas, parent.width(), parent.height());
		grid.style.height = canvas.height + "px";
	    windowStatus = defineWindowStatus(canvas.width, canvas.height);
	    cellStatus = defineCellStatus(numCell, windowStatus);
		mapStatus = defineMapStatus(cellStatus, windowStatus);
    	mapFeature = defineMapFeature(mapStatus, windowStatus);
	    drawCellMap(ctx, cellStatus, mapStatus, windowStatus, mapFeature);
	    drawMapContent(ctx, mapContent, cellStatus, mapFeature);
	    writeText(ctx, mouseAt, cellStatus, mapStatus, windowStatus, mapFeature);
    
    };

	let path;
	for (let x = 1; x < 324; x++){
		path = "<img class='icon' src='/static/img/map2/component (" + x + ").png'>";
		$('#grid-element').append(path)
	}
    
	let imgs = $('#grid-element').find('img');
	
	imgs.click(function(e) {
		$(this).addClass("selected"); 
		$(this).siblings('img.icon.selected').removeClass("selected");
	});
	
	imgs.mouseover(function(){
		$(this).attr("style", "border: 2px solid white");
		$(this).siblings('img.icon').removeAttr( "style" );
	});

    drawCellMap(ctx, cellStatus, mapStatus, windowStatus, mapFeature);
    writeText(ctx, mouseAt, cellStatus, mapStatus, windowStatus, mapFeature);

}

function playing() {

	let canvas = getCanvas();
	let ctx = canvas.getContext("2d");
	let parent = $(canvas).parent();
	
	setCanvasSize(canvas, parent.width(), parent.height());

	let numCell = {
		x : 100,
	    y : 100
	}

	let windowStatus = defineWindowStatus(canvas.width, canvas.height);
	let cellStatus = defineCellStatus(numCell, windowStatus);
	let mapStatus = defineMapStatus(cellStatus, windowStatus);
	let mapFeature = defineMapFeature(mapStatus, windowStatus);
	let mapContent = createArray(cellStatus.number.x, cellStatus.number.y);
	let mouseAt = {
		windowPosition: { x: "x", y: "y" },
		mapPosition: { x: "x", y: "y" },
		cellPosition: { x: "x", y: "y" }
	}

	let drag = false;
	let fullScreen = false;

	canvas.addEventListener('mousemove', function(event) {
		mouseAt = defineMouseAt(event, canvas, mapFeature, cellStatus);
	    
	    if (drag && 0 <= mouseAt.cellPosition.x && mouseAt.cellPosition.x < cellStatus.number.x && 0 <= mouseAt.cellPosition.y && mouseAt.cellPosition.y < cellStatus.number.y){
	    	mapContent[mouseAt.cellPosition.x][mouseAt.cellPosition.y] = 1;
	    }
		
	    clearCanvasContext(ctx, canvas);
	    drawCellMap(ctx, cellStatus, mapStatus, windowStatus, mapFeature);
	    drawMapContentColour(ctx, mapContent, cellStatus, mapFeature);
	    drawMouseAtCell(ctx, mouseAt, cellStatus, mapFeature);
	    
	    event.returnValue = false;
	});

	canvas.addEventListener('mousedown', function(event) {

		drag = true;
	    
	    if (0 <= mouseAt.cellPosition.x && mouseAt.cellPosition.x < cellStatus.number.x && 0 <= mouseAt.cellPosition.y && mouseAt.cellPosition.y < cellStatus.number.y){
	    	mapContent[mouseAt.cellPosition.x][mouseAt.cellPosition.y] = 1;
	    }
	    
	    event.returnValue = false;
	})

	canvas.addEventListener('mouseup',function(event){

	    drag = false;
	    
	    event.returnValue = false;
	    
	});

	canvas.addEventListener('wheel', function(event){

		zoom(mouseAt, cellStatus, mapStatus, windowStatus, mapFeature);
	    
        clearCanvasContext(ctx, canvas);
        mapStatus = defineMapStatus(cellStatus, mapStatus);
    	mapFeature = defineMapFeature(mapStatus, windowStatus);
	    drawCellMap(ctx, cellStatus, mapStatus, windowStatus, mapFeature);
	    drawMapContentColour(ctx, mapContent, cellStatus, mapFeature);
	    drawMouseAtCell(ctx, mouseAt, cellStatus, mapFeature);
	    
	    event.returnValue = false;
	    
	});

	window.onresize = function() {
		
		if (fullScreen){
			setCanvasSize(canvas, window.innerWidth, window.innerHeight);
		}
		else {
			setCanvasSize(canvas, parent.width(), parent.height());
		}
		
		fullScreen = false;
	    windowStatus = defineWindowStatus(canvas.width, canvas.height);
	    cellStatus = defineCellStatus(numCell, windowStatus);
		mapStatus = defineMapStatus(cellStatus, windowStatus);
    	mapFeature = defineMapFeature(mapStatus, windowStatus);
	    drawCellMap(ctx, cellStatus, mapStatus, windowStatus, mapFeature);
	    drawMapContentColour(ctx, mapContent, cellStatus, mapFeature);
    
    };
	
	function fullscreen(){
	    
		if(canvas.webkitRequestFullScreen) {
			canvas.webkitRequestFullScreen();
		}
		else {
			canvas.mozRequestFullScreen();
		}
		
		fullScreen = true;
		
	}

	document.getElementById("full-screen").addEventListener("click", fullscreen);

	drawCellMap(ctx, cellStatus, mapStatus, windowStatus, mapFeature);

}
