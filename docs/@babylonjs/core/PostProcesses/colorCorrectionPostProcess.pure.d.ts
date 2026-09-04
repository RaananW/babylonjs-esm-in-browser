/** This file must only contain pure code and pure imports */
import { type PostProcessOptions, PostProcess } from "./postProcess.pure.js";
import { type AbstractEngine } from "../Engines/abstractEngine.pure.js";
import { type Camera } from "../Cameras/camera.pure.js";
import { type Nullable } from "../types.js";
import { type Scene } from "../scene.pure.js";
import { ThinColorCorrectionPostProcess } from "./thinColorCorrectionPostProcess.js";
/**
 *
 * This post-process allows the modification of rendered colors by using
 * a 'look-up table' (LUT). This effect is also called Color Grading.
 *
 * The object needs to be provided an url to a texture containing the color
 * look-up table: the texture must be 256 pixels wide and 16 pixels high.
 * Use an image editing software to tweak the LUT to match your needs.
 *
 * For an example of a color LUT, see here:
 * @see http://udn.epicgames.com/Three/rsrc/Three/ColorGrading/RGBTable16x1.png
 * For explanations on color grading, see here:
 * @see http://udn.epicgames.com/Three/ColorGrading.html
 *
 */
export declare class ColorCorrectionPostProcess extends PostProcess {
    /**
     * Gets the color table url used to create the LUT texture
     */
    get colorTableUrl(): string;
    /**
     * Gets a string identifying the name of the class
     * @returns "ColorCorrectionPostProcess" string
     */
    getClassName(): string;
    protected _effectWrapper: ThinColorCorrectionPostProcess;
    constructor(name: string, colorTableUrl: string, options: number | PostProcessOptions, camera: Nullable<Camera>, samplingMode?: number, engine?: AbstractEngine, reusable?: boolean);
    /**
     * @internal
     */
    static _Parse(parsedPostProcess: any, targetCamera: Camera, scene: Scene, rootUrl: string): Nullable<ColorCorrectionPostProcess>;
}
/**
 * Register side effects for colorCorrectionPostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterColorCorrectionPostProcess(): void;
