// @api-1.0

/*
Special thanks to:
DT Author: @liuliu
DT API Author: @Gooster

Parse Batch Prompt
autor: @ZolAnder
version: release candidate 0.9.12

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

Manual:

Look for cheat sheet further below.
Look for model register further below.

This script divides the positive prompt into blocks separated by at least two line-breaks.
These blocks are preprocessed for unrolling wildcards and other preprocessor commands.
The resulted blocks are executed in sequence, each of them correcponding to one generation.
They can contain commands for customizing configuration or execute other functions.

Example input:

```
cat and dog
- deformed
// generates "cat and dog" with negative "deformed"

/model: Reliberate
// sets model to Reliberate
// does not generate because no prompt was given

/generate
// generate is called directly
// falls back to previous prompts because no prompts were given

/empty
/model: DreamShaper
// sets model to DreamShaper
// runs generation because prompt was given with empty

/repeat
/model: Reliberate
// sets model to Reliberate
// uses previous prompts because repeat was called

- deformed
/generate
// new negative prompt is used
// positive prompt falls back to previous

{kitten|cat} and {puppy+dog} friends
// runs two generations
// "kitten and puppy friends" or "cat and puppy friends" randomly
// "kitten and dog friends" or "cat and dog friends" randomly

{kitten+cat} and {puppy+dog} friends
// generates all four possibilities

/sampler: {DDIM+PLMS+UniPC}
big tree with {apples+oranges}
// works with commands too

forest
- people
/size: 256 320
// generates "forest" with negative "people" at size 256 x 320

/model: Reliberate
/steps: 15
/generate
// generates "forest" with negative "people" at size 256 x 320 with Reliberate and 15 steps

dinosaur
// generates "dinosaur" with negative "people" at size 256 x 320 with Reliberate and 15 steps

- purple
/repeat
dog
boxing
// generates "dinosaur ↵ dog ↵ boxing" with negative "purple ↵ people" and same configuration

/reset
big monkey
// generates "big monkey" with initial negative and configuration
```

Detailed explanation:

The preprocessor looks for pairs of braces inside blocks.
Braces have to come in pairs and can not be nested.
Some preprocessor commands emit multiple instances of the current block.
Parsing commands is started when all preprocessor commands got unrolled.

Command lines starting with `/` can be used to change configuration or execute API functions.
Comment lines starting with `//` are printed on the console when the block is executed.
Negative lines starting with `-` set or concatenate the negative prompt of the block.
All other lines set or concatenate the positive prompt of the block.

Blocks with positive prompt automatically gerenate at their ends.
The `generate` command can be used to execute generation in other cases.
The latest positive prompt is used for generation if the block has no positive prompt.
The latest negative prompt is used for generation if the block has no negative prompt.
Not having a prompt is not the same as having an empty prompt, that is why the `empty` command works.
Executing `generate` also clears the block, so no consecutive generation happens until new prompt is given.
Positive prompt is initialized with empty string, negative prompt from the user interface.

Preprocessor commands or wildcards can have these forms:
```
{cat|dog|bird}
{cat+dog+bird}
{10}
{5:20:5}
{@command: param1 param2}
```

Preprocessor commands are encouraged to be in `{@command: param1 param2}` format.
But tokanizing is simply done by splitting at groups of colon or space characters.
So these work too for instance:
```
{@command: param1: param2}
{@ command param1 param2}
```

Wildcards are allowed to span across multiple lines:
```
photo of {
	a dinosaur +
	an elephant +
	an eagle
} knitting

/seed: {
	100
	a dinosaur +
	200
	an elephant +
	200
	an eagle
} knitting
```

Unrolling wildcards are done recursively from top to bottom:
```
{cat|dog}
{playing+working}
{slowly|quickly}

v v v v v

cat
{playing+working}
{slowly|quickly}

v v v v v

cat
playing
{slowly|quickly}

cat
working
{slowly|quickly}

v v v v v

cat
playing
quickly

cat
working
slowly
```

Command lines are encouraged to be in `/command: param1 param2` format.
But tokanizing is simply done by splitting at groups of colon or space characters.
So these work too for instance:
```
/command: param1: param2
/ command param1 param2
```

Four types of parameters may occure.
- string (text) (no spaces are used)
- float (any number)
- int (integer number)
- bool (possible values below)
	- true of false
	- yes or no
	- 1 or 0

Some parameters might be omitted and take on default values.
The code ensures that mandatory parameters are present and that all parameters are of the right type.
Models and face restorations may be referenced by their registered name or their file name.
Samplers and upscalers may be referenced by their registered name or their index.
These file names and indices can be found by printing them with a script.
You may also find them on the Draw Things Discord channel.

Cheat sheet:

```
{choose|one|randomly}
{emit+for+all+values}
{10} or {@times: 10 [digits]} – emits 10 blocks inserting the index
{0.1:1.0:0.1} or {@for: 0.1 1.0 0.1} – emits 10 blocks inserting values from 0.1 to 1.0 with steps of 0.1
{@num: 5} or {@randomDigits: 5} – inserts a number made of 5 random digits
{@word: 5} or {@randomLetters: 5} – inserts a word made of 5 random letters
{@i: [digits]} or {@localIndex: [digits]} – inserts the index of the emitted block from the original
{@n: [digits]} or {@globalIndex: [digits]} – inserts the index of the emitted block all together

/empty – sets prompts to empty
/repeat – adds last promtps
/reset – resets configuration and prompts
/save: path [cropToVisible=true]
/load: path [targetLayer=image]
/pickFile: (mask|depth|scribble|pose|color|custom|moodboard)
/pickPhoto: (mask|depth|scribble|pose|color|custom|moodboard)
/clearCanvas
/model: name
/lora index: name [weight=1]
/control index: name [weight=1] [start=0] [end=1] [noPrompt=false] [downSamplingRate=1] [globalAveragePooling=false]
/strength: number
/seed: [number=random] [mode=same]
/size: width height
/upscaler: name
/steps: number
/guidance: normal [image=1.5]
/sampler: name
/refiner: model [start=0.85]
/originalSize: width height
/targetSize: width height
/negativeSize: width height
/crop: top left
/aesthetic: positive negative
/enableZeroNegative
/disableZeroNegative
/clipSkip: number
/maskBlur: number
/restoration: name
/enableHiResFix: width height [strength=0.7]
/disableHiResFix
/batchCount: int
/batchSize: int
/generate
```
*/

