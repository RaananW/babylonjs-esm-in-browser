import { type AbstractEngine } from "../Engines/abstractEngine.js";
import { type Nullable } from "../types.js";
import { ShaderLanguage } from "../Materials/shaderLanguage.js";
import { BaseTexture } from "../Materials/Textures/baseTexture.pure.js";
/**
 * Class used for fast copy from one texture to another
 */
export declare class AreaLightTextureTools {
    private _engine;
    private _renderer;
    private _effectWrapper;
    private _source;
    private _scalingRange;
    private _kernelLibrary;
    private readonly _blurSize;
    private readonly _alphaFactor;
    /** Shader language used */
    protected _shaderLanguage: ShaderLanguage;
    /**
     * Gets the shader language
     */
    get shaderLanguage(): ShaderLanguage;
    private _textureIsInternal;
    /**
     * Constructs a new instance of the class
     * @param engine The engine to use for the copy
     */
    constructor(engine: AbstractEngine);
    private _shadersLoaded;
    private _createEffect;
    /**
     * Indicates if the effect is ready to be used for the copy
     * @returns true if "copy" can be called without delay, else false
     */
    isReady(): boolean;
    /**
     * Pre-processes the texture to be used with RectAreaLight emissionTexture.
     * @param source The texture to pre-process
     * @returns A promise that resolves with the pre-processed texture
     */
    processAsync(source: BaseTexture): Promise<Nullable<BaseTexture>>;
    private _scaleImageDownAsync;
    private _generateGaussianKernel;
    private _mirrorIndex;
    private _applyGaussianBlurRange;
    private _transposeImage;
    private _applyProgressiveBlurAsync;
    /**
     * Releases all the resources used by the class
     */
    dispose(): void;
}
