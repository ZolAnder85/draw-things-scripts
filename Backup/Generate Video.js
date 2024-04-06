// @api-1.0

/*
Special thanks to:
DT Author: @liuliu
DT API Author: @Gooster

Generate Video
autor: @ZolAnder
version: beta 0.6.3

License:

This JavaScript code is licensed under Creative Commons Attribution 4.0 International License.
You are free to:
- Share: Copy and redistribute the material in any medium or format.
- Adapt: Remix, transform, and build upon the material for any purpose, even commercially.
Under the following terms:
- Attribution: You must give appropriate credit, provide a link to the license, and indicate if changes were made.
- You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
See the full license details here:
https://creativecommons.org/licenses/by/4.0/

Cheat sheet:

```
/name: name – subfolder in Pictures for saving images
/preset: (dynamic|standard|slow|mixed|simple|strong)
/step: seed strength load [weight=0] [prompt=null]
/warmup: strength
/scale: scale [x=0] [y=0]
[seed=random] this is the prompt for the first keyframe
[seed=random] this is the prompt for the second keyframe
```

Example:

```
/name: TestVideo
/scale: 63 0 0
Cat
Dog
```

Notes:

The subfolder has to be added manually before running this script.
You can use one of these Terminal commands to combine the images into a video:

```
# universally compatible encoding
-c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p output-universal.mp4
# almost lossless encoding
-c:v libx265 -preset fast -crf 0 -pix_fmt yuv444p -tag:v hvc1 output-lossless.mp4
# simple combination
ffmpeg -framerate 5 -pattern_type glob -i "*.png" \
	-colorspace smpte170m -color_primaries smpte170m -color_trc smpte170m \
	-c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p output-universal.mp4
# blended combination
ffmpeg -framerate 1 -pattern_type glob -i "*.png" \
	-filter:v framerate=2,fps=3,framerate=30 \
	-colorspace smpte170m -color_primaries smpte170m -color_trc smpte170m \
	-c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p output-universal.mp4
# enhanced combination
ffmpeg -framerate 1 -pattern_type glob -i "*.png" \
	-filter:v eq=gamma=1,unsharp=13:13:0.05:13:13:0.05,unsharp=3:3:0.2:3:3:0.2,framerate=2,fps=3,framerate=30 \
	-colorspace smpte170m -color_primaries smpte170m -color_trc smpte170m \
	-c:v libx265 -preset fast -crf 0 -pix_fmt yuv444p -tag:v hvc1 output-lossless.mp4
# for interpolated sequences
ffmpeg -framerate 10 -pattern_type glob -i "*.png" \
	-filter:v eq=gamma=1,unsharp=13:13:0.05:13:13:0.05,unsharp=3:3:0.2:3:3:0.2,framerate=5,framerate=30
	-colorspace smpte170m -color_primaries smpte170m -color_trc smpte170m \
	-c:v libx265 -preset fast -crf 0 -pix_fmt yuv444p -tag:v hvc1 output-lossless.mp4
```

You can use these tools to do motion interpolation:
https://replicate.com/pollinations/rife-video-interpolation
https://nmkd.itch.io/flowframes
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
let warmup = [ 1 ];
let scale = 1;
let x = 0;
let y = 0;

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

function handleWarmup(parameterList) {
	warmup.push(parameterList.nextFloat());
}

function handleScale(parameterList) {
	scale = parameterList.nextInt() / 60;
	x = parameterList.nextInt(0);
	y = parameterList.nextInt(0);
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
			handleWarmup(parameterList);
			break;
		case "scale":
			handleScale(parameterList);
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

const width = configuration.width;
const height = configuration.height;

function loadAndScale(index, scale, x, y) {
	canvas.clear();
	canvas.loadImage(getPath(index));
	x = (width / 2 - x) - (width / 2 - x) / scale;
	y = (height / 2 - y) - (height / 2 - y) / scale;
	canvas.canvasZoom = scale;
	canvas.moveCanvas(x, y);
}

function run(prompt) {
	pipeline.run({ configuration, prompt });
}

function save(index) {
	const path = getPath(index);
	canvas.saveImage(path, true);
}

let keyframe = keyframes[0];
let index = 1;
configuration.seed = keyframe.seed;
for (const strength of warmup) {
	configuration.strength = strength;
	if (canvas.boundingBox.width == 0) {
		run(keyframe.prompt);
	}
	save(index);
}

let loadIndex = index;
let loadScale = scale;

for (let i = 1; i < keyframes.length; ++i) {
	const keyframe = keyframes[i];
	for (let k = 0; k < steps.length; ++k) {
		const step = steps[k];
		if (loadIndex < index) {
			loadAndScale(loadIndex, loadScale, x, y);
			loadScale += scale - 1;
		} else if (scale > 1) {
			loadAndScale(index, scale, x, y);
		}
		++index;
		keyframe.seed = combineSeed(keyframe, step);
		configuration.seed = keyframe.seed;
		configuration.strength = step.strength;
		run(combinePrompt(keyframe, step));
		save(index);
		if (step.load) {
			loadIndex = index;
			loadScale = scale;
		}
	}
}