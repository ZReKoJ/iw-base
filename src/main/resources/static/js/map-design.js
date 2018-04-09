$( document ).ready(function() {

	var canvas = document.getElementById("mapBuilder");
	var ctx = canvas.getContext("2d");
	var parent = $(canvas).parent();
	var grid = document.getElementById("grid-element");

	function canvasSize(){
		canvas.width = parent.width();
		canvas.height = parent.width();
		grid.style.height = canvas.height + "px";
	}

	function createArray(length) {
	    var arr = new Array(length || 0),
	        i = length;

	    if (arguments.length > 1) {
	        var args = Array.prototype.slice.call(arguments, 1);
	        while(i--) arr[length-1 - i] = createArray.apply(this, args);
	    }

	    return arr;
	}

	var numCell = {
		x : 100,
	    y : 100
	}

	var mapContent = createArray(numCell.x, numCell.y);

	var dragSpeed = 0.05;
	var zoomScale = 1;
	var moveScale = 5;
	var lineWidth = 0;

	var winDim;
	var winCenter;
	var winDist;

	function resizeWin() {
	    
		winDim = {
	        x : canvas.width,
	        y : canvas.height
	    }

	    winCenter = {
	        x : Math.floor(winDim.x / 2),
	        y : Math.floor(winDim.y / 2)
	    } 
	    
	    winDist = {
	        left : winCenter.x,
	        right : winDim.x - winCenter.x,
	    	up : winCenter.y,
	        down : winDim.y - winCenter.y
	    }

	}

	var mapDim;
	var cellDim;
	var center;
	
	function initValues() {
		mapDim = {
		    x : Math.min(winDim.x - 10, winDim.y - 10),
		    y : Math.min(winDim.x - 10, winDim.y - 10),
		};
	
		cellDim = {
		    x : Math.floor(mapDim.x / numCell.x),
		    y : Math.floor(mapDim.y / numCell.y)
		};
		    
		center = {
		    x : Math.floor(mapDim.x / 2),
		    y : Math.floor(mapDim.y / 2)
		}
		mapDim = {
		    x : numCell.x * cellDim.x,
		    y : numCell.y * cellDim.y
		}
		center = {
		    x : Math.floor(mapDim.x / 2),
		    y : Math.floor(mapDim.y / 2)
		}
	}

	var mapDist;
	var margin;

	var mousePos = {
		x : "x",
	    y : "y"
	}

	var mouseMapPos = {
		x : "x",
	    y : "y"
	}

	var cellPos = {
		x : "x",
	    y : "y"
	}

	function resetValues() {
	    
    	var operation = {
        	x : mapDim.x,
            y : mapDim.y
        }
	    
	    mapDim = {
	        x : numCell.x * cellDim.x,
	        y : numCell.y * cellDim.y
	    }
	    
	    lineWidth = (mapDim.x < winDim.x || mapDim.y < winDim.y) ? 0 : 1; 
        center.x = Math.floor(mapDim.x * center.x / operation.x);
        center.y = Math.floor(mapDim.y * center.y / operation.y);
	    
	    mapDist = {
	        left : center.x,
	        right : mapDim.x - center.x,
	        up : center.y,
	        down : mapDim.y - center.y
	    }

	    margin = {
	        left : winDist.left - mapDist.left,
	        right : winDist.right - mapDist.right,
	        up : winDist.up - mapDist.up,
	        down : winDist.down - mapDist.down
	    }

	}

	function drawCellMap() {

	    ctx.setLineDash([lineWidth, lineWidth]);
	    ctx.lineWidth = 1;
	    ctx.strokeStyle = "gray";
	    
		var coord = {
	    	left : (margin.left > 0) ? margin.left : 0,
	        right : (margin.right > 0) ? winDim.x - margin.right : winDim.x,
			up : (margin.up > 0) ? margin.up : 0,
	        down : (margin.down > 0) ? winDim.y - margin.down : winDim.y
		}
	    
	    var i = (margin.left > 0) ? margin.left : cellDim.x - Math.abs(margin.left % cellDim.x);
	    var j = (margin.up > 0) ? margin.up : cellDim.y - Math.abs(margin.up % cellDim.y);

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
	    
	    for (var ii = 0; ii < numCell.x; ii++){
	        for (var jj = 0; jj < numCell.y; jj++){
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
	    ctx.fillText("Dimension win [" + winDim.x + ", " + winDim.y + "]", 10, 80);
	    ctx.fillText("Dimension map [" + mapDim.x + ", " + mapDim.y + "]", 10, 100);
	    ctx.fillText("Dimension cell [" + cellDim.x + ", " + cellDim.y + "]", 10, 120);
	    ctx.fillText("Distance win [" + winDist.left + ", " + winDist.right + ", " + winDist.up + ", " + winDist.down + "]", 10, 140);
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

	var drag = false;

	canvas.addEventListener('mousemove', function(event) {
		var rect = canvas.getBoundingClientRect();
		
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

		var horizontal = mousePos.x - winCenter.x;
		var vertical = mousePos.y - winCenter.y;
        
		if (Math.abs(horizontal) < winCenter.x * 0.6 && Math.abs(vertical) < winCenter.y * 0.6){
            if (event.deltaY < 0) {
                cellDim.x += zoomScale;
                cellDim.y += zoomScale;
                if (cellDim.x > (winDim.x / 10) || cellDim.y > (winDim.y / 10)){
                    cellDim.x -= zoomScale;
                    cellDim.y -= zoomScale;
                }
            }
            else {
                cellDim.x -= zoomScale;
                cellDim.y -= zoomScale;
                if (mapDim.x < winDim.x || mapDim.y < winDim.y){
                    cellDim.x += zoomScale;
                    cellDim.y += zoomScale;
                }
            }
        }
        else {
        	var zoomValue = (event.deltaY < 0) ? moveScale : moveScale * -1;
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
	    resizeWin();
		initValues();
		resetValues();
	    drawCellMap();
    
    };

	var path;
	for (var x = 1; x < 170; x++){
		path = "<img class='icon' src='/static/img/map/component (" + x + ").png'>";
		$('#grid-element').append(path)
	}
    
	var imgs = $('#grid-element').find('img');
	
	imgs.click(function(e) {
		$(this).addClass("selected"); 
		$(this).siblings('img.icon.selected').removeClass("selected");
	});
	
	imgs.mouseover(function(){
		$(this).attr("style", "border: 2px solid white");
		$(this).siblings('img.icon').removeAttr( "style" );
	});

	canvasSize();
    resizeWin();
	initValues();
	resetValues();
    drawCellMap();

});