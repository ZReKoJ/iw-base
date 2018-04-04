$( document ).ready(function() {

	var canvas = document.getElementById("mapBuilder");
	var ctx = canvas.getContext("2d");
	var container = $(canvas).parent();
	
	window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
            canvas.width = container.width();
            canvas.height = container.width();
            drawCellMap(); 
    }
    
    resizeCanvas();

    function drawCellMap() {
    	// Create gradient
    	/*var grd=ctx.createLinearGradient(0, 0, canvas.width, 0);
    	grd.addColorStop(0,"red");
    	grd.addColorStop(1,"white");

    	// Fill with gradient
    	ctx.fillStyle = grd;
    	ctx.fillRect(0, 0, canvas.width, canvas.height);*/
    	
    	// Draw lines
    	var numCells = 20;

    	var cellDimension = Math.floor(canvas.width / numCells);

    	var horizontalMargin = canvas.width % cellDimension;
    	var verticalMargin = canvas.height % cellDimension;

    	var marginLeft = Math.floor(horizontalMargin / 2);
    	var marginRight = Math.ceil(verticalMargin / 2);

    	var marginUp = Math.floor(verticalMargin / 2);
    	var marginDown = Math.ceil(verticalMargin / 2);

    	ctx.setLineDash([1, 1]);
    	ctx.lineWidth = 1;

    	var i = marginLeft + 0.5;

    	while (i < canvas.width){
    		ctx.moveTo(i, 0);
    		ctx.lineTo(i, canvas.height);
    		i = i + cellDimension;
    	}

    	var j = marginUp + 0.5;

    	while (j < canvas.height){
    		ctx.moveTo(0, j);
    		ctx.lineTo(canvas.width, j);
    		j = j + cellDimension;
    	}

    	ctx.strokeStyle = "lightGray";
    	ctx.stroke();
    }

});