'use strict';

/**
 * This is the class Robot, which defines all functionalities and moves that a robot performs.
 */
class Robot {
	/*
	 * info: id and name for the robot and its creator.
	 * path: the path for its image
	 * code: its logic for the functionality
	 * battleGround: contains all battle data which helps the robot to move through
	 */
	constructor(info, path, code, battleGround){
		this.info = info;

		this.path = path;
		// Loading image
		imageLoader.loadImage("robot_" + this.info.id, this.path);
		
		// Parameters definition
		// These dimensions depend on a cell dimension in battleGround. (Half sized)
		this.width = 0.5;
		this.height = 0.5;
		// Its movements scale depends on a relation between a cell dimension and the whole map
		this.proportionX = battleGround.cell.width / battleGround.table.width / 5;
		this.proportionY = battleGround.cell.height / battleGround.table.height / 5;
		// 1 degree per turn when changing direction
		this.rotationScale = 1;
		// Starts at 0 degrees (direction to north)
		this.rotation = 0;
		
		// Finds an empty position in map to situate the robot
		let newPosition = battleGround.findEmptyCell();
		
		this.x = newPosition.x;
		this.y = newPosition.y;
		
		// The corners for the robot and other measures that helps on their calculations
		this.topRightCorner = undefined;
		this.downRightCorner = undefined;
		this.downLeftCorner = undefined;
		this.topLeftCorner = undefined;
		this.diagonal = battleGround.cell.diagonal / 4;
		
		// If it is true, the "camera" follows this robot when moving
		this.follow = false;
		
		// Calculating some parameters before defined
		this.calculateCorners(battleGround);
		
		// Array containing shot bullets by the robot
		this.bullets = [];
		
		// Counter which by each 100 moves increments 1 bullet for the robot
		this.moveCounter = 0;
		// Robot stats
		this.atk = 10;
		this.hp = 100;
		this.def = 1;
		this.numBullets = 5;
		
		// Info about enemy robots that are situated close to the robot
		this.closeRobots = [];
		// Defines what sort of ground this robot is on. (Different ground, different stats)
		this.block = battleGround.BLOCKS.NOTHING;
		
		// An abstraction for this robot that restricts the code written by other designers not corrupt this class
		this.abstraction = new RobotAbstraction(code);
	}
	
	// Function that returns an image, if the robot dies it is an explosion image
	get image(){
		if (this.hp > 0) {
			return imageLoader.image("robot_" + this.info.id);
		}
		else {
			return imageLoader.image("explosion");
		}
	}
	
	// The robot shoots a bullet
	fireBullet(){
		if (this.numBullets > 0) {
			this.bullets.push(new Bullet(this));
			this.numBullets--;
		}
	}
	
	// When playing, this function will notify its progress bar its info
	notify() {
		let childNodes = $("#robot_"+ this.info.id)[0].childNodes;
		for (let i = 0; i < childNodes.length; ++i) {
			let element = childNodes[i];
			if (element.className == 'progress-bar progress-bar-success'){
				element.style.width = this.hp + "%";
				element.setAttribute("aria-valuenow", this.hp);
			}
			if (element.className == 'progress-type'){
				element.innerHTML = ((this.follow) ? "*" : "") + this.info.name + "/" + this.info.creatorName.toUpperCase();
			}
			if (element.className == 'progress-completed'){
				element.innerHTML = Math.ceil(this.hp) + "% " + this.numBullets;
			}
		}
	}
	
	// Function that redefines the hp when getting hit by bullets
	gotHit(bullet, a, b){
		// Check if this robot has gotten a hit
		let hit = bullet.owner != this.info.id && intersect(this.topRightCorner, this.downRightCorner, this.downLeftCorner, this.topLeftCorner, a, b);
		if (hit) {
			this.hp -= (bullet.atk - (this.def * this.block.def));
			this.hp = Math.max(0, this.hp);
			this.notify();
		}
		return hit;
	}
	
