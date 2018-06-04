/*
Basic guide on how to program your robot with examples:

The 5 basic actions your robot can take are:

	- fire:		the robot fires a bullet in a straight line
	- up:		the robot moves forward
	- down:		the robot moves backwards
	- right:	the robot rotates clockwise
	- left:		the robot rotates counterclockwise  

Now if you want your robot to perform any of this actions you can write:
	this.<actionName>();
For example, if you want your robot to fire you may write:
	this.fire();
	
Here is a basic example code for a robot. A robot that will perform one of the 5 actions randomly:

	let rand = Math.random();
	if (0 <= rand && rand < 0.6) this.up();
	else if (0.6 <= rand && rand < 0.75) this.left();
	else if (0.75 <= rand && rand < 0.9) this.right();
	else if (0.9 <= rand && rand < 0.95) this.down();
	else if (0.95 <= rand && rand < 1) this.fire();

But as you probably have guessed, a robot this smart will not survive for too long in the battlefield.
If you want your robot to chase his enemies through labyrinths, manage his bullets wisely and use his
surroundings to his benefit to be the last survivor and claim the glory of victory, you will need use
the information provided in "data" to tune your robot's decision making.

"data" is an object which contains the following information:

Info of the robot itself:
	- name : The name of the robot.
	- hp : The current hit points the robot has.
	- bullets : The number of bullets the robot has left (automatically increases over time).
	- position : Current position of the robot in the map (position.x and position.y).
	- rotation : Direction in which the robot is pointing (in degrees).
	- atk : The current attack power the robot has.*
	- def : The current defense the robot has.*
*The last two will vary depending on the type of terrain the robot is in.

Info of the robot's surroundings:
	- robots : List of the enemy robots that are near you within a certain range, ordered from closest to farthest.
			   Each robot of this list has the following information:
			   	- name : The name of the robot.
			   	- position : Current position of the robot in the map (position.x and position.y).
			   	- distance : Distance between you and this robot.
	- mapData : 
	  {
		dimension : Number of columns(dimension.x) and rows(dimension.y) the map has.
		cellDimension : A Square with the size of one single cell of the map.
		mapDimension : A Rectangle with the size of the whole map.
		area : Matrix (5x5) which contains the data of the cells around the robot (the robot is in area[2][2]).
			   The value of each position depends on the type of terrain on that cell:
				   	1: Platform
				   	2: Ground	
				   	3: Grass
				   	4: Bridge
				   	5: Magma
				   	6: Water
				  >=7: Barrier
	  }
	  
Now, for example, if you want to know how many bullets your robot has left, you can write:
	data.bullets;
	
Use this information to take smart decisions and be the last robot standing.
Hunt your closest enemies, search for advantageous terrain, hide in the corner of the map... possibilities are endless!

Here is another basic example code for a robot. This robot will chase the closest enemy, get close to him and fire:

	function toDegrees(radians){
		return radians * (180 / Math.PI);
	}
	
	if (data.robots.length > 0){
		//First we locate the closest enemy robot
		let robot = data.robots[0];
		let width = robot.position.x - data.position.x;
		let height = data.position.y - robot.position.y;
		let radian = Math.acos(width / robot.distance);
		let degree = Math.trunc(toDegrees(radian));
		if (height < 0) {
			degree = 360 - degree;
		}
		
		if (data.rotation != degree){
			//Then we rotate to aim
			let left = degree - data.rotation;
			let right = data.rotation - degree;
			(data.rotation < degree) ? right += 360 : left += 360;
			if (left < right) this.left();
			else this.right();
		}
		else {
			//Now we are aiming directly into the enemy robot
			if (robot.distance < 2.5 * data.mapData.cellDimension.width){
				//If we are close we fire
				this.fire();
			}
			else {
				//If we are not close enough, then we get closer
				this.up();
			}
		}
	}

Now maybe you are thinking: "But this example code doesn't takes into account the fact that there might be a wall in between the robot and his enemy..."
You are right! ;)

Good luck and have fun!
 */



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