// Library handling classes:

class BaseLibrary {
	constructor(name, map) {
		this.name = name;
		this.map = map;
	}

	get(key) {
		if (key in this.map) {
			return this.map[key];
		}
		return this.handle(key);
	}
}

class CKPTLibrary extends BaseLibrary {
	handle(value) {
		if (value.endsWith(".ckpt")) {
			return value;
		}
		throw `No such ${this.name} registered in library (nor is it a ckpt name): ${value}`;
	}
}

class IntLibrary extends CKPTLibrary {
	handle(value) {
		const result = parseInt(value);
		if (isNaN(result)) {
			throw `No such ${this.name} registered in library (nor is it an integer): ${value}`;
		}
		return result;
	}
}

// Model register:

const modelLibrary = new CKPTLibrary("model", {
	"SDXL-Turbo": "sdxl_turbo_1_0_f16.ckpt",
	"LCM-SSD-1B": "lcm_ssd_1b_1_0_f16.ckpt",
	ZAMixRVBase: "zamix_rv_base_f32.ckpt",
	ZAMixRVFast: "zamix_rv_fast_f16.ckpt",
	ZAMixRVUltra: "zamix_rv_ultra_f16.ckpt",
	ZAMixDSBase: "zamix_ds_base_f32.ckpt",
	ZAMixDSFast: "zamix_ds_fast_f16.ckpt",
	ZAMixDSUltra: "zamix_ds_ultra_f16.ckpt",
	CyberRealisticClassicBase: "cyberrealistic_classic_2_0_base_f16.ckpt",
	CyberRealisticClassicFast: "cyberrealistic_classic_2_0_fast_f16.ckpt",
	CyberRealisticClassicUltra: "cyberrealistic_classic_2_0_ultra_f16.ckpt",
	RealisticVisionBase: "realistic_vision_5_1_base_f16.ckpt",
	RealisticVisionFast: "realistic_vision_5_1_fast_f16.ckpt",
	RealisticVisionUltra: "realistic_vision_5_1_ultra_f16.ckpt",
	DreamShaperBase: "dreamshaper_8_0_base_f16.ckpt",
	DreamShaperFast: "dreamshaper_8_0_fast_f16.ckpt",
	DreamShaperUltra: "dreamshaper_8_0_ultra_f16.ckpt",
	disabled: null
});

