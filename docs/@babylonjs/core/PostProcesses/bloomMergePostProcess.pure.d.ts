/** This file must only contain pure code and pure imports */
import { type PostProcessOptions, PostProcess } from "./postProcess.pure.js";
import { type Nullable } from "../types.js";
import { type AbstractEngine } from "../Engines/abstractEngine.pure.js";
import { type Camera } from "../Cameras/camera.pure.js";
import { ThinBloomMergePostProcess } from "./thinBloomMergePostProcess.js";
/**
 * The BloomMergePostProcess merges blurred images with the original based on the values of the circle of confusion.
 */
export declare class BloomMergePostProcess extends PostProcess {
    /** Weight of the bloom to be added to the original input. */
    get weight(): number;
    set weight(value: number);
    /**
     * Gets a string identifying the name of the class
     * @returns "BloomMergePostProcess" string
     */
    getClassName(): string;
    protected _effectWrapper: ThinBloomMergePostProcess;
    /**
     * Creates a new instance of @see BloomMergePostProcess
     * @param name The name of the effect.
     * @param originalFromInput Post process which's input will be used for the merge.
     * @param blurred Blurred highlights post process which's output will be used.
     * @param weight Weight of the bloom to be added to the original input.
     * @param options The required width/height ratio to downsize to before computing the render pass.
     * @param camera The camera to apply the render pass to.
     * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
     * @param engine The engine which the post process will be applied. (default: current engine)
     * @param reusable If the post process can be reused on the same frame. (default: false)
     * @param textureType Type of textures used when performing the post process. (default: 0)
     * @param blockCompilation If compilation of the shader should not be done in the constructor. The updateEffect method can be used to compile the shader at a later time. (default: false)
     */
    constructor(name: string, originalFromInput: PostProcess, blurred: PostProcess, weight: number, options: number | PostProcessOptions, camera?: Nullable<Camera>, samplingMode?: number, engine?: AbstractEngine, reusable?: boolean, textureType?: number, blockCompilation?: boolean);
}
/**
 * Register side effects for bloomMergePostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterBloomMergePostProcess(): void;
