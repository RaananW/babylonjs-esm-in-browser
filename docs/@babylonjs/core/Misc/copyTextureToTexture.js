import { EffectRenderer, EffectWrapper } from "../Materials/effectRenderer.pure.js";

/**
 * Conversion modes available when copying a texture into another one
 */
export var ConversionMode;
(function (ConversionMode) {
    ConversionMode[ConversionMode["None"] = 0] = "None";
    ConversionMode[ConversionMode["ToLinearSpace"] = 1] = "ToLinearSpace";
    ConversionMode[ConversionMode["ToGammaSpace"] = 2] = "ToGammaSpace";
})(ConversionMode || (ConversionMode = {}));
/**
 * Class used for fast copy from one texture to another
 */
export class CopyTextureToTexture {
    /**
     * Gets the shader language
     */
    get shaderLanguage() {
        return this._shaderLanguage;
    }
    /**
     * Gets the effect wrapper used for the copy
     */
    get effectWrapper() {
        return this._effectWrapper;
    }
    /**
     * Gets or sets the source texture
     */
    get source() {
        return this._source;
    }
    set source(texture) {
        this._source = texture;
    }
    /**
     * Gets or sets the LOD level to copy from the source texture
     */
    get lodLevel() {
        return this._lodLevel;
    }
    set lodLevel(level) {
        this._lodLevel = level;
    }
    _textureIsInternal(texture) {
        return texture.getInternalTexture === undefined;
    }
    /**
     * Constructs a new instance of the class
     * @param engine The engine to use for the copy
     * @param isDepthTexture True means that we should write (using gl_FragDepth) into the depth texture attached to the destination (default: false)
     * @param sameSizeCopy True means that the copy will be done without any sampling (more efficient, but requires the source and destination to be of the same size) (default: false)
     */
    constructor(engine, isDepthTexture = false, sameSizeCopy = false) {
        /** Shader language used */
        this._shaderLanguage = 0 /* ShaderLanguage.GLSL */;
        this._shadersLoaded = false;
        this._engine = engine;
        this._isDepthTexture = isDepthTexture;
        this._lodLevel = 0;
        this._conversion = 0 /* ConversionMode.None */;
        this._renderer = new EffectRenderer(engine);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._initShaderSourceAsync(isDepthTexture, sameSizeCopy);
    }
    async _initShaderSourceAsync(isDepthTexture, sameSizeCopy) {
        const engine = this._engine;
        if (engine.isWebGPU) {
            this._shaderLanguage = 1 /* ShaderLanguage.WGSL */;
            await import("../ShadersWGSL/copyTextureToTexture.fragment.js");
        }
        else {
            await import("../Shaders/copyTextureToTexture.fragment.js");
        }
        this._shadersLoaded = true;
        const defines = [];
        if (isDepthTexture) {
            defines.push("#define DEPTH_TEXTURE");
        }
        if (sameSizeCopy) {
            defines.push("#define NO_SAMPLER");
        }
        this._effectWrapper = new EffectWrapper({
            engine: engine,
            name: "CopyTextureToTexture",
            fragmentShader: "copyTextureToTexture",
            useShaderStore: true,
            uniformNames: ["conversion", "lodLevel"],
            samplerNames: ["textureSampler"],
            defines,
            shaderLanguage: this._shaderLanguage,
        });
        this._effectWrapper.onApplyObservable.add(() => {
            if (isDepthTexture) {
                engine.setState(false);
                engine.setDepthBuffer(true);
                engine.depthCullingState.depthMask = true;
                engine.depthCullingState.depthFunc = 519;
            }
            else {
                engine.depthCullingState.depthMask = false;
                // other states are already set by EffectRenderer.applyEffectWrapper
            }
            if (this._textureIsInternal(this._source)) {
                this._effectWrapper.effect._bindTexture("textureSampler", this._source);
            }
            else {
                this._effectWrapper.effect.setTexture("textureSampler", this._source);
            }
            this._effectWrapper.effect.setFloat("conversion", this._conversion);
            this._effectWrapper.effect.setFloat("lodLevel", this._lodLevel);
        });
    }
    /**
     * Indicates if the effect is ready to be used for the copy
     * @returns true if "copy" can be called without delay, else false
     */
    isReady() {
        return this._shadersLoaded && !!this._effectWrapper?.effect?.isReady();
    }
    /**
     * Copy one texture into another
     * @param source The source texture
     * @param destination The destination texture. If null, copy the source to the currently bound framebuffer
     * @param conversion The conversion mode that should be applied when copying
     * @param lod The LOD level to copy from the source texture
     * @returns
     */
    copy(source, destination = null, conversion = 0 /* ConversionMode.None */, lod = 0) {
        if (!this.isReady()) {
            return false;
        }
        this._source = source;
        this._conversion = conversion;
        this._lodLevel = lod;
        const engineDepthFunc = this._engine.getDepthFunction();
        const engineDepthMask = this._engine.getDepthWrite(); // for some reasons, depthWrite is not restored by EffectRenderer.restoreStates
        this._renderer.render(this._effectWrapper, destination);
        this._engine.setDepthWrite(engineDepthMask);
        if (this._isDepthTexture && engineDepthFunc) {
            this._engine.setDepthFunction(engineDepthFunc);
        }
        return true;
    }
    /**
     * Releases all the resources used by the class
     */
    dispose() {
        this._effectWrapper?.dispose();
        this._renderer.dispose();
    }
}
//# sourceMappingURL=copyTextureToTexture.js.map