const loraLibrary = new CKPTLibrary("LoRA", {
	Pastel: "pastel_1_0_lora_f16.ckpt",
	Schmanzy: "schmanzy_sdxl_1_4_lora_f16.ckpt",
	"LCM-LoRA-SD-15": "lcm_lora_sd_15_lora_f16.ckpt",
	"LCM-LoRA-SSD-1B": "lcm_lora_ssd_1b_lora_f16.ckpt",
	"LCM-LoRA-SDXL": "lcm_lora_sdxl_lora_f16.ckpt",
	"SDXL-Noise-OS": "sdxl_noise_os_lora_f16.ckpt",
	"Add-Brightness": "add_brightness_lora_f16.ckpt",
	"TO8-Contrast": "to8_contrast_lora_f16.ckpt",
	"EPI-Noise_OS": "epi_noise_os_lora_f16.ckpt",
	disabled: null
});

const controlLibrary = new CKPTLibrary("control", {
	canny: "controlnet_canny_1.x_v1.1_f16.ckpt",
	depth: "controlnet_depth_1.x_v1.1_f16.ckpt",
	lineArt: "controlnet_lineart_1.x_v1.1_f16.ckpt",
	normal: "controlnet_normal_1.x_v1.1_f16.ckpt",
	pose: "controlnet_openpose_1.x_v1.1_f16.ckpt",
	scribble: "controlnet_scribble_1.x_v1.1_f16.ckpt",
	tile: "controlnet_tile_1.x_v1.1_f16.ckpt",
	disabled: null
});

const seedModeLibrary = new IntLibrary("seed mode", {
	legacy: 0,
	torch: 1,
	default: 2
});

const upscalerLibrary = new CKPTLibrary("upscaler", {
	"Real-ESRGAN-X2": "realesrgan_x2plus_f16.ckpt",
	"Real-ESRGAN-X4": "realesrgan_x4plus_f16.ckpt",
	"Real-ESRGAN-Anime": "realesrgan_x4plus_anime_f16.ckpt",
	"Universal-Upscaler": "esrgan_4x_universal_upscaler_v2_sharp_f16.ckpt",
	Remacri: "remacri_4x_f16.ckpt",
	UltraSharp: "4x_ultrasharp_f16.ckpt",
	disabled: null
});

const samplerLibrary = new IntLibrary("sampler", {
	"DPM-2M-Karras": 0,
	"Euler-Ancestral": 1,
	DDIM: 2,
	PLMS: 3,
	"DPM-SDE-Karras": 4,
	UniPC: 5,
	LCM: 6,
	"Euler-A-SubStep": 7,
	"DPM-SDE-SubStep": 8
});

const faceRestorationLibrary = new CKPTLibrary("face restoration", {
	RestoreFormer: "restoreformer_v1.0_f16.ckpt",
	disabled: null
});

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

function formatIndex(index, digits = 1) {
	let result = index.toString();
	while (result.length < digits) {
		result = "0" + result;
	}
	return result;
}

function getPath(name) {
	return filesystem.pictures.path + "/" + name;
}

function getSource(name) {
	return "file://" + filesystem.pictures.path + "/" + name;
}

// Functions for handling commands:

function createStandardlHandler(...targets) {
	return (block, parameterList) => {
		let i = 0;
		while (i < targets.length) {
			const key = targets[i++];
			const type = targets[i++];
			const fallback = targets[i++];
			if (type == "string") {
				block.configuration[key] = parameterList.nextString(fallback);
			} else if (type == "float") {
				block.configuration[key] = parameterList.nextFloat(fallback);
			} else if (type == "int") {
				block.configuration[key] = parameterList.nextInt(fallback);
			} else {
				block.configuration[key] = fallback;
			}
		}
	};
}

function executeEmpty(block, parameterList) {
	block.positive = "";
	block.negative = "";
}

function executeRepeat(block, parameterList) {
	if (block.positive) {
		if (lastPositive) {
			block.positive += "\n";
			block.positive += lastPositive;
		}
	} else {
		block.positive = lastPositive;
	}
	if (block.negative) {
		if (lastNegative) {
			block.negative += "\n";
			block.negative += lastNegative;
		}
	} else {
		block.negative = lastNegative;
	}
}

const initialConfiguration = { ...pipeline.configuration };
const initialPositive = "";
const initialNegative = pipeline.prompts.negativePrompt;

function executeReset(block, parameterList) {
	for (const key in block.configuration) {
		delete block.configuration[key];
	}
	for (const key in initialConfiguration) {
		block.configuration[key] = initialConfiguration[key];
	}
	block.positive = initialPositive;
	block.negative = initialNegative;
}

const defaultConfiguration = {
	loras: [],
	controls: [],
	strength: 1,
	seedMode: 2,
	width: 512,
	height: 512,
	upscaler: null,
	steps: 20,
	guidanceScale: 6,
	sampler: 0,
	refinerModel: null,
	refinerStart: 0.85,
	originalImageWidth: 512,
	originalImageHeight: 512,
	cropTop: 0,
	cropLeft: 0,
	targetImageWidth: 512,
	targetImageHeight: 512,
	negativeOriginalImageWidth: 512,
	negativeOriginalImageHeight: 512,
	aestheticScore: 6,
	negativeAestheticScore: 2.5,
	zeroNegativePrompt: false,
	clipSkip: 1,
	maskBlur: 1.5,
	faceRestoration: null,
	hiresFix: false,
	hiresFixWidth: 512,
	hiresFixHeight: 512,
	hiresFixStrength: 0.7,
	imageGuidanceScale: 1.5,
	batchCount: 1,
	batchSize: 1,
	negativePromptForImagePrior: true,
	imagePriorSteps: 5,
	clipWeight: 1
};

function executeDefaults(block, parameterList) {
	for (const key in defaultConfiguration) {
		block.configuration[key] = defaultConfiguration[key];
	}
}

function executeSave(block, parameterList) {
	const name = parameterList.nextString()
		.replace("@MODEL", block.configuration.model)
		.replace("@STEPS", block.configuration.steps);
	const path = getPath(name);
	const crop = parameterList.nextBool(true);
	canvas.saveImage(path, crop);
}

function executeLoad(block, parameterList) {
	const path = parameterList.nextString();
	switch (parameterList.nextString("image")) {
		case "image":
			canvas.loadImage(getPath(path));
			break;
		case "mask":
			canvas.loadMaskFromSrc(getSource(path));
			break;
		case "depth":
			canvas.loadDepthMapFromSrc(getSource(path));
			break;
		case "scribble":
			canvas.loadScribbleFromSrc(getSource(path));
			break;
		case "pose":
			canvas.loadPoseFromSrc(getSource(path));
			break;
		case "color":
			canvas.loadColorFromSrc(getSource(path));
			break;
		case "custom":
			canvas.loadCustomLayerFromSrc(getSource(path));
			break;
		case "moodboard":
			canvas.loadMoodboardFromSrc(getSource(path));
			break;
		default:
			throw "No such layer.";
	}
}

function executePickFile(block, parameterList) {
	switch (parameterList.nextString()) {
		case "mask":
			canvas.loadMaskFromFiles();
			break;
		case "depth":
			canvas.loadDepthMapFromFiles();
			break;
		case "scribble":
			canvas.loadScribbleFromFiles();
			break;
		case "pose":
			canvas.loadPoseFromFiles();
			break;
		case "color":
			canvas.loadColorFromFiles();
			break;
		case "custom":
			canvas.loadCustomLayerFromFiles();
			break;
		case "moodboard":
			canvas.loadMoodboardFromFiles();
			break;
		default:
			throw "No such layer.";
	}
}

function executePickPhoto(block, parameterList) {
	switch (parameterList.nextString()) {
		case "mask":
			canvas.loadMaskFromPhotos();
		case "depth":
			canvas.loadDepthMapFromPhotos();
		case "scribble":
			canvas.loadScribbleFromPhotos();
		case "pose":
			canvas.loadPoseFromPhotos();
		case "color":
			canvas.loadColorFromPhotos();
		case "custom":
			canvas.loadCustomLayerFromPhotos();
		case "moodboard":
			canvas.loadMoodboardFromPhotos();
		default:
			throw "No such layer.";
	}
}

function executeClearCanvas(block, parameterList) {
	canvas.clear();
}

function executeModel(block, parameterList) {
	block.configuration.model = modelLibrary.get(parameterList.nextString());
}

function executeLora(block, parameterList) {
	const index = parameterList.nextInt();
	if (index < 1) {
		throw "LoRA indexing should start from 1.";
	}
	block.configuration.loras[index - 1] = {
		file: loraLibrary.get(parameterList.nextString()),
		weight: parameterList.nextFloat(1)
	}
}

