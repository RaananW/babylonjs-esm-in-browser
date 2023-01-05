import { InternalTextureSource } from "../Materials/Textures/internalTexture.js";

/**
 * Wrapper around a render target (either single or multi textures)
 */
export class RenderTargetWrapper {
    /**
     * Initializes the render target wrapper
     * @param isMulti true if the wrapper is a multi render target
     * @param isCube true if the wrapper should render to a cube texture
     * @param size size of the render target (width/height/layers)
     * @param engine engine used to create the render target
     */
    constructor(isMulti, isCube, size, engine) {
        this._textures = null;
        /** @internal */
        this._samples = 1;
        /** @internal */
        this._attachments = null;
        /** @internal */
        this._generateStencilBuffer = false;
        /** @internal */
        this._generateDepthBuffer = false;
        /** @internal */
        this._depthStencilTextureWithStencil = false;
        this._isMulti = isMulti;
        this._isCube = isCube;
        this._size = size;
        this._engine = engine;
        this._depthStencilTexture = null;
    }
    /**
     * Gets the depth/stencil texture (if created by a createDepthStencilTexture() call)
     */
    get depthStencilTexture() {
        return this._depthStencilTexture;
    }
    /**
     * Indicates if the depth/stencil texture has a stencil aspect
     */
    get depthStencilTextureWithStencil() {
        return this._depthStencilTextureWithStencil;
    }
    /**
     * Defines if the render target wrapper is for a cube texture or if false a 2d texture
     */
    get isCube() {
        return this._isCube;
    }
    /**
     * Defines if the render target wrapper is for a single or multi target render wrapper
     */
    get isMulti() {
        return this._isMulti;
    }
    /**
     * Defines if the render target wrapper is for a single or an array of textures
     */
    get is2DArray() {
        return this.layers > 0;
    }
    /**
     * Gets the size of the render target wrapper (used for cubes, as width=height in this case)
     */
    get size() {
        return this.width;
    }
    /**
     * Gets the width of the render target wrapper
     */
    get width() {
        return this._size.width || this._size;
    }
    /**
     * Gets the height of the render target wrapper
     */
    get height() {
        return this._size.height || this._size;
    }
    /**
     * Gets the number of layers of the render target wrapper (only used if is2DArray is true)
     */
    get layers() {
        return this._size.layers || 0;
    }
    /**
     * Gets the render texture. If this is a multi render target, gets the first texture
     */
    get texture() {
        var _a, _b;
        return (_b = (_a = this._textures) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null;
    }
    /**
     * Gets the list of render textures. If we are not in a multi render target, the list will be null (use the texture getter instead)
     */
    get textures() {
        return this._textures;
    }
    /**
     * Gets the sample count of the render target
     */
    get samples() {
        return this._samples;
    }
    /**
     * Sets the sample count of the render target
     * @param value sample count
     * @param initializeBuffers If set to true, the engine will make an initializing call to drawBuffers (only used when isMulti=true).
     * @param force true to force calling the update sample count engine function even if the current sample count is equal to value
     * @returns the sample count that has been set
     */
    setSamples(value, initializeBuffers = true, force = false) {
        if (this.samples === value && !force) {
            return value;
        }
        const result = this._isMulti
            ? this._engine.updateMultipleRenderTargetTextureSampleCount(this, value, initializeBuffers)
            : this._engine.updateRenderTargetTextureSampleCount(this, value);
        this._samples = value;
        return result;
    }
    /**
     * Sets the render target texture(s)
     * @param textures texture(s) to set
     */
    setTextures(textures) {
        if (Array.isArray(textures)) {
            this._textures = textures;
        }
        else if (textures) {
            this._textures = [textures];
        }
        else {
            this._textures = null;
        }
    }
    /**
     * Set a texture in the textures array
     * @param texture the texture to set
     * @param index the index in the textures array to set
     * @param disposePrevious If this function should dispose the previous texture
     */
    setTexture(texture, index = 0, disposePrevious = true) {
        if (!this._textures) {
            this._textures = [];
        }
        if (this._textures[index] && disposePrevious) {
            this._textures[index].dispose();
        }
        this._textures[index] = texture;
    }
    /**
     * Creates the depth/stencil texture
     * @param comparisonFunction Comparison function to use for the texture
     * @param bilinearFiltering true if bilinear filtering should be used when sampling the texture
     * @param generateStencil true if the stencil aspect should also be created
     * @param samples sample count to use when creating the texture
     * @param format format of the depth texture
     * @returns the depth/stencil created texture
     */
    createDepthStencilTexture(comparisonFunction = 0, bilinearFiltering = true, generateStencil = false, samples = 1, format = 14) {
        var _a;
        (_a = this._depthStencilTexture) === null || _a === void 0 ? void 0 : _a.dispose();
        this._depthStencilTextureWithStencil = generateStencil;
        this._depthStencilTexture = this._engine.createDepthStencilTexture(this._size, {
            bilinearFiltering,
            comparisonFunction,
            generateStencil,
            isCube: this._isCube,
            samples,
            depthTextureFormat: format,
        }, this);
        return this._depthStencilTexture;
    }
    /**
     * Shares the depth buffer of this render target with another render target.
     * @internal
     * @param renderTarget Destination renderTarget
     */
    _shareDepth(renderTarget) {
        if (this._depthStencilTexture) {
            if (renderTarget._depthStencilTexture) {
                renderTarget._depthStencilTexture.dispose();
            }
            renderTarget._depthStencilTexture = this._depthStencilTexture;
            this._depthStencilTexture.incrementReferences();
        }
    }
    /**
     * @internal
     */
    _swapAndDie(target) {
        if (this.texture) {
            this.texture._swapAndDie(target);
        }
        this._textures = null;
        this.dispose(true);
    }
    _cloneRenderTargetWrapper() {
        var _a, _b, _c, _d, _e, _f;
        let rtw = null;
        if (this._isMulti) {
            const textureArray = this.textures;
            if (textureArray && textureArray.length > 0) {
                let generateDepthTexture = false;
                let textureCount = textureArray.length;
                const lastTextureSource = textureArray[textureArray.length - 1]._source;
                if (lastTextureSource === InternalTextureSource.Depth || lastTextureSource === InternalTextureSource.DepthStencil) {
                    generateDepthTexture = true;
                    textureCount--;
                }
                const samplingModes = [];
                const types = [];
                for (let i = 0; i < textureCount; ++i) {
                    const texture = textureArray[i];
                    samplingModes.push(texture.samplingMode);
                    types.push(texture.type);
                }
                const optionsMRT = {
                    samplingModes,
                    generateMipMaps: textureArray[0].generateMipMaps,
                    generateDepthBuffer: this._generateDepthBuffer,
                    generateStencilBuffer: this._generateStencilBuffer,
                    generateDepthTexture,
                    types,
                    textureCount,
                };
                const size = {
                    width: this.width,
                    height: this.height,
                };
                rtw = this._engine.createMultipleRenderTarget(size, optionsMRT);
            }
        }
        else {
            const options = {};
            options.generateDepthBuffer = this._generateDepthBuffer;
            options.generateMipMaps = (_b = (_a = this.texture) === null || _a === void 0 ? void 0 : _a.generateMipMaps) !== null && _b !== void 0 ? _b : false;
            options.generateStencilBuffer = this._generateStencilBuffer;
            options.samplingMode = (_c = this.texture) === null || _c === void 0 ? void 0 : _c.samplingMode;
            options.type = (_d = this.texture) === null || _d === void 0 ? void 0 : _d.type;
            options.format = (_e = this.texture) === null || _e === void 0 ? void 0 : _e.format;
            if (this.isCube) {
                rtw = this._engine.createRenderTargetCubeTexture(this.width, options);
            }
            else {
                const size = {
                    width: this.width,
                    height: this.height,
                    layers: this.is2DArray ? (_f = this.texture) === null || _f === void 0 ? void 0 : _f.depth : undefined,
                };
                rtw = this._engine.createRenderTargetTexture(size, options);
            }
            rtw.texture.isReady = true;
        }
        return rtw;
    }
    _swapRenderTargetWrapper(target) {
        if (this._textures && target._textures) {
            for (let i = 0; i < this._textures.length; ++i) {
                this._textures[i]._swapAndDie(target._textures[i], false);
                target._textures[i].isReady = true;
            }
        }
        if (this._depthStencilTexture && target._depthStencilTexture) {
            this._depthStencilTexture._swapAndDie(target._depthStencilTexture);
            target._depthStencilTexture.isReady = true;
        }
        this._textures = null;
        this._depthStencilTexture = null;
    }
    /** @internal */
    _rebuild() {
        const rtw = this._cloneRenderTargetWrapper();
        if (!rtw) {
            return;
        }
        if (this._depthStencilTexture) {
            const samplingMode = this._depthStencilTexture.samplingMode;
            const bilinear = samplingMode === 2 ||
                samplingMode === 3 ||
                samplingMode === 11;
            rtw.createDepthStencilTexture(this._depthStencilTexture._comparisonFunction, bilinear, this._depthStencilTextureWithStencil, this._depthStencilTexture.samples);
        }
        if (this.samples > 1) {
            rtw.setSamples(this.samples);
        }
        rtw._swapRenderTargetWrapper(this);
        rtw.dispose();
    }
    /**
     * Releases the internal render textures
     */
    releaseTextures() {
        var _a, _b;
        if (this._textures) {
            for (let i = 0; (_b = i < ((_a = this._textures) === null || _a === void 0 ? void 0 : _a.length)) !== null && _b !== void 0 ? _b : 0; ++i) {
                this._textures[i].dispose();
            }
        }
        this._textures = null;
    }
    /**
     * Disposes the whole render target wrapper
     * @param disposeOnlyFramebuffers true if only the frame buffers should be released (used for the WebGL engine). If false, all the textures will also be released
     */
    dispose(disposeOnlyFramebuffers = false) {
        var _a;
        if (!disposeOnlyFramebuffers) {
            (_a = this._depthStencilTexture) === null || _a === void 0 ? void 0 : _a.dispose();
            this._depthStencilTexture = null;
            this.releaseTextures();
        }
        this._engine._releaseRenderTargetWrapper(this);
    }
}
//# sourceMappingURL=renderTargetWrapper.js.map