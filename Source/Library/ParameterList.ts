class ParameterList {
	private parameters: string[];
	private count: number;

	public constructor(parameters: string[]) {
		this.parameters = parameters.filter(Boolean);
		this.count = 0;
	}

	public nextString(fallback: string): string {
		if (this.parameters.length) {
			++this.count;
			return this.parameters.shift();
		}
		if (fallback === undefined) {
			throw `String parameter at ${this.count} is missing.`;
		}
		return fallback;
	}

	public nextFloat(fallback: number): number {
		if (this.parameters.length) {
			++this.count;
			const result = parseFloat(this.parameters.shift());
			if (isNaN(result)) {
				throw `Parameter at ${this.count} is not a number.`;
			}
			return result;
		}
		if (fallback === undefined) {
			throw `Number parameter at ${this.count} is missing.`;
		}
		return fallback;
	}

	public nextInt(fallback: number): number {
		if (this.parameters.length) {
			++this.count;
			const result = parseInt(this.parameters.shift());
			if (isNaN(result)) {
				throw `Parameter at ${this.count} is not an integer.`;
			}
			return result;
		}
		if (fallback === undefined) {
			throw `Integer parameter at ${this.count} is missing.`;
		}
		return fallback;
	}

	public nextBool(fallback: boolean): boolean {
		if (this.parameters.length) {
			++this.count;
			switch (this.parameters.shift()) {
				case "false":
				case "no":
				case "0":
					return false;
				case "true":
				case "yes":
				case "1":
					return true;
				default:
					throw `Parameter at ${this.count} is not a boolean.`;
			}
		}
		if (fallback === undefined) {
			throw `Boolean parameter at ${this.count} is missing.`;
		}
		return fallback;
	}

	public checkEmpty(name): void {
		if (this.parameters.length) {
			console.log(`Too many arguments for ${name} command.`);
		}
	}
}