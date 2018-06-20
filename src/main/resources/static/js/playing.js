'use strict';

function playing(map, code, enemies) {
	
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");
	let parent = $(canvas).parent();
	
	// Making it square
	canvas.width = parent.width();
	canvas.height = parent.width();
	
	let battleGround = undefined;
	// Starts to load all battle info
	loadData('/loadMap/' + map.id, function(data){
		data = JSON.parse(data);
		battleGround = new BattleGround(canvas, data.cellDim.rows, data.cellDim.cols);
		battleGround.fillContent(data, function(){
			// Redirects a function below
			start(battleGround, new Array(code).concat(enemies));
		});
		
		// Listeners for canvas
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

		// Resizing when the windows has changed on size
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
	});

}

function start(battleGround, codes){
	// Starts to load all codes
	codes.forEach(function(element) {
		loadData('/loadCode/' + element.id, function(data){
			let robot = new Robot(element, "/static/img/robot/robot (" + Math.floor((Math.random() * 8) + 1) + ").png", data, battleGround);
			battleGround.addRobot(robot);
			// Create all progress bars
			let childNodes = $("#robot_"+ element.id);
			if (!(childNodes[0] != null && childNodes[0] != undefined)) {
				$("#rank")
					.append( "<div id=\"robot_" + robot.info.id + "\" class=\"progress\">"
						+ "<div class=\"progress-bar progress-bar-success\" role=\"progressbar\" style=\"width: " + robot.hp + "%;\" aria-valuenow=\"" + robot.hp + "\" aria-valuemin=\"0\" aria-valuemax=\"100\"></div>"
						+ "<span class=\"progress-type\">" + robot.info.name + "/" + robot.info.creatorName.toUpperCase() + "</span>"
						+ "<span class=\"progress-completed\">" + Math.ceil(robot.hp) + "% " + robot.numBullets + "</span>"				
						+ "</div>"
					);
				$("#robot_" + robot.info.id)[0].addEventListener("click", function(e){
					if (battleGround.followRobot == null || battleGround.followRobot != robot.info.id) {
						if (battleGround.followRobot != null && battleGround.robots.has("robot_" + battleGround.followRobot)){
							battleGround.robots.get("robot_" + battleGround.followRobot).setFollow(false);
						}
						battleGround.followRobot = robot.info.id;
						robot.setFollow(true);
					}
					else {
						battleGround.followRobot = null;
						robot.setFollow(false);
					}
				});
			}
		});
	});
	
	// Parameter to play or stop the game
	let playPause = true;
	
	// The game loop
	function loop(timestamp) {
		let progress = (timestamp - lastRender)
		
		// Calls each robot to move
		battleGround.robots.forEach(function(value, key){
			value.makeMove(battleGround);
		});
		
		// Redraw map
		battleGround.clear().drawMapContent();
		
		if (battleGround.robots.size == 1) {
			playPause = false;
			playPauseButton.classList.add("disabled");
		}
		
		// Checking if keep playing
		if (playPause) {
			lastRender = timestamp
			window.requestAnimationFrame(loop);
		}
	}
	let lastRender = 0;
	window.requestAnimationFrame(loop);

	// Listener for play pause
	let playPauseButton = document.getElementById("play-pause");
	playPauseButton.addEventListener("click", function(){
		if (playPause){
			playPause = false;
			playPauseButton.innerHTML = "Play";
		}
		else {
			playPause = true;
			playPauseButton.innerHTML = "Pause";
			lastRender = 0
			window.requestAnimationFrame(loop);
		}
	});
	
}