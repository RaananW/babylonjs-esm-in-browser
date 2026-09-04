import { type Nullable, type Scene, type EffectWrapperCreationOptions } from "../index.js";
import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { Camera } from "../Cameras/camera.pure.js";
/**
 * @internal
 */
export declare class ThinSSAO2PostProcess extends EffectWrapper {
    private static readonly ORTHO_DEPTH_PROJECTION;
    private static readonly PERSPECTIVE_DEPTH_PROJECTION;
    static readonly FragmentUrl = "ssao2";
    static readonly Uniforms: string[];
    static readonly Samplers: string[];
    protected _gatherImports(useWebGPU: boolean, list: Promise<any>[]): void;
    camera: Nullable<Camera>;
    private _textureWidth;
    get textureWidth(): number;
    set textureWidth(width: number);
    private _textureHeight;
    get textureHeight(): number;
    set textureHeight(height: number);
    private _samples;
    set samples(n: number);
    get samples(): number;
    totalStrength: number;
    radius: number;
    maxZ: number;
    minZAspect: number;
    base: number;
    private _epsilon;
    private _normalsInWorldSpace;
    set normalsInWorldSpace(value: boolean);
    get normalsInWorldSpace(): boolean;
    set epsilon(n: number);
    get epsilon(): number;
    updateEffect(): void;
    private _scene;
    private _randomTexture;
    private _sampleSphere;
    private readonly _normalWorldToViewMatrix;
    private readonly _normalWorldToView;
    constructor(name: string, scene: Scene, options?: EffectWrapperCreationOptions);
    bind(noDefaultBindings?: boolean): void;
    dispose(): void;
    private _createRandomTexture;
    private _bits;
    private _radicalInverseVdC;
    private _hammersley;
    private _hemisphereSampleUniform;
    private _generateHemisphere;
    private _getDefinesForSSAO;
}
