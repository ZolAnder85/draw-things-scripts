/*
Use the same input format as for video generation.
Only seed and prompt gets used from the input.
Processes all the images with the current parameters.
*/

// Library and catalogue for presets:

class SimpleLibrary {
	constructor(name, map) {
		this.name = name;
		this.map = map;
	}

	get(key) {
		if (key in this.map) {
			return this.map[key];
		}
		throw `No such ${this.name} registered in library: ${key}`;
	}
}

const presetLibrary = new SimpleLibrary("preset", {
	dynamic: {
		steps: [
			{ seed: 0, strength: 0.2, load: false },
			{ seed: 0, strength: 0.35, load: false },
			{ seed: 0, strength: 0.45, load: true },
			{ seed: -1, strength: 0.2, load: false },
			{ seed: 0, strength: 0.35, load: false },
			{ seed: 0, strength: 0.45, load: true },
			{ seed: -1, strength: 0.2, load: false },
			{ seed: 0, strength: 0.35, load: false },
			{ seed: 0, strength: 0.45, load: true }
		],
		warmup: [ 1 ]
	},
	standard: {
		steps: [
			{ seed: 0, strength: 0.15, load: false },
			{ seed: 0, strength: 0.3, load: false },
			{ seed: 0, strength: 0.38, load: true },
			{ seed: -1, strength: 0.15, load: false },
			{ seed: 0, strength: 0.3, load: false },
			{ seed: 0, strength: 0.38, load: true },
			{ seed: -1, strength: 0.15, load: false },
			{ seed: 0, strength: 0.3, load: false },
			{ seed: 0, strength: 0.38, load: true },
			{ seed: -1, strength: 0.15, load: false },
			{ seed: 0, strength: 0.3, load: false },
			{ seed: 0, strength: 0.38, load: true },
			{ seed: -1, strength: 0.15, load: false },
			{ seed: 0, strength: 0.3, load: false },
			{ seed: 0, strength: 0.38, load: true }
		],
		warmup: [ 1 ]
	},
	slow: {
		steps: [
			{ seed: 0, strength: 0.1, load: false },
			{ seed: 0, strength: 0.25, load: true },
			{ seed: -1, strength: 0.1, load: false },
			{ seed: 0, strength: 0.25, load: false },
			{ seed: 0, strength: 0.33, load: true },
			{ seed: -1, strength: 0.1, load: false },
			{ seed: 0, strength: 0.25, load: false },
			{ seed: 0, strength: 0.33, load: false },
			{ seed: 0, strength: 0.38, load: true },
			{ seed: -1, strength: 0.1, load: false },
			{ seed: 0, strength: 0.25, load: false },
			{ seed: 0, strength: 0.33, load: false },
			{ seed: 0, strength: 0.38, load: true },
			{ seed: -1, strength: 0.1, load: false },
			{ seed: 0, strength: 0.25, load: false },
			{ seed: 0, strength: 0.33, load: false },
			{ seed: 0, strength: 0.38, load: true },
			{ seed: -1, strength: 0.1, load: false },
			{ seed: 0, strength: 0.25, load: false },
			{ seed: 0, strength: 0.33, load: false },
			{ seed: 0, strength: 0.38, load: true },
			{ seed: -1, strength: 0.1, load: false },
			{ seed: 0, strength: 0.25, load: false },
			{ seed: 0, strength: 0.33, load: false },
			{ seed: 0, strength: 0.38, load: true }
		],
		warmup: [ 1 ]
	},
	mixed: {
		steps: [
			{ seed: 0, strength: 0.15, load: false },
			{ seed: 0, strength: 0.25, load: true },
			{ seed: -1, strength: 0.2, load: false },
			{ seed: 0, strength: 0.38, load: true },
			{ seed: -1, strength: 0.2, load: false },
			{ seed: 0, strength: 0.38, load: true },
			{ seed: -1, strength: 0.2, load: false },
			{ seed: 0, strength: 0.38, load: true },
			{ seed: -1, strength: 0.2, load: false },
			{ seed: 0, strength: 0.38, load: true },
			{ seed: -1, strength: 0.2, load: false },
			{ seed: 0, strength: 0.38, load: true },
			{ seed: -1, strength: 0.2, load: false },
			{ seed: 0, strength: 0.38, load: true },
			{ seed: -1, strength: 0.2, load: false },
			{ seed: 0, strength: 0.38, load: true },
			{ seed: -1, strength: 0.2, load: false },
			{ seed: 0, strength: 0.38, load: true },
			{ seed: -1, strength: 0.2, load: false },
			{ seed: 0, strength: 0.38, load: true }
		],
		warmup: [ 1 ]
	},
	simple: {
		steps: [
			{ seed: 0, strength: 0.15, load: true, weight: 0.8, prompt: null },
			{ seed: -1, strength: 0.25, load: true, weight: 0.8, prompt: null },
			{ seed: -1, strength: 0.3, load: true, weight: 0.8, prompt: null },
			{ seed: -1, strength: 0.35, load: true, weight: 0.8, prompt: null },
			{ seed: -1, strength: 0.35, load: true, weight: 0.8, prompt: null },
			{ seed: -1, strength: 0.35, load: true, weight: 0.8, prompt: null },
			{ seed: -1, strength: 0.35, load: true, weight: 0.8, prompt: null },
			{ seed: -1, strength: 0.35, load: true, weight: 0.8, prompt: null }
		],
		warmup: [ 1 ]
	},
	strong: {
		steps: [
			{ seed: 0, strength: 0.5, load: true, weight: 0.2, prompt: null },
			{ seed: -1, strength: 0.95, load: true, weight: 0.2, prompt: null },
			{ seed: 0, strength: 0.95, load: true, weight: 0.3, prompt: null },
			{ seed: 0, strength: 0.95, load: true, weight: 0.3, prompt: null },
			{ seed: 0, strength: 0.95, load: true, weight: 0.5, prompt: null },
			{ seed: 0, strength: 0.95, load: true, weight: 0.5, prompt: null },
			{ seed: 0, strength: 0.95, load: true, weight: 0.8, prompt: null },
			{ seed: 0, strength: 0.95, load: true, weight: 0.8, prompt: null }
		],
		warmup: [ 1, 0.95 ]
	}
});

