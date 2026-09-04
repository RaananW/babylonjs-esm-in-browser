/** This file must only contain pure code and pure imports */
import { type Nullable } from "../types.js";
import { type Camera } from "../Cameras/camera.pure.js";
import { type PostProcessOptions, PostProcess } from "./postProcess.pure.js";
import { type AbstractEngine } from "../Engines/abstractEngine.pure.js";
import { ThinFXAAPostProcess } from "./thinFXAAPostProcess.js";
import { type Scene } from "../scene.pure.js";
/**
 * Fxaa post process
 * @see https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/usePostProcesses#fxaa
 */
export declare class FxaaPostProcess extends PostProcess {
    /**
     * Gets a string identifying the name of the class
     * @returns "FxaaPostProcess" string
     */
    getClassName(): string;
    protected _effectWrapper: ThinFXAAPostProcess;
    constructor(name: string, options: number | PostProcessOptions, camera?: Nullable<Camera>, samplingMode?: number, engine?: AbstractEngine, reusable?: boolean, textureType?: number);
    /**
     * @internal
     */
    static _Parse(parsedPostProcess: any, targetCamera: Camera, scene: Scene, rootUrl: string): FxaaPostProcess;
}
/**
 * Register side effects for fxaaPostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFxaaPostProcess(): void;
