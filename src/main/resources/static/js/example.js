
class Robot {
	constructor(code){
		this.code = code;
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
	data is an object which contains the following informations :
	
	*/
	makeMove(data){
		eval(this.code);
	}
	
}