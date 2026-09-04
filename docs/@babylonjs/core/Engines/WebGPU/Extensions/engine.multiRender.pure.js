/** This file must only contain pure code and pure imports */
import { InternalTexture } from "../../../Materials/Textures/internalTexture.js";
import { Logger } from "../../../Misc/logger.js";

import { WebGPUEngine } from "../../webgpuEngine.pure.js";
let _Registered = false;
/**
 * Register side effects for enginesWebGPUExtensionsEngineMultiRender.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterEnginesWebGPUExtensionsEngineMultiRender() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    WebGPUEngine.prototype.unBindMultiColorAttachmentFramebuffer = function (rtWrapper, disableGenerateMipMaps = false, onBeforeUnbind) {
        if (onBeforeUnbind) {
            onBeforeUnbind();
        }
        this._endCurrentRenderPass();
        if (!rtWrapper.disableAutomaticMSAAResolve) {
            this.resolveMultiFramebuffer(rtWrapper, false);
        }
        if (!disableGenerateMipMaps) {
            this.generateMipMapsMultiFramebuffer(rtWrapper);
        }
        this._currentRenderTarget = null;
        this._mrtAttachments = [];
        this._cacheRenderPipeline.setMRT([]);
        this._cacheRenderPipeline.setMRTAttachments(this._mrtAttachments);
    };
    WebGPUEngine.prototype.createMultipleRenderTarget = function (size, options, initializeBuffers) {
        let generateMipMaps = false;
        let generateDepthBuffer = true;
        let generateStencilBuffer = false;
        let generateDepthTexture = false;
        let depthTextureFormat = 15;
        let textureCount = 1;
        let samples = 1;
        const defaultType = 0;
        const defaultSamplingMode = 3;
        const defaultUseSRGBBuffer = false;
        const defaultFormat = 5;
        const defaultTarget = 3553;
        let types = [];
        let samplingModes = [];
        let useSRGBBuffers = [];
        let formats = [];
        let targets = [];
        let faceIndex = [];
        let layerIndex = [];
        let layers = [];
        let labels = [];
        let creationFlags = [];
        let dontCreateTextures = false;
        const rtWrapper = this._createHardwareRenderTargetWrapper(true, false, size);
        if (options !== undefined) {
            generateMipMaps = options.generateMipMaps ?? false;
            generateDepthBuffer = options.generateDepthBuffer ?? true;
            generateStencilBuffer = options.generateStencilBuffer ?? false;
            generateDepthTexture = options.generateDepthTexture ?? false;
            textureCount = options.textureCount ?? 1;
            depthTextureFormat = options.depthTextureFormat ?? 15;
            types = options.types || types;
            samplingModes = options.samplingModes || samplingModes;
            useSRGBBuffers = options.useSRGBBuffers || useSRGBBuffers;
            formats = options.formats || formats;
            targets = options.targetTypes || targets;
            faceIndex = options.faceIndex || faceIndex;
            layerIndex = options.layerIndex || layerIndex;
            layers = options.layerCounts || layers;
            labels = options.labels || labels;
            creationFlags = options.creationFlags || creationFlags;
            samples = options.samples ?? samples;
            dontCreateTextures = options.dontCreateTextures ?? false;
        }
        const width = size.width ?? size;
        const height = size.height ?? size;
        const textures = [];
        const attachments = [];
        const defaultAttachments = [];
        rtWrapper.label = options?.label ?? "MultiRenderTargetWrapper";
        rtWrapper._generateDepthBuffer = generateDepthBuffer;
        rtWrapper._generateStencilBuffer = generateStencilBuffer;
        rtWrapper._attachments = attachments;
        rtWrapper._defaultAttachments = defaultAttachments;
        let depthStencilTexture = null;
        if ((generateDepthBuffer || generateStencilBuffer || generateDepthTexture) && !dontCreateTextures) {
            if (!generateDepthTexture) {
                // The caller doesn't want a depth texture, so we are free to use the depth texture format we want.
                // So, we will align with what the WebGL engine does
                if (generateDepthBuffer && generateStencilBuffer) {
                    depthTextureFormat = 13;
                }
                else if (generateDepthBuffer) {
                    depthTextureFormat = 14;
                }
                else {
                    depthTextureFormat = 19;
                }
            }
            depthStencilTexture = rtWrapper.createDepthStencilTexture(0, false, generateStencilBuffer, 1, depthTextureFormat, rtWrapper.label + "-DepthStencil");
        }
        const mipmapsCreationOnly = options !== undefined && typeof options === "object" && options.createMipMaps && !generateMipMaps;
        for (let i = 0; i < textureCount; i++) {
            let samplingMode = samplingModes[i] || defaultSamplingMode;
            let type = types[i] || defaultType;
            const format = formats[i] || defaultFormat;
            const useSRGBBuffer = (useSRGBBuffers[i] || defaultUseSRGBBuffer) && this._caps.supportSRGBBuffers;
            const target = targets[i] || defaultTarget;
            const layerCount = layers[i] ?? 1;
            const creationFlag = creationFlags[i];
            if (type === 1 && !this._caps.textureFloatLinearFiltering) {
                // if floating point linear (FLOAT) then force to NEAREST_SAMPLINGMODE
                samplingMode = 1;
            }
            else if (type === 2 && !this._caps.textureHalfFloatLinearFiltering) {
                // if floating point linear (HALF_FLOAT) then force to NEAREST_SAMPLINGMODE
                samplingMode = 1;
            }
            if (type === 1 && !this._caps.textureFloat) {
                type = 0;
                Logger.Warn("Float textures are not supported. Render target forced to TEXTURETYPE_UNSIGNED_BYTE type");
            }
            attachments.push(i + 1);
            defaultAttachments.push(initializeBuffers ? i + 1 : i === 0 ? 1 : 0);
            if (target === -1 || dontCreateTextures) {
                continue;
            }
            const texture = new InternalTexture(this, 6 /* InternalTextureSource.MultiRenderTarget */);
            textures[i] = texture;
            switch (target) {
                case 34067:
                    texture.isCube = true;
                    break;
                case 32879:
                    texture.is3D = true;
                    texture.baseDepth = texture.depth = layerCount;
                    break;
                case 35866:
                    texture.is2DArray = true;
                    texture.baseDepth = texture.depth = layerCount;
                    break;
            }
            texture.baseWidth = width;
            texture.baseHeight = height;
            texture.width = width;
            texture.height = height;
            texture.isReady = true;
            texture.samples = 1;
            texture.generateMipMaps = generateMipMaps;
            texture.samplingMode = samplingMode;
            texture.type = type;
            texture._cachedWrapU = 0;
            texture._cachedWrapV = 0;
            texture._useSRGBBuffer = useSRGBBuffer;
            texture.format = format;
            texture.label = labels[i] ?? rtWrapper.label + "-Texture" + i;
            this._internalTexturesCache.push(texture);
            if (mipmapsCreationOnly) {
                // createGPUTextureForInternalTexture will only create a texture with mipmaps if generateMipMaps is true, as InternalTexture has no createMipMaps property, separate from generateMipMaps.
                texture.generateMipMaps = true;
            }
            this._textureHelper.createGPUTextureForInternalTexture(texture, undefined, undefined, undefined, creationFlag);
            if (mipmapsCreationOnly) {
                texture.generateMipMaps = false;
            }
        }
        if (depthStencilTexture) {
            depthStencilTexture.incrementReferences();
            textures[textureCount] = depthStencilTexture;
            this._internalTexturesCache.push(depthStencilTexture);
        }
        rtWrapper.setTextures(textures);
        rtWrapper.setLayerAndFaceIndices(layerIndex, faceIndex);
        if (!dontCreateTextures) {
            this.updateMultipleRenderTargetTextureSampleCount(rtWrapper, samples);
        }
        else {
            rtWrapper._samples = samples;
        }
        return rtWrapper;
    };
    WebGPUEngine.prototype.updateMultipleRenderTargetTextureSampleCount = function (rtWrapper, samples) {
        if (!rtWrapper || !rtWrapper.textures || rtWrapper.textures.length === 0 || rtWrapper.textures[0].samples === samples) {
            return samples;
        }
        const count = rtWrapper.textures.length;
        if (count === 0) {
            return 1;
        }
        samples = Math.min(samples, this.getCaps().maxMSAASamples);
        // Release existing MSAA textures
        for (let i = 0; i < count; ++i) {
            const texture = rtWrapper.textures[i];
            const gpuTextureWrapper = texture._hardwareTexture;
            gpuTextureWrapper?.releaseMSAATextures();
        }
        // Sets new sample count. The MSAA textures will be created on demand.
        for (let i = 0; i < count; ++i) {
            const texture = rtWrapper.textures[i];
            texture.samples = samples;
        }
        if (rtWrapper._depthStencilTexture) {
            rtWrapper._depthStencilTexture.samples = samples;
        }
        rtWrapper._samples = samples;
        return samples;
    };
    WebGPUEngine.prototype.generateMipMapsMultiFramebuffer = function (texture) {
        const rtWrapper = texture;
        if (!rtWrapper.isMulti) {
            return;
        }
        const attachments = rtWrapper._attachments;
        const count = attachments.length;
        for (let i = 0; i < count; i++) {
            const texture = rtWrapper.textures[i];
            if (texture.generateMipMaps && !texture.isCube && !texture.is3D) {
                this._generateMipmaps(texture);
            }
        }
    };
    WebGPUEngine.prototype.resolveMultiFramebuffer = function (texture, resolveColors = true) {
        this.resolveFramebuffer(texture, resolveColors);
    };
    WebGPUEngine.prototype.bindAttachments = function (attachments) {
        if (attachments.length === 0 || !this._currentRenderTarget) {
            return;
        }
        this._mrtAttachments = attachments;
        if (this._currentRenderPass) {
            // the render pass has already been created, we need to call setMRTAttachments to update the state of the attachments
            this._cacheRenderPipeline.setMRTAttachments(attachments);
        }
        else {
            // the render pass is not created yet so we don't need to call setMRTAttachments: it will be called as part of the render pass creation (see WebGPUEngine._startRenderTargetRenderPass)
        }
    };
    WebGPUEngine.prototype.buildTextureLayout = function (textureStatus, backBufferLayout = false) {
        const result = [];
        if (backBufferLayout) {
            result.push(1);
        }
        else {
            for (let i = 0; i < textureStatus.length; i++) {
                if (textureStatus[i]) {
                    result.push(i + 1);
                }
                else {
                    result.push(0);
                }
            }
        }
        return result;
    };
    WebGPUEngine.prototype.restoreSingleAttachment = function () {
        // not sure what to do, probably nothing... This function and restoreSingleAttachmentForRenderTarget are not called in Babylon.js so it's hard to know the use case
    };
    WebGPUEngine.prototype.restoreSingleAttachmentForRenderTarget = function () {
        // not sure what to do, probably nothing... This function and restoreSingleAttachment are not called in Babylon.js so it's hard to know the use case
    };
}
//# sourceMappingURL=engine.multiRender.pure.js.map