class Robot {
	constructor(name, path, code, battleGround){
		this.name = name;
		
		let req = new XMLHttpRequest();
		req.open('GET', '/getName/'+this.name, false);
		req.send(null);
		this.driver = req.responseText;
		
		this.path = path;
		imageLoader.loadImage("robot_" + this.name, this.path)
		this.width = 0.5;
		this.height = 0.5;
		this.proportionX = battleGround.cell.width / battleGround.table.width / 5;
		this.proportionY = battleGround.cell.height / battleGround.table.height / 5;
		this.rotationScale = 1;
		this.rotation = 0;
		
		let newPosition = battleGround.findEmptyCell();
		this.x = newPosition.x;
		this.y = newPosition.y;
		
		this.topRightCorner = undefined;
		this.downRightCorner = undefined;
		this.downLeftCorner = undefined;
		this.topLeftCorner = undefined;
		this.diagonal = battleGround.cell.diagonal / 4;
		this.follow = false;
		this.calculateCorners(battleGround);
		this.bullets = [];
		
		this.moveCounter = 0;
		this.atk = 10;
		this.hp = 100;
		this.def = 1;
		this.numBullets = 5;
		
		$( "#rank" ).append( "<li class=\"list-group-item\" id=\""+this.name+"\">"
				+this.driver.toUpperCase()
				+"  HP: "
				+this.hp
				+"  Bullets: "
				+this.numBullets
				+"</li>" 
				);
		this.closeRobots = [];
		this.block = battleGround.BLOCKS.NOTHING;
		
		this.abstraction = new RobotAbstraction(code);
	}
	
	get image(){
		if (this.hp > 0) {
			return imageLoader.image("robot_" + this.name);
		}
		else {
			return imageLoader.image("explosion");
		}
	}
	
	fireBullet(){
		if (this.numBullets > 0) {
			this.bullets.push(new Bullet(this));
			this.numBullets--;
			$( "#"+ this.name).replaceWith( "<li class=\"list-group-item\" id=\""+this.name+"\">"
					+this.driver.toUpperCase()
					+" -  HP: "
					+this.hp
					+" -  Bullets: "
					+this.numBullets
					+"</li>" );
		}
	}
	
	gotHit(bullet, a, b){
		let hit = bullet.owner != this.name && intersect(this.topRightCorner, this.downRightCorner, this.downLeftCorner, this.topLeftCorner, a, b);
		if (hit) {
			this.hp -= (bullet.atk - (this.def * this.block.def));
			if(this.hp<0){
				this.hp = 0;
			}
			$( "#"+ this.name).replaceWith( "<li class=\"list-group-item\" id=\""+this.name+"\">"
					+this.driver.toUpperCase()
					+" -  HP: "
					+this.hp
					+" -  Bullets: "
					+this.numBullets
					+"</li>" );
		}
		return hit;
	}
	