function executeControl(block, parameterList) {
	const index = parameterList.nextInt();
	if (index < 1) {
		throw "Control indexing should start from 1.";
	}
	block.configuration.controls[index - 1] = {
		file: controlLibrary.get(parameterList.nextString()),
		weight: parameterList.nextFloat(1),
		guidanceStart: parameterList.nextFloat(0),
		guidanceEnd: parameterList.nextFloat(1),
		noPrompt: parameterList.nextBool(false),
		downSamplingRate: parameterList.nextFloat(1),
		globalAveragePooling: parameterList.nextBool(false)
	};
}

function executeSeed(block, parameterList) {
	block.configuration.seed = parameterList.nextInt(nextSeed(block.configuration.seed));
	block.configuration.seedMode = seedModeLibrary.get(parameterList.nextString(block.configuration.seedMode));
}

function executeSize(block, parameterList) {
	block.configuration.width = parameterList.nextInt();
	block.configuration.height = parameterList.nextInt();
	if (parameterList.nextBool(false)) {
		block.configuration.originalImageWidth = block.configuration.width;
		block.configuration.originalImageHeight = block.configuration.height;
		block.configuration.targetImageWidth = block.configuration.width;
		block.configuration.targetImageHeight = block.configuration.height;
	}
	if (parameterList.nextBool(false)) {
		block.configuration.negativeOriginalImageWidth = block.configuration.width;
		block.configuration.negativeOriginalImageHeight = block.configuration.height;
	}
	canvas.updateCanvasSize(block.configuration);
}

function executeAspect(block, parameterList) {
	const aspect = parameterList.nextString();
	if (aspect == "horizontal") {
		let width = block.configuration.width;
		block.configuration.width = Math.max(width, block.configuration.height);
		block.configuration.height = Math.min(width, block.configuration.height);
		width = block.configuration.originalImageWidth;
		block.configuration.originalImageWidth = Math.max(width, block.configuration.originalImageHeight);
		block.configuration.originalImageHeight = Math.min(width, block.configuration.originalImageHeight);
		width = block.configuration.targetImageWidth;
		block.configuration.targetImageWidth = Math.max(width, block.configuration.targetImageHeight);
		block.configuration.targetImageHeight = Math.min(width, block.configuration.targetImageHeight);
		width = block.configuration.negativeOriginalImageWidth;
		block.configuration.negativeOriginalImageWidth = Math.max(width, block.configuration.negativeOriginalImageHeight);
		block.configuration.negativeOriginalImageHeight = Math.min(width, block.configuration.negativeOriginalImageHeight);
		width = block.configuration.hiresFixWidth;
		block.configuration.hiresFixWidth = Math.max(width, block.configuration.hiresFixHeight);
		block.configuration.hiresFixHeight = Math.min(width, block.configuration.hiresFixHeight);
	} else if (aspect == "vertical") {
		let width = block.configuration.width;
		block.configuration.width = Math.min(width, block.configuration.height);
		block.configuration.height = Math.max(width, block.configuration.height);
		width = block.configuration.originalImageWidth;
		block.configuration.originalImageWidth = Math.min(width, block.configuration.originalImageHeight);
		block.configuration.originalImageHeight = Math.max(width, block.configuration.originalImageHeight);
		width = block.configuration.targetImageWidth;
		block.configuration.targetImageWidth = Math.min(width, block.configuration.targetImageHeight);
		block.configuration.targetImageHeight = Math.max(width, block.configuration.targetImageHeight);
		width = block.configuration.negativeOriginalImageWidth;
		block.configuration.negativeOriginalImageWidth = Math.min(width, block.configuration.negativeOriginalImageHeight);
		block.configuration.negativeOriginalImageHeight = Math.max(width, block.configuration.negativeOriginalImageHeight);
		width = block.configuration.hiresFixWidth;
		block.configuration.hiresFixWidth = Math.min(width, block.configuration.hiresFixHeight);
		block.configuration.hiresFixHeight = Math.max(width, block.configuration.hiresFixHeight);
	} else {
		throw "Aspect should be horizontal or vertical.";
	}
	canvas.updateCanvasSize(block.configuration);
}

function executeUpscaler(block, parameterList) {
	block.configuration.upscaler = upscalerLibrary.get(parameterList.nextString());
}

function executeSampler(block, parameterList) {
	block.configuration.sampler = samplerLibrary.get(parameterList.nextString());
}

function executeRefiner(block, parameterList) {
	block.configuration.refinerModel = modelLibrary.get(parameterList.nextString());
	block.configuration.refinerStart = parameterList.nextFloat(0.85);
}

