function playing() {

	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");
	let parent = $(canvas).parent();
	
	canvas.width = parent.width();
	canvas.height = parent.width();
	
	let data = null;
	let req = new XMLHttpRequest();
	req.open('GET', 'http://localhost:8080/loadMap/1', false); 
	req.send(null);
	if (req.status == 200){
		data = req.responseText;
	}
	data = JSON.parse(data);
	
	let battleGround = new BattleGround(canvas, data.cellDim.rows, data.cellDim.cols);
	battleGround.fillContent(data, function(){
		start(battleGround);
	});

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
		
		if (isFullScreen()) {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}
		else {
			canvas.width = parent.width();
			canvas.height = parent.width();
		}
		
		battleGround.reset(canvas);
	    battleGround.clear().drawMapContent();
    
    };

	document.getElementById("fullscreen").addEventListener("click", function(){
		fullscreen(canvas);
	});

}

function start(battleGround){
	let code = null;
	let req = new XMLHttpRequest();
	req.open('GET', '/loadCode/1', false); 
	req.send(null);
	if (req.status == 200){
		code = req.responseText;
	}
	
	let robots = new Map();
	let robot = new Robot("Zihao", "/static/img/robot/robot (10).png", code, battleGround).setFollow(true);
	robot.numBullets = 1000000;
	robot.hp = 1000000;
	robots.set("Zihao", robot);
	robots.set("Cesar", new Robot("Cesar", "/static/img/robot/robot (3).png", code, battleGround));
	robots.set("Lorenzo", new Robot("Lorenzo", "/static/img/robot/robot (7).png", code, battleGround));
	//for (let i = 25; i < 35; i++)
	//	robots.set(i.toString(), new Robot(i, "/static/img/map/component (" + i + ").png", code, battleGround));
	
	for (let [k, v] of robots) {
		battleGround.addRobot(v);
	}
	
	let left = false, right = false, up = false, down = false, space = false, makeMove = false;
	
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
		case 77: robots.get("Zihao").makeMove(battleGround); break;
		default: 
			console.log(key);
			event.returnValue = true; 
			break;
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
	
	function loop(timestamp) {
		var progress = (timestamp - lastRender)
		
		for (let [key, value] of battleGround.robots) {
			if (key != "Zihao") value.makeMove(battleGround);
		}
		moving();
		
		battleGround.clear().drawMapContent();
		  
		lastRender = timestamp
		window.requestAnimationFrame(loop);
	}
	var lastRender = 0;
	window.requestAnimationFrame(loop);
	
}