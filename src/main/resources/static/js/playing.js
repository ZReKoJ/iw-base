'use strict';

function playing(map, code, enemies) {
	
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");
	let parent = $(canvas).parent();
	
	canvas.width = parent.width();
	canvas.height = parent.width();
	
	let battleGround = undefined;
	loadData('/loadMap/' + map.id, function(data){
		data = JSON.parse(data);
		battleGround = new BattleGround(canvas, data.cellDim.rows, data.cellDim.cols);
		battleGround.fillContent(data, function(){
			start(battleGround, new Array(code).concat(enemies));
		});
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

function start(battleGround, codes){
	
	let robot = undefined;
	
	codes.forEach(function(element) {
		loadData('/loadCode/' + element.id, function(data){
			robot = new Robot(element, "/static/img/robot/robot (" + Math.floor((Math.random() * 12) + 1) + ").png", data, battleGround);
			battleGround.addRobot(robot);
		});
	});
	
	function loop(timestamp) {
		var progress = (timestamp - lastRender)
		
		for (let [key, value] of battleGround.robots) {
			value.makeMove(battleGround);
		}
		
		battleGround.clear().drawMapContent();
		  
		lastRender = timestamp
		window.requestAnimationFrame(loop);
	}
	var lastRender = 0;
	window.requestAnimationFrame(loop);
	
}