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
class BasePreprocessor {
    constructor() {
        this.localIndex = 1;
        this.globalIndex = 1;
    }
    handleBlock(block, handler) {
        this.localIndex = 1;
        const list = [block];
        while (list.length) {
            const current = list.pop();
            const match = current.match(/{[^{}]+}/);
            if (match) {
                const original = match[0];
                try {
                    const result = this.handleWildcard(original);
                    for (const replacement of result.reverse()) {
                        list.push(current.replace(original, replacement));
                    }
                }
                catch (message) {
                    console.log(`Error at wildcard: ${original}`);
                    console.log(`Error message: ${message}`);
                }
            }
            else {
                handler(current);
                ++this.localIndex;
                ++this.globalIndex;
            }
        }
    }
    handleWildcard(original) {
        let parts;
        if (parts = original.match(/{@(\w+)=(.*)}/)) {
            return this.handleAssignment(parts[1], parts[2]);
        }
        if (original.match(/\+/)) {
            return this.handleAll(original.substring(1, original.length - 1));
        }
        if (original.match(/\|/)) {
            return this.handleSelect(original.substring(1, original.length - 1));
        }
        if (parts = original.match(/{(\+?\d+)}/)) {
            const count = parseInt(parts[1]);
            return this.handleTimes(count, 1);
        }
        if (parts = original.match(/{([+-]?\d+\.?\d*|[+-]?\.\d+):([+-]?\d+\.?\d*|[+-]?\.\d+):([+-]?\d+\.?\d*|[+-]?\.\d+)}/)) {
            const start = parseFloat(parts[1]);
            const limit = parseFloat(parts[2]);
            const step = parseFloat(parts[3]);
            return this.handleFor(start, limit, step);
        }
        if (original.match(/{@/)) {
            return this.handleFunction(original.substring(2, original.length - 1));
        }
        throw "Wrong wildcard format.";
    }
    handleAssignment(name, value) {
        if (name in this.wildcards) {
            throw "Trying to override function.";
        }
        value = value.trim();
        this.variables[name] = value;
        return [value];
    }
    handleAll(content) {
        return content.split("+").map(value => value.trim());
    }
    handleSelect(content) {
        const options = content.split("|").map(value => value.trim());
        const value = options[this.random.next() % options.length];
        return [value];
    }
    handleTimes(count, digits) {
        const result = [];
        for (let i = 0; i < count; ++i) {
            result.push(formatIndex(i + 1, digits));
        }
        return result;
    }
    handleFor(start, limit, step) {
        const result = [];
        step = Math.sign(limit - start) * Math.abs(step);
        if (step > 0) {
            for (let i = start; i < limit + BasePreprocessor.limitThreshold; i += step) {
                result.push(String(i));
            }
        }
        else if (step < 0) {
            for (let i = start; i > limit - BasePreprocessor.limitThreshold; i += step) {
                result.push(String(i));
            }
        }
        else {
            throw "Step should not be 0.";
        }
        return result;
    }
    handleFunction(content) {
        const parts = content.split(/\s*[:\s]\s*/);
        const name = parts[0];
        if (name in this.wildcards) {
            const parameters = new ParameterList(parts.slice(1));
            return this.wildcards[name](parameters);
        }
        if (name in this.variables) {
            const value = this.variables[name];
            return [value];
        }
        throw "No such wildcard.";
    }
}
BasePreprocessor.limitThreshold = 0.000001;
/// <reference path="../Library/BasePreprocessor.ts" />
class PBPPreprocessor extends BasePreprocessor {
    constructor(seed) {
        super();
        this.timesHandler = (parameters) => {
            return this.handleTimes(parameters.nextInt(), parameters.nextInt(1));
        };
        this.forHandler = (parameters) => {
            return this.handleFor(parameters.nextFloat(), parameters.nextFloat(), parameters.nextFloat());
        };
        this.randomDigitsHandler = (parameters) => {
            let result = "";
            for (let i = 0; i < parameters.nextInt(); ++i) {
                result += String.fromCharCode(48 + this.random.next() % 10);
            }
            return [result];
        };
        this.randomLettersHandler = (parameters) => {
            let result = "";
            for (let i = 0; i < parameters.nextInt(); ++i) {
                result += String.fromCharCode(97 + this.random.next() % 25);
            }
            return [result];
        };
        this.localIndexHandler = (parameters) => {
            return [formatIndex(this.localIndex, parameters.nextInt(1))];
        };
        this.globalIndexHandler = (parameters) => {
            return [formatIndex(this.globalIndex, parameters.nextInt(1))];
        };
        this.wildcards = {
            "times": this.timesHandler,
            "for": this.forHandler,
            "randomDigits": this.randomDigitsHandler,
            "num": this.randomDigitsHandler,
            "randomLetters": this.randomLettersHandler,
            "word": this.randomLettersHandler,
            "localIndex": this.localIndexHandler,
            "i": this.localIndexHandler,
            "globalIndex": this.globalIndexHandler,
            "n": this.globalIndexHandler
        };
        this.variables = {};
        this.random = new XSRandom(seed);
    }
}
/// <reference path="../Library/DrawThings.d.ts" />
function prettyFormat(object) {
    return JSON.stringify(object, null, "\t");
}
function prettyPrint(object) {
    console.log(prettyFormat(object));
}
function getAllPropertyNames(object) {
    const result = [];
    let current = object;
    while (current) {
        result.push(...Object.getOwnPropertyNames(current));
        current = Object.getPrototypeOf(current);
    }
    return result;
}
function printProperties(object, propertyNames) {
    for (const name of propertyNames) {
        const value = object[name];
        if (typeof value == "object") {
            console.log(name + ": " + prettyFormat(value));
        }
        else {
            console.log(name + ": " + value);
        }
    }
}
function printOwnProperties(object) {
    printProperties(object, Object.getOwnPropertyNames(object));
}
function printAllProperties(object) {
    printProperties(object, getAllPropertyNames(object));
}
function cleanString(value) {
    return value.trim().replace(/\r\n|\r|\u2028/g, "\n");
}
class XSRandom {
    static next(seed) {
        seed = seed ^ (seed << 13);
        seed = seed ^ (seed >> 17);
        seed = seed ^ (seed << 5);
        return seed >>> 0;
    }
    constructor(seed) {
        this.seed = seed;
    }
    next() {
        const result = this.seed;
        this.seed = XSRandom.next(this.seed);
        return result;
    }
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
    aestheticScore: 6,
    negativeAestheticScore: 2,
    clipSkip: 1,
    zeroNegativePrompt: false,
    imagePriorSteps: 5,
    negativePromptForImagePrior: true,
    clipWeight: 1,
    batchCount: 1,
    batchSize: 1,
    stage2Guidance: 1,
    stage2Steps: 10,
    stage2Shift: 1,
    fps: 5,
    numFrames: 21,
    startFrameGuidance: 1,
    guidingFrameNoise: 0.02,
    motionScale: 127,
    tiledDecoding: false,
    decodingTileWidth: 512,
    decodingTileHeight: 512,
    decodingTileOverlap: 128,
    tiledDiffusion: false,
    diffusionTileHeight: 1536,
    diffusionTileOverlap: 256,
    diffusionTileWidth: 1536
};
class ParameterList {
    constructor(parameters) {
        this.parameters = parameters.filter(Boolean);
        this.count = 0;
    }
    nextString(fallBack = undefined) {
        if (this.parameters.length) {
            ++this.count;
            return this.parameters.shift();
        }
        if (fallBack === undefined) {
            throw `String parameter at ${this.count} is missing.`;
        }
        return fallBack;
    }
    nextFloat(fallBack = undefined) {
        if (this.parameters.length) {
            ++this.count;
            const result = parseFloat(this.parameters.shift());
            if (isNaN(result)) {
                throw `Parameter at ${this.count} is not a number.`;
            }
            return result;
        }
        if (fallBack === undefined) {
            throw `Number parameter at ${this.count} is missing.`;
        }
        return fallBack;
    }
    nextInt(fallBack = undefined) {
        if (this.parameters.length) {
            ++this.count;
            const result = parseInt(this.parameters.shift());
            if (isNaN(result)) {
                throw `Parameter at ${this.count} is not an integer.`;
            }
            return result;
        }
        if (fallBack === undefined) {
            throw `Integer parameter at ${this.count} is missing.`;
        }
        return fallBack;
    }
    nextBool(fallBack = undefined) {
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
        if (fallBack === undefined) {
            throw `Boolean parameter at ${this.count} is missing.`;
        }
        return fallBack;
    }
    checkEmpty(name) {
        if (this.parameters.length) {
            console.log(`Too many arguments for ${name} command.`);
        }
    }
}
/// <reference path="ParameterList.ts" />
class BaseCommandEngine {
    handleBlock(block) {
        for (const line of block.split("\n")) {
            this.handleLine(line.trim());
        }
        this.handleEnd();
    }
    handleLine(line) {
        if (line.startsWith("//")) {
            console.log(line.substring(2).trim());
        }
        else if (line.startsWith("/")) {
            try {
                this.handleCommand(line.substring(1).trim());
            }
            catch (message) {
                if (message == "ABORT") {
                    throw "ABORT";
                }
                console.log(`Error at line: ${line}`);
                console.log(`Error message: ${message}`);
            }
        }
        else if (line.startsWith("-")) {
            line = line.substring(1).trim();
            if (line) {
                this.handleNegative(this.cleanLine(line));
            }
        }
        else if (line) {
            this.handlePositive(this.cleanLine(line));
        }
    }
    handleCommand(line) {
        const parts = line.split(/\s*[:\s]\s*/);
        const name = parts[0];
        if (name in this.commands) {
            const parameters = new ParameterList(parts.slice(1));
            this.commands[name](parameters);
            parameters.checkEmpty(name);
        }
        else {
            throw "No such command.";
        }
    }
    cleanLine(line) {
        return line
            .replace(/\s+/g, " ")
            .replace(/\s\./g, ".")
            .replace(/\.+/g, ".")
            .replace(/\s,/g, ",")
            .replace(/,+/g, ",");
    }
}
class SimpleCatalogue {
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
    handle(value) {
        throw `No such ${this.name} registered in catalogue: ${value}`;
    }
}
class CKPTCatalogue extends SimpleCatalogue {
    handle(value) {
        if (value.endsWith(".ckpt")) {
            return value;
        }
        throw `No such ${this.name} registered in catalogue (nor is it a ckpt name): ${value}`;
    }
}
class IntCatalogue extends SimpleCatalogue {
    handle(value) {
        const result = parseInt(value);
        if (isNaN(result)) {
            throw `No such ${this.name} registered in catalogue (nor is it an integer): ${value}`;
        }
        return result;
    }
}
/// <reference path="../Library/Catalogue.ts" />
const modelCatalogue = new CKPTCatalogue("model", {
    "LCM-SSD-1B-1.0": "lcm_ssd_1b_1_0_f16.ckpt",
    "SDXL-Turbo-1.0": "sdxl_turbo_1_0_f16.ckpt",
    "ZAMix-RV-Base": "zamix_rv_base_f16.ckpt",
    "ZAMix-RV-Fast": "zamix_rv_fast_f16.ckpt",
    "ZAMix-RV-Ultra": "zamix_rv_ultra_f16.ckpt",
    "ZAMix-DS-Base": "zamix_ds_base_f16.ckpt",
    "ZAMix-DS-Fast": "zamix_ds_fast_f16.ckpt",
    "ZAMix-DS-Ultra": "zamix_ds_ultra_f16.ckpt",
    "RealVisXL-Base": "realvisxl_base_f16.ckpt",
    "RealVisXL-Lightning": "realvisxl_lightning_f16.ckpt",
    "DreamShaper-XL-Base": "dreamshaper_xl_base_f16.ckpt",
    "DreamShaper-XL-Turbo": "dreamshaper_xl_turbo_f16.ckpt",
    "Realistic-Vision-5.1-Base": "realistic_vision_5_1_base_f16.ckpt",
    "Realistic-Vision-5.1-Fast": "realistic_vision_5_1_fast_f16.ckpt",
    "Realistic-Vision-5.1-Ultra": "realistic_vision_5_1_ultra_f16.ckpt",
    "CyberRealistic-Classic-1.6-Base": "cyberrealistic_classic_1_6_base_f16.ckpt",
    "CyberRealistic-Classic-2.0-Base": "cyberrealistic_classic_2_0_base_f16.ckpt",
    "CyberRealistic-Classic-2.0-Fast": "cyberrealistic_classic_2_0_fast_f16.ckpt",
    "CyberRealistic-Classic-2.0-Ultra": "cyberrealistic_classic_2_0_ultra_f16.ckpt",
    "DreamShaper-8.0-Base": "dreamshaper_8_0_base_f16.ckpt",
    "DreamShaper-8.0-Fast": "dreamshaper_8_0_fast_f16.ckpt",
    "DreamShaper-8.0-Ultra": "dreamshaper_8_0_ultra_f16.ckpt",
    disabled: null
});
const loraCatalogue = new CKPTCatalogue("LoRA", {
    "LCM-SDXL-LoRA": "lcm_sdxl_lora_f16.ckpt",
    "TCD-SDXL-LoRA": "tcd_sdxl_lora_f16.ckpt",
    "Lightning-SDXL-8-LoRA": "lightning_sdxl_8_lora_f16.ckpt",
    "Hyper-SDXL-8-LoRA": "hyper_sdxl_8_lora_f16.ckpt",
    "LCM-SD-15-LoRA": "lcm_sd_15_lora_f16.ckpt",
    "TCD-SD-15-LoRA": "tcd_sd_15_lora_f16.ckpt",
    "Hyper-SD-15-8-LoRA": "hyper_sd_15_8_lora_f16.ckpt",
    "Add-Brightness": "add_brightness_lora_f16.ckpt",
    "TO8-Contrast": "to8_contrast_lora_f16.ckpt",
    "EPI-Noise-OS": "epi_noise_os_lora_f16.ckpt",
    "Schmanzy-SDXL": "schmanzy_sdxl_lora_f16.ckpt",
    "Papercut-SDX": "papercut_sdxl_lora_f16.ckpt",
    disabled: null
});
const controlCatalogue = new CKPTCatalogue("control", {
    cannyXL: "controlnet_control_lora_canny_r128_f16.ckpt",
    depthXL: "controlnet_control_lora_depth_r128_f16.ckpt",
    recolorXL: "controlnet_control_lora_recolor_r128_f16.ckpt",
    sketchXL: "controlnet_control_lora_sketch_r128_f16.ckpt",
    IPPlusXL: "ip_adapter_plus_xl_base_open_clip_h14_f16.ckpt",
    IPFaceXL: "ip_adapter_plus_face_xl_base_open_clip_h14_f16.ckpt",
    canny: "controlnet_canny_1.x_v1.1_f16.ckpt",
    depth: "controlnet_depth_1.x_v1.1_f16.ckpt",
    inpaint: "controlnet_inpaint_1.x_v1.1_f16.ckpt",
    lineart: "controlnet_lineart_1.x_v1.1_f16.ckpt",
    tile: "controlnet_tile_1.x_v1.1_f16.ckpt",
    IPPlus: "ip_adapter_plus_sd_v1.x_open_clip_h14_f16.ckpt",
    IPFace: "ip_adapter_full_face_sd_v1.x_open_clip_h14_f16.ckpt",
    disabled: null
});
const seedModeCatalogue = new IntCatalogue("seed mode", {
    legacy: 0,
    torch: 1,
    default: 2,
    nvidia: 3
});
const upscalerCatalogue = new CKPTCatalogue("upscaler", {
    "Real-ESRGAN-X2": "realesrgan_x2plus_f16.ckpt",
    "Real-ESRGAN-X4": "realesrgan_x4plus_f16.ckpt",
    "Real-ESRGAN-Anime": "realesrgan_x4plus_anime_f16.ckpt",
    "Universal-Upscaler": "esrgan_4x_universal_upscaler_v2_sharp_f16.ckpt",
    "Remacri": "remacri_4x_f16.ckpt",
    "UltraSharp": "4x_ultrasharp_f16.ckpt",
    disabled: null
});
const samplerCatalogue = new IntCatalogue("sampler", {
    "DPM++-2M-Karras": 0,
    "Euler-Ancestral": 1,
    "DDIM": 2,
    "PLMS": 3,
    "DPM++-SDE-Karras": 4,
    "UniPC": 5,
    "LCM": 6,
    "Euler-A-SubStep": 7,
    "DPM++-SDE-SubStep": 8,
    "TCD": 9,
    "Euler-A-Trailing": 10,
    "DPM++-SDE-Trailing": 11
});
const faceRestorationCatalogue = new CKPTCatalogue("face restoration", {
    RestoreFormer: "restoreformer_v1.0_f16.ckpt",
    disabled: null
});
/// <reference path="../Library/CommonUtil.ts" />
/// <reference path="../Library/DefaultConfiguration.ts" />
/// <reference path="../Library/BaseCommandEngine.ts" />
/// <reference path="Catalogue.ts" />
class PBPCommandEngine extends BaseCommandEngine {
    constructor(configuration, negative) {
        super();
        this.handleDefaults = (parameters) => {
            this.configuration = { ...this.configuration, ...defaultConfiguration };
        };
        this.handleReset = (parameters) => {
            this.configuration = { ...this.initialConfiguration };
            this.lastNegative = this.initialNegative;
            this.negative = null;
        };
        this.handleEmpty = (parameters) => {
            this.positive = "";
            this.negative = "";
        };
        this.handleLoad = (parameters) => {
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
        };
        this.handlePickFile = (parameters) => {
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
        };
        this.handlePickPhoto = (parameters) => {
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
        };
        this.handleClear = (parameters) => {
            canvas.clear();
        };
        this.handleLoRA = (parameters) => {
            const index = parameters.nextInt();
            if (index < 1) {
                throw "LoRA indexing should start from 1.";
            }
            this.configuration.loras[index - 1] = {
                file: loraCatalogue.get(parameters.nextString()),
                weight: parameters.nextFloat(1)
            };
        };
        this.handleControl = (parameters) => {
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
        };
        this.handleSeed = (parameters) => {
            this.configuration.seed = parameters.nextInt(XSRandom.next(this.configuration.seed));
        };
        this.handleSize = (parameters) => {
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
        };
        this.handleAspect = (parameters) => {
            const aspect = parameters.nextString();
            if (aspect == "horizontal") {
                this.swapHorizontal("width", "height");
                this.swapHorizontal("originalImageWidth", "originalImageHeight");
                this.swapHorizontal("targetImageWidth", "targetImageHeight");
                this.swapHorizontal("negativeOriginalImageWidth", "negativeOriginalImageHeight");
                this.swapHorizontal("hiresFixWidth", "hiresFixHeight");
            }
            else if (aspect == "vertical") {
                this.swapVertical("width", "height");
                this.swapVertical("originalImageWidth", "originalImageHeight");
                this.swapVertical("targetImageWidth", "targetImageHeight");
                this.swapVertical("negativeOriginalImageWidth", "negativeOriginalImageHeight");
                this.swapVertical("hiresFixWidth", "hiresFixHeight");
            }
            else {
                throw "Aspect should be horizontal or vertical.";
            }
        };
        this.handleGenerate = (parameters) => {
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
            }
            catch (_a) {
                throw "ABORT";
            }
        };
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
    buildAPIMap() {
        const result = {};
        for (const key in defaultConfiguration) {
            switch (typeof defaultConfiguration[key]) {
                case "string":
                    result[key] = (parameters) => this.configuration[key] = parameters.nextString();
                    break;
                case "number":
                    result[key] = (parameters) => this.configuration[key] = parameters.nextFloat();
                    break;
                case "boolean":
                    result[key] = (parameters) => this.configuration[key] = parameters.nextBool();
                    break;
            }
        }
        return result;
    }
    buildCustomMap() {
        return {
            generate: this.handleGenerate,
            defaults: this.handleDefaults,
            reset: this.handleReset,
            empty: this.handleEmpty,
            load: this.handleLoad,
            pickFile: this.handlePickFile,
            pickPhoto: this.handlePickPhoto,
            clear: this.handleClear,
            model: this.createStandardHandler("model", modelCatalogue, undefined),
            refinerModel: this.createStandardHandler("refinerModel", modelCatalogue, undefined),
            refiner: this.createStandardHandler("refinerModel", modelCatalogue, undefined, "refinerStart", "float", undefined),
            lora: this.handleLoRA,
            control: this.handleControl,
            sampler: this.createStandardHandler("sampler", samplerCatalogue, undefined),
            cfg: this.createStandardHandler("guidanceScale", "float", undefined),
            seed: this.handleSeed,
            seedMode: this.createStandardHandler("seedMode", seedModeCatalogue, undefined),
            size: this.handleSize,
            aspect: this.handleAspect,
            enableHiResFix: this.createStandardHandler("hiresFix", "const", true),
            setHiResFix: this.createStandardHandler("hiresFix", "const", true, "hiresFixWidth", "int", undefined, "hiresFixHeight", "int", undefined, "hiresFixStrength", "float", undefined),
            disableHiResFix: this.createStandardHandler("hiresFix", "const", false),
            originalSize: this.createStandardHandler("originalImageWidth", "int", undefined, "originalImageHeight", "int", undefined),
            targetSize: this.createStandardHandler("targetImageWidth", "int", undefined, "targetImageHeight", "int", undefined),
            negativeSize: this.createStandardHandler("negativeOriginalImageWidth", "int", undefined, "negativeOriginalImageHeight", "int", undefined),
            crop: this.createStandardHandler("cropTop", "int", undefined, "cropLeft", "int", undefined),
            upscaler: this.createStandardHandler("upscaler", upscalerCatalogue, undefined),
            faceRestoration: this.createStandardHandler("faceRestoration", faceRestorationCatalogue, undefined),
            aesthetic: this.createStandardHandler("aestheticScore", "float", undefined, "negativeAestheticScore", "float", undefined),
            enableZeroNegative: this.createStandardHandler("zeroNegativePrompt", "const", true),
            disableZeroNegative: this.createStandardHandler("zeroNegativePrompt", "const", false)
        };
    }
    createStandardHandler(...targets) {
        return (parameterList) => {
            let i = 0;
            while (i < targets.length) {
                const key = targets[i++];
                const type = targets[i++];
                const fallback = targets[i++];
                if (type instanceof SimpleCatalogue) {
                    this.configuration[key] = type.get(parameterList.nextString(fallback));
                }
                else if (type == "const") {
                    this.configuration[key] = fallback;
                }
                else if (type == "string") {
                    this.configuration[key] = parameterList.nextString(fallback);
                }
                else if (type == "float") {
                    this.configuration[key] = parameterList.nextFloat(fallback);
                }
                else if (type == "int") {
                    this.configuration[key] = parameterList.nextInt(fallback);
                }
                else {
                    this.configuration[key] = fallback;
                }
            }
        };
    }
    swapHorizontal(widthKey, heightKey) {
        const width = this.configuration[widthKey];
        this.configuration[widthKey] = Math.max(width, this.configuration[heightKey]);
        this.configuration[heightKey] = Math.min(width, this.configuration[heightKey]);
    }
    swapVertical(widthKey, heightKey) {
        const width = this.configuration[widthKey];
        this.configuration[widthKey] = Math.max(width, this.configuration[heightKey]);
        this.configuration[heightKey] = Math.min(width, this.configuration[heightKey]);
    }
    handlePositive(line) {
        if (this.positive) {
            this.positive += "\n";
            this.positive += line;
        }
        else {
            this.positive = line;
        }
    }
    handleNegative(line) {
        if (this.negative) {
            this.negative += "\n";
            this.negative += line;
        }
        else {
            this.negative = line;
        }
    }
    handleEnd() {
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
            }
            catch (_a) {
                throw "ABORT";
            }
        }
    }
}
/// <reference path="TopComment.ts" />
/// <reference path="PBPPreprocessor.ts" />
/// <reference path="PBPCommandEngine.ts" />
const commandHandler = new PBPCommandEngine(pipeline.configuration, pipeline.prompts.negativePrompt);
const preprocessor = new PBPPreprocessor(pipeline.configuration.seed);
const input = cleanString(pipeline.prompts.prompt);
for (const block of input.split(/\n\n+/)) {
    preprocessor.handleBlock(block, block => commandHandler.handleBlock(block));
}
