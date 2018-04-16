
function mapUpload(){

	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var data = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var dataToJSon = JSON.stringify(data);
    $.post("createMap",dataToJSon);

}
