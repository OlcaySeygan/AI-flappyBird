class NeuralNetwork {
	constructor(input, hidden, output) {
		this.i2h = [];
		this.h2o = [];
		this.iUnits = [];
		this.hUnits = [];
		this.oUnits = [];
		this.b2h = [];
		this.b2o = [];

		this.fitness = 0;

		for (let i = 0; i < input; i++) {
			this.i2h[i] = [];
			for (let j = 0; j < hidden; j++) {
				this.i2h[i][j] = Random.next(-1, 1);
			}
		}

		for (let i = 0; i < hidden; i++) {
			this.h2o[i] = [];
			for (let j = 0; j < output; j++) {
				this.h2o[i][j] = Random.next(-1, 1);
			}
		}

		for (let i = 0; i < input; i++) {
			this.iUnits[i] = 0;
		}
		for (let i = 0; i < hidden; i++) {
			this.hUnits[i] = 0;
			this.b2h[i] = Random.next(-1, 1);
		}
		for (let i = 0; i < output; i++) {
			this.oUnits[i] = 0;
			this.b2o[i] = Random.next(-1, 1);
		}
	}

	predict(inputs) {
		for (let i = 0; i < this.iUnits.length; i++) {
			this.iUnits[i] = inputs[i];
		}
		for (let i = 0; i < this.hUnits.length; i++) {
			let state = 0;
			for (let j = 0; j < this.iUnits.length; j++) {
				state += this.i2h[j][i] * this.iUnits[j] * this.b2h[i];
			}
			this.hUnits[i] = state > 0 ? state : 0;
		}

		let sum = 0;
		for (let i = 0; i < this.oUnits.length; i++) {
			let state = 0;
			for (let j = 0; j < this.hUnits.length; j++) {
				state += this.h2o[j][i] * this.hUnits[j] * this.b2o[i];
			}
			this.oUnits[i] = state > 0 ? state : 0;
			sum += this.oUnits[i];
		}

		for (let i = 0; i < this.oUnits.length; i++) {
			this.oUnits[i] = (this.oUnits[i] / sum) | 0;
		}

		return this.oUnits;
	}

	mutate(mutationRate) {
		for (let i = 0; i < this.iUnits.length; i++) {
			for (let j = 0; j < this.hUnits.length; j++) {
				let rand = Random.next(0, 1);
				if (rand < mutationRate) {
					this.i2h[i][j] += Random.gaussian() * 0.5;
				}
			}
		}

		for (let i = 0; i < this.hUnits.length; i++) {
			for (let j = 0; j < this.oUnits.length; j++) {
				let rand = Random.next(0, 1);
				if (rand < mutationRate) {
					this.h2o[i][j] += Random.gaussian() * 0.5;
				}
			}
		}

		for (let i = 0; i < this.hUnits.length; i++) {
			let rand = Random.next(0, 1);
			if (rand < mutationRate) {
				this.b2h[i] += Random.gaussian() * 0.5;
			}
		}
		for (let i = 0; i < this.oUnits.length; i++) {
			let rand = Random.next(0, 1);
			if (rand < mutationRate) {
				this.b2o[i] += Random.gaussian() * 0.5;
			}
		}
	}

	crosover(other) {
		let child = this.clone();

		for (let i = 0; i < this.iUnits.length; i++) {
			for (let j = 0; j < this.hUnits.length; j++) {
				let rand = Random.next(0, 1);
				if (rand < 0.5) {
					child.i2h[i][j] = other.i2h[i][j];
				}
			}
		}

		for (let i = 0; i < this.hUnits.length; i++) {
			for (let j = 0; j < this.oUnits.length; j++) {
				let rand = Random.next(0, 1);
				if (rand < 0.5) {
					child.h2o[i][j] = other.h2o[i][j];
				}
			}
		}

		for (let i = 0; i < this.hUnits.length; i++) {
			let rand = Random.next(0, 1);
			if (rand < 0.5) {
				child.b2h[i] = other.b2h[i];
			}
		}
		for (let i = 0; i < this.oUnits.length; i++) {
			let rand = Random.next(0, 1);
			if (rand < 0.5) {
				child.b2o[i] = other.b2o[i];
			}
		}

		return child;
	}
	clone() {
		return Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
	}
}

class Generation {
	constructor(config) {
		if (config.generation != null) {
			let generation = config.generation;

			this.population = generation.population;
			let sum = 0;
			for (let i = 0; i < this.population; i++) {
				generation.networks[i].fitness *= generation.networks[i].fitness;
				sum += generation.networks[i].fitness;
			}

			for (let i = 0; i < this.population; i++) {
				generation.networks[i].fitness = generation.networks[i].fitness / sum;
			}
			this.networks = [];
			for (let i = 0; i < this.population; i++) {
				let network = generation.networks[i].crosover(this.chooseOne(generation));
				network.mutate(this.mutationRate);
				network.fitness = 0;
				this.networks[i] = network;
			}
			this.mutationRate = generation.mutationRate;
			return;
		}

		this.population = config.population;
		this.mutationRate = config.mutationRate | 0.1;

		this.networks = [];
		for (let i = 0; i < this.population; i++) {
			this.networks[i] = new NeuralNetwork(config.input, config.hidden, config.output);
		}
	}

	chooseOne(generation) {
		let r = Random.next(0, 1);
		let index = 0;
		for (let i = 0; i < generation.population; i++) {
			r -= generation.networks[i].fitness;
			if (r < 0) {
				index = i;
				break;
			}
		}

		return generation.networks[index];
	}
}

class Random {
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
