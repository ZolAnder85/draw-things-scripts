interface LoRAConfig {
	file: string;
	weight: number;
}

interface ControlConfig {
	file: string;
	weight: number;
	guidanceStart: number;
	guidanceEnd: number;
	noPrompt: boolean;
	downSamplingRate: number;
	globalAveragePooling: boolean;
}

declare const enum SeedMode {
	legacy = 0,
	torch = 1,
	default = 2
}

declare const enum Upscaler {
	RealESRGANX2 = "realesrgan_x2plus_f16.ckpt",
	RealESRGANX4 = "realesrgan_x4plus_f16.ckpt",
	RealESRGANAnime = "realesrgan_x4plus_anime_f16.ckpt",
	UniversalUpscaler = "esrgan_4x_universal_upscaler_v2_sharp_f16.ckpt",
	Remacri = "remacri_4x_f16.ckpt",
	UltraSharp = "4x_ultrasharp_f16.ckpt",
	disabled = null
}

declare const enum Sampler {
	DPMPP2MKarras = 0,
	EulerAncestral = 1,
	DDIM = 2,
	PLMS = 3,
	DPMPPSDEKarras = 4,
	UniPC = 5,
	LCM = 6,
	EulerASubStep = 7,
	DPMPPSDESubStep = 8,
	TCD = 9
}

declare const enum Restoration {
	RestoreFormer = "restoreformer_v1.0_f16.ckpt",
	disabled = null
}

// TODO:
// Optional members?
// Add missing parameters.
interface Configuration {
	loras: LoRAConfig[];
	controls: ControlConfig[];
	strength: number;
	seed: number;
	seedMode: SeedMode;
	width: number;
	height: number;
	upscaler: Upscaler
	steps: number;
	shift: number;
	guidanceScale: number;
	sampler: Sampler;
	refinerModel: string;
	refinerStart: number;
	originalImageWidth: number;
	originalImageHeight: number;
	cropTop: number;
	cropLeft: number;
	targetImageWidth: number;
	targetImageHeight: number;
	negativeOriginalImageWidth: number;
	negativeOriginalImageHeight: number;
	aestheticScore: number;
	negativeAestheticScore: number;
	zeroNegativePrompt: boolean;
	clipSkip: number;
	maskBlur: number;
	faceRestoration: Restoration;
	hiresFix: boolean;
	hiresFixWidth: number;
	hiresFixHeight: number;
	hiresFixStrength: number;
	imageGuidanceScale: number;
	batchCount: number;
	batchSize: number;
	negativePromptForImagePrior: boolean;
	imagePriorSteps: number;
	clipWeight: number;
	id: number;
}

interface PipelinePrompts {
	negativePrompt?: string;
	prompt?: string;
}

declare class Mask {
	constructor(handle: number);
	fillRectangle(x: number, y, width: number, height: number, value: number);
}

interface PipelineInput {
	configuration: Configuration;
	negativePrompt?: string;
	prompt?: string;
	mask?: Mask;
}

declare const pipeline: {
	configuration: Configuration,
	prompts: PipelinePrompts,
	run(input: PipelineInput): void,
	downloadBuiltin(name: string): void,
	findControlByName(name: string): ControlConfig,
	findLoRAByName(name: string): LoRAConfig
};

declare const canvas: {
	currentMask: Mask,
	canvasZoom: number,
	topLeftCorner: { x: number, y: number },
	boundingBox: { x: number, y: number, width: number, height: number },
	moveCanvas(x: number, y: number): void,
	updateCanvasSize(configuration: Configuration): void,
	createMask(width: number, height: number, value: number): Mask,
	clear(): void,
	loadImage(path: string): void,
	saveImage(path: string, visibleRegionOnly?: boolean): void,
	loadMaskFromPhotos(): void,
	loadDepthMapFromPhotos(): void,
	loadScribbleFromPhotos(): void,
	loadPoseFromPhotos(): void,
	loadColorFromPhotos(): void,
	loadCustomLayerFromPhotos(): void,
	loadMoodboardFromPhotos(): void,
	loadMaskFromFiles(): void,
	loadDepthMapFromFiles(): void,
	loadScribbleFromFiles(): void,
	loadPoseFromFiles(): void,
	loadColorFromFiles(): void,
	loadCustomLayerFromFiles(): void,
	loadMoodboardFromFiles(): void,
	loadMaskFromSrc(source: string): void,
	loadDepthMapFromSrc(source: string): void,
	loadScribbleFromSrc(source: string): void,
	loadPoseFromSrc(source: string): void,
	loadColorFromSrc(source: string): void,
	loadCustomLayerFromSrc(source: string): void,
	loadMoodboardFromSrc(source: string): void,
	loadPoseFromJson(source: string): void
};

declare const filesystem: {
	pictures: { path: string }
};

declare namespace console {
	function log(...args);
	function warn(...args);
	function error(...args);
	function debug(...args);
	function clear(...args);
	function dir(...args);
	function dirxml(...args);
	function table(...args);
	function trace(...args);
	function assert(...args);
	function count(...args);
	function countReset(...args);
	function profile(...args);
	function profileEnd(...args);
	function time(...args);
	function timeLog(...args);
	function timeEnd(...args);
	function timeStamp(...args);
	function takeHeapSnapshot(...args);
	function group(...args);
	function groupCollapsed(...args);
	function groupEnd(...args);
	function record(...args);
	function recordEnd(...args);
	function screenshot(...args);
}