	makeMove(battleGround){
		this.moveCounter++;
		if (this.moveCounter % 10 == 0) {
			this.numBullets++;
		}
		
		let position = battleGround.getCellPosition(new Point(this.x, this.y));
		position = new Point(position.x - 2, position.y - 2);
		let mapContent = battleGround.mapContent;
		let mapData = {
			dimension : new Point(battleGround.cols, battleGround.rows),
			cellDimension : battleGround.cell,
			mapDimension : battleGround.table,
			area : createArray(5, 5)
		}
		for (let i = 0; i < 5; ++i){
			for (let j = 0; j < 5; ++j){
				if (0 <= position.y + i && position.y + i < battleGround.rows
					&& 0 <= position.x + j && position.x + j < battleGround.cols){
					mapData.area[i][j] = mapContent[position.y + i][position.x + j].index;
				}
				else mapData.area[i][j] = battleGround.BLOCKS.NOTHING;
			}
		}
		position = new Point(position.x + 2, position.y + 2);
		
		let dist = undefined;
		let cells = Math.max(battleGround.rows, battleGround.cols);
		cells = cells / (battleGround.robots.size - 1);
		this.closeRobots = [];
		for (let [key, value] of battleGround.robots) {
			if (this.name != value.name) {
				dist = battleGround.toRealPosition(new Point(this.x, this.y)).distanceTo(battleGround.toRealPosition(new Point(value.x, value.y)));
				if (dist < (cells * 5 * battleGround.cell.width	)){
					this.closeRobots.push({
						name : value.name,
						position : battleGround.toRealPosition(new Point(value.x, value.y)),
						distance : dist
					});
				}
			}
		}
		this.closeRobots.sort(function(a, b) { return (a.distance > b.distance); });
		
		let data = {
			name : this.name,
			atk : this.atk,
			hp : this.hp,
			def : this.def,
			bullets : this.numBullets,
			position : battleGround.toRealPosition(new Point(this.x, this.y)),
			rotation : (90 - this.rotation + 360) % 360,
			robots : this.closeRobots,
			mapData : mapData
		}
		
		let command = this.abstraction.makeMove(data);
		if (command != "") {
			command = "this." + command + "(battleGround);";
			eval(command);
		}
		
		for (let block in battleGround.BLOCKS){
			if (battleGround.BLOCKS[block].id == battleGround.checkPosition(new Point(this.x, this.y))){
				this.block = battleGround.BLOCKS[block];
			}
		}
		
		if (this.follow){
			battleGround.mapCenter.x = Math.floor(battleGround.table.width * this.x);
			battleGround.mapCenter.y = Math.floor(battleGround.table.height * this.y);
			battleGround.defineMapFeature();
		}
	}
	
	calculateCorners(battleGround){
		this.diagonal = battleGround.cell.diagonal / 4;
		this.topRightCorner = new Point(
				this.diagonal / battleGround.table.width * Math.cos(toRadians(this.rotation + 315)) + this.x,
				this.diagonal / battleGround.table.height * Math.sin(toRadians(this.rotation + 315)) + this.y);
		this.downRightCorner = new Point(
				this.diagonal / battleGround.table.width * Math.cos(toRadians(this.rotation + 45)) + this.x,
				this.diagonal / battleGround.table.height * Math.sin(toRadians(this.rotation + 45)) + this.y);
		this.downLeftCorner = new Point(
				this.diagonal / battleGround.table.width * Math.cos(toRadians(this.rotation + 135)) + this.x,
				this.diagonal / battleGround.table.height * Math.sin(toRadians(this.rotation + 135)) + this.y);
		this.topLeftCorner = new Point(
				this.diagonal / battleGround.table.width * Math.cos(toRadians(this.rotation + 225)) + this.x,
				this.diagonal / battleGround.table.height * Math.sin(toRadians(this.rotation + 225)) + this.y);
	}
	
	setFollow(follow){
		this.follow = follow;
		return this;
	}
	
	changeRotation(degrees, battleGround){
		this.rotation += degrees;
		this.rotation %= 360;
		if (this.rotation < 0){
			this.rotation = 359;
		}
		this.calculateCorners(battleGround);
	}
	
	moveTo(x, y, battleGround){
		this.x += x;
		this.y += y;
		
		this.calculateCorners(battleGround);
		
		let movementsAvailable = {
			topRight : battleGround.canIMoveOn(battleGround.checkPosition(this.topRightCorner)),
			downRight : battleGround.canIMoveOn(battleGround.checkPosition(this.downRightCorner)),
			downLeft : battleGround.canIMoveOn(battleGround.checkPosition(this.downLeftCorner)),
			topLeft : battleGround.canIMoveOn(battleGround.checkPosition(this.topLeftCorner))
		}
		
		if (!movementsAvailable.topRight || !movementsAvailable.downLeft){
			this.moveToLeft(battleGround);
		}
		else if (!movementsAvailable.downRight || !movementsAvailable.topLeft){
			this.moveToRight(battleGround);
		}
		
		let move = true;
		
		if (!(movementsAvailable.topRight &&
			movementsAvailable.downRight &&
			movementsAvailable.downLeft &&
			movementsAvailable.topLeft)){
			move = false;
		}
		else {
			for (let [key, value] of battleGround.robots) {
				if (this.name != value.name && (intersect(value.topRightCorner, value.downRightCorner, value.downLeftCorner, value.topLeftCorner, this.topLeftCorner, this.topRightCorner)
					|| intersect(value.topRightCorner, value.downRightCorner, value.downLeftCorner, value.topLeftCorner, this.downLeftCorner, this.downRightCorner)
					|| intersect(value.topRightCorner, value.downRightCorner, value.downLeftCorner, value.topLeftCorner, this.topRightCorner, this.downRightCorner) 
					|| intersect(value.topRightCorner, value.downRightCorner, value.downLeftCorner, value.topLeftCorner, this.topLeftCorner, this.downLeftCorner))) {
					move = false;
				}
			}
		}
		
		if (!move){
			this.x -= x;
			this.y -= y;
		}
	}
	
