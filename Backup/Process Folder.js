// TODO: Detect resolution.

const lines = pipeline.prompts.prompt.split("\n");
const inputFolder = lines[0];
const outputFolder = lines[1];
const remaining = lines.slice(2).join("\n");

const configuration = { ...pipeline.configuration };
const batchCount = configuration.batchCount;
configuration.batchCount = 1;

function nextSeed(seed) {
	seed = seed ^ (seed << 13);
	seed = seed ^ (seed >> 17);
	seed = seed ^ (seed << 5);
	return seed >>> 0;
}

const images = [];

for (const path of filesystem.pictures.readEntries(inputFolder)) {
	if (path.endsWith(".png") || path.endsWith(".jpg") || path.endsWith(".jpeg")) {
		images.push(path);
	}
}

images.sort();

for (const path of images) {
	const name = path.split("/").pop().split(".")[0];
	const words = name.split("_").filter(Boolean);
	const matches = words[0].match(/\D/);
	if (matches == null) {
		words.shift();
	}
	words.pop();
	const prompt = remaining || words.join(" ").split("-")[0];
	const seed = configuration.seed;
	for (let i = 0; i < batchCount; ++i) {
		canvas.loadImage(path);
		pipeline.run({ configuration, prompt });
		canvas.saveImage(filesystem.pictures.path + "/" + outputFolder + "/" + name + "." + i + ".png");
		configuration.seed = nextSeed(configuration.seed);
	}
	configuration.seed = seed;
}