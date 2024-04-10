/// <reference path="../Library/BasePreprocessor.ts" />

class PBPPreprocessor extends BasePreprocessor {
	public constructor(seed: number) {
		super();
		this.wildcards = {
			"times": this.timesHandler,
			"for": this.forHandler,
			"randomDigits": this.randomDigitsHandler,
			"num": this.randomDigitsHandler,
			"randomLetters": this.randomLettersHandler,
			"word": this.randomLettersHandler,
			"localIndex": this.localIndexHandler,
			"i": this.localIndexHandler,
			"globalIndex": this.globalIndexHandler,
			"n": this.globalIndexHandler
		};
		this.variables = {};
		this.random = new XSRandom(seed);
	}

	private timesHandler = (parameters: ParameterList) => {
		return this.handleTimes(parameters.nextInt(), parameters.nextInt(1));
	}

	private forHandler = (parameters: ParameterList) => {
		return this.handleFor(parameters.nextInt(), parameters.nextInt(), parameters.nextInt());
	}

	private randomDigitsHandler = (parameters: ParameterList) => {
		let result = "";
		for (let i = 0; i < parameters.nextInt(); ++i) {
			result += String.fromCharCode(48 + this.random.next() % 10);
		}
		return [ result ];
	}

	private randomLettersHandler = (parameters: ParameterList) => {
		let result = "";
		for (let i = 0; i < parameters.nextInt(); ++i) {
			result += String.fromCharCode(97 + this.random.next() % 25);
		}
		return [ result ];
	}

	private localIndexHandler = (parameters: ParameterList) => {
		return [ formatIndex(this.localIndex, parameters.nextInt(1)) ];
	}

	private globalIndexHandler = (parameters: ParameterList) => {
		return [ formatIndex(this.globalIndex, parameters.nextInt(1)) ];
	}
}