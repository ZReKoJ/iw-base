function createArray(length) {
    let arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        let args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

class Point {
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
	
	relativeLocation(oldRectangle, newRectangle){
		this.x = Math.floor(newRectangle.width * this.x / oldRectangle.width),
		this.y = Math.floor(newRectangle.height * this.y / oldRectangle.height)
	}
	
	distanceTo(point){
		let x = this.x - point.x;
		let y = this.y - point.y;
		return Math.sqrt(x * x + y * y);
	}
}

class Rectangle {
	constructor(width, height) {
		this.width = width;
		this.height = height;
	}
	
	get center() {
		return this.calculateCenter();
	}
	
	get area() {
		return this.calculateArea();
	}
	
	get diagonal() {
		return this.calculateDiagonal();
	}
	
	calculateCenter(){
		return new Point(Math.floor(this.width / 2), Math.floor(this.height / 2));
	}
	
	calculateArea(){
		return this.width * this.height;
	}
	
	calculateDiagonal(){
		return Math.sqrt(this.width * this.width + this.height * this.height);
	}
	
	distancesTo(point){
		return {
			left: point.x,
			right: this.width - point.x,
			top: point.y,
			down: this.height - point.y
		};
	}
	
	isMoreThan(rectangle){
		return this.width > rectangle.width && this.height > rectangle.height;
	}
	
	isLessThan(rectangle){
		return this.width < rectangle.width && this.height < rectangle.height;
	}
	
	isMoreEqual(rectangle){
		return this.width >= rectangle.width && this.height >= rectangle.height;
	}
	
	isLessEqual(rectangle){
		return this.width <= rectangle.width && this.height <= rectangle.height;
	}
	
}

class Square extends Rectangle {
	constructor(width, height){
		super(width, height);
		let min = Math.min(width, height);
		this.width = min;
		this.height = min;
	}
	
	zoomIn(value){
		this.width += value;
		this.height += value;
	}
	
	zoomOut(value){
		this.width -= value;
		this.height -= value;
	}
}