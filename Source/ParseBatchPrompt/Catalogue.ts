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