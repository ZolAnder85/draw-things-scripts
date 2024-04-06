const startTime = Date.now();

/*
TODO:
- check if generation can reach the end without progression
- start from the middle
- Why are the edges messed up?

/size:
/load:
/upscaler:
/zoom:
/progression:
/mask:
prompt
- negative
*/

const scaleToMatch = 4;
const progression = 0.75;
const maskFactor = 2;

const size = {
	x: pipeline.configuration.width,
	y: pipeline.configuration.height
};

const step = {
	x: progression * pipeline.configuration.width,
	y: progression * pipeline.configuration.height
};

const margin = {
	x: (size.x - step.x) / 2,
	y: (size.y - step.y) / 2
};

const border = maskFactor * pipeline.configuration.maskBlur;

const start = {
	x: canvas.boundingBox.x,
	y: canvas.boundingBox.y
};

const target = {
	x: scaleToMatch * canvas.boundingBox.width,
	y: scaleToMatch * canvas.boundingBox.height
};

canvas.canvasZoom = scaleToMatch;

function clamp(value, min, max) {
	if (value < min) {
		return min;
	}
	if (value > max) {
		return max;
	}
	return value;
}

function generateTile(x, y) {
	const AX = clamp(x - border, 0, target.x);
	const AY = clamp(y - border, 0, target.y);
	const BX = clamp(x + step.x + border, 0, target.x);
	const BY = clamp(y + step.y + border, 0, target.y);
	const TX = clamp(x - margin.x, 0, target.x - size.x);
	const TY = clamp(y - margin.y, 0, target.y - size.y);
	canvas.moveCanvas(start.x + TX / scaleToMatch, start.y + TY / scaleToMatch);
	const mask = canvas.createMask(size.x, size.y, 0);
	mask.fillRectangle(AX - TX, AY - TY, BX - AX, BY - AY, 2);
  pipeline.run({ configuration: pipeline.configuration, mask: mask });
}

function generateRow(x, y) {
	generateTile(x, y);
	if (x + step.x < target.x) {
		generateRow(x + step.x, y);
	}
}

function generateColumn(x, y) {
	generateRow(x, y);
	if (y + step.y < target.y) {
		generateColumn(x, y + step.y);
	}
}

generateColumn(0, 0);

const duration = Date.now() - startTime;

console.log(duration / 1000);