function executeRestoration(block, parameterList) {
	block.configuration.faceRestoration = faceRestorationLibrary.get(parameterList.nextString());
}

let lastPositive = "";
let lastNegative = pipeline.prompts.negativePrompt;

let lastWidth = pipeline.configuration.width;
let lastHeight = pipeline.configuration.height;

function executeGenerate(block, parameterList) {
	if (typeof block.negative == "string") {
		lastNegative = block.negative;
		block.negative = null;
	}
	if (typeof block.positive == "string") {
		lastPositive = block.positive;
		block.positive = null;
	}
	if (lastWidth - block.configuration.width || block.configuration.height - lastHeight) {
		lastWidth = block.configuration.width;
		lastHeight = block.configuration.height;
		canvas.clear();
	}
	try {
		pipeline.run({
			configuration: block.configuration,
			prompt: lastPositive,
			negativePrompt: lastNegative
		});
	} catch {
		throw "ABORT";
	}
}

function executeFinish(block) {
	if (typeof block.negative == "string") {
		lastNegative = block.negative;
		block.negative = null;
	}
	if (typeof block.positive == "string") {
		lastPositive = block.positive;
		block.positive = null;
		if (lastWidth - block.configuration.width || block.configuration.height - lastHeight) {
			lastWidth = block.configuration.width;
			lastHeight = block.configuration.height;
			canvas.clear();
		}
		try {
			pipeline.run({
				configuration: block.configuration,
				prompt: lastPositive,
				negativePrompt: lastNegative
			});
		} catch {
			throw "ABORT";
		}
	}
}

// Binding handlers to commands:

const commandHandlers = {
	empty: executeEmpty,
	repeat: executeRepeat,
	reset: executeReset,
	defaults: executeDefaults,
	save: executeSave,
	load: executeLoad,
	pickFile: executePickFile,
	pickPhoto: executePickPhoto,
	clearCanvas: executeClearCanvas,
	model: executeModel,
	lora: executeLora,
	control: executeControl,
	strength: createStandardlHandler(
		"strength", "float", undefined
	),
	seed: executeSeed,
	size: executeSize,
	aspect: executeAspect,
	upscaler: executeUpscaler,
	steps: createStandardlHandler(
		"steps", "int", undefined
	),
	guidance: createStandardlHandler(
		"guidanceScale", "float", undefined,
		"imageGuidanceScale", "float", 1.5
	),
	sampler: executeSampler,
	refiner: executeRefiner,
	originalSize: createStandardlHandler(
		"originalImageWidth", "int", undefined,
		"originalImageHeight", "int", undefined
	),
	targetSize: createStandardlHandler(
		"targetImageWidth", "int", undefined,
		"targetImageHeight", "int", undefined
	),
	negativeSize: createStandardlHandler(
		"negativeOriginalImageWidth", "int", undefined,
		"negativeOriginalImageHeight", "int", undefined
	),
	crop: createStandardlHandler(
		"cropTop", "int", undefined,
		"cropLeft", "int", undefined
	),
	aesthetic: createStandardlHandler(
		"aestheticScore", "float", undefined,
		"negativeAestheticScore", "float", undefined
	),
	enableZeroNegative: createStandardlHandler(
		"zeroNegativePrompt", "bool", true
	),
	disableZeroNegative: createStandardlHandler(
		"zeroNegativePrompt", "bool", false
	),
	clipSkip: createStandardlHandler(
		"clipSkip", "int", undefined
	),
	maskBlur: createStandardlHandler(
		"maskBlur", "float", undefined
	),
	restoration: executeRestoration,
	enableHiResFix: createStandardlHandler(
		"hiresFix", "bool", true,
		"hiresFixWidth", "int", undefined,
		"hiresFixHeight", "int", undefined,
		"hiresFixStrength", "float", 0.7
	),
	disableHiResFix: createStandardlHandler(
		"hiresFix", "bool", false
	),
	batchCount: createStandardlHandler(
		"batchCount", "int", undefined
	),
	batchSize: createStandardlHandler(
		"batchSize", "bool", false
	),
	generate: executeGenerate
};

// Functions for parsing commands:

function parseCommand(line) {
	const parts = line.substring(1).trim().split(/[:\s]+/);
	const name = parts[0];
	const commandHandler = commandHandlers[name];
	if (commandHandler) {
		const parameterList = new ParameterList(parts.slice(1));
		return (block) => {
			try {
				commandHandler(block, parameterList);
				parameterList.checkEmpty(name);
			} catch (message) {
				if (message == "ABORT") {
					throw "ABORT";
				}
				console.log(`Error during executing line: ${line}`);
				console.log(`Error message: ${message}`);
			}
		};
	}
	console.log(`Error during parsing line: ${line}`);
	console.log(`No such command: ${name}`);
	return null;
}

