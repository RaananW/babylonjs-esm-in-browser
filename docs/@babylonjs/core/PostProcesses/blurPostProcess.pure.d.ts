/** This file must only contain pure code and pure imports */
import { type Vector2 } from "../Maths/math.vector.pure.js";
import { type Nullable } from "../types.js";
import { type PostProcessOptions, PostProcess } from "./postProcess.pure.js";
import { type Camera } from "../Cameras/camera.pure.js";
import { type Effect } from "../Materials/effect.pure.js";
import { type Scene } from "../scene.pure.js";
import { type AbstractEngine } from "../Engines/abstractEngine.pure.js";
import { ThinBlurPostProcess } from "./thinBlurPostProcess.js";
/**
 * The Blur Post Process which blurs an image based on a kernel and direction.
 * Can be used twice in x and y directions to perform a gaussian blur in two passes.
 */
export declare class BlurPostProcess extends PostProcess {
    /** The direction in which to blur the image. */
    get direction(): Vector2;
    set direction(value: Vector2);
    /**
     * Sets the length in pixels of the blur sample region
     */
    set kernel(v: number);
    /**
     * Gets the length in pixels of the blur sample region
     */
    get kernel(): number;
    /**
     * Sets whether or not the blur needs to unpack/repack floats
     */
    set packedFloat(v: boolean);
    /**
     * Gets whether or not the blur is unpacking/repacking floats
     */
    get packedFloat(): boolean;
    /**
     * Gets a string identifying the name of the class
     * @returns "BlurPostProcess" string
     */
    getClassName(): string;
    protected _effectWrapper: ThinBlurPostProcess;
    /**
     * Creates a new instance BlurPostProcess
     * @param name The name of the effect.
     * @param direction The direction in which to blur the image.
     * @param kernel The size of the kernel to be used when computing the blur. eg. Size of 3 will blur the center pixel by 2 pixels surrounding it.
     * @param options The required width/height ratio to downsize to before computing the render pass. (Use 1.0 for full size)
     * @param camera The camera to apply the render pass to.
     * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
     * @param engine The engine which the post process will be applied. (default: current engine)
     * @param reusable If the post process can be reused on the same frame. (default: false)
     * @param textureType Type of textures used when performing the post process. (default: 0)
     * @param defines
     * @param blockCompilation If compilation of the shader should not be done in the constructor. The updateEffect method can be used to compile the shader at a later time. (default: false)
     * @param textureFormat Format of textures used when performing the post process. (default: TEXTUREFORMAT_RGBA)
     */
    constructor(name: string, direction: Vector2, kernel: number, options: number | PostProcessOptions, camera?: Nullable<Camera>, samplingMode?: number, engine?: AbstractEngine, reusable?: boolean, textureType?: number, defines?: string, blockCompilation?: boolean, textureFormat?: number);
    /**
     * Updates the effect with the current post process compile time values and recompiles the shader
     * @param _defines the post process defines
     * @param _uniforms the post process uniforms
     * @param _samplers the post process samplers
     * @param _indexParameters the index parameters
     * @param onCompiled callback called when the shader is compiled
     * @param onError callback called if there is an error
     */
    updateEffect(_defines?: Nullable<string>, _uniforms?: Nullable<string[]>, _samplers?: Nullable<string[]>, _indexParameters?: any, onCompiled?: (effect: Effect) => void, onError?: (effect: Effect, errors: string) => void): void;
    /**
     * @internal
     */
    static _Parse(parsedPostProcess: any, targetCamera: Camera, scene: Scene, rootUrl: string): Nullable<BlurPostProcess>;
}
/**
 * Register side effects for blurPostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterBlurPostProcess(): void;
