import { type Nullable, type AbstractEngine, type EffectWrapperCreationOptions } from "../index.js";
import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
/**
 * Post process used to apply a sharpen effect
 */
export declare class ThinSharpenPostProcess extends EffectWrapper {
    /**
     * The fragment shader url
     */
    static readonly FragmentUrl = "sharpen";
    /**
     * The list of uniforms used by the effect
     */
    static readonly Uniforms: string[];
    protected _gatherImports(useWebGPU: boolean, list: Promise<any>[]): void;
    /**
     * Constructs a new sharpen post process
     * @param name Name of the effect
     * @param engine Engine to use to render the effect. If not provided, the last created engine will be used
     * @param options Options to configure the effect
     */
    constructor(name: string, engine?: Nullable<AbstractEngine>, options?: EffectWrapperCreationOptions);
    /**
     * How much of the original color should be applied. Setting this to 0 will display edge detection. (default: 1)
     */
    colorAmount: number;
    /**
     * How much sharpness should be applied (default: 0.3)
     */
    edgeAmount: number;
    /**
     * The width of the source texture
     */
    textureWidth: number;
    /**
     * The height of the source texture
     */
    textureHeight: number;
    bind(noDefaultBindings?: boolean): void;
}