function parseComment(line) {
	line = line.substring(2).trim();
	return (block) => {
		console.log(line);
	};
}

function parseNegative(line) {
	line = line.substring(1).trim();
	return (block) => {
		if (block.negative) {
			block.negative += "\n";
			block.negative += line;
		} else {
			block.negative = line;
		}
	};
}

function parsePositive(line) {
	line = line.trim();
	return (block) => {
		if (block.positive) {
			block.positive += "\n";
			block.positive += line;
		} else {
			block.positive = line;
		}
	};
}

function parseLine(line) {
	if (line.startsWith("//")) {
		return parseComment(line);
	}
	if (line.startsWith("/")) {
		return parseCommand(line);
	}
	if (line.startsWith("-")) {
		return parseNegative(line);
	}
	return parsePositive(line);
}

function parseBlock(lines) {
	const commands = [];
	for (const line of lines.split(/\n+/)) {
		commands.push(parseLine(line));
	}
	commands.push(executeFinish);
	return {
		configuration: pipeline.configuration,
		positive: null,
		negative: null,
		commands: commands
	};
}

// Functions for handling wildcards:

const wildcardVariables = {};

let wildcardSeed = pipeline.configuration.seed;

function createAssignmentGenerator(name, value) {
	const inner = createWildcardHandler(`{${value}}`);
	return () => {
		// TODO: Handling arrays.
		const result = inner();
		wildcardVariables[name] = result;
		return result;
	}
}

function createAccessGenerator(name) {
	return () => {
		if (name in wildcardVariables) {
			return wildcardVariables[name];
		} else {
			return "";
		}
	}
}

function createAllGenerator(original) {
	const values = original.substring(1, original.length - 1).split("+").map(value => value.trim());
	return () => values;
}

function createSelectGenerator(original) {
	const values = original.substring(1, original.length - 1).split("|").map(value => value.trim());
	return () => {
		wildcardSeed = nextSeed(wildcardSeed);
		return values[wildcardSeed % values.length];
	}
}

function createTimesGenerator(parameterList) {
	const count = parameterList.nextInt();
	const digits = parameterList.nextInt(1);
	const values = [];
	for (let i = 0; i < count; ++i) {
		values.push(formatIndex(i + 1, digits));
	}
	return () => values;
}

const limitThreshold = 0.000001;

function createForGenerator(parameterList) {
	const start = parameterList.nextFloat();
	const limit = parameterList.nextFloat();
	const step = parameterList.nextFloat(1);
	const values = [];
	if (start < limit) {
		const secureLimit = limit + limitThreshold;
		if (step > 0) {
			for (let i = start; i < secureLimit; i += step) {
				values.push(i);
			}
		} else if (step < 0) {
			for (let i = start; i < secureLimit; i -= step) {
				values.push(i);
			}
		} else {
			throw "Step should not be 0.";
		}
	} else {
		const secureLimit = limit - limitThreshold;
		if (step > 0) {
			for (let i = start; i > secureLimit; i -= step) {
				values.push(i);
			}
		} else if (step < 0) {
			for (let i = start; i > secureLimit; i += step) {
				values.push(i);
			}
		} else {
			throw "Step should not be 0.";
		}
	}
	return () => values;
}

function createRandomDigitsGenerator(parameterList) {
	const count = parameterList.nextInt();
	return () => {
		let result = "";
		for (let i = 0; i < count; ++i) {
			wildcardSeed = nextSeed(wildcardSeed);
			result += String.fromCharCode(48 + wildcardSeed % 10);
		}
		return result;
	}
}

function createRandomLettersGenerator(parameterList) {
	const count = parameterList.nextInt();
	return () => {
		let result = "";
		for (let i = 0; i < count; ++i) {
			wildcardSeed = nextSeed(wildcardSeed);
			result += String.fromCharCode(97 + wildcardSeed % 25);
		}
		return result;
	}
}

let localWildcardIndex = 1;

function createLocalIndexGenerator(parameterList) {
	const digits = parameterList.nextInt(1);
	return () => {
		return formatIndex(localWildcardIndex, digits);
	}
}

let globalWildcardIndex = 1;