// Parameters of video generation:

let name = "DTVideo";
let keyframes = [];
let steps = [];

// Utility classes and functions:

class ParameterList {
	constructor(parameters) {
		this.parameters = parameters.filter(Boolean);
		this.count = 0;
	}

	nextString(fallback) {
		if (this.parameters.length) {
			++this.count;
			return this.parameters.shift();
		}
		if (fallback === undefined) {
			throw `String parameter at ${this.count} is missing.`;
		}
		return fallback;
	}

	nextFloat(fallback) {
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

	nextInt(fallback) {
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

	nextBool(fallback) {
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

	checkEmpty(name) {
		if (this.parameters.length) {
			console.log(`Too many arguments for ${name} command.`);
		}
	}
}

function nextSeed(seed) {
	seed = seed ^ (seed << 13);
	seed = seed ^ (seed >> 17);
	seed = seed ^ (seed << 5);
	return seed >>> 0;
}

function getPath(index) {
	if (index < 10) {
		return `${filesystem.pictures.path}/${name}/00${index}.png`;
	} else if (index < 100) {
		return `${filesystem.pictures.path}/${name}/0${index}.png`;
	} else {
		return `${filesystem.pictures.path}/${name}/${index}.png`;
	}
}

function combineSeed(keyframe, step) {
	return keyframe.seed + step.seed >>> 0;
}

function combinePrompt(keyframe, step) {
	if (step.weight) {
		return `${keyframe.prompt} (${step.prompt}:${step.weight})`;
	}
	return keyframe.prompt;
}

// Functions for handling commands:

function handleName(parameterList) {
	name = parameterList.nextString();
}

function handlePreset(parameterList) {
	const preset = presetLibrary.get(parameterList.nextString());
	steps = preset.steps;
	warmup = preset.warmup;
}

function handleStep(parameterList) {
	steps.push({
		seed: parameterList.nextInt(),
		strength: parameterList.nextFloat(),
		load: parameterList.nextBool(),
		weight: parameterList.nextFloat(0),
		prompt: parameterList.nextString(null)
	});
}

// Parsing and handling commands:

function handleCommand(line) {
	const parts = line.substring(1).trim().split(/[:\s]+/);
	const name = parts[0];
	const parameterList = new ParameterList(parts.slice(1));
	switch (name) {
		case "name":
			handleName(parameterList);
			break;
		case "preset":
			handlePreset(parameterList);
			break;
		case "step":
			handleStep(parameterList);
			break;
		case "warmup":
			console.log("Ignoring warmup command.");
			break;
		case "scale":
			console.log("Ignoring scale command.");
			break;
		default:
			throw `No such command: ${name}`;
	}
	parameterList.checkEmpty(name);
}

function handleLine(line) {
	if (line.startsWith("/")) {
		handleCommand(line);
	} else {
		const matches = line.match(/^(-?\d+)\s+(.+)/);
		if (matches) {
			keyframes.push({
				seed: parseInt(matches[0]),
				prompt: matches[1]
			});
		} else {
			keyframes.push({
				seed: -1,
				prompt: line
			});
		}
	}
}

function handleInput(lines) {
	for (const line of lines.split(/\n+/)) {
		try {
			handleLine(line);
		} catch (message) {
			console.log(`Error during executing line: ${line}`);
			console.log(`Error message: ${message}`);
		}
	}
}

// Preparing generation:

handleInput(pipeline.prompts.prompt.trim().replace(/\r\n|\r|\u2028/g, "\n"));

if (steps.length < 1) {
	const preset = presetLibrary.get("standard");
	steps = preset.steps;
	warmup = preset.warmup;
}

let wordSeed = pipeline.configuration.seed;

function randomWord() {
	let result = "";
	for (let i = 0; i < 3; ++i) {
		wordSeed = nextSeed(wordSeed);
		result += String.fromCharCode(97 + wordSeed % 25);
	}
	return result;
}

let stepSeed = pipeline.configuration.seed;

for (const step of steps) {
	// making sure that overriding random seed keeps other seeds
	stepSeed = nextSeed(stepSeed);
	if (step.seed < 0) {
		step.seed = stepSeed;
	}
	// making sure that overriding random word keeps other words
	let stepPrompt = randomWord();
	if (step.prompt == null) {
		step.prompt = stepPrompt;
	}
}

let keyframeSeed = pipeline.configuration.seed;

for (const keyframe of keyframes) {
	if (isNaN(keyframe.seed)) {
		keyframe.seed = keyframeSeed;
	} else if (keyframe.seed < 0) {
		keyframe.seed = keyframeSeed;
	}
	// making the first promt use the initial seed
	keyframeSeed = nextSeed(keyframeSeed);
}

// Executing generation:

const configuration = { ...pipeline.configuration };

function process(index, prompt) {
	canvas.loadImage(getPath(index));
	pipeline.run({ configuration, prompt });
	canvas.saveImage(getPath(index));
}

let keyframe = keyframes[0];
let index = 1;
configuration.seed = keyframe.seed;
process(index, keyframe.prompt);

for (let i = 1; i < keyframes.length; ++i) {
	const keyframe = keyframes[i];
	for (let k = 0; k < steps.length; ++k) {
		const step = steps[k];
		++index;
		configuration.seed = combineSeed(keyframe, step);
		process(index, combinePrompt(keyframe, step));
	}
}