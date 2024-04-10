/// <reference path="../Library/DefaultConfiguration.ts" />
/// <reference path="../Library/BaseCommandEngine.ts" />
/// <reference path="Catalogue.ts" />

class PBPCommandEngine extends BaseCommandEngine {
	private initialConfiguration: Configuration;
	private configuration: Configuration;

	private lastPositive: string;
	private positive: string;

	private initialNegative: string;
	private lastNegative: string;
	private negative: string;

	private lastWidth: number;
	private lastHeight: number;

	public constructor(configuration: Configuration, negative: string) {
		super();
		this.initialConfiguration = { ...configuration };
		this.configuration = { ...configuration };
		this.initialNegative = negative;
		this.lastNegative = negative;
		this.lastWidth = configuration.width;
		this.lastHeight = configuration.height;
		this.commands = {
			...this.buildAPIMap(),
			...this.buildCustomMap()
		};
	}

	private buildAPIMap(): CommandMap {
		const result = {};
		for (const key in this.initialConfiguration) {
			switch (typeof this.initialConfiguration[key]) {
				case "string":
					result[key] = (parameters: ParameterList) => this.configuration[key] = parameters.nextString();
					break;
				case "number":
					result[key] = (parameters: ParameterList) => this.configuration[key] = parameters.nextFloat();
					break;
				case "boolean":
					result[key] = (parameters: ParameterList) => this.configuration[key] = parameters.nextBool();
					break;
			}
		}
		return result;
	}

	private buildCustomMap(): CommandMap {
		return {
			generate: this.handleGenerate,
			defaults: this.handleDefaults,
			reset: this.handleReset,
			empty: this.handleEmpty,
			load: this.handleLoad,
			pickFile: this.handlePickFile,
			pickPhoto: this.handlePickPhoto,
			clear: this.handleClear,
			model: this.createStandardHandler(
				"model", modelCatalogue, undefined
			),
			refinerModel: this.createStandardHandler(
				"refinerModel", modelCatalogue, undefined
			),
			refiner: this.createStandardHandler(
				"refinerModel", modelCatalogue, undefined,
				"refinerStart", "float", undefined
			),
			lora: this.handleLoRA,
			control: this.handleControl,
			sampler: this.createStandardHandler(
				"sampler", samplerCatalogue, undefined
			),
			cfg: this.createStandardHandler(
				"guidanceScale", "float", undefined
			),
			strength: this.createStandardHandler(
				"strength", "float", undefined
			),
			seed: this.handleSeed,
			seedMode: this.createStandardHandler(
				"seedMode", seedModeCatalogue, undefined
			),
			size: this.handleSize,
			aspect: this.handleAspect,
			enableHiResFix: this.createStandardHandler(
				"hiresFix", "const", true
			),
			setHiResFix: this.createStandardHandler(
				"hiresFix", "const", true,
				"hiresFixWidth", "int", undefined,
				"hiresFixHeight", "int", undefined,
				"hiresFixStrength", "float", undefined
			),
			disableHiResFix: this.createStandardHandler(
				"hiresFix", "const", false
			),
			originalSize: this.createStandardHandler(
				"originalImageWidth", "int", undefined,
				"originalImageHeight", "int", undefined
			),
			targetSize: this.createStandardHandler(
				"targetImageWidth", "int", undefined,
				"targetImageHeight", "int", undefined
			),
			negativeSize: this.createStandardHandler(
				"negativeOriginalImageWidth", "int", undefined,
				"negativeOriginalImageHeight", "int", undefined
			),
			crop: this.createStandardHandler(
				"cropTop", "int", undefined,
				"cropLeft", "int", undefined
			),
			upscaler: this.createStandardHandler(
				"upscaler", upscalerCatalogue, undefined
			),
			faceRestoration: this.createStandardHandler(
				"faceRestoration", faceRestorationCatalogue, undefined
			),
			aesthetic: this.createStandardHandler(
				"aestheticScore", "float", undefined,
				"negativeAestheticScore", "float", undefined
			),
			enableZeroNegative: this.createStandardHandler(
				"zeroNegativePrompt", "const", true
			),
			disableZeroNegative: this.createStandardHandler(
				"zeroNegativePrompt", "const", false
			)
		};
	}

	private createStandardHandler(...targets): CommandHandler {
		return (parameterList) => {
			let i = 0;
			while (i < targets.length) {
				const key = targets[i++];
				const type = targets[i++];
				const fallback = targets[i++];
				if (type instanceof SimpleCatalogue) {
					this.configuration[key] = type.get(parameterList.nextString(fallback))
				} else if (type == "const") {
					this.configuration[key] = fallback;
				} else if (type == "string") {
					this.configuration[key] = parameterList.nextString(fallback);
				} else if (type == "float") {
					this.configuration[key] = parameterList.nextFloat(fallback);
				} else if (type == "int") {
					this.configuration[key] = parameterList.nextInt(fallback);
				} else {
					this.configuration[key] = fallback;
				}
			}
		};
	}

	private handleDefaults = (parameters: ParameterList) => {
		this.configuration = { ...this.configuration, ...defaultConfiguration };
	}

	private handleReset = (parameters: ParameterList) => {
		this.configuration = { ...this.initialConfiguration };
		this.lastNegative = this.initialNegative;
		this.negative = null;
	}

	private handleEmpty = (parameters: ParameterList) => {
		this.positive = "";
		this.negative = "";
	}

