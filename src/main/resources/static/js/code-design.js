'use strict';

function codeDesign(codeId) {
	
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");
	let parent = $(canvas).parent();
	canvas.width = parent.width();
	canvas.height = parent.height();

	let battleGround = new BattleGround(canvas, 10, 10);
	
	window.onresize = function() {
		
		canvas.width = parent.width();
		canvas.height = parent.height();
		
		battleGround.reset(canvas);
	    battleGround.clear().drawMapContent();
    
    };
    
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
	
	let help = undefined;
	let codeAux = "";
	let codeOrHelp = true;
	
	loadData("/static/js/example.js", function(data){
		help = data;
		codeMirrorEditor.setValue(help);
		
		if (codeId != null && codeId != undefined && codeId != ""){
			loadData('/loadCode/' + codeId, function(data){
		    	codeMirrorEditor.setValue(data);
			});
		}
	});

	let buttonCode = document.getElementById("code");
	buttonCode.addEventListener("click", function(e){
		if (!codeOrHelp) {
			codeMirrorEditor.setValue(codeAux);
		}
		codeOrHelp = true;
		buttonCode.classList.add('btn-success');
		buttonHelp.classList.remove('btn-success');
	});
	
	let buttonHelp = document.getElementById("help");
	buttonHelp.addEventListener("click", function(e){
		if (codeOrHelp) {
			codeAux = codeMirrorEditor.getValue();
		}
		codeMirrorEditor.setValue(help);
		codeOrHelp = false;
		buttonHelp.classList.add('btn-success');
		buttonCode.classList.remove('btn-success');
	});
	
	let robot = undefined;
	let fire = false, left = false, up = false, right = false, down = false;
	
	window.onkeyup = function(e) {
	   let key = e.keyCode ? e.keyCode : e.which;

	   if (robot != undefined && robot != null && battleGround != undefined && battleGround != null) {
		   switch(key){
			   case 32: fire = false; break; // space
			   case 37: left = false; break; // left
			   case 38: up = false; break; // up
			   case 39: right = false; break; // right
			   case 40: down = false; break; // down
		   }
	   }
	}
	
	window.onkeydown = function(e) {
	   let key = e.keyCode ? e.keyCode : e.which;
	   
	   if (robot != undefined && robot != null && battleGround != undefined && battleGround != null) {
		   switch(key){
			   case 32: fire = true; break; // space
			   case 37: left = true; break; // left
			   case 38: up = true; break; // up
			   case 39: right = true; break; // right
			   case 40: down = true; break; // down
		   }
	   }
	}
	
	document.getElementById("test").addEventListener("click", function(e){
		
		loadData("/static/json/10x10_simple.json", function(data){
			playPause = false;
			battleGround.reset(canvas);
			data = JSON.parse(data);
			battleGround = new BattleGround(canvas, data.cellDim.rows, data.cellDim.cols);
			battleGround.fillContent(data, function(){
				robot = new Robot(
						{"id": 0, "name": "admin", "creatorId": 0, "creatorName": "admin" }, 
						"/static/img/robot/robot (10).png", 
						"", 
						battleGround
				);
				robot.hp = 1000000;
				battleGround.addRobot(robot);
				battleGround.addRobot(new Robot(
						{"id": 1, "name": "user", "creatorId": 1, "creatorName": "user" }, 
						"/static/img/robot/robot (3).png", 
						codeMirrorEditor.getValue(), 
						battleGround
				));
			    battleGround.clear().drawMapContent();
			    battleGround.play = false;
			    lastRender = 0;
			    playPause = true;
				window.requestAnimationFrame(loop);
			});
		});
		
	});
	
	let playPause = true;
	
	// The game loop
	function loop(timestamp) {
		let progress = (timestamp - lastRender)
		
		// Calls each robot to move
		battleGround.robots.forEach(function(value, key){
			value.makeMove(battleGround);
		});
		
	    if (robot != undefined && robot != null && battleGround != undefined && battleGround != null) {
	 	    if (fire) {
	 	    	robot.fireBullet(battleGround);
	 	    	fire = false;
	 	    }
	 	    if (left) robot.moveToLeft(battleGround);
		    if (up) robot.moveToUp(battleGround);
		    if (right) robot.moveToRight(battleGround);
		    if (down) robot.moveToDown(battleGround);
	    }
		
		// Redraw map
		battleGround.clear().drawMapContent();
		
		if (battleGround.robots.size == 1) {
			playPause = false;
		}
		
		// Checking if keep playing
		if (playPause) {
			lastRender = timestamp
			window.requestAnimationFrame(loop);
		}
	}
	let lastRender = 0;

	document.getElementById("upload").addEventListener("click", function(e){
		e.preventDefault();
		if (document.getElementById("codeFileName").value == ""){
			notifier.warning("Name is required");
		}
		else{
			let title = $("#codeFileName").val();
			let error = hasJavascript(title);
			if (error == null) {
				$.post("/createCode", {
					"_csrf" : csrf_data.token, 
					"code" : codeMirrorEditor.getValue(),
					"codeFileName": title},
					function(data){notifier.success(data)});
			}
			else {
				notifier.error(error);
			}
		}
	});
	
	$("#fileButton").change(function() {
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