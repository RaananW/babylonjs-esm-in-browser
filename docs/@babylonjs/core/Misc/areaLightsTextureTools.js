import { EffectRenderer, EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { Vector2 } from "../Maths/math.vector.pure.js";
import { WhenTextureReadyAsync } from "./textureTools.js";
import { BaseTexture } from "../Materials/Textures/baseTexture.pure.js";

/**
 * Class used for fast copy from one texture to another
 */
export class AreaLightTextureTools {
    /**
     * Gets the shader language
     */
    get shaderLanguage() {
        return this._shaderLanguage;
    }
    _textureIsInternal(texture) {
        return texture?.getInternalTexture === undefined;
    }
    /**
     * Constructs a new instance of the class
     * @param engine The engine to use for the copy
     */
    constructor(engine) {
        this._kernelLibrary = [];
        this._blurSize = 5;
        this._alphaFactor = 0.5;
        /** Shader language used */
        this._shaderLanguage = 0 /* ShaderLanguage.GLSL */;
        this._shadersLoaded = false;
        this._engine = engine;
        this._renderer = new EffectRenderer(this._engine);
        this._scalingRange = new Vector2();
        for (let i = 0; i < 512; i++) {
            const kernelSize = this._blurSize + (i + 1) * 2;
            const alpha = (kernelSize / 2.0) * this._alphaFactor;
            this._kernelLibrary.push(this._generateGaussianKernel(kernelSize, alpha));
        }
    }
    _createEffect() {
        const engine = this._engine;
        let isWebGPU = false;
        if (engine?.isWebGPU) {
            this._shaderLanguage = 1 /* ShaderLanguage.WGSL */;
            isWebGPU = true;
        }
        const effectWrapper = new EffectWrapper({
            engine: engine,
            name: "AreaLightTextureProcessing",
            fragmentShader: "areaLightTextureProcessing",
            useShaderStore: true,
            uniformNames: ["scalingRange"],
            samplerNames: ["textureSampler"],
            defines: [],
            shaderLanguage: this._shaderLanguage,
            extraInitializationsAsync: async () => {
                if (isWebGPU) {
                    await import("../ShadersWGSL/areaLightTextureProcessing.fragment.js");
                }
                else {
                    await import("../Shaders/areaLightTextureProcessing.fragment.js");
                }
            },
        });
        effectWrapper.onApplyObservable.add(() => {
            engine.depthCullingState.depthMask = false;
            if (this._textureIsInternal(this._source)) {
                effectWrapper.effect._bindTexture("textureSampler", this._source);
            }
            else {
                effectWrapper.effect.setTexture("textureSampler", this._source);
            }
            effectWrapper.effect.setVector2("scalingRange", this._scalingRange);
        });
        return effectWrapper;
    }
    /**
     * Indicates if the effect is ready to be used for the copy
     * @returns true if "copy" can be called without delay, else false
     */
    isReady() {
        return this._shadersLoaded && !!this._effectWrapper?.effect?.isReady();
    }
    /**
     * Pre-processes the texture to be used with RectAreaLight emissionTexture.
     * @param source The texture to pre-process
     * @returns A promise that resolves with the pre-processed texture
     */
    async processAsync(source) {
        if (!this._shadersLoaded) {
            this._effectWrapper = this._createEffect();
            await this._effectWrapper.effect.whenCompiledAsync();
            this._shadersLoaded = true;
        }
        if (!source.isReady()) {
            await WhenTextureReadyAsync(source);
        }
        this._scalingRange.x = 0.125;
        this._scalingRange.y = 0.875;
        this._source = source;
        const oldWrapU = this._source.wrapU;
        const oldWrapV = this._source.wrapV;
        this._source.wrapU = 2;
        this._source.wrapV = 2;
        const result = await this._scaleImageDownAsync(source);
        await this._applyProgressiveBlurAsync(result);
        result.wrapU = 0;
        result.wrapV = 0;
        this._source.wrapU = oldWrapU;
        this._source.wrapV = oldWrapV;
        return result;
    }
    async _scaleImageDownAsync(source) {
        const renderTarget = this._engine.createRenderTargetTexture({ width: 1024, height: 1024 }, {
            generateDepthBuffer: false,
            generateMipMaps: true,
            generateStencilBuffer: false,
            samplingMode: 3,
            type: 0,
            format: 5,
        });
        this._source = source;
        const engineDepthMask = this._engine.getDepthWrite(); // for some reasons, depthWrite is not restored by EffectRenderer.restoreStates
        this._renderer.render(this._effectWrapper, renderTarget);
        this._engine.setDepthWrite(engineDepthMask);
        return new BaseTexture(this._engine, renderTarget.texture);
    }
    _generateGaussianKernel(size, sigma) {
        if (size % 2 === 0) {
            throw new Error("Kernel size must be odd.");
        }
        const kernel = new Float32Array(size);
        let sum = 0.0;
        const halfSize = Math.floor(size / 2);
        for (let i = -halfSize; i <= halfSize; ++i) {
            const value = Math.exp(-(i * i) / (2.0 * sigma * sigma));
            const index = i + halfSize;
            kernel[index] = value;
            sum += value;
        }
        for (let i = 0; i < kernel.length; i++) {
            kernel[i] /= sum;
        }
        return { kernel, kernelSize: size, kernelHalfSize: halfSize };
    }
    _mirrorIndex(x, width) {
        if (x < 0) {
            x = -x;
        }
        if (x >= width) {
            x = 2 * width - 2 - x;
        }
        return x;
    }
    _applyGaussianBlurRange(input, output, width, height, channels, kernelLibrary) {
        const marginStart = Math.floor(width * 0.125);
        const marginEnd = Math.floor(width * 0.875);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let targetKernel = 0;
                if (x <= marginStart) {
                    targetKernel = Math.max(targetKernel, Math.abs(x - marginStart));
                }
                if (y <= marginStart) {
                    targetKernel = Math.max(targetKernel, Math.abs(y - marginStart));
                }
                if (x >= marginEnd) {
                    targetKernel = Math.max(targetKernel, Math.abs(x - marginEnd));
                }
                if (y >= marginEnd) {
                    targetKernel = Math.max(targetKernel, Math.abs(y - marginEnd));
                }
                const kernelData = kernelLibrary[targetKernel];
                const { kernel, kernelHalfSize } = kernelData;
                for (let c = 0; c < channels - 1; c++) {
                    let sum = 0.0;
                    for (let kx = -kernelHalfSize; kx <= kernelHalfSize; kx++) {
                        const px = this._mirrorIndex(x + kx, width);
                        const weight = kernel[kx + kernelHalfSize];
                        const pixelData = input[(y * width + px) * channels + c];
                        sum += pixelData * weight;
                    }
                    output[(y * width + x) * channels + c] = Math.max(0, Math.min(255, Math.round(sum)));
                }
                // copy alpha if present
                if (channels > 3) {
                    output[(y * width + x) * channels + (channels - 1)] = input[(y * width + x) * channels + (channels - 1)];
                }
            }
        }
    }
    _transposeImage(input, width, height, channels, output) {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const srcBase = (y * width + x) * channels;
                const dstBase = (x * height + y) * channels;
                for (let c = 0; c < channels; c++) {
                    output[dstBase + c] = input[srcBase + c];
                }
            }
        }
    }
    async _applyProgressiveBlurAsync(source) {
        const pixelData = await source.readPixels();
        if (!pixelData) {
            return;
        }
        const internalTexture = source.getInternalTexture();
        if (!internalTexture) {
            return;
        }
        const rourcePixel = new Uint8Array(pixelData.buffer);
        const result = new Uint8Array(rourcePixel.length);
        this._applyGaussianBlurRange(rourcePixel, result, internalTexture.width, internalTexture.height, 4, this._kernelLibrary);
        this._transposeImage(result, internalTexture.width, internalTexture.height, 4, rourcePixel);
        this._applyGaussianBlurRange(rourcePixel, result, internalTexture.width, internalTexture.height, 4, this._kernelLibrary);
        this._transposeImage(result, internalTexture.width, internalTexture.height, 4, rourcePixel);
        this._engine.updateRawTexture(internalTexture, rourcePixel, internalTexture.format, false);
    }
    /**
     * Releases all the resources used by the class
     */
    dispose() {
        this._effectWrapper?.dispose();
        this._renderer.dispose();
    }
}
//# sourceMappingURL=areaLightsTextureTools.js.map