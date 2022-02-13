let flock = [];
let cellSize = 100;
let walls = [];

function setup() {
	createCanvas(displayWidth, displayHeight);
	for(let x = 0; x < width / cellSize; x++) {
		flock.push([]);
		for(let y = 0; y < height / cellSize; y++) {
			flock[x].push([]);
		}
	}
	for(let i = 0; i < 50; i++) {
		let boid = new Boid(i);
		flock[Math.floor(boid.position.x / cellSize)][Math.floor(boid.position.y / cellSize)].push(boid)
	}
}

function draw() {
	background(100, 100, 255);
	for(let x = 0; x < width / cellSize; x++) {
		for(let y = 0; y < height / cellSize; y++) {
			for(let i = 0; i < flock[x][y].length; i++) {
				flock[x][y][i].update();
			}
		}
	}
}