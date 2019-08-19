let birds = [];
let pipes = [];

let generation;

const POPULATION = 100;

const PERCENT = 0.1;

const BIRD_START = 64;
const BIRD_MAX_VELOCITY = 16;

const PIPE_SPACE = 256;
const PIPE_START = 384;
const PIPE_MIN_HEIGHT = 96;
const PIPE_MAX_HEIGHT = 192;
const PIPE_MIN_WIDTH = 16;
const PIPE_MAX_WIDTH = 64;
const PIPE_MIN_SPEED = 2.5;
const PIPE_MAX_SPEED = 10;
const PIPE_PADDING = 32;

let SPEED = 1;

let pipeCount = 1;
let count = 1;

function setup() {
	createCanvas(640, 480);
	init();
}

function draw() {
	background(0);
	rectangle();
	noStroke();

	fill(0, 255, 0);
	textSize(16);
	textAlign(LEFT);
	text('Speed: ' + SPEED, 16, 32);
	text('Population: ' + POPULATION, 16, 64);
	text('Generation: ' + count, 16, 96);

	let birdCount = 0;
	birds.forEach((bird) => {
		if (birdCount < POPULATION * PERCENT) {
			bird.show();
			birdCount++;
		}
	});
	pipes.forEach((pipe) => {
		pipe.show();
	});

	for (let i = 0; i < SPEED; i++) {
		update();
	}
}

function update() {
	birds.forEach((bird) => {
		let nextPipe = bird.nextPipe(pipes);

		let inputs = [
			map(bird.y, bird.r, height - bird.r, 0, 1),
			(nextPipe.top - bird.y) / height,
			(nextPipe.bottom - bird.y) / height,
			(nextPipe.x - bird.x) / width,
			nextPipe.slalomEneble ? 1 : 0,
			map(nextPipe.w, PIPE_MIN_WIDTH, PIPE_MAX_WIDTH, 0, 1),
			map(nextPipe.gateHeight, PIPE_MIN_HEIGHT, PIPE_MAX_HEIGHT, 0, 1),
			map(nextPipe.speed, PIPE_MIN_SPEED, PIPE_MAX_SPEED, 0, 1)
		];

		let results = bird.brain.predict(inputs);

		if (results[0] > results[1]) {
			bird.up();
		}

		bird.update();
		if (bird.collision(pipes)) {
			let index = birds.indexOf(bird);
			birds.splice(index, 1);

			if (birds.length == 0) {
				reset();
			}
		}
	});

	pipes.forEach((pipe) => {
		pipe.update();
	});

	if (pipes[pipes.length - 1].x <= width - PIPE_SPACE) {
		pipes.push(new Pipe(width, pipeCount++));
		pipes.shift();
	}
}

function keyPressed() {
	switch (keyCode) {
		case UP_ARROW:
			SPEED = 1;
			break;
		case LEFT_ARROW:
			SPEED -= 1;
			SPEED = constrain(SPEED, 0, 100);
			break;
		case RIGHT_ARROW:
			SPEED += 1;
			SPEED = constrain(SPEED, 0, 100);
			break;
		case DOWN_ARROW:
			SPEED += 10;
			SPEED = constrain(SPEED, 0, 100);
			break;

		default:
			break;
	}
}

function init() {
	let config = {
		population: POPULATION,
		input: 8,
		hidden: 16,
		output: 2,
		mutationRate: 0.01
	};

	generation = new Generation(config);
	birds = [];
	for (let i = 0; i < POPULATION; i++) {
		birds.push(new Bird(generation.networks[i]));
	}

	pipes = [];
	for (let i = 0; i < 3; i++) {
		pipes.push(new Pipe(PIPE_START + (i + 1) * PIPE_SPACE, pipeCount++));
	}
}

function reset() {
	let config = {
		generation: generation
	};
	generation = new Generation(config);
	count++;
	pipeCount = 1;
	birds = [];
	for (let i = 0; i < POPULATION; i++) {
		birds.push(new Bird(generation.networks[i]));
	}

	pipes = [];
	for (let i = 0; i < 3; i++) {
		pipes.push(new Pipe(PIPE_START + (i + 1) * PIPE_SPACE, pipeCount++));
	}
}

function rectangle() {
	stroke(255);
	fill(255, 255, 255, 0);
	rect(0, 0, width, height);
}
