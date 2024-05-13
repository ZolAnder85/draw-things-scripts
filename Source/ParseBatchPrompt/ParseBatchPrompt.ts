/// <reference path="TopComment.ts" />
/// <reference path="PBPPreprocessor.ts" />
/// <reference path="PBPCommandEngine.ts" />

const commandHandler = new PBPCommandEngine(pipeline.configuration, pipeline.prompts.negativePrompt);
const preprocessor = new PBPPreprocessor(pipeline.configuration.seed);

const input = cleanString(pipeline.prompts.prompt);
for(const block of input.split(/\n\n+/)) {
	preprocessor.handleBlock(block, block => commandHandler.handleBlock(block));
}