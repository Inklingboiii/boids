let flock = [];
let walls = [];


function setup() {
	createCanvas(displayWidth, displayHeight);
	walls = [
		createVector(0, 0),
		createVector(width, 0),
		createVector(0, height),
		createVector(width, height)
	];
	for(let i = 0; i < 3; i++) {
		flock.push(new Boid());
	}

}

function draw() {
	background(0);
	flock.map((boid) => {
		boid.update();
		boid.show();
	
	});
}