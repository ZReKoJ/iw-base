$( document ).ready(function() {

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	
	// Create gradient
	var grd=ctx.createLinearGradient(0, 0, canvas.width, 0);
	grd.addColorStop(0,"red");
	grd.addColorStop(1,"white");

	// Fill with gradient
	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	// Draw lines
    ctx.lineWidth = 2;
    var cellWidth = canvas.width / 20.0;
    var cellHeight = canvas.height / 20.0;
    var i = cellWidth + 0.5;
    while (i < canvas.height){
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
      i = i + cellHeight;
    }
    var j = cellHeight + 0.5;
    while (j < canvas.width){
      ctx.moveTo(j, 0);
      ctx.lineTo(j, canvas.height);
      ctx.stroke();
      j = j + cellWidth;
    }

});