	private handleLoad = (parameters: ParameterList) => {
		const path = parameters.nextString();
		switch (parameters.nextString("image")) {
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

	private handlePickFile = (parameters: ParameterList) => {
		switch (parameters.nextString()) {
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

	private handlePickPhoto = (parameters: ParameterList) => {
		switch (parameters.nextString()) {
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

	private handleClear = (parameters: ParameterList) => {
		canvas.clear();
	}

	private handleLoRA = (parameters: ParameterList) => {
		const index = parameters.nextInt();
		if (index < 1) {
			throw "LoRA indexing should start from 1.";
		}
		this.configuration.loras[index - 1] = {
			file: loraCatalogue.get(parameters.nextString()),
			weight: parameters.nextFloat(1)
		}
	}

	private handleControl = (parameters: ParameterList) => {
		const index = parameters.nextInt();
		if (index < 1) {
			throw "Control indexing should start from 1.";
		}
		this.configuration.controls[index - 1] = {
			file: controlCatalogue.get(parameters.nextString()),
			weight: parameters.nextFloat(1),
			guidanceStart: parameters.nextFloat(0),
			guidanceEnd: parameters.nextFloat(1),
			noPrompt: false,
			controlImportance: parameters.nextString("balanced"),
			downSamplingRate: parameters.nextFloat(1),
			globalAveragePooling: parameters.nextBool(false)
		};
	}

	private handleSeed = (parameters: ParameterList) => {
		this.configuration.seed = parameters.nextInt(XSRandom.next(this.configuration.seed));
	}

	private handleSize = (parameters: ParameterList) => {
		const configuration = this.configuration;
		configuration.width = parameters.nextInt();
		configuration.height = parameters.nextInt();
		if (parameters.nextBool(true)) {
			configuration.originalImageWidth = configuration.width;
			configuration.originalImageHeight = configuration.height;
			configuration.targetImageWidth = configuration.width;
			configuration.targetImageHeight = configuration.height;
		}
		if (parameters.nextBool(true)) {
			configuration.negativeOriginalImageWidth = configuration.width;
			configuration.negativeOriginalImageHeight = configuration.height;
		}
	}

	private swapHorizontal(widthKey: string, heightKey: string) {
		const width = this.configuration[widthKey];
		this.configuration[widthKey] = Math.max(width, this.configuration[heightKey]);
		this.configuration[heightKey] = Math.min(width, this.configuration[heightKey]);
	}

	private swapVertical(widthKey: string, heightKey: string) {
		const width = this.configuration[widthKey];
		this.configuration[widthKey] = Math.max(width, this.configuration[heightKey]);
		this.configuration[heightKey] = Math.min(width, this.configuration[heightKey]);
	}

	private handleAspect = (parameters: ParameterList) => {
		const aspect = parameters.nextString();
		if (aspect == "horizontal") {
			this.swapHorizontal("width", "height");
			this.swapHorizontal("originalImageWidth", "originalImageHeight");
			this.swapHorizontal("targetImageWidth", "targetImageHeight");
			this.swapHorizontal("negativeOriginalImageWidth", "negativeOriginalImageHeight");
			this.swapHorizontal("hiresFixWidth", "hiresFixHeight");
		} else if (aspect == "vertical") {
			this.swapVertical("width", "height");
			this.swapVertical("originalImageWidth", "originalImageHeight");
			this.swapVertical("targetImageWidth", "targetImageHeight");
			this.swapVertical("negativeOriginalImageWidth", "negativeOriginalImageHeight");
			this.swapVertical("hiresFixWidth", "hiresFixHeight");
		} else {
			throw "Aspect should be horizontal or vertical.";
		}
	}

	private handleGenerate = (parameters: ParameterList) => {
		if (typeof this.negative == "string") {
			this.lastNegative = this.negative;
			this.negative = null;
		}
		if (typeof this.positive == "string") {
			this.lastPositive = this.positive;
			this.positive = null;
		}
		if (this.lastWidth - this.configuration.width || this.lastHeight - this.configuration.height) {
			this.lastWidth = this.configuration.width;
			this.lastHeight = this.configuration.height;
			canvas.updateCanvasSize(this.configuration);
			canvas.clear();
		}
		try {
			pipeline.run({
				configuration: this.configuration,
				prompt: this.lastPositive,
				negativePrompt: this.lastNegative
			});
			const name = parameters.nextString(null);
			const crop = parameters.nextBool(true);
			if (name) {
				const path = getPath(name);
				canvas.saveImage(path, crop);
			}
		} catch {
			throw "ABORT";
		}
	}

	protected override handlePositive(line: string): void {
		if (this.positive) {
			this.positive += "\n";
			this.positive += line;
		} else {
			this.positive = line;
		}
	}

	protected override handleNegative(line: string): void {
		if (this.negative) {
			this.negative += "\n";
			this.negative += line;
		} else {
			this.negative = line;
		}
	}

	protected override handleEnd(): void {
		if (typeof this.negative == "string") {
			this.lastNegative = this.negative;
			this.negative = null;
		}
		if (typeof this.positive == "string") {
			this.lastPositive = this.positive;
			this.positive = null;
			if (this.lastWidth - this.configuration.width || this.lastHeight - this.configuration.height) {
				this.lastWidth = this.configuration.width;
				this.lastHeight = this.configuration.height;
				canvas.clear();
			}
			try {
				pipeline.run({
					configuration: this.configuration,
					prompt: this.lastPositive,
					negativePrompt: this.lastNegative
				});
			} catch {
				throw "ABORT";
			}
		}
	}
}