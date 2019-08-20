class NeuralNetwork {
	constructor(config) {
		this.layers = [];
		for (let i = 0; i < config.units.length; i++) {
			this.layers[i] = [];
			for (let j = 0; j < config.units[i]; j++) {
				this.layers[i][j] = 0;
			}
		}

		this.weights = [];
		for (let i = 0; i < config.units.length - 1; i++) {
			this.weights[i] = [];
			for (let j = 0; j < config.units[i]; j++) {
				this.weights[i][j] = [];
				for (let z = 0; z < config.units[i + 1]; z++) {
					this.weights[i][j][z] = random.next(-1, 1);
				}
			}
		}

		this.biases = [];
		for (let i = 1; i < config.units.length; i++) {
			this.biases[i - 1] = [];
			for (let j = 0; j < config.units[i]; j++) {
				this.biases[i - 1][j] = random.next(-1, 1);
			}
		}

		this.fitness = 0;
	}

	predict(inputs) {
		for (let i = 0, ip = -1; i < this.layers.length; i++, ip++) {
			if (i == 0) {
				for (let j = 0; j < this.layers[i].length; j++) {
					this.layers[i][j] = inputs[j];
				}
				continue;
			}

			for (let j = 0; j < this.layers[i].length; j++) {
				let state = 0;
				for (let z = 0; z < this.layers[ip].length; z++) {
					state += this.weights[ip][z][j] * this.layers[ip][z];
				}
				state += this.biases[ip][j];
				this.layers[i][j] = activation.relu(state);
			}
		}
		this.layers[this.layers.length - 1] = activation.softmax(this.layers[this.layers.length - 1]);
		return this.layers[this.layers.length - 1];
	}

	mutate(rate) {
		for (let i = 0; i < this.weights.length; i++) {
			for (let j = 0; j < this.weights[i].length; j++) {
				for (let z = 0; z < this.weights[i][j].length; z++) {
					if (random.next(0, 1) < rate) {
						this.weights[i][j][z] += random.gaussian();
					}
				}
			}
		}

		for (let i = 0; i < this.biases.length; i++) {
			for (let j = 0; j < this.biases[i].length; j++) {
				if (random.next(0, 1) < rate) {
					this.biases[i][j] += random.gaussian();
				}
			}
		}
	}

	crossover(other, rate) {
		let child = this.clone();

		for (let i = 0; i < child.weights.length; i++) {
			for (let j = 0; j < child.weights[i].length; j++) {
				for (let z = 0; z < child.weights[i][j].length; z++) {
					if (random.next(0, 1) < rate) {
						child.weights[i][j][z] = other.weights[i][j][z];
					}
				}
			}
		}

		for (let i = 0; i < child.biases.length; i++) {
			for (let j = 0; j < child.biases[i].length; j++) {
				if (random.next(0, 1) < rate) {
					child.biases[i][j] = other.biases[i][j];
				}
			}
		}
		child.fitness = 0;
		return child;
	}

	clone() {
		return Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
	}
}

class Generation {
	constructor(config) {
		if (config.generation && config.generation instanceof Generation) {
			let generation = config.generation;

			this.population = generation.population;

			generation.networks.map((x) => (x.fitness = x.fitness * x.fitness));
			let sum = generation.networks.reduce((a, b) => a + b.fitness, 0);
			if (sum == 0) {
				generation.networks.map((x) => (x.fitness = 0));
			} else {
				generation.networks.map((x) => (x.fitness = x.fitness / sum));
			}

			this.networks = [];
			for (let i = 0; i < generation.population; i++) {
				let other = generation.chooseOne();
				let network = generation.networks[i].crossover(other, generation.crossoverRate);
				network.mutate(generation.mutationRate);
				this.networks[i] = network;
			}

			this.mutationRate = generation.mutationRate;
			this.crossoverRate = generation.crossoverRate;
			return;
		}
		this.population = config.population;
		this.networks = [];
		for (let i = 0; i < config.population; i++) {
			this.networks[i] = new NeuralNetwork(config.units);
		}

		this.mutationRate = config.mutationRate;
		this.crossoverRate = config.crossoverRate;
	}

	chooseOne() {
		let r = random.next(0, 1);
		let index = parseInt(random.next(0, this.population));
		for (let i = 0; i < this.population; i++) {
			r -= this.networks[i].fitness;
			if (r < 0) {
				index = i;
				break;
			}
		}

		return this.networks[index];
	}

	bestOne() {
		let index = 0;
		let high = -1;
		for (let i = 0; i < this.population; i++) {
			if (high < this.networks[i].fitness) {
				high = this.networks[i].fitness;
				index = i;
			}
		}

		return this.networks[index];
	}
}

class random {
	static next(min, max) {
		return Math.random() * (max - min) + min;
	}
	static gaussian(mu = 0, sigma = 1) {
		let v1, v2, rSquared;
		do {
			v1 = 2 * this.next(0, 1) - 1;
			v2 = 2 * this.next(0, 1) - 1;
			rSquared = v1 * v1 + v2 * v2;
		} while (rSquared >= 1 || rSquared == 0);

		let polar = Math.sqrt(-2 * Math.log(rSquared) / rSquared);
		return v1 * polar * sigma + mu;
	}
}

class activation {
	static relu(value) {
		return value > 0 ? value : 0;
	}

	static softmax(array) {
		let sum = array.reduce((a, b) => a + b);
		return sum == 0 ? array.map((x) => 0) : array.map((x) => x / sum);
	}
}
