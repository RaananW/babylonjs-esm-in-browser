/** This file must only contain pure code and pure imports */
import { Camera } from "../Cameras/camera.pure.js";
import { type PostProcessOptions, PostProcess } from "./postProcess.pure.js";
import { type Nullable } from "../types.js";
import { type AbstractEngine } from "../Engines/abstractEngine.pure.js";
import { type ThinTonemapPostProcessOptions, type TonemappingOperator, ThinTonemapPostProcess } from "./thinTonemapPostProcess.js";
import { type Scene } from "../scene.pure.js";
export type ToneMapPostProcessOptions = ThinTonemapPostProcessOptions & PostProcessOptions;
/**
 * Defines a post process to apply tone mapping
 */
export declare class TonemapPostProcess extends PostProcess {
    /**
     * Defines the required exposure adjustment
     */
    get exposureAdjustment(): number;
    set exposureAdjustment(value: number);
    /**
     * Gets the operator used for tonemapping
     */
    get operator(): TonemappingOperator;
    /**
     * Gets a string identifying the name of the class
     * @returns "TonemapPostProcess" string
     */
    getClassName(): string;
    protected _effectWrapper: ThinTonemapPostProcess;
    /**
     * Creates a new TonemapPostProcess
     * @param name defines the name of the postprocess
     * @param operator defines the operator to use
     * @param exposureAdjustment defines the required exposure adjustment
     * @param camera defines the camera to use (can be null)
     * @param samplingMode defines the required sampling mode (BABYLON.Texture.BILINEAR_SAMPLINGMODE by default)
     * @param engine defines the hosting engine (can be ignore if camera is set)
     * @param textureType defines the texture format to use (BABYLON.Engine.TEXTURETYPE_UNSIGNED_BYTE by default)
     * @param reusable If the post process can be reused on the same frame. (default: false)
     */
    constructor(name: string, operator: TonemappingOperator, exposureAdjustment: number, camera: Nullable<Camera> | ToneMapPostProcessOptions, samplingMode?: number, engine?: AbstractEngine, textureType?: number, reusable?: boolean);
    /**
     * @internal
     */
    static _Parse(parsedPostProcess: any, targetCamera: Camera, scene: Scene, rootUrl: string): Nullable<TonemapPostProcess>;
}
/**
 * Register side effects for tonemapPostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterTonemapPostProcess(): void;
