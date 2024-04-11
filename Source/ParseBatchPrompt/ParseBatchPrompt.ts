/*
Parse Batch Prompt
Version: Beta 0.10.1
https://github.com/ZolAnder85/draw-things-scripts

Autor: @ZolAnder
https://github.com/ZolAnder85

This code is licensed under the MIT License:
https://github.com/ZolAnder85/draw-things-scripts/blob/main/LICENSE.txt

Manual:
https://github.com/ZolAnder85/draw-things-scripts/blob/main/Documents/ParseBatchPrompt.md

Credits:
Draw Things webpage:
https://drawthings.ai/
Draw Things author: @liuliu
https://github.com/liuliu
Draw Things API author: @Gooster
*/

/// <reference path="PBPPreprocessor.ts" />
/// <reference path="PBPCommandEngine.ts" />

const commandHandler = new PBPCommandEngine(pipeline.configuration, pipeline.prompts.negativePrompt);
const preprocessor = new PBPPreprocessor(pipeline.configuration.seed);

for(const block of cleanPrompt().split(/\n\n+/)) {
	preprocessor.handleBlock(block, block => commandHandler.handleBlock(block));
}