class Pipe {
	constructor(x, count) {
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
	}

	show() {
		noStroke();
		fill(255);
		rect(this.x, 0, this.w, this.top);
		rect(this.x, this.bottom, this.w, height - this.bottom);
		fill(255);
		textSize(16);
		textAlign(LEFT);
		text(this.count, this.x, this.bottom - 12);
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
			if (abs(this.gateY - this.gateTarget) <= 4) {
				this.gateTarget = Random.next(PIPE_PADDING, height - PIPE_PADDING - this.gateHeight);
			}
		}
	}
}
