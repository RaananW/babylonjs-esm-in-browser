import { type AbstractEngine } from "../Engines/abstractEngine.js";
import { type InternalTexture } from "../Materials/Textures/internalTexture.js";
import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { type IRenderTargetTexture, type RenderTargetWrapper } from "../Engines/renderTargetWrapper.js";
import { type ThinTexture } from "../Materials/Textures/thinTexture.js";
import { type Nullable } from "../types.js";
import { ShaderLanguage } from "../Materials/shaderLanguage.js";
/**
 * Conversion modes available when copying a texture into another one
 */
export declare enum ConversionMode {
    None = 0,
    ToLinearSpace = 1,
    ToGammaSpace = 2
}
/**
 * Class used for fast copy from one texture to another
 */
export declare class CopyTextureToTexture {
    private _engine;
    private _isDepthTexture;
    private _renderer;
    private _effectWrapper;
    private _source;
    private _conversion;
    private _lodLevel;
    /** Shader language used */
    protected _shaderLanguage: ShaderLanguage;
    /**
     * Gets the shader language
     */
    get shaderLanguage(): ShaderLanguage;
    /**
     * Gets the effect wrapper used for the copy
     */
    get effectWrapper(): EffectWrapper;
    /**
     * Gets or sets the source texture
     */
    get source(): InternalTexture | ThinTexture;
    set source(texture: InternalTexture | ThinTexture);
    /**
     * Gets or sets the LOD level to copy from the source texture
     */
    get lodLevel(): number;
    set lodLevel(level: number);
    private _textureIsInternal;
    /**
     * Constructs a new instance of the class
     * @param engine The engine to use for the copy
     * @param isDepthTexture True means that we should write (using gl_FragDepth) into the depth texture attached to the destination (default: false)
     * @param sameSizeCopy True means that the copy will be done without any sampling (more efficient, but requires the source and destination to be of the same size) (default: false)
     */
    constructor(engine: AbstractEngine, isDepthTexture?: boolean, sameSizeCopy?: boolean);
    private _shadersLoaded;
    private _initShaderSourceAsync;
    /**
     * Indicates if the effect is ready to be used for the copy
     * @returns true if "copy" can be called without delay, else false
     */
    isReady(): boolean;
    /**
     * Copy one texture into another
     * @param source The source texture
     * @param destination The destination texture. If null, copy the source to the currently bound framebuffer
     * @param conversion The conversion mode that should be applied when copying
     * @param lod The LOD level to copy from the source texture
     * @returns
     */
    copy(source: InternalTexture | ThinTexture, destination?: Nullable<RenderTargetWrapper | IRenderTargetTexture>, conversion?: ConversionMode, lod?: number): boolean;
    /**
     * Releases all the resources used by the class
     */
    dispose(): void;
}