	// Performs a movement
	makeMove(battleGround){
		this.moveCounter++;
		// Checking counter
		if (this.moveCounter % 100 == 0) {
			this.numBullets++;
		}
		
		// Get the cell position of the robot in map
		let position = battleGround.getCellPosition(new Point(this.x, this.y));
		// Creates a 5x5 dimension map that contains the ground around the robot
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
		// This cells means a relation of distance for the robot to capt other robots, it depends on the number of robotss left
		let cells = Math.max(battleGround.rows, battleGround.cols);
		cells = cells / (battleGround.robots.size - 1);
		this.closeRobots = [];
		let self = this;
		// Checking if other robots are in this robot capt area
		battleGround.robots.forEach(function(value, key) {
			if (self.info.id != value.info.id) {
				dist = battleGround.toRealPosition(new Point(self.x, self.y)).distanceTo(battleGround.toRealPosition(new Point(value.x, value.y)));
				if (dist < (cells * 5 * battleGround.cell.width	)){
					self.closeRobots.push({
						name : value.info.name,
						position : battleGround.toRealPosition(new Point(value.x, value.y)),
						distance : dist
					});
				}
			}
		});
		// Sorting all robots by distance
		this.closeRobots.sort(function(a, b) { return (a.distance > b.distance); });
		
		// Constructs the data for the abstraction
		let data = {
			name : this.info.name,
			creator: this.info.creatorName,
			atk : this.atk,
			hp : this.hp,
			def : this.def,
			bullets : this.numBullets,
			position : battleGround.toRealPosition(new Point(this.x, this.y)),
			rotation : (90 - this.rotation + 360) % 360,
			robots : this.closeRobots,
			mapData : mapData
		}
		
		// Execute the code through abstraction
		let command = this.abstraction.makeMove(data);
		if (command != "") {
			command = "this." + command + "(battleGround);";
			eval(command);
		}
		
		// Checking the ground the robot is on
		for (let block in battleGround.BLOCKS){
			if (battleGround.BLOCKS[block].id == battleGround.checkPosition(new Point(this.x, this.y))){
				this.block = battleGround.BLOCKS[block];
			}
		}
		
		this.notify();
	}
	
	// Calculating the corners of the robot
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
	
	// Sets if the robot has to be followed
	setFollow(follow){
		this.follow = follow;
		return this;
	}
	
	// Changing the rotation for the robot
	changeRotation(degrees, battleGround){
		this.rotation += degrees;
		this.rotation %= 360;
		if (this.rotation < 0){
			this.rotation = 359;
		}
		this.calculateCorners(battleGround);
	}
	
	// Moving forward or backward
	moveTo(x, y, battleGround){
		this.x += x;
		this.y += y;
		
		this.calculateCorners(battleGround);
		
		// Checks
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
			let self = this;
			battleGround.robots.forEach(function(value, key){
				if (self.info.id != value.info.id && (intersect(value.topRightCorner, value.downRightCorner, value.downLeftCorner, value.topLeftCorner, self.topLeftCorner, self.topRightCorner)
					|| intersect(value.topRightCorner, value.downRightCorner, value.downLeftCorner, value.topLeftCorner, self.downLeftCorner, self.downRightCorner)
					|| intersect(value.topRightCorner, value.downRightCorner, value.downLeftCorner, value.topLeftCorner, self.topRightCorner, self.downRightCorner) 
					|| intersect(value.topRightCorner, value.downRightCorner, value.downLeftCorner, value.topLeftCorner, self.topLeftCorner, self.downLeftCorner))) {
					move = false;
				}
			});
		}
		
		if (!move){
			this.x -= x;
			this.y -= y;
		}
	}
	
	// Left movement
	moveToLeft(battleGround){
		this.changeRotation(-this.rotationScale, battleGround);
	}
	
	// Up movement
	moveToUp(battleGround){
		this.moveTo(
			this.proportionX * Math.sin(toRadians(this.rotation)) * this.block.speed,
			-this.proportionY * Math.cos(toRadians(this.rotation)) * this.block.speed,
			battleGround);
	}
	
	// Right movement
	moveToRight(battleGround){
		this.changeRotation(this.rotationScale, battleGround);
	}
	
	// Down movement
	moveToDown(battleGround){
		this.moveTo(
			-this.proportionX * Math.sin(toRadians(this.rotation)) * this.block.speed,
			this.proportionY * Math.cos(toRadians(this.rotation)) * this.block.speed,
			battleGround);
	}
}

// A class for the bullet
class Bullet {
	constructor(robot) {
		// The robot starts at the robot location
		this.x = robot.x;
		this.y = robot.y;
		this.owner = robot.info.id;
		// These dimensions depend on a cell dimension in battleGround. (10%)
		this.width = 0.1;
		this.height = 0.1;
		this.rotation = robot.rotation;
		// Its movements speed is the robot's one x 2
		this.proportionX = robot.proportionX * 2;
		this.proportionY = robot.proportionY * 2;
		// States of the bullet
		this.STATES = Object.freeze({
			"MOVING": 1,
			"EXPLODE": 2,
			"DELETE": 3
			});
		this.state = this.STATES.MOVING;
		
		this.atk = robot.atk * robot.block.atk;
	}
	
	// Returns an image depending on the state of the bullet
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
	
	// Moves forward
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
				let self = this;
				battleGround.robots.forEach(function(value, key){
	    			if (value.gotHit(self, new Point(self.x, self.y), p)) {
	    				self.state = self.STATES.EXPLODE;
	    			}
				});
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

// The abstraction class for the robot
class RobotAbstraction {
	constructor(code) {
		this.code = code;
		this.command = "";
		// Any history of the battle the designer wants to keep
		this.dataMap = new Map();
		this.error = false;
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
		if (!this.error) {
			try {
				eval(this.code);
			}
			catch(err) {
				notifier.error("" + data.name + "/" + data.creator + ": I have issues with my code, check log");
				console.log("" + data.name + "/" + data.creator + ": " + err.message);
				this.error = true;
				return "";
			}
		}
		return this.command;
	}
}