$( document ).ready(function() {

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var container = $(canvas).parent();
	
	window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
            canvas.width = container.width() * 2;
            canvas.height = container.width() * 2;
            drawStuff(); 
    }
    resizeCanvas();

    function drawStuff() {
    	// Create gradient
    	/*var grd=ctx.createLinearGradient(0, 0, canvas.width, 0);
    	grd.addColorStop(0,"red");
    	grd.addColorStop(1,"white");

    	// Fill with gradient
    	ctx.fillStyle = grd;
    	ctx.fillRect(0, 0, canvas.width, canvas.height);*/
    	
    	// Draw lines
    	ctx.lineWidth = 1;
    	var cellWidth = Math.floor(canvas.width / 20);
    	var cellHeight = Math.floor(canvas.height / 20);
    	var i = 0.5;
    	while (i < canvas.height){
    	  ctx.moveTo(0.5, i);
    	  ctx.lineTo(canvas.width + 0.5, i);
    	  i = i + cellHeight;
    	}
    	var j = 0.5;
    	while (j < canvas.width){
    	  ctx.moveTo(j, 0.5);
    	  ctx.lineTo(j, canvas.height + 0.5);
    	  j = j + cellWidth;
    	}
    	ctx.moveTo(0.5, 0.5);
    	ctx.lineTo(500.5, 500.5)
    	ctx.stroke();
    }

});