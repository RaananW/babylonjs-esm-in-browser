import { type Nullable, type EffectWrapperCreationOptions, type Scene } from "../index.js";
import { Camera } from "../Cameras/camera.pure.js";
import { Vector2 } from "../Maths/math.vector.pure.js";
import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
/**
 * Simple implementation of Temporal Anti-Aliasing (TAA).
 * This can be used to improve image quality for still pictures (screenshots for e.g.).
 */
export declare class ThinTAAPostProcess extends EffectWrapper {
    /**
     * The fragment shader url
     */
    static readonly FragmentUrl = "taa";
    /**
     * The list of uniforms used by the effect
     */
    static readonly Uniforms: string[];
    /**
     * The list of samplers used by the effect
     */
    static readonly Samplers: string[];
    protected _gatherImports(useWebGPU: boolean, list: Promise<any>[]): void;
    private _samples;
    /**
     * Number of accumulated samples (default: 8)
     */
    set samples(samples: number);
    get samples(): number;
    /**
     * The factor used to blend the history frame with current frame (default: 0.05)
     */
    factor: number;
    /**
     * The camera to use for the post process
     */
    camera: Nullable<Camera>;
    private _disabled;
    /**
     * Whether the TAA is disabled
     */
    get disabled(): boolean;
    set disabled(value: boolean);
    private _textureWidth;
    /**
     * The width of the texture in which to render
     */
    get textureWidth(): number;
    set textureWidth(width: number);
    private _textureHeight;
    /**
     * The height of the texture in which to render
     */
    get textureHeight(): number;
    set textureHeight(height: number);
    /**
     * Disable TAA on camera move (default: true).
     * You generally want to keep this enabled, otherwise you will get a ghost effect when the camera moves (but if it's what you want, go for it!)
     */
    disableOnCameraMove: boolean;
    private _reprojectHistory;
    /**
     * Enables reprojecting the history texture with a per-pixel velocity.
     * If set the "velocitySampler" has to be provided.
     */
    get reprojectHistory(): boolean;
    set reprojectHistory(reproject: boolean);
    private _clampHistory;
    /**
     * Clamps the history pixel to the min and max of the 3x3 pixels surrounding the target pixel.
     * This can help further reduce ghosting and artifacts.
     */
    get clampHistory(): boolean;
    set clampHistory(clamp: boolean);
    private _scene;
    private _hs;
    private _firstUpdate;
    private _taaMaterialManager;
    /**
     * Constructs a new TAA post process
     * @param name Name of the effect
     * @param scene The scene the post process belongs to
     * @param options Options to configure the effect
     */
    constructor(name: string, scene: Scene, options?: EffectWrapperCreationOptions);
    /** @internal */
    _reset(): void;
    /** @internal */
    _updateJitter(): void;
    protected _nextJitterOffset(output?: Vector2): Vector2;
    protected _updateProjectionMatrix(): void;
    bind(noDefaultBindings?: boolean): void;
    dispose(): void;
    private _updateEffect;
}
