class Boid {
	constructor() {
		this.position = createVector(random(width), random(height));
		this.velocity = p5.Vector.random2D();
		this.velocity.setMag(2, 4);
		this.acceleration = createVector();
		this.maxForce = 0.2;
		this.maxSpeed = 4;
	}

	update() {
		this.flock();
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxSpeed);
		this.position.add(this.velocity);

		if(this.position.x > width) this.position.x = 0;
		if(this.position.x < 0) this.position.x = width;
		if(this.position.y > height) this.position.y = 0;
		if(this.position.y < 0) this.position.y = height;
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
		
		let alignment = createVector();
		let cohesion = createVector();
		let seperation = createVector();

		let sightRadius = 50;
		let neighbourCount = 0;
		for(let otherBoid of flock) {
			if(otherBoid !== this) {
				let distance = this.position.dist(otherBoid.position);
				if(distance <= sightRadius) {
					neighbourCount++;
					alignment.add(otherBoid.velocity);
					cohesion.add(otherBoid.position);	

					let difference = p5.Vector.sub(this.position, otherBoid.position);
					difference.div(distance * distance);
					seperation.add(difference);			
				}
			}
		}

		// Add walls to seperation vector
		walls.map((wall) => {
			let distance = this.position.dist(wall);
			if(distance <= sightRadius) {
				console.log('wall moment')
				neighbourCount++;
				let difference = p5.Vector.sub(this.position, wall);
				difference.div(distance * distance);
				seperation.add(difference);	
			}	
		});
		if(neighbourCount) {
			alignment.div(neighbourCount);
			cohesion.div(neighbourCount);
			cohesion.sub(this.position);
			seperation.div(neighbourCount);
			[alignment, cohesion, seperation].forEach((steeringForce, index) => {
				steeringForce.setMag(this.maxSpeed);
				steeringForce.sub(this.velocity);
				steeringForce.limit(this.maxForce);
			});
		}

		this.acceleration.add(alignment.mult(1.1));
		this.acceleration.add(cohesion);
		this.acceleration.add(seperation.mult(1.25));
	}

	alignment() {
		let sightRadius = 50;
		let steeringForce = createVector();
		let neighbourCount = 0;
		for(let otherBoid of flock) {
			if(otherBoid !== this) {
				let distance = dist(this.position.x, this.position.y, otherBoid.position.x, otherBoid.position.y);
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
		for(let otherBoid of flock) {
			if(otherBoid !== this) {
				let distance = dist(this.position.x, this.position.y, otherBoid.position.x, otherBoid.position.y);
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
		for(let otherBoid of flock) {
			if(otherBoid !== this) {

				let distance = dist(this.position.x, this.position.y, otherBoid.position.x, otherBoid.position.y);
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
}
