import { type EffectWrapperCreationOptions, type Nullable, type Scene } from "../index.js";
import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
/**
 * Post process used to apply color correction
 */
export declare class ThinColorCorrectionPostProcess extends EffectWrapper {
    private _colorTableTexture;
    /**
     * The fragment shader url
     */
    static readonly FragmentUrl = "colorCorrection";
    /**
     * The list of uniforms used by the effect
     */
    static readonly Samplers: string[];
    protected _gatherImports(useWebGPU: boolean, list: Promise<any>[]): void;
    /**
     * Constructs a new black and white post process
     * @param name Name of the effect
     * @param scene The scene the effect belongs to
     * @param colorTableUrl URL of the color table texture
     * @param options Options to configure the effect
     */
    constructor(name: string, scene: Nullable<Scene>, colorTableUrl: string, options?: EffectWrapperCreationOptions);
    /**
     * Gets the color table url used to create the LUT texture
     */
    readonly colorTableUrl: string;
    bind(noDefaultBindings?: boolean): void;
}
