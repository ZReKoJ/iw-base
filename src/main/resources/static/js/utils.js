function isFullScreen(){
	if (document.fullscreenElement) return true;
    else if (document.webkitFullscreenElement) return true;
    else if (document.mozFullScreenElement) return true;
    else return false;
}

function fullscreen(content){
	if(content.webkitRequestFullScreen) 
		content.webkitRequestFullScreen();
	else content.mozRequestFullScreen();
}

function loadData(path, callback){
	let req = new XMLHttpRequest();
	req.onload = function () {
		callback(req.responseText);
	}
	req.open('GET', path, false);
	req.send(null);
}

class ImageLoader{
	constructor(){
		this.images = new Map();
		this.imagesLoaded = 0;
		this.loaded = true;

		let bulletPath = "/static/img/bullet/bullet (1).png";
		let explosionPath = "/static/img/animation/explosion/explosion (1).png";
		this.loadImage("bullet", bulletPath);
		this.loadImage("explosion", explosionPath);
	}
	
	loadImage(name, path, callback){
		if (!this.images.has(name)){
			let self = this;
			let img = document.createElement("img");
			img.onload = function(){
				self.imagesLoaded++;
				if (self.imagesLoaded == self.images.size){
					self.loaded = true;
					if (typeof callback === "function") { callback(); }
				}
			}
			img.src = path;
			this.images.set(name, img);
		}
	}
	
	image(name){
		return this.images.get(name);
	}
}

function toRadians (angle) {
  return angle * (Math.PI / 180);
}

function intersect(topRightCorner, downRightCorner, downLeftCorner, topLeftCorner, a, b){
	
	function side(p1, p2, p3, p4) {
		let d = new Point(p2.x - p1.x, p2.y - p1.y);
		let d1 = new Point(p3.x - p1.x, p3.y - p1.y);
		let d2 = new Point(p4.x - p2.x, p4.y - p2.y);
		return (d.x * d1.y - d.y * d1.x) * (d.x * d2.y - d.y * d2.x);
	}
	
	function between(x1, x2, x3){
		return ((x1 - x3) * (x2 - x3) <= 0);
	}
	
	function inside(p1, p2, p3, p4){
		return (between(p1.x, p2.x, p3.x) && between(p1.y, p2.y, p3.y))
				|| (between(p1.x, p2.x, p4.x) && between(p1.y, p2.y, p4.y));
	}
	
	function cross(p1, p2, p3, p4){
		let int1 = side(p1, p2, p3, p4);
		let int2 = side(p3, p4, p1, p2);
		return ((int1 < 0) && (int2 < 0))
			|| ((int1 == 0) && (int2 == 0) && inside(p1, p2, p3, p4));	
	} 
	
	return (cross(a, b, topLeftCorner, downLeftCorner) || cross(a, b, downLeftCorner, downRightCorner)
			|| cross(a, b, downRightCorner, topRightCorner) || cross(a, b, topRightCorner, topLeftCorner)
			|| inside(topLeftCorner, downRightCorner, a, b));
}

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

var imageLoader = new ImageLoader();