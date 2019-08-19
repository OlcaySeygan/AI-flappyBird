class Bird {
	constructor(brain, sprites) {
		this.y = height / 2;
		this.x = BIRD_START;
		this.r = 13;

		this.gravity = 0.3;
		this.lift = -5;
		this.velocity = 0;

		this.brain = brain;

		this.isInPipe = false;
		this.inPipe;

		this.sprites = sprites;
	}

	show() {
		imageMode(CENTER);
		image(this.sprites[frameCount % 3], this.x, this.y, this.r * 2, this.r * 2);
	}

	update() {
		this.y += this.velocity;
		this.velocity += this.gravity;

		this.y = constrain(this.y, 0 + this.r, height - this.r);
		this.velocity = constrain(this.velocity, -BIRD_MAX_VELOCITY, BIRD_MAX_VELOCITY);
	}

	collision(pipes) {
		let state = false;
		pipes.forEach((pipe) => {
			if (this.x + this.r >= pipe.x && this.x - this.r <= pipe.x + pipe.w) {
				if (!pipe.scored) {
					pipe.scored = true;
					score++;
					if (highscore < score) highscore = score;
				}

				if (this.y - this.r <= pipe.top || this.y + this.r >= pipe.bottom) {
					state = true;
				} else {
					this.inPipe = pipe;
				}
				if (!this.isInPipe) {
					this.brain.fitness += 1;
					this.isInPipe = true;
				}
			} else if (this.isInPipe) {
				if (this.inPipe === pipe) this.isInPipe = false;
			}
		});
		if (this.y >= height - this.r || this.y <= this.r) {
			state = true;
		}
		return state;
	}

	nextPipe(pipes) {
		let useablePipes = [];
		pipes.forEach((pipe) => {
			if (pipe.x + pipe.w > this.x) {
				useablePipes.push(pipe);
			}
		});
		return useablePipes.shift();
	}

	up() {
		this.velocity = 0;
		this.velocity += this.lift;
	}
}
