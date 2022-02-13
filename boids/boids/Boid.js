class Boid {
	constructor(id) {
		this.position = createVector(random(width), random(height));
		this.velocity = p5.Vector.random2D();
		this.velocity.setMag(3, 4);
		this.acceleration = createVector();
		this.maxForce = 0.2;
		this.maxSpeed = 5;
		this.id = id;
	}

	update() {
		this.flock();
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxSpeed);
		this.position.add(this.velocity);;


		if(this.position.x > width) this.position.x = 0;
		if(this.position.x < 0) this.position.x = width;
		if(this.position.y > height) this.position.y = 0;
		if(this.position.y < 0) this.position.y = height;
		
		this.moveBoidInFLockArray()

		this.show();
	}

	show() {
		strokeWeight(1);
		stroke(255);
		push();
		translate(this.position.x, this.position.y);
		rotate(atan2(this.velocity.y, this.velocity.x));
		// Offset cus triangles are weird
		rotate(-90 * (PI / 180));
		triangle(0, 0, -3, -10, 3, -10);
		pop();
	}

	flock() {
		this.acceleration.set(0, 0);
		this.acceleration.add(this.seperation().mult(1.5));
		this.acceleration.add(this.alignment());
		this.acceleration.add(this.cohesion().mult(0.75));
		
	}

	alignment() {
		let sightRadius = 50;
		let steeringForce = createVector();
		let neighbourCount = 0;
		let neighbours = [];
		let x = Math.floor(this.position.x / cellSize);
		let y = Math.floor(this.position.y / cellSize);
		for(let neighbourX = x - 1; neighbourX <= x + 1; neighbourX++) {
			for(let neighbourY = y - 1; neighbourY <= y + 1; neighbourY++) {
				if(neighbourX >= 0 && neighbourX < flock.length && neighbourY >= 0 && neighbourY < flock[0].length) { // Avoid out of bound errors
					neighbours = neighbours.concat(flock[neighbourX][neighbourY]);
				}
			}
		}
		for(let otherBoid of neighbours) {
			if(otherBoid !== this) {
				let distance = this.position.dist(otherBoid.position);
				if(distance <= sightRadius) {
					neighbourCount++;
					steeringForce.add(otherBoid.velocity);				
				}
			}
		}
		if(neighbourCount) {
			steeringForce.div(neighbourCount);
			steeringForce.setMag(this.maxSpeed);
			steeringForce.sub(this.velocity);
			steeringForce.limit(this.maxForce);
		}
		return steeringForce;
	}

	cohesion() {
		let sightRadius = 50;
		let steeringForce = createVector();
		let neighbourCount = 0;
		let neighbours = [];
		let x = Math.floor(this.position.x / cellSize);
		let y = Math.floor(this.position.y / cellSize);
		for(let neighbourX = x - 1; neighbourX <= x + 1; neighbourX++) {
			for(let neighbourY = y - 1; neighbourY <= y + 1; neighbourY++) {
				if(neighbourX >= 0 && neighbourX < flock.length && neighbourY >= 0 && neighbourY < flock[0].length) { // Avoid out of bound errors
					neighbours = neighbours.concat(flock[neighbourX][neighbourY]);
				}
			}
		}
		for(let otherBoid of neighbours) {
			if(otherBoid !== this) {
				let distance = this.position.dist(otherBoid.position);
				if(distance <= sightRadius) {
					neighbourCount++;
					steeringForce.add(otherBoid.position);				
				}
			}
		}
		if(neighbourCount) {
			steeringForce.div(neighbourCount);
			steeringForce.sub(this.position);
			steeringForce.setMag(this.maxSpeed);
			steeringForce.sub(this.velocity);
			steeringForce.limit(this.maxForce);
		}
		return steeringForce;
	}

	seperation() {
		let sightRadius = 50;
		let steeringForce = createVector();
		let neighbourCounter = 0;
		let neighbours = [];
		let x = Math.floor(this.position.x / cellSize);
		let y = Math.floor(this.position.y / cellSize);
		for(let neighbourX = x - 1; neighbourX <= x + 1; neighbourX++) {
			for(let neighbourY = y - 1; neighbourY <= y + 1; neighbourY++) {
				if(neighbourX >= 0 && neighbourX < flock.length && neighbourY >= 0 && neighbourY < flock[0].length) { // Avoid out of bound errors
					neighbours = neighbours.concat(flock[neighbourX][neighbourY]);
				}
			}
		}
		let walls = [
			{
				position: createVector(width, this.position.y) // Right
			},
			{
				position: createVector(0, this.position.y) // Left
			},
			{
				position: createVector(this.position.x, height) // Up
			},
			{
				position: createVector(this.position.x, 0) // Down
			}
		]
		for(let otherBoid of walls.concat(neighbours)) {
			if(otherBoid !== this) {

				let distance = this.position.dist(otherBoid.position);
				if(distance <= sightRadius) {
					neighbourCounter++;
					let difference = p5.Vector.sub(this.position, otherBoid.position);
					difference.div(distance * distance);
					steeringForce.add(difference);
				}
			}
		}
		if(neighbourCounter) {
			steeringForce.div(neighbourCounter);
			steeringForce.setMag(this.maxSpeed);
			steeringForce.sub(this.velocity);
			steeringForce.limit(this.maxForce);
		}
		return steeringForce;
	}

	moveBoidInFLockArray() {
		// Remove priorBoidPosition
		let priorFlockPosition = createVector(floor((this.position.x - this.velocity.x) / cellSize), floor((this.position.y - this.velocity.y) / cellSize));
		let flockPosition = createVector(floor(this.position.x / cellSize), floor(this.position.y / cellSize));
		if(!priorFlockPosition.equals(flockPosition)) {
			let priorFlockArray = flock[priorFlockPosition.x][priorFlockPosition.y];
			flock[priorFlockPosition.x][priorFlockPosition.y] = priorFlockArray.filter((boid) => boid.id !== this.id);
			flock[flockPosition.x][flockPosition.y].push(this);
		} 
	}
}



