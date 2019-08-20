let birds = [];
let pipes = [];

let generation;

const POPULATION = 100;

const PERCENT = 1;

const BIRD_START = 64;
const BIRD_MAX_VELOCITY = 16;

const PIPE_SPACE = 256;
const PIPE_START = 384;
const PIPE_MIN_HEIGHT = 96;
const PIPE_MAX_HEIGHT = 192;
const PIPE_MIN_WIDTH = 64;
const PIPE_MAX_WIDTH = 96;
const PIPE_MIN_SPEED = 2.5;
const PIPE_MAX_SPEED = 10;
const PIPE_PADDING = 32;

let SPEED = 1;

let pipeCount = 1;
let count = 1;

var score = 0;
var highscore = 0;

let sprites = [];
let backgroundImg;
let pipeImg = [];

let birdConfig = { units: [ 8, 16, 2 ] };

function preload() {
	sprites[0] = loadImage('assets/yellowbird-upflap.png');
	sprites[1] = loadImage('assets/yellowbird-midflap.png');
	sprites[2] = loadImage('assets/yellowbird-downflap.png');
	backgroundImg = loadImage('assets/background-day.png');
	pipeImg[0] = loadImage('assets/pipe-green.png');
	pipeImg[1] = loadImage('assets/pipe-green-down.png');
}

function setup() {
	createCanvas(640, 480);
	init();
}

function draw() {
	background(0);
	for (let i = 0; i < 4; i++) {
		let imgRatio = backgroundImg.width / backgroundImg.height;
		imageMode(CORNER);
		image(backgroundImg, -(frameCount % backgroundImg.width) + i * backgroundImg.width, 0, width, height);
	}
	noStroke();

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

	fill(0);
	textSize(16);
	textAlign(LEFT);
	text('Speed: ' + SPEED, 16, 32);
	text('Population: ' + birds.length + ' of ' + POPULATION, 16, 64);
	text('Generation: ' + count, 16, 96);

	textAlign(CENTER);
	textSize(64);
	text(score, width / 2, 64);
	textSize(32);
	text(highscore, width / 2, 96);

	for (let i = 0; i < SPEED; i++) {
		update();
	}
	//SPEED = 0;
}

function update() {
	birds.forEach((bird) => {
		let nextPipe = bird.nextPipe(pipes);

		let inputs = [
			map(bird.y, bird.r, height - bird.r, 0, 1),
			(nextPipe.top - bird.y) / height,
			(nextPipe.bottom - bird.y) / height,
			(nextPipe.x + nextPipe.w - bird.x) / width,
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
		pipes.push(new Pipe(width, pipeCount++, pipeImg));
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
			SPEED = constrain(SPEED, 0, 1000);
			break;
		case RIGHT_ARROW:
			SPEED += 1;
			SPEED = constrain(SPEED, 0, 1000);
			break;
		case DOWN_ARROW:
			SPEED += 100;
			SPEED = constrain(SPEED, 0, 1000);
			break;
		case 32:
			reset();
			break;

		default:
			break;
	}
}

function init() {
	let config = {
		population: POPULATION,
		mutationRate: 0.01,
		crossoverRate: 0.5,
		units: birdConfig
	};

	generation = new Generation(config);
	birds = [];

	for (let i = 0; i < POPULATION; i++) {
		birds.push(new Bird(generation.networks[i], sprites));
	}

	pipes = [];
	for (let i = 0; i < 3; i++) {
		pipes.push(new Pipe(PIPE_START + (i + 1) * PIPE_SPACE, pipeCount++, pipeImg));
	}
}

function reset() {
	score = 0;
	let config = {
		generation: generation
	};
	generation = new Generation(config);

	count++;
	pipeCount = 1;
	birds = [];
	for (let i = 0; i < POPULATION; i++) {
		birds.push(new Bird(generation.networks[i], sprites));
	}

	pipes = [];
	for (let i = 0; i < 3; i++) {
		pipes.push(new Pipe(PIPE_START + (i + 1) * PIPE_SPACE, pipeCount++, pipeImg));
	}
}

function rectangle() {
	stroke(255);
	fill(255, 255, 255, 0);
	rect(0, 0, width, height);
}