	moveToLeft(battleGround){
		this.changeRotation(-this.rotationScale, battleGround);
	}
	
	moveToUp(battleGround){
		this.moveTo(
			this.proportionX * Math.sin(toRadians(this.rotation)) * this.block.speed,
			-this.proportionY * Math.cos(toRadians(this.rotation)) * this.block.speed,
			battleGround);
	}
	
	moveToRight(battleGround){
		this.changeRotation(this.rotationScale, battleGround);
	}
	
	moveToDown(battleGround){
		this.moveTo(
			-this.proportionX * Math.sin(toRadians(this.rotation)) * this.block.speed,
			this.proportionY * Math.cos(toRadians(this.rotation)) * this.block.speed,
			battleGround);
	}
}

class Bullet {
	constructor(robot) {
		this.x = robot.x;
		this.y = robot.y;
		this.owner = robot.name;
		this.width = 0.1;
		this.height = 0.1;
		this.rotation = robot.rotation;
		this.proportionX = robot.proportionX * 2;
		this.proportionY = robot.proportionY * 2;
		this.STATES = Object.freeze({
			"MOVING": 1,
			"EXPLODE": 2,
			"DELETE": 3
			});
		this.state = this.STATES.MOVING;
		
		this.atk = robot.atk * robot.block.atk;
	}
	
	get image(){
		switch (this.state){
		case this.STATES.MOVING:
			return imageLoader.image("bullet");
			break;
		case this.STATES.EXPLODE:
			this.width = 0.5;
			this.height = 0.5;
			return imageLoader.image("explosion");
			break;
		case this.STATES.DELETE:
			this.width = 1;
			this.height = 1;
			return imageLoader.image("explosion");
			break;
		default: break;
		}
	}
	
	next(battleGround){
		switch (this.state){
		case this.STATES.MOVING:
			let p = new Point(this.x, this.y);
			this.x += this.proportionX * Math.sin(toRadians(this.rotation));
			this.y -= this.proportionY * Math.cos(toRadians(this.rotation));
			if (battleGround.canIShotBulletOn(battleGround.checkPosition(new Point(this.x, this.y)))){
				this.state = this.STATES.EXPLODE;
				this.x -= this.proportionX * Math.sin(toRadians(this.rotation));
				this.y += this.proportionY * Math.cos(toRadians(this.rotation));
			}
			else {
	    		for (let [key, value] of battleGround.robots) {
	    			if (value.gotHit(this, new Point(this.x, this.y), p)) {
	    				this.state = this.STATES.EXPLODE;
	    			}
	    		}
			}
			break;
		case this.STATES.EXPLODE:
			this.state = this.STATES.DELETE;
			break;
		case this.STATES.DELETE:
			break;
		default: break;
		}
	}
}

class RobotAbstraction {
	constructor(code) {
		this.code = code;
		this.command = "";
		this.dataMap = new Map();
	}
	
	fire(){
		this.command = "fireBullet";
	}
	
	left(){
		this.command = "moveToLeft"
	}
	
	up(){
		this.command = "moveToUp";
	}
	
	right(){
		this.command = "moveToRight";
	}
	
	down(){
		this.command = "moveToDown";
	}
	
	makeMove(data){
		this.command = "";
		eval(this.code);
		return this.command;
	}
}