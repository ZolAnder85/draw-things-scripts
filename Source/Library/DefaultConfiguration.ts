const defaultConfiguration = {
	// model: null,
	refinerModel: null,
	refinerStart: 0.5,
	loras: [],
	controls: [],
	sampler: 0,
	steps: 20,
	shift: 1,
	stochasticSamplingGamma: 0.3,
	guidanceScale: 5,
	imageGuidanceScale: 1.5,
	strength: 1,
	// seed: 0,
	seedMode: 2,
	width: 512,
	height: 512,
	hiresFix: false,
	hiresFixWidth: 512,
	hiresFixHeight: 512,
	hiresFixStrength: 0.5,
	originalImageWidth: 512,
	originalImageHeight: 512,
	targetImageWidth: 512,
	targetImageHeight: 512,
	negativeOriginalImageWidth: 512,
	negativeOriginalImageHeight: 512,
	cropTop: 0,
	cropLeft: 0,
	upscaler: null,
	faceRestoration: null,
	maskBlur: 5,
	maskBlurOutset: 0,
	preserveOriginalAfterInpaint: true,
	sharpness: 0,
	aestheticScore: 5,
	negativeAestheticScore: 2,
	clipSkip: 1,
	zeroNegativePrompt: false,
	stage2Guidance: 1,
	stage2Steps: 10,
	stage2Shift: 1,
	fps: 5,
	numFrames: 21,
	startFrameGuidance: 1,
	guidingFrameNoise: 0.02,
	motionScale: 127,
	imagePriorSteps: 5,
	negativePromptForImagePrior: true,
	clipWeight: 1,
	batchCount: 1,
	batchSize: 1,
	tiledDecoding: false,
	decodingTileWidth: 512,
	decodingTileHeight: 512,
	decodingTileOverlap: 128
};