class Pipe {
	constructor(x, count, img) {
		this.x = x;
		this.w = Random.next(PIPE_MIN_WIDTH, PIPE_MAX_WIDTH);
		this.gateHeight = Random.next(PIPE_MIN_HEIGHT, PIPE_MAX_HEIGHT);
		this.gateY = Random.next(PIPE_PADDING, height - PIPE_PADDING - this.gateHeight);
		this.gateTarget = Random.next(PIPE_PADDING, height - PIPE_PADDING - this.gateHeight);

		this.top = this.gateY;
		this.bottom = this.gateY + this.gateHeight;

		this.speed = PIPE_MIN_SPEED;
		this.speedStep = 0.001;
		this.count = count;
		this.scored = false;
		this.slalomEnable = Random.next(0, 1) < 0.75;

		this.step = 0.01;

		this.img = img;
	}

	show() {
		imageMode(CORNER);
		image(this.img[1], this.x, 0, this.w, this.top);
		image(this.img[0], this.x, this.bottom, this.w, height - this.bottom);
	}

	update() {
		this.x -= this.speed;
		this.top = this.gateY;
		this.bottom = this.gateY + this.gateHeight;
		this.slalom();
		this.speed += this.speedStep;
		this.speed = constrain(this.speed, PIPE_MIN_SPEED, PIPE_MAX_SPEED);
	}

	slalom() {
		if (this.slalomEnable) {
			this.gateY = lerp(this.gateY, this.gateTarget, this.step);
			if (abs(this.gateY - this.gateTarget) <= 32) {
				this.gateTarget = Random.next(PIPE_PADDING, height - PIPE_PADDING - this.gateHeight);
			}
		}
	}
}
