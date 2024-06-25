/// <reference path="../Library/Catalogue.ts" />

const modelCatalogue = new CKPTCatalogue("model", {
	"LCM-SSD-1B-1.0": "lcm_ssd_1b_1.0_f16.ckpt",
	"SDXL-Turbo-1.0": "sdxl_turbo_1.0_f16.ckpt",
	"ZAMix-DS1-Base": "zamix_ds1_base_f16.ckpt",
	"ZAMix-DS1-T35": "zamix_ds1_t35_f16.ckpt",
	"ZAMix-DS1-Fast": "zamix_ds1_fast_f16.ckpt",
	"ZAMix-RV1-Base": "zamix_rv1_base_f16.ckpt",
	"ZAMix-RV1-T35": "zamix_rv1_t35_f16.ckpt",
	"ZAMix-RV1-Fast": "zamix_rv1_fast_f16.ckpt",
	"ZAMix-DS2-Base": "zamix_ds2_base_f16.ckpt",
	"ZAMix-DS2-T35": "zamix_ds2_t35_f16.ckpt",
	"ZAMix-DS2-Fast": "zamix_ds2_fast_f16.ckpt",
	"ZAMix-RV2-Base": "zamix_rv2_base_f16.ckpt",
	"ZAMix-RV2-T35": "zamix_rv2_t35_f16.ckpt",
	"ZAMix-RV2-Fast": "zamix_rv2_fast_f16.ckpt",
	"DreamShaper-XL": "dreamshaper_xl_f16.ckpt",
	"RealVisXL-2.0": "realvisxl_2.0_f16.ckpt",
	"RealVisXL-4.0": "realvisxl_4.0_f16.ckpt",
	"NightVision-XL": "nightvision_xl_f16.ckpt",
	"SDXL-Flash-1.0": "sdxl_flash_1.0_f16.ckpt",
	"Realistic-Vision-5.1-Base": "realistic_vision_5_1_base_f16.ckpt",
	"Realistic-Vision-5.1-Fast": "realistic_vision_5_1_fast_f16.ckpt",
	"CyberRealistic-Classic-1.6-Base": "cyberrealistic_classic_1_6_base_f16.ckpt",
	"CyberRealistic-Classic-1.6-Fast": "cyberrealistic_classic_1_6_fast_f16.ckpt",
	"CyberRealistic-Classic-2.0-Base": "cyberrealistic_classic_2_0_base_f16.ckpt",
	"CyberRealistic-Classic-2.0-Fast": "cyberrealistic_classic_2_0_fast_f16.ckpt",
	"DreamShaper-8.0-Base": "dreamshaper_8_0_base_f16.ckpt",
	"DreamShaper-8.0-Fast": "dreamshaper_8_0_fast_f16.ckpt",
	disabled: null
});

const loraCatalogue = new CKPTCatalogue("LoRA", {
	"LCM-SDXL-LoRA": "lcm_sdxl_lora_f16.ckpt",
	"SDXL-Turbo-LoRA": "sdxl_turbo_lora_f16.ckpt",
	"TCD-SDXL-LoRA": "tcd_sdxl_lora_f16.ckpt",
	"Lightning-SDXL-8-LoRA": "lightning_sdxl_8_lora_f16.ckpt",
	"Hyper-SDXL-8-LoRA": "hyper_sdxl_8_lora_f16.ckpt",
	"Schmanzy-SDXL": "schmanzy_sdxl_lora_f16.ckpt",
	"Papercut-SDXL": "papercut_sdxl_lora_f16.ckpt",
	"LCM-SD-15-LoRA": "lcm_sd_15_lora_f16.ckpt",
	"TCD-SD-15-LoRA": "tcd_sd_15_lora_f16.ckpt",
	"Hyper-SD-15-8-LoRA": "hyper_sd_15_8_lora_f16.ckpt",
	"Add-Brightness": "add_brightness_lora_f16.ckpt",
	"TO8-Contrast": "to8_contrast_lora_f16.ckpt",
	"EPI-Noise-OS": "epi_noise_os_lora_f16.ckpt",
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
	"DPM++-SDE-Trailing": 11,
	"DPM++-2M-AYS": 12,
	"Euler-A-AYS": 13,
	"DPM++-SDE-AYS": 14,
	"DPM++-2M-Trailing": 15,
	"DDIM-Trailing": 16
});

const faceRestorationCatalogue = new CKPTCatalogue("face restoration", {
	RestoreFormer: "restoreformer_v1.0_f16.ckpt",
	disabled: null
});