class Robot {
	constructor(code){
		// Enables the posibility of writing a new code for the robot while execution
		this.code = code;
		// Storage for data
		this.dataMap = new Map();
	}
	
	// The robot fires a bullet
	fire(){}
	
	// The robot turns left
	left(){}
	
	// The robot moves up
	up(){}
	
	// The robot turns right
	right(){}
	
	// The robot moves down
	down(){}
	
	/*
	@Param data is an object which contains the following informations :
		name : The name for the robot.
		atk : The current attack power the robot has.
		hp : The current life the robot has.
		def : The current defense the robot has.
		bullets : The number of bullets the robot has left.
		position : Current position the robot is at.
		rotation : Rotation of the robot.
		robots : List of enemies in a distance range.
		mapData : {
			dimension : Rows and columns for the map.
			cellDimension : The dimension for one single cell.
			mapDimension : The dimension for the whole map.
			area : Matrix (5x5) which contains the map data around the robot.
		}
	*/
	makeMove(data){
		eval(this.code);
	}
	// For further information about data write in console "console.log(data)" and see its properties.
	
}


// The code below can only aim the direction for bullet but cannot move through labyrinths.
function toDegrees(radians){
	return radians * (180 / Math.PI);
}

if (data.robots.length > 0){
	let robot = data.robots[0];
	let width = robot.position.x - data.position.x;
	let height = data.position.y - robot.position.y;
	let radian = Math.acos(width / robot.distance);
	let degree = Math.trunc(toDegrees(radian));
	if (height < 0) {
		degree = 360 - degree;
	}
	if (data.rotation != degree){
		let left = degree - data.rotation;
		let right = data.rotation - degree;
		(data.rotation < degree) ? right += 360 : left += 360;
		if (left < right) this.left();
		else this.right();
	}
	else {
		if (robot.distance < 2.5 * data.mapData.cellDimension.width){
			this.fire();
		}
		else {
			this.up();
		}
	}
}
else {
	let rand = Math.random();
	if (0 <= rand && rand < 0.6) this.up();
	else if (0.6 <= rand && rand < 0.75) this.left();
	else if (0.75 <= rand && rand < 0.9) this.right();
	else if (0.9 <= rand && rand < 0.95) this.down();
	else if (0.95 <= rand && rand < 1) this.fire();
}