function createGlobalIndexGenerator(parameterList) {
	const digits = parameterList.nextInt(1);
	return () => {
		return formatIndex(globalWildcardIndex, digits);
	}
}

function createGeneratorForName(name, parameterList) {
	let generator;
	switch (name) {
		case "times":
			generator = createTimesGenerator(parameterList);
			break;
		case "for":
			generator = createForGenerator(parameterList);
			break;
		case "num":
		case "randomDigits":
			generator = createRandomDigitsGenerator(parameterList);
			break;
		case "word":
		case "randomLetters":
			generator = createRandomLettersGenerator(parameterList);
			break;
		case "i":
		case "localIndex":
			generator = createLocalIndexGenerator(parameterList);
			break;
		case "n":
		case "globalIndex":
			generator = createGlobalIndexGenerator(parameterList);
			break;
		default:
			generator = createAccessGenerator(name);
			break;
	}
	parameterList.checkEmpty(name);
	return generator;
}

// Functions for parsing wildcards:

function createWildcardHandler(original) {
	let parts;
	if (parts = original.match(/{@(\w+)[=\s]+(.+)}/)) {
		return createAssignmentGenerator(parts[1], parts[2]);
	}
	if (original.match(/\+/)) {
		return createAllGenerator(original);
	}
	if (original.match(/\|/)) {
		return createSelectGenerator(original);
	}
	if (parts = original.match(/{(\d+)}/)) {
		const parameterList = new ParameterList(parts.slice(1));
		return createTimesGenerator(parameterList);
	}
	if (parts = original.match(/{(-?\d+\.?|-?\.?\d+|-?\d+\.\d+):(-?\d+\.?|-?\.?\d+|-?\d+\.\d+):(-?\d+\.?|-?\.?\d+|-?\d+\.\d+)}/)) {
		const parameterList = new ParameterList(parts.slice(1));
		return createForGenerator(parameterList);
	}
	if (original.match(/{@/)) {
		parts = original.substring(2, original.length - 1).split(/[:\s]+/);
		const name = parts[0];
		const parameterList = new ParameterList(parts.slice(1));
		return createGeneratorForName(name, parameterList);
	}
	throw "Wrong wildcard format.";
}

// maybe this is overkill
function getWildcardMatches(lines) {
	const openMatches = lines.match(/{[^{]+}/g);
	const closeMatches = lines.match(/{[^}]+}/g);
	const openString = String(openMatches);
	const closeString = String(closeMatches);
	if (openString == closeString) {
		return openMatches;
	}
	console.log("Error: Braces should be paired and non-nested.");
}

function parseWildcards(lines) {
	const wildcards = [];
	const matches = getWildcardMatches(lines);
	if (matches) {
		for (const original of matches) {
			try {
				const generator = createWildcardHandler(original);
				wildcards.push({ original, generator });
			} catch (message) {
				console.log(`Error during parsing wildcard: ${original}`);
				console.log(`Error message: ${message}`);
			}
		}
	}
	return wildcards;
}

// Function for processing wildcards:

function executeWildcards(lines, wildcards, blocks) {
	if (wildcards.length) {
		const wildcard = wildcards.shift();
		const result = wildcard.generator();
		if (Array.isArray(result)) {
			for (const value of result) {
				const nextLines = lines.replace(wildcard.original, value);
				const nextWildcards = [ ...wildcards ];
				executeWildcards(nextLines, nextWildcards, blocks);
			}
		} else {
			const nextLines = lines.replace(wildcard.original, result);
			executeWildcards(nextLines, wildcards, blocks);
		}
	} else {
		++localWildcardIndex;
		++globalWildcardIndex;
		blocks.push(parseBlock(lines));
	}
}

// Final parsing and execution:

function parseInput(input) {
	const blocks = [];
	for (const lines of input.split(/\n\n+/)) {
		const wildcards = parseWildcards(lines);
		localWildcardIndex = 1;
		executeWildcards(lines, wildcards, blocks);
	}
	return blocks;
}

function executeBlocks(blocks) {
	for (const block of blocks) {
		for (const command of block.commands) {
			if (command) {
				command(block);
			}
		}
	}
}

try {
	executeBlocks(parseInput(pipeline.prompts.prompt.trim().replace(/\r\n|\r|\u2028/g, "\n")));
} catch (message) {
	if (message == "ABORT") {
		console.log("Execution aborted by user.");
	} else {
		console.log(`Unexpected error: ${message}`);
	}
}