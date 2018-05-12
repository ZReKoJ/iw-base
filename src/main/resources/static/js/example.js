
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
		robots : List of enemies in a distance range.
		mapData : Matrix (5x5) which contains the map data around the robot.
	*/
	makeMove(data){
		eval(this.code);
	}
	
}