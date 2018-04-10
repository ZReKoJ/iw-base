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
	canvas.width = width;
	canvas.height = height;
}

function defineWindowStatus(width, height) {
	let windowStatus = {
		dimension: undefined,
		center: undefined,
		margin: undefined
	}

	windowStatus.dimension = {
		width: width,
		height: height
	}
	
	windowStatus.center = {
		x: Math.floor(windowStatus.dimension.width / 2),
		y: Math.floor(windowStatus.dimension.height / 2)
	}
	
	windowStatus.margin = {
		left: windowStatus.center.x,
		right: windowStatus.dimension.width - windowStatus.center.x,
		top: windowStatus.center.y,
		down: windowStatus.dimension.height - windowStatus.center.y
	}
	
	return windowStatus;
}

function createCellStatus(cellNumber, windowStatus) {
	let cellStatus = {
		number: undefined,
		dimension: undefined
	}
	
	number = {
		x: cellNumber.x,
		y: cellNumber.y
	}
	
	dimension = {
		width : Math.floor(windowStatus.dimension.width / cellStatus.number.x),
	    height : Math.floor(windowStatus.dimension.height / cellStatus.number.y)
	}
	
	return cellStatus;
}

/**
 * 
 * @param cellStatus
 * @param dimensionStatus Could be mapStatus or windowStatus
 * @returns
 */
function defineMapStatus(cellStatus, dimensionStatus){
	let mapStatus = {
		dimension: undefined,
		center: undefined,
		margin: undefined,
	}
	
	mapStatus.dimension = {
		width: cellStatus.number.x * cellStatus.dimension.width,
		heigh: cellStatus.number.y * cellStatus.dimension.height
	}
	
	mapStatus.center = {
		x: Math.floor(mapStatus.dimension.width * dimensionStatus.center.x / dimensionStatus.dimension.width),
		y: Math.floor(mapStatus.dimension.height * dimensionStatus.center.y / dimensionStatus.dimension.height)
	}
	
	mapStatus.margin = {
		left: mapStatus.center.x,
		right: mapStatus.dimension.width - mapStatus.center.x,
		top: mapStatus.center.y,
		down: mapStatus.dimension.height - mapStatus.center.y
	}
	
	return mapStatus;
}

function mapDesign() {
	
	let canvas = getCanvas();
	let ctx = canvas.getContext("2d");
	let parent = $(canvas).parent();
	let grid = document.getElementById("grid-element");

	function canvasSize(){
		setCanvasSize(canvas, parent.width(), parent.width());
		grid.style.height = canvas.height + "px";
	}

	let numCell = {
		x : 100,
	    y : 100
	}

	let mapContent = createArray(numCell.x, numCell.y);

	let dragSpeed = 0.05;
	let zoomScale = 1;
	let moveScale = 5;
	let lineWidth = 0;

	let windowStatus = defineWindowStatus(canvas.width, canvas.height);
	let cellStatus = defineCellStatus(numCell, windowStatus);

	let mapDim;
	let cellDim;
	let center;
	
	function initValues() {
		
		cellStatus = defineCellStatus(numCell, windowStatus);
		let mapStatus = defineMapStatus(cellStatus, windowStatus);
		
		mapDim = {
		    x : mapStatus.dimension.width,
		    y : mapStatus.dimension.height
		};
	
		cellDim = {
		    x : cellStatus.dimension.width,
		    y : cellStatus.dimension.height
		};
		    
		center = {
		    x : mapStatus.center.x,
		    y :  mapStatus.center.y
		}
	}

	let mapDist;
	let margin;

	let mousePos = {
		x : "x",
	    y : "y"
	}

	let mouseMapPos = {
		x : "x",
	    y : "y"
	}

	let cellPos = {
		x : "x",
	    y : "y"
	}

	function resetValues() {
	    
    	let operation = {
        	x : mapDim.x,
            y : mapDim.y
        }
	    
	    mapDim = {
	        x : numCell.x * cellDim.x,
	        y : numCell.y * cellDim.y
	    }
	    
	    lineWidth = (mapDim.x < windowStatus.dimension.width || mapDim.y < windowStatus.dimension.height) ? 0 : 1; 
        center.x = Math.floor(mapDim.x * center.x / operation.x);
        center.y = Math.floor(mapDim.y * center.y / operation.y);
	    
	    mapDist = {
	        left : center.x,
	        right : mapDim.x - center.x,
	        up : center.y,
	        down : mapDim.y - center.y
	    }

	    margin = {
	        left : windowStatus.margin.left - mapDist.left,
	        right : windowStatus.margin.right - mapDist.right,
	        up : windowStatus.margin.top - mapDist.up,
	        down : windowStatus.margin.down - mapDist.down
	    }

	}

	function drawCellMap() {

	    ctx.setLineDash([lineWidth, lineWidth]);
	    ctx.lineWidth = 1;
	    ctx.strokeStyle = "gray";
	    
		let coord = {
	    	left : (margin.left > 0) ? margin.left : 0,
	        right : (margin.right > 0) ? windowStatus.dimension.width - margin.right : windowStatus.dimension.width,
			up : (margin.up > 0) ? margin.up : 0,
	        down : (margin.down > 0) ? windowStatus.dimension.height - margin.down : windowStatus.dimension.height
		}
	    
	    let i = (margin.left > 0) ? margin.left : cellDim.x - Math.abs(margin.left % cellDim.x);
	    let j = (margin.up > 0) ? margin.up : cellDim.y - Math.abs(margin.up % cellDim.y);

	    while (i <= coord.right){
	        ctx.moveTo(i + 0.5, coord.up);
	        ctx.lineTo(i + 0.5, coord.down);
	        i += cellDim.x;
	    }

	    while (j <= coord.down){
	        ctx.moveTo(coord.left, j + 0.5);
	        ctx.lineTo(coord.right, j + 0.5);
	        j += cellDim.y;
	    }
	    
	    for (let ii = 0; ii < numCell.x; ii++){
	        for (let jj = 0; jj < numCell.y; jj++){
	            if (mapContent[ii][jj] != undefined) {
	                ctx.drawImage(mapContent[ii][jj], ii * cellDim.x + margin.left, jj * cellDim.y + margin.up, cellDim.x, cellDim.y);
	            }
	        }
	    }

	    ctx.fillStyle = "#00FFEE";
		if (0 <= cellPos.x && cellPos.x < numCell.x && 0 <= cellPos.y && cellPos.y < numCell.y) {
	        ctx.fillRect(cellPos.x * cellDim.x + margin.left, cellPos.y * cellDim.y + margin.up, cellDim.x, cellDim.y);
	    }
		  
	    ctx.fillStyle = "white";
	    ctx.font = "20px Arial";
	    ctx.fillText("[" + mousePos.x + ", " + mousePos.y + "]", 10, 20);
	    ctx.fillText("[" + mouseMapPos.x + ", " + mouseMapPos.y + "]", 10, 40);
	    ctx.fillText("[" + cellPos.x + ", " + cellPos.y + "]", 10, 60);
	    ctx.font = "15px Arial";
	    ctx.fillText("Dimension win [" + windowStatus.dimension.width + ", " + windowStatus.dimension.height + "]", 10, 80);
	    ctx.fillText("Dimension map [" + mapDim.x + ", " + mapDim.y + "]", 10, 100);
	    ctx.fillText("Dimension cell [" + cellDim.x + ", " + cellDim.y + "]", 10, 120);
	    ctx.fillText("Distance win [" + windowStatus.margin.left + ", " + windowStatus.margin.right + ", " + windowStatus.margin.top + ", " + windowStatus.margin.down + "]", 10, 140);
	    ctx.fillText("Distance map [" + mapDist.left + ", " + mapDist.right + ", " + mapDist.up + ", " + mapDist.down + "]", 10, 160);
	    ctx.fillText("Center [" + center.x + ", " + center.y + "]", 10, 180);
	    ctx.fillText("Margin [" + margin.left + ", " + margin.right + ", " + margin.up + ", " + margin.down + "]", 10, 200);
	    ctx.fillText("Coord [" + coord.left + ", " + coord.right + ", " + coord.up + ", " + coord.down + "]", 10, 220);
	    
	    
	    ctx.stroke();
	}

	function clear() {
	    ctx.save();
	    ctx.beginPath();
	    ctx.setTransform(1, 0, 0, 1, 0, 0);
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	    ctx.restore();
	}

	let drag = false;

	canvas.addEventListener('mousemove', function(event) {
		let rect = canvas.getBoundingClientRect();
		
	    mousePos = {
	        x: Math.floor((event.clientX - rect.left) * (canvas.width / rect.width)),
	        y: Math.floor((event.clientY - rect.top) * (canvas.height / rect.height))
	    }
	    
	    mouseMapPos = {
	    	x: mousePos.x - margin.left,
	    	y: mousePos.y - margin.up
	    }
	    
	    cellPos = {
	    	x: Math.floor(mouseMapPos.x / cellDim.x),
	    	y: Math.floor(mouseMapPos.y / cellDim.y)
	    }
	    
	    if (drag && 0 <= cellPos.x && cellPos.x < numCell.x && 0 <= cellPos.y && cellPos.y < numCell.y){
	    	mapContent[cellPos.x][cellPos.y] = $('.selected')[0];
	    }
		
	    clear();
	    drawCellMap();
	    
	});

	canvas.addEventListener('mousedown', function(event) {

		drag = true;
	    
	    if (0 <= cellPos.x && cellPos.x < numCell.x && 0 <= cellPos.y && cellPos.y < numCell.y){
	    	mapContent[cellPos.x][cellPos.y] = $('.selected')[0];
	    }

	})

	canvas.addEventListener('mouseup',function(event){

	    drag = false;

	});

	canvas.addEventListener('wheel', function(event){

		let horizontal = mousePos.x - windowStatus.center.x;
		let vertical = mousePos.y - windowStatus.center.y;
        
		if (Math.abs(horizontal) < windowStatus.center.x * 0.6 && Math.abs(vertical) < windowStatus.center.y * 0.6){
            if (event.deltaY < 0) {
                cellDim.x += zoomScale;
                cellDim.y += zoomScale;
                if (cellDim.x > (windowStatus.dimension.width / 10) || cellDim.y > (windowStatus.dimension.height / 10)){
                    cellDim.x -= zoomScale;
                    cellDim.y -= zoomScale;
                }
            }
            else {
                cellDim.x -= zoomScale;
                cellDim.y -= zoomScale;
                if (mapDim.x < windowStatus.dimension.width || mapDim.y < windowStatus.dimension.height){
                    cellDim.x += zoomScale;
                    cellDim.y += zoomScale;
                }
            }
        }
        else {
        	let zoomValue = (event.deltaY < 0) ? moveScale : moveScale * -1;
            center.x += (horizontal > 0) ? zoomValue : zoomValue * -1;
            center.y += (vertical > 0) ? zoomValue : zoomValue * -1;
        }
	    
        clear();
        resetValues();
	    drawCellMap();
	    
	    event.returnValue = false;
	    
	});

	window.onresize = function() {

    	canvasSize();
	    windowStatus = defineWindowStatus(canvas.width, canvas.height);
		initValues();
		resetValues();
	    drawCellMap();
    
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

	canvasSize();
    windowStatus = defineWindowStatus(canvas.width, canvas.height);
	initValues();
	resetValues();
    drawCellMap();

}