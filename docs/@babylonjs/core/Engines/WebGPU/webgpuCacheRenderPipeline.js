/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable babylonjs/available */
/* eslint-disable jsdoc/require-jsdoc */

import { VertexBuffer } from "../../Buffers/buffer.pure.js";
import { WebGPUTextureHelper } from "./webgpuTextureHelper.js";
import { renderableTextureFormatToIndex } from "./webgpuTextureManager.js";
import { checkNonFloatVertexBuffers } from "../../Buffers/buffer.nonFloatVertexBuffers.js";
import { Logger } from "../../Misc/logger.js";
var StatePosition;
(function (StatePosition) {
    StatePosition[StatePosition["StencilReadMask"] = 0] = "StencilReadMask";
    StatePosition[StatePosition["StencilWriteMask"] = 1] = "StencilWriteMask";
    //DepthBiasClamp = 1, // not used, so remove it to improve perf
    StatePosition[StatePosition["DepthBias"] = 2] = "DepthBias";
    StatePosition[StatePosition["DepthBiasSlopeScale"] = 3] = "DepthBiasSlopeScale";
    StatePosition[StatePosition["DepthStencilState"] = 4] = "DepthStencilState";
    StatePosition[StatePosition["MRTAttachments"] = 5] = "MRTAttachments";
    StatePosition[StatePosition["RasterizationState"] = 6] = "RasterizationState";
    StatePosition[StatePosition["ColorStates1"] = 7] = "ColorStates1";
    StatePosition[StatePosition["ColorStates2"] = 8] = "ColorStates2";
    StatePosition[StatePosition["ColorStates3"] = 9] = "ColorStates3";
    StatePosition[StatePosition["ColorStates4"] = 10] = "ColorStates4";
    StatePosition[StatePosition["ShaderStage"] = 11] = "ShaderStage";
    StatePosition[StatePosition["TextureStage"] = 12] = "TextureStage";
    StatePosition[StatePosition["VertexState"] = 13] = "VertexState";
    StatePosition[StatePosition["NumStates"] = 14] = "NumStates";
})(StatePosition || (StatePosition = {}));
const alphaBlendFactorToIndex = {
    0: 1, // Zero
    1: 2, // One
    0x0300: 3, // SrcColor
    0x0301: 4, // OneMinusSrcColor
    0x0302: 5, // SrcAlpha
    0x0303: 6, // OneMinusSrcAlpha
    0x0304: 7, // DstAlpha
    0x0305: 8, // OneMinusDstAlpha
    0x0306: 9, // DstColor
    0x0307: 10, // OneMinusDstColor
    0x0308: 11, // SrcAlphaSaturated
    0x8001: 12, // BlendColor
    0x8002: 13, // OneMinusBlendColor
    0x8003: 14, // BlendColor (alpha)
    0x8004: 15, // OneMinusBlendColor (alpha)
    0x88f9: 16, // Src1Color
    0x88fa: 17, // OneMinusSrc1Color
    0x8589: 18, // Src1Alpha
    0x88fb: 19, // OneMinusSrc1Alpha
};
const alphaBlendEquationToIndex = {
    0x8006: 0, // Add
    0x8007: 1, // Min
    0x8008: 2, // Max
    0x800a: 3, // Subtract
    0x800b: 4, // ReverseSubtract
};
const stencilOpToIndex = {
    0x0000: 0, // ZERO
    0x1e00: 1, // KEEP
    0x1e01: 2, // REPLACE
    0x1e02: 3, // INCR
    0x1e03: 4, // DECR
    0x150a: 5, // INVERT
    0x8507: 6, // INCR_WRAP
    0x8508: 7, // DECR_WRAP
};
const colorStates = [0, 0, 0, 0];
// VertexBuffer.hashCode uses at most bit 23 for WebGPU's maximum 2048-byte stride.
const vertexBufferLayoutContinuation = 1 << 26;
/** @internal */
export class WebGPUCacheRenderPipeline {
    constructor(device, emptyVertexBuffer) {
        this._depthBiasClamp = 0;
        this.mrtTextureCount = 0;
        this._device = device;
        this._useTextureStage = true; // we force usage because we must handle depth textures with "float" filtering, which can't be fixed by a caps (like "textureFloatLinearFiltering" can for float textures)
        // Each attribute can add a format state and a non-zero descriptor offset state.
        this._states = new Array(StatePosition.VertexState + 2 * (device.limits.maxVertexAttributes || 16));
        this._statesLength = 0;
        this._stateDirtyLowestIndex = 0;
        this._emptyVertexBuffer = emptyVertexBuffer;
        this._mrtFormats = [];
        this._parameter = { token: undefined, pipeline: null };
        this.disabled = false;
        this.vertexBuffers = [];
        this._kMaxVertexBufferStride = device.limits.maxVertexBufferArrayStride || 2048;
        this.reset();
    }
    reset() {
        this._isDirty = true;
        this.vertexBuffers.length = 0;
        this.setAlphaToCoverage(false);
        this.resetDepthCullingState();
        this.setClampDepth(false);
        this.setDepthBias(0);
        //this.setDepthBiasClamp(0);
        this._webgpuColorFormat = ["bgra8unorm" /* WebGPUConstants.TextureFormat.BGRA8Unorm */];
        this.setColorFormat("bgra8unorm" /* WebGPUConstants.TextureFormat.BGRA8Unorm */);
        this.setMRT([]);
        this.setAlphaBlendEnabled([false], 1);
        this.setAlphaBlendFactors([null, null, null, null], [null, null]);
        this.setWriteMask(0xf);
        this.setDepthStencilFormat("depth24plus-stencil8" /* WebGPUConstants.TextureFormat.Depth24PlusStencil8 */);
        this.setStencilEnabled(false);
        this.resetStencilState();
        this.setBuffers(null, null, null);
        this._setTextureState(0);
    }
    get colorFormats() {
        return this._mrtAttachments > 0 ? this._mrtFormats : this._webgpuColorFormat;
    }
    /**
     * Performs the cache state setup and lookup for a render pipeline.
     * @param fillMode defines the fill mode used to configure the rasterization state
     * @param effect defines the effect containing the shader and vertex input layout
     * @param sampleCount defines the number of samples to use for MSAA
     * @param textureState defines the encoded texture state used for the pipeline cache key
     * @returns the cached pipeline on hit, or null on miss (with cache state ready for creation)
     */
    _lookupRenderPipeline(fillMode, effect, sampleCount, textureState) {
        this._setShaderStage(effect.uniqueId);
        this._setRasterizationState(fillMode, sampleCount);
        this._setColorStates();
        this._setDepthStencilState();
        this._setVertexState(effect);
        this._setTextureState(textureState);
        this.lastStateDirtyLowestIndex = this._stateDirtyLowestIndex;
        if (!this._isDirty && this._parameter.pipeline) {
            this._stateDirtyLowestIndex = this._statesLength;
            WebGPUCacheRenderPipeline.NumCacheHitWithoutHash++;
            return this._parameter.pipeline;
        }
        this._getRenderPipeline(this._parameter);
        this._isDirty = false;
        this._stateDirtyLowestIndex = this._statesLength;
        if (this._parameter.pipeline) {
            WebGPUCacheRenderPipeline.NumCacheHitWithHash++;
            return this._parameter.pipeline;
        }
        return null;
    }
    getRenderPipeline(fillMode, effect, sampleCount, textureState = 0) {
        sampleCount = WebGPUTextureHelper.GetSample(sampleCount);
        if (this.disabled) {
            const topology = WebGPUCacheRenderPipeline._GetTopology(fillMode);
            this._setVertexState(effect); // to fill this.vertexBuffers with correct data
            this._setTextureState(textureState);
            this._parameter.pipeline = this._createRenderPipeline(effect, topology, sampleCount);
            WebGPUCacheRenderPipeline.NumCacheMiss++;
            WebGPUCacheRenderPipeline._NumPipelineCreationCurrentFrame++;
            return this._parameter.pipeline;
        }
        const cached = this._lookupRenderPipeline(fillMode, effect, sampleCount, textureState);
        if (cached) {
            return cached;
        }
        const topology = WebGPUCacheRenderPipeline._GetTopology(fillMode);
        this._parameter.pipeline = this._createRenderPipeline(effect, topology, sampleCount);
        this._setRenderPipeline(this._parameter);
        WebGPUCacheRenderPipeline.NumCacheMiss++;
        WebGPUCacheRenderPipeline._NumPipelineCreationCurrentFrame++;
        return this._parameter.pipeline;
    }
    endFrame() {
        WebGPUCacheRenderPipeline.NumPipelineCreationLastFrame = WebGPUCacheRenderPipeline._NumPipelineCreationCurrentFrame;
        WebGPUCacheRenderPipeline._NumPipelineCreationCurrentFrame = 0;
    }
    setAlphaToCoverage(enabled) {
        this._alphaToCoverageEnabled = enabled;
    }
    setFrontFace(frontFace) {
        this._frontFace = frontFace;
    }
    setCullEnabled(enabled) {
        this._cullEnabled = enabled;
    }
    setCullFace(cullFace) {
        this._cullFace = cullFace;
    }
    setClampDepth(clampDepth) {
        this._clampDepth = clampDepth;
    }
    resetDepthCullingState() {
        this.setDepthCullingState(false, 2, 1, 0, 0, true, true, 519);
    }
    setDepthCullingState(cullEnabled, frontFace, cullFace, zOffset, zOffsetUnits, depthTestEnabled, depthWriteEnabled, depthCompare) {
        this._depthWriteEnabled = depthWriteEnabled;
        this._depthTestEnabled = depthTestEnabled;
        this._depthCompare = (depthCompare ?? 519) - 0x0200;
        this._cullFace = cullFace;
        this._cullEnabled = cullEnabled;
        this._frontFace = frontFace;
        this.setDepthBiasSlopeScale(zOffset);
        this.setDepthBias(zOffsetUnits);
    }
    setDepthBias(depthBias) {
        if (this._depthBias !== depthBias) {
            this._depthBias = depthBias;
            this._states[StatePosition.DepthBias] = depthBias;
            this._isDirty = true;
            this._stateDirtyLowestIndex = Math.min(this._stateDirtyLowestIndex, StatePosition.DepthBias);
        }
    }
    /*public setDepthBiasClamp(depthBiasClamp: number): void {
        if (this._depthBiasClamp !== depthBiasClamp) {
            this._depthBiasClamp = depthBiasClamp;
            this._states[StatePosition.DepthBiasClamp] = depthBiasClamp.toString();
            this._isDirty = true;
        }
    }*/
    setDepthBiasSlopeScale(depthBiasSlopeScale) {
        if (this._depthBiasSlopeScale !== depthBiasSlopeScale) {
            this._depthBiasSlopeScale = depthBiasSlopeScale;
            this._states[StatePosition.DepthBiasSlopeScale] = depthBiasSlopeScale;
            this._isDirty = true;
            this._stateDirtyLowestIndex = Math.min(this._stateDirtyLowestIndex, StatePosition.DepthBiasSlopeScale);
        }
    }
    setColorFormat(format) {
        this._webgpuColorFormat[0] = format;
        this._colorFormat = renderableTextureFormatToIndex[format ?? ""];
    }
    // Must be called after setMRT!
    setMRTAttachments(attachments) {
        this.mrtAttachments = attachments;
        let mask = 0;
        for (let i = 0; i < attachments.length; ++i) {
            if (attachments[i] !== 0) {
                mask += 1 << i;
            }
        }
        if (this._mrtEnabledMask !== mask) {
            this._mrtEnabledMask = mask;
            this._isDirty = true;
            this._stateDirtyLowestIndex = Math.min(this._stateDirtyLowestIndex, StatePosition.MRTAttachments);
        }
    }
    setMRT(textureArray, textureCount) {
        textureCount = textureCount ?? textureArray.length;
        if (textureCount > 8) {
            // We only support 8 MRTs in WebGPU, so we throw an error if we try to set more than that.
            throw new Error("Can't handle more than 8 attachments for a MRT in cache render pipeline!");
        }
        this.mrtTextureArray = textureArray;
        this.mrtTextureCount = textureCount;
        // Since we need approximately 45 different values per texture format (see WebGPUTextureManager.renderableTextureFormatToIndex), we use 6 bits to encode a texture format,
        // which means we can encode 8 texture formats in 48 bits (a double can represent integers exactly up until 2^53, so 48 bits is ok).
        this._mrtEnabledMask = 0xffff; // all textures are enabled at start (meaning we can write to them). Calls to setMRTAttachments may disable some
        let mrtAttachments = 0;
        let mask = 0;
        for (let i = 0; i < textureCount; ++i) {
            const texture = textureArray[i];
            const gpuWrapper = texture?._hardwareTexture;
            this._mrtFormats[i] = gpuWrapper?.format ?? this._webgpuColorFormat[0];
            mrtAttachments += renderableTextureFormatToIndex[this._mrtFormats[i] ?? ""] * 2 ** mask;
            mask += 6;
        }
        this._mrtFormats.length = textureCount;
        if (this._mrtAttachments !== mrtAttachments) {
            this._mrtAttachments = mrtAttachments;
            this._states[StatePosition.MRTAttachments] = mrtAttachments;
            this._isDirty = true;
            this._stateDirtyLowestIndex = Math.min(this._stateDirtyLowestIndex, StatePosition.MRTAttachments);
        }
    }
    setAlphaBlendEnabled(enabled, numAlphaBlendTargetsEnabled) {
        this._alphaBlendEnabled = enabled;
        this._numAlphaBlendTargetsEnabled = numAlphaBlendTargetsEnabled;
    }
    setAlphaBlendFactors(factors, operations) {
        this._alphaBlendFuncParams = factors;
        this._alphaBlendEqParams = operations;
    }
    setWriteMask(mask) {
        this._writeMask = mask;
    }
    setDepthStencilFormat(format) {
        this._webgpuDepthStencilFormat = format;
        this._depthStencilFormat = format === undefined ? 0 : renderableTextureFormatToIndex[format];
    }
    setDepthTestEnabled(enabled) {
        this._depthTestEnabled = enabled;
    }
    setDepthWriteEnabled(enabled) {
        this._depthWriteEnabled = enabled;
    }
    setDepthCompare(func) {
        this._depthCompare = (func ?? 519) - 0x0200;
    }
    setStencilEnabled(enabled) {
        this._stencilEnabled = enabled;
    }
    setStencilCompare(func) {
        this._stencilFrontCompare = (func ?? 519) - 0x0200;
    }
    setStencilDepthFailOp(op) {
        this._stencilFrontDepthFailOp = op === null ? 1 /* KEEP */ : stencilOpToIndex[op];
    }
    setStencilPassOp(op) {
        this._stencilFrontPassOp = op === null ? 2 /* REPLACE */ : stencilOpToIndex[op];
    }
    setStencilFailOp(op) {
        this._stencilFrontFailOp = op === null ? 1 /* KEEP */ : stencilOpToIndex[op];
    }
    setStencilBackCompare(func) {
        this._stencilBackCompare = (func ?? 519) - 0x0200;
    }
    setStencilBackDepthFailOp(op) {
        this._stencilBackDepthFailOp = op === null ? 1 /* KEEP */ : stencilOpToIndex[op];
    }
    setStencilBackPassOp(op) {
        this._stencilBackPassOp = op === null ? 2 /* REPLACE */ : stencilOpToIndex[op];
    }
    setStencilBackFailOp(op) {
        this._stencilBackFailOp = op === null ? 1 /* KEEP */ : stencilOpToIndex[op];
    }
    setStencilReadMask(mask) {
        if (this._stencilReadMask !== mask) {
            this._stencilReadMask = mask;
            this._states[StatePosition.StencilReadMask] = mask;
            this._isDirty = true;
            this._stateDirtyLowestIndex = Math.min(this._stateDirtyLowestIndex, StatePosition.StencilReadMask);
        }
    }
    setStencilWriteMask(mask) {
        if (this._stencilWriteMask !== mask) {
            this._stencilWriteMask = mask;
            this._states[StatePosition.StencilWriteMask] = mask;
            this._isDirty = true;
            this._stateDirtyLowestIndex = Math.min(this._stateDirtyLowestIndex, StatePosition.StencilWriteMask);
        }
    }
    resetStencilState() {
        this.setStencilState(false, 519, 7680, 7681, 7680, 0xff, 0xff);
    }
    setStencilState(stencilEnabled, compare, depthFailOp, passOp, failOp, readMask, writeMask, backCompare = null, backDepthFailOp = null, backPassOp = null, backFailOp = null) {
        this._stencilEnabled = stencilEnabled;
        this._stencilFrontCompare = (compare ?? 519) - 0x0200;
        this._stencilFrontDepthFailOp = depthFailOp === null ? 1 /* KEEP */ : stencilOpToIndex[depthFailOp];
        this._stencilFrontPassOp = passOp === null ? 2 /* REPLACE */ : stencilOpToIndex[passOp];
        this._stencilFrontFailOp = failOp === null ? 1 /* KEEP */ : stencilOpToIndex[failOp];
        this._stencilBackCompare = (backCompare ?? 519) - 0x0200;
        this._stencilBackDepthFailOp = backDepthFailOp === null ? 1 /* KEEP */ : stencilOpToIndex[backDepthFailOp];
        this._stencilBackPassOp = backPassOp === null ? 2 /* REPLACE */ : stencilOpToIndex[backPassOp];
        this._stencilBackFailOp = backFailOp === null ? 1 /* KEEP */ : stencilOpToIndex[backFailOp];
        this.setStencilReadMask(readMask);
        this.setStencilWriteMask(writeMask);
    }
    setBuffers(vertexBuffers, indexBuffer, overrideVertexBuffers) {
        this._vertexBuffers = vertexBuffers;
        this._overrideVertexBuffers = overrideVertexBuffers;
        this.indexBuffer = indexBuffer;
    }
    static _GetTopology(fillMode) {
        switch (fillMode) {
            // Triangle views
            case 0:
                return "triangle-list" /* WebGPUConstants.PrimitiveTopology.TriangleList */;
            case 2:
                return "point-list" /* WebGPUConstants.PrimitiveTopology.PointList */;
            case 1:
                return "line-list" /* WebGPUConstants.PrimitiveTopology.LineList */;
            // Draw modes
            case 3:
                return "point-list" /* WebGPUConstants.PrimitiveTopology.PointList */;
            case 4:
                return "line-list" /* WebGPUConstants.PrimitiveTopology.LineList */;
            case 5:
                // return this._gl.LINE_LOOP;
                // TODO WEBGPU. Line Loop Mode Fallback at buffer load time.
                // eslint-disable-next-line no-throw-literal
                throw "LineLoop is an unsupported fillmode in WebGPU";
            case 6:
                return "line-strip" /* WebGPUConstants.PrimitiveTopology.LineStrip */;
            case 7:
                return "triangle-strip" /* WebGPUConstants.PrimitiveTopology.TriangleStrip */;
            case 8:
                // return this._gl.TRIANGLE_FAN;
                // TODO WEBGPU. Triangle Fan Mode Fallback at buffer load time.
                // eslint-disable-next-line no-throw-literal
                throw "TriangleFan is an unsupported fillmode in WebGPU";
            default:
                return "triangle-list" /* WebGPUConstants.PrimitiveTopology.TriangleList */;
        }
    }
    static _GetAphaBlendOperation(operation) {
        switch (operation) {
            case 32774:
                return "add" /* WebGPUConstants.BlendOperation.Add */;
            case 32778:
                return "subtract" /* WebGPUConstants.BlendOperation.Subtract */;
            case 32779:
                return "reverse-subtract" /* WebGPUConstants.BlendOperation.ReverseSubtract */;
            case 32775:
                return "min" /* WebGPUConstants.BlendOperation.Min */;
            case 32776:
                return "max" /* WebGPUConstants.BlendOperation.Max */;
            default:
                return "add" /* WebGPUConstants.BlendOperation.Add */;
        }
    }
    static _GetAphaBlendFactor(factor) {
        switch (factor) {
            case 0:
                return "zero" /* WebGPUConstants.BlendFactor.Zero */;
            case 1:
                return "one" /* WebGPUConstants.BlendFactor.One */;
            case 768:
                return "src" /* WebGPUConstants.BlendFactor.Src */;
            case 769:
                return "one-minus-src" /* WebGPUConstants.BlendFactor.OneMinusSrc */;
            case 770:
                return "src-alpha" /* WebGPUConstants.BlendFactor.SrcAlpha */;
            case 771:
                return "one-minus-src-alpha" /* WebGPUConstants.BlendFactor.OneMinusSrcAlpha */;
            case 772:
                return "dst-alpha" /* WebGPUConstants.BlendFactor.DstAlpha */;
            case 773:
                return "one-minus-dst-alpha" /* WebGPUConstants.BlendFactor.OneMinusDstAlpha */;
            case 774:
                return "dst" /* WebGPUConstants.BlendFactor.Dst */;
            case 775:
                return "one-minus-dst" /* WebGPUConstants.BlendFactor.OneMinusDst */;
            case 776:
                return "src-alpha-saturated" /* WebGPUConstants.BlendFactor.SrcAlphaSaturated */;
            case 32769:
            case 32771:
                return "constant" /* WebGPUConstants.BlendFactor.Constant */;
            case 32770:
            case 32772:
                return "one-minus-constant" /* WebGPUConstants.BlendFactor.OneMinusConstant */;
            case 35065:
                return "src1" /* WebGPUConstants.BlendFactor.Src1 */;
            case 35066:
                return "one-minus-src1" /* WebGPUConstants.BlendFactor.OneMinusSrc1 */;
            case 34185:
                return "src1-alpha" /* WebGPUConstants.BlendFactor.Src1Alpha */;
            case 35067:
                return "one-minus-src1-alpha" /* WebGPUConstants.BlendFactor.OneMinusSrc1Alpha */;
            default:
                return "one" /* WebGPUConstants.BlendFactor.One */;
        }
    }
    static _GetCompareFunction(compareFunction) {
        switch (compareFunction) {
            case 0: // NEVER
                return "never" /* WebGPUConstants.CompareFunction.Never */;
            case 1: // LESS
                return "less" /* WebGPUConstants.CompareFunction.Less */;
            case 2: // EQUAL
                return "equal" /* WebGPUConstants.CompareFunction.Equal */;
            case 3: // LEQUAL
                return "less-equal" /* WebGPUConstants.CompareFunction.LessEqual */;
            case 4: // GREATER
                return "greater" /* WebGPUConstants.CompareFunction.Greater */;
            case 5: // NOTEQUAL
                return "not-equal" /* WebGPUConstants.CompareFunction.NotEqual */;
            case 6: // GEQUAL
                return "greater-equal" /* WebGPUConstants.CompareFunction.GreaterEqual */;
            case 7: // ALWAYS
                return "always" /* WebGPUConstants.CompareFunction.Always */;
        }
        return "never" /* WebGPUConstants.CompareFunction.Never */;
    }
    static _GetStencilOpFunction(operation) {
        switch (operation) {
            case 0:
                return "zero" /* WebGPUConstants.StencilOperation.Zero */;
            case 1:
                return "keep" /* WebGPUConstants.StencilOperation.Keep */;
            case 2:
                return "replace" /* WebGPUConstants.StencilOperation.Replace */;
            case 3:
                return "increment-clamp" /* WebGPUConstants.StencilOperation.IncrementClamp */;
            case 4:
                return "decrement-clamp" /* WebGPUConstants.StencilOperation.DecrementClamp */;
            case 5:
                return "invert" /* WebGPUConstants.StencilOperation.Invert */;
            case 6:
                return "increment-wrap" /* WebGPUConstants.StencilOperation.IncrementWrap */;
            case 7:
                return "decrement-wrap" /* WebGPUConstants.StencilOperation.DecrementWrap */;
        }
        return "keep" /* WebGPUConstants.StencilOperation.Keep */;
    }
    static _GetVertexInputDescriptorFormat(vertexBuffer) {
        const type = vertexBuffer.type;
        const normalized = vertexBuffer.normalized;
        const size = vertexBuffer.getSize();
        switch (type) {
            case VertexBuffer.BYTE:
                switch (size) {
                    case 1:
                    case 2:
                        return normalized ? "snorm8x2" /* WebGPUConstants.VertexFormat.Snorm8x2 */ : "sint8x2" /* WebGPUConstants.VertexFormat.Sint8x2 */;
                    case 3:
                    case 4:
                        return normalized ? "snorm8x4" /* WebGPUConstants.VertexFormat.Snorm8x4 */ : "sint8x4" /* WebGPUConstants.VertexFormat.Sint8x4 */;
                }
                break;
            case VertexBuffer.UNSIGNED_BYTE:
                switch (size) {
                    case 1:
                    case 2:
                        return normalized ? "unorm8x2" /* WebGPUConstants.VertexFormat.Unorm8x2 */ : "uint8x2" /* WebGPUConstants.VertexFormat.Uint8x2 */;
                    case 3:
                    case 4:
                        return normalized ? "unorm8x4" /* WebGPUConstants.VertexFormat.Unorm8x4 */ : "uint8x4" /* WebGPUConstants.VertexFormat.Uint8x4 */;
                }
                break;
            case VertexBuffer.SHORT:
                switch (size) {
                    case 1:
                    case 2:
                        return normalized ? "snorm16x2" /* WebGPUConstants.VertexFormat.Snorm16x2 */ : "sint16x2" /* WebGPUConstants.VertexFormat.Sint16x2 */;
                    case 3:
                    case 4:
                        return normalized ? "snorm16x4" /* WebGPUConstants.VertexFormat.Snorm16x4 */ : "sint16x4" /* WebGPUConstants.VertexFormat.Sint16x4 */;
                }
                break;
            case VertexBuffer.UNSIGNED_SHORT:
                switch (size) {
                    case 1:
                    case 2:
                        return normalized ? "unorm16x2" /* WebGPUConstants.VertexFormat.Unorm16x2 */ : "uint16x2" /* WebGPUConstants.VertexFormat.Uint16x2 */;
                    case 3:
                    case 4:
                        return normalized ? "unorm16x4" /* WebGPUConstants.VertexFormat.Unorm16x4 */ : "uint16x4" /* WebGPUConstants.VertexFormat.Uint16x4 */;
                }
                break;
            case VertexBuffer.HALF_FLOAT:
                switch (size) {
                    case 1:
                    case 2:
                        return "float16x2" /* WebGPUConstants.VertexFormat.Float16x2 */;
                    case 3:
                    case 4:
                        return "float16x4" /* WebGPUConstants.VertexFormat.Float16x4 */;
                }
                break;
            case VertexBuffer.INT:
                switch (size) {
                    case 1:
                        return "sint32" /* WebGPUConstants.VertexFormat.Sint32 */;
                    case 2:
                        return "sint32x2" /* WebGPUConstants.VertexFormat.Sint32x2 */;
                    case 3:
                        return "sint32x3" /* WebGPUConstants.VertexFormat.Sint32x3 */;
                    case 4:
                        return "sint32x4" /* WebGPUConstants.VertexFormat.Sint32x4 */;
                }
                break;
            case VertexBuffer.UNSIGNED_INT:
                switch (size) {
                    case 1:
                        return "uint32" /* WebGPUConstants.VertexFormat.Uint32 */;
                    case 2:
                        return "uint32x2" /* WebGPUConstants.VertexFormat.Uint32x2 */;
                    case 3:
                        return "uint32x3" /* WebGPUConstants.VertexFormat.Uint32x3 */;
                    case 4:
                        return "uint32x4" /* WebGPUConstants.VertexFormat.Uint32x4 */;
                }
                break;
            case VertexBuffer.FLOAT:
                switch (size) {
                    case 1:
                        return "float32" /* WebGPUConstants.VertexFormat.Float32 */;
                    case 2:
                        return "float32x2" /* WebGPUConstants.VertexFormat.Float32x2 */;
                    case 3:
                        return "float32x3" /* WebGPUConstants.VertexFormat.Float32x3 */;
                    case 4:
                        return "float32x4" /* WebGPUConstants.VertexFormat.Float32x4 */;
                }
                break;
        }
        throw new Error(`Invalid Format '${vertexBuffer.getKind()}' - type=${type}, normalized=${normalized}, size=${size}`);
    }
    _getAphaBlendState(targetIndex) {
        if (!this._alphaBlendEnabled[targetIndex]) {
            return null;
        }
        return {
            srcFactor: WebGPUCacheRenderPipeline._GetAphaBlendFactor(this._alphaBlendFuncParams[targetIndex * 4 + 2]),
            dstFactor: WebGPUCacheRenderPipeline._GetAphaBlendFactor(this._alphaBlendFuncParams[targetIndex * 4 + 3]),
            operation: WebGPUCacheRenderPipeline._GetAphaBlendOperation(this._alphaBlendEqParams[targetIndex * 2 + 1]),
        };
    }
    _getColorBlendState(targetIndex) {
        if (!this._alphaBlendEnabled) {
            return null;
        }
        return {
            srcFactor: WebGPUCacheRenderPipeline._GetAphaBlendFactor(this._alphaBlendFuncParams[targetIndex * 4 + 0]),
            dstFactor: WebGPUCacheRenderPipeline._GetAphaBlendFactor(this._alphaBlendFuncParams[targetIndex * 4 + 1]),
            operation: WebGPUCacheRenderPipeline._GetAphaBlendOperation(this._alphaBlendEqParams[targetIndex * 2 + 0]),
        };
    }
    _setShaderStage(id) {
        if (this._shaderId !== id) {
            this._shaderId = id;
            this._states[StatePosition.ShaderStage] = id;
            this._isDirty = true;
            this._stateDirtyLowestIndex = Math.min(this._stateDirtyLowestIndex, StatePosition.ShaderStage);
        }
    }
    _setRasterizationState(topology, sampleCount) {
        const frontFace = this._frontFace;
        const cullMode = this._cullEnabled ? this._cullFace : 0;
        const clampDepth = this._clampDepth ? 1 : 0;
        const alphaToCoverage = this._alphaToCoverageEnabled && sampleCount > 1 ? 1 : 0;
        const rasterizationState = frontFace - 1 + (cullMode << 1) + (clampDepth << 3) + (alphaToCoverage << 4) + (topology << 5) + (sampleCount << 8);
        if (this._rasterizationState !== rasterizationState) {
            this._rasterizationState = rasterizationState;
            this._states[StatePosition.RasterizationState] = this._rasterizationState;
            this._isDirty = true;
            this._stateDirtyLowestIndex = Math.min(this._stateDirtyLowestIndex, StatePosition.RasterizationState);
        }
    }
    _setColorStates() {
        // Note that _depthWriteEnabled state has been moved from depthStencilState here because alpha and depth are related (generally when alpha is on, depth write is off and the other way around)
        // We need 4 color states because we will be grouping 2 blend targets in each state (and WebGPU supports up to 8 targets).
        // Integers can only be represented exactly in 53 bits with a double, so we can only use 53 bits for each state.
        // We use 25 bits for each blend target (5 bits for the 2 (color/alpha) equations and 4*5 bits for the 4 factors (src/dst color and src/dst alpha)).
        // This means that we need 25*2=50 bits to pack 2 blend targets, and we can use the remaining 3 bits for other states (write mask, depth write, color format).
        // The color format is encoded on 6 bits, so we dispatch it over 3 bits to the last two color states.
        colorStates[0] = (this._writeMask ? 1 : 0) * 2 ** 53;
        colorStates[1] = (this._depthWriteEnabled ? 1 : 0) * 2 ** 53;
        colorStates[2] = (this._colorFormat & 0x07) * 2 ** 50;
        colorStates[3] = (this._colorFormat & 0x38) * 2 ** 47;
        let colorStateIndex = 0;
        let isDirty = false;
        for (let i = 0; i < 8; i++) {
            if (this._alphaBlendEnabled[i]) {
                const index0 = i * 4 + 0;
                const index1 = i * 4 + 1;
                const index2 = i * 4 + 2;
                const index3 = i * 4 + 3;
                const indexEq0 = i * 2 + 0;
                const indexEq1 = i * 2 + 1;
                const eq0 = this._alphaBlendEqParams[indexEq0] === null ? 0 : alphaBlendEquationToIndex[this._alphaBlendEqParams[indexEq0]];
                const eq1 = this._alphaBlendEqParams[indexEq1] === null ? 0 : alphaBlendEquationToIndex[this._alphaBlendEqParams[indexEq1]];
                colorStates[colorStateIndex] +=
                    ((this._alphaBlendFuncParams[index0] === null ? 1 : alphaBlendFactorToIndex[this._alphaBlendFuncParams[index0]]) << 0) +
                        ((this._alphaBlendFuncParams[index1] === null ? 1 : alphaBlendFactorToIndex[this._alphaBlendFuncParams[index1]]) << 5) +
                        ((this._alphaBlendFuncParams[index2] === null ? 1 : alphaBlendFactorToIndex[this._alphaBlendFuncParams[index2]]) << 10) +
                        ((this._alphaBlendFuncParams[index3] === null ? 1 : alphaBlendFactorToIndex[this._alphaBlendFuncParams[index3]]) << 15) +
                        (eq0 + eq1 * 5) * (1 << 20);
            }
            if (i & 1) {
                isDirty = isDirty || this._states[StatePosition.ColorStates1 + colorStateIndex] !== colorStates[colorStateIndex];
                this._states[StatePosition.ColorStates1 + colorStateIndex] = colorStates[colorStateIndex];
                colorStateIndex++;
            }
        }
        if (isDirty) {
            this._isDirty = true;
            this._stateDirtyLowestIndex = Math.min(this._stateDirtyLowestIndex, StatePosition.ColorStates1);
        }
    }
    _setDepthStencilState() {
        const stencilState = !this._stencilEnabled
            ? 7 /* ALWAYS */ +
                (1 /* KEEP */ << 3) +
                (1 /* KEEP */ << 6) +
                (1 /* KEEP */ << 9) + // front
                (7 /* ALWAYS */ << 12) +
                (1 /* KEEP */ << 15) +
                (1 /* KEEP */ << 18) +
                (1 /* KEEP */ << 21) // back
            : this._stencilFrontCompare +
                (this._stencilFrontDepthFailOp << 3) +
                (this._stencilFrontPassOp << 6) +
                (this._stencilFrontFailOp << 9) + // front
                (this._stencilBackCompare << 12) +
                (this._stencilBackDepthFailOp << 15) +
                (this._stencilBackPassOp << 18) +
                (this._stencilBackFailOp << 21); // back
        const depthStencilState = this._depthStencilFormat + ((this._depthTestEnabled ? this._depthCompare : 7) /* ALWAYS */ << 6) + stencilState * (1 << 10); // stencil front + back
        if (this._depthStencilState !== depthStencilState) {
            this._depthStencilState = depthStencilState;
            this._states[StatePosition.DepthStencilState] = this._depthStencilState;
            this._isDirty = true;
            this._stateDirtyLowestIndex = Math.min(this._stateDirtyLowestIndex, StatePosition.DepthStencilState);
        }
    }
    _setVertexState(effect) {
        const currStateLen = this._statesLength;
        let newNumStates = StatePosition.VertexState;
        const webgpuPipelineContext = effect._pipelineContext;
        const attributes = webgpuPipelineContext.shaderProcessingContext.attributeNamesFromEffect;
        const locations = webgpuPipelineContext.shaderProcessingContext.attributeLocationsFromEffect;
        let currentGPUBuffer;
        let numVertexBuffers = 0;
        for (let index = 0; index < attributes.length; index++) {
            const location = locations[index];
            let vertexBuffer = (this._overrideVertexBuffers && this._overrideVertexBuffers[attributes[index]]) ?? this._vertexBuffers[attributes[index]];
            if (!vertexBuffer) {
                // In WebGL it's valid to not bind a vertex buffer to an attribute, but it's not valid in WebGPU
                // So we must bind a dummy buffer when we are not given one for a specific attribute
                vertexBuffer = this._emptyVertexBuffer;
                if (WebGPUCacheRenderPipeline.LogErrorIfNoVertexBuffer) {
                    Logger.Error(`No vertex buffer is provided for the "${attributes[index]}" attribute. A default empty vertex buffer will be used, but this may generate errors in some browsers.`);
                }
            }
            const buffer = vertexBuffer.effectiveBuffer?.underlyingResource;
            // We optimize usage of GPUVertexBufferLayout: we will create a single GPUVertexBufferLayout for all the attributes which follow each other and which use the same GPU buffer
            // However, there are some constraints in the attribute.offset value range, so we must check for them before being able to reuse the same GPUVertexBufferLayout
            // See _getVertexInputDescriptor() below
            if (vertexBuffer._validOffsetRange === undefined) {
                const offset = vertexBuffer.effectiveByteOffset;
                const formatSize = vertexBuffer.getSize(true);
                const byteStride = vertexBuffer.effectiveByteStride;
                vertexBuffer._validOffsetRange =
                    (offset + formatSize <= this._kMaxVertexBufferStride && byteStride === 0) || (byteStride !== 0 && offset + formatSize <= byteStride);
            }
            const canMergeWithCurrentBuffer = WebGPUCacheRenderPipeline._CanMergeVertexBuffer(currentGPUBuffer, buffer, vertexBuffer);
            if (!canMergeWithCurrentBuffer) {
                // we can't combine the previous vertexBuffer with the current one
                this.vertexBuffers[numVertexBuffers++] = vertexBuffer;
                currentGPUBuffer = vertexBuffer._validOffsetRange ? buffer : null;
            }
            const vid = vertexBuffer.hashCode + (location << 7) + (canMergeWithCurrentBuffer ? vertexBufferLayoutContinuation : 0);
            const descriptorOffset = vertexBuffer._validOffsetRange ? vertexBuffer.effectiveByteOffset : 0;
            this._isDirty = this._isDirty || this._states[newNumStates] !== vid;
            this._states[newNumStates++] = vid;
            if (descriptorOffset !== 0) {
                // Offset states are negative so they cannot collide with vertex format states.
                const offsetState = -descriptorOffset;
                this._isDirty = this._isDirty || this._states[newNumStates] !== offsetState;
                this._states[newNumStates++] = offsetState;
            }
        }
        this.vertexBuffers.length = numVertexBuffers;
        this._statesLength = newNumStates;
        this._isDirty = this._isDirty || newNumStates !== currStateLen;
        if (this._isDirty) {
            this._stateDirtyLowestIndex = Math.min(this._stateDirtyLowestIndex, StatePosition.VertexState);
        }
    }
    _setTextureState(textureState) {
        if (this._textureState !== textureState) {
            this._textureState = textureState;
            this._states[StatePosition.TextureStage] = this._textureState;
            this._isDirty = true;
            this._stateDirtyLowestIndex = Math.min(this._stateDirtyLowestIndex, StatePosition.TextureStage);
        }
    }
    _createPipelineLayout(webgpuPipelineContext) {
        if (this._useTextureStage) {
            return this._createPipelineLayoutWithTextureStage(webgpuPipelineContext);
        }
        const bindGroupLayouts = [];
        const bindGroupLayoutEntries = webgpuPipelineContext.shaderProcessingContext.bindGroupLayoutEntries;
        for (let i = 0; i < bindGroupLayoutEntries.length; i++) {
            const setDefinition = bindGroupLayoutEntries[i];
            bindGroupLayouts[i] = this._device.createBindGroupLayout({
                entries: setDefinition,
            });
        }
        webgpuPipelineContext.bindGroupLayouts[0] = bindGroupLayouts;
        return this._device.createPipelineLayout({ bindGroupLayouts });
    }
    _createPipelineLayoutWithTextureStage(webgpuPipelineContext) {
        const shaderProcessingContext = webgpuPipelineContext.shaderProcessingContext;
        const bindGroupLayoutEntries = shaderProcessingContext.bindGroupLayoutEntries;
        let bitVal = 1;
        for (let i = 0; i < bindGroupLayoutEntries.length; i++) {
            const setDefinition = bindGroupLayoutEntries[i];
            for (let j = 0; j < setDefinition.length; j++) {
                const entry = bindGroupLayoutEntries[i][j];
                if (entry.texture) {
                    const name = shaderProcessingContext.bindGroupLayoutEntryInfo[i][entry.binding].name;
                    const textureInfo = shaderProcessingContext.availableTextures[name];
                    const samplerInfo = textureInfo.autoBindSampler ? shaderProcessingContext.availableSamplers[name + `Sampler`] : null;
                    let sampleType = textureInfo.sampleType;
                    let samplerType = samplerInfo?.type ?? "filtering" /* WebGPUConstants.SamplerBindingType.Filtering */;
                    if (this._textureState & bitVal && sampleType !== "depth" /* WebGPUConstants.TextureSampleType.Depth */) {
                        // The texture is a 32 bits float texture but the system does not support linear filtering for them OR the texture is a depth texture with "float" filtering:
                        // we set the sampler to "non-filtering" and the texture sample type to "unfilterable-float"
                        if (textureInfo.autoBindSampler) {
                            samplerType = "non-filtering" /* WebGPUConstants.SamplerBindingType.NonFiltering */;
                        }
                        sampleType = "unfilterable-float" /* WebGPUConstants.TextureSampleType.UnfilterableFloat */;
                    }
                    entry.texture.sampleType = sampleType;
                    if (samplerInfo) {
                        const binding = shaderProcessingContext.bindGroupLayoutEntryInfo[samplerInfo.binding.groupIndex][samplerInfo.binding.bindingIndex].index;
                        bindGroupLayoutEntries[samplerInfo.binding.groupIndex][binding].sampler.type = samplerType;
                    }
                    bitVal = bitVal << 1;
                }
            }
        }
        const bindGroupLayouts = [];
        for (let i = 0; i < bindGroupLayoutEntries.length; ++i) {
            bindGroupLayouts[i] = this._device.createBindGroupLayout({
                entries: bindGroupLayoutEntries[i],
            });
        }
        webgpuPipelineContext.bindGroupLayouts[this._textureState] = bindGroupLayouts;
        return this._device.createPipelineLayout({ bindGroupLayouts });
    }
    _getVertexInputDescriptor(effect) {
        const descriptors = [];
        const webgpuPipelineContext = effect._pipelineContext;
        const attributes = webgpuPipelineContext.shaderProcessingContext.attributeNamesFromEffect;
        const locations = webgpuPipelineContext.shaderProcessingContext.attributeLocationsFromEffect;
        let currentGPUBuffer;
        let currentGPUAttributes;
        for (let index = 0; index < attributes.length; index++) {
            const location = locations[index];
            let vertexBuffer = (this._overrideVertexBuffers && this._overrideVertexBuffers[attributes[index]]) ?? this._vertexBuffers[attributes[index]];
            if (!vertexBuffer) {
                // In WebGL it's valid to not bind a vertex buffer to an attribute, but it's not valid in WebGPU
                // So we must bind a dummy buffer when we are not given one for a specific attribute
                vertexBuffer = this._emptyVertexBuffer;
            }
            let buffer = vertexBuffer.effectiveBuffer?.underlyingResource;
            // We reuse the same GPUVertexBufferLayout for all attributes that use the same underlying GPU buffer (and for attributes that follow each other in the attributes array)
            let offset = vertexBuffer.effectiveByteOffset;
            const invalidOffsetRange = !vertexBuffer._validOffsetRange;
            if (!WebGPUCacheRenderPipeline._CanMergeVertexBuffer(currentGPUBuffer, buffer, vertexBuffer)) {
                const vertexBufferDescriptor = {
                    arrayStride: vertexBuffer.effectiveByteStride,
                    stepMode: vertexBuffer.getIsInstanced() ? "instance" /* WebGPUConstants.VertexStepMode.Instance */ : "vertex" /* WebGPUConstants.VertexStepMode.Vertex */,
                    attributes: [],
                };
                descriptors.push(vertexBufferDescriptor);
                currentGPUAttributes = vertexBufferDescriptor.attributes;
                if (invalidOffsetRange) {
                    offset = 0; // the offset will be set directly in the setVertexBuffer call
                    buffer = null; // buffer can't be reused
                }
            }
            currentGPUAttributes.push({
                shaderLocation: location,
                offset,
                format: WebGPUCacheRenderPipeline._GetVertexInputDescriptorFormat(vertexBuffer),
            });
            currentGPUBuffer = buffer;
        }
        return descriptors;
    }
    static _CanMergeVertexBuffer(currentGPUBuffer, buffer, vertexBuffer) {
        return !!currentGPUBuffer && currentGPUBuffer === buffer && vertexBuffer._validOffsetRange;
    }
    _buildRenderPipelineDescriptor(effect, topology, sampleCount) {
        const webgpuPipelineContext = effect._pipelineContext;
        const inputStateDescriptor = this._getVertexInputDescriptor(effect);
        const pipelineLayout = this._createPipelineLayout(webgpuPipelineContext);
        const colorStates = [];
        if (this._vertexBuffers) {
            checkNonFloatVertexBuffers(this._vertexBuffers, effect);
        }
        if (this._mrtAttachments > 0) {
            for (let i = 0; i < this._mrtFormats.length; ++i) {
                const format = this._mrtFormats[i];
                if (format) {
                    const descr = {
                        format,
                        writeMask: (this._mrtEnabledMask & (1 << i)) !== 0 ? this._writeMask : 0,
                    };
                    const alphaBlend = this._getAphaBlendState(i < this._numAlphaBlendTargetsEnabled ? i : 0);
                    const colorBlend = this._getColorBlendState(i < this._numAlphaBlendTargetsEnabled ? i : 0);
                    if (alphaBlend && colorBlend) {
                        descr.blend = {
                            alpha: alphaBlend,
                            color: colorBlend,
                        };
                    }
                    colorStates.push(descr);
                }
                else {
                    colorStates.push(null);
                }
            }
        }
        else {
            if (this._webgpuColorFormat[0]) {
                const descr = {
                    format: this._webgpuColorFormat[0],
                    writeMask: this._writeMask,
                };
                const alphaBlend = this._getAphaBlendState(0);
                const colorBlend = this._getColorBlendState(0);
                if (alphaBlend && colorBlend) {
                    descr.blend = {
                        alpha: alphaBlend,
                        color: colorBlend,
                    };
                }
                colorStates.push(descr);
            }
            else {
                colorStates.push(null);
            }
        }
        const stencilFront = {
            compare: WebGPUCacheRenderPipeline._GetCompareFunction(this._stencilEnabled ? this._stencilFrontCompare : 7 /* ALWAYS */),
            depthFailOp: WebGPUCacheRenderPipeline._GetStencilOpFunction(this._stencilEnabled ? this._stencilFrontDepthFailOp : 1 /* KEEP */),
            failOp: WebGPUCacheRenderPipeline._GetStencilOpFunction(this._stencilEnabled ? this._stencilFrontFailOp : 1 /* KEEP */),
            passOp: WebGPUCacheRenderPipeline._GetStencilOpFunction(this._stencilEnabled ? this._stencilFrontPassOp : 1 /* KEEP */),
        };
        const stencilBack = {
            compare: WebGPUCacheRenderPipeline._GetCompareFunction(this._stencilEnabled ? this._stencilBackCompare : 7 /* ALWAYS */),
            depthFailOp: WebGPUCacheRenderPipeline._GetStencilOpFunction(this._stencilEnabled ? this._stencilBackDepthFailOp : 1 /* KEEP */),
            failOp: WebGPUCacheRenderPipeline._GetStencilOpFunction(this._stencilEnabled ? this._stencilBackFailOp : 1 /* KEEP */),
            passOp: WebGPUCacheRenderPipeline._GetStencilOpFunction(this._stencilEnabled ? this._stencilBackPassOp : 1 /* KEEP */),
        };
        const topologyIsTriangle = topology === "triangle-list" /* WebGPUConstants.PrimitiveTopology.TriangleList */ || topology === "triangle-strip" /* WebGPUConstants.PrimitiveTopology.TriangleStrip */;
        let stripIndexFormat = undefined;
        if (topology === "line-strip" /* WebGPUConstants.PrimitiveTopology.LineStrip */ || topology === "triangle-strip" /* WebGPUConstants.PrimitiveTopology.TriangleStrip */) {
            stripIndexFormat = !this.indexBuffer || this.indexBuffer.is32Bits ? "uint32" /* WebGPUConstants.IndexFormat.Uint32 */ : "uint16" /* WebGPUConstants.IndexFormat.Uint16 */;
        }
        const depthStencilFormatHasStencil = this._webgpuDepthStencilFormat ? WebGPUTextureHelper.HasStencilAspect(this._webgpuDepthStencilFormat) : false;
        const primitiveState = {
            topology,
            frontFace: this._frontFace === 1 ? "ccw" /* WebGPUConstants.FrontFace.CCW */ : "cw" /* WebGPUConstants.FrontFace.CW */,
            cullMode: !this._cullEnabled ? "none" /* WebGPUConstants.CullMode.None */ : this._cullFace === 2 ? "front" /* WebGPUConstants.CullMode.Front */ : "back" /* WebGPUConstants.CullMode.Back */,
        };
        if (stripIndexFormat) {
            primitiveState.stripIndexFormat = stripIndexFormat;
        }
        return {
            label: `RenderPipeline_${colorStates[0]?.format ?? "nooutput"}_${this._webgpuDepthStencilFormat ?? "nodepth"}_samples${sampleCount}_textureState${this._textureState}`,
            layout: pipelineLayout,
            vertex: {
                module: webgpuPipelineContext.stages.vertexStage.module,
                entryPoint: webgpuPipelineContext.stages.vertexStage.entryPoint,
                buffers: inputStateDescriptor,
            },
            primitive: primitiveState,
            fragment: !webgpuPipelineContext.stages.fragmentStage
                ? undefined
                : {
                    module: webgpuPipelineContext.stages.fragmentStage.module,
                    entryPoint: webgpuPipelineContext.stages.fragmentStage.entryPoint,
                    targets: colorStates,
                },
            multisample: {
                count: sampleCount,
            },
            depthStencil: this._webgpuDepthStencilFormat === undefined
                ? undefined
                : {
                    depthWriteEnabled: this._depthWriteEnabled,
                    depthCompare: this._depthTestEnabled ? WebGPUCacheRenderPipeline._GetCompareFunction(this._depthCompare) : "always" /* WebGPUConstants.CompareFunction.Always */,
                    format: this._webgpuDepthStencilFormat,
                    stencilFront: this._stencilEnabled && depthStencilFormatHasStencil ? stencilFront : undefined,
                    stencilBack: this._stencilEnabled && depthStencilFormatHasStencil ? stencilBack : undefined,
                    stencilReadMask: this._stencilEnabled && depthStencilFormatHasStencil ? this._stencilReadMask : 0xffffffff,
                    stencilWriteMask: this._stencilEnabled && depthStencilFormatHasStencil ? this._stencilWriteMask : 0xffffffff,
                    depthBias: this._depthBias,
                    depthBiasClamp: topologyIsTriangle ? this._depthBiasClamp : 0,
                    depthBiasSlopeScale: topologyIsTriangle ? this._depthBiasSlopeScale : 0,
                },
        };
    }
    _createRenderPipeline(effect, topology, sampleCount) {
        return this._device.createRenderPipeline(this._buildRenderPipelineDescriptor(effect, topology, sampleCount));
    }
    /**
     * Pre-warms a render pipeline asynchronously. Sets up the cache state,
     * checks for a cache hit, and on miss starts an async pipeline compilation.
     * @param fillMode - the fill mode (triangle list, wireframe, etc.)
     * @param effect - the effect to create the pipeline for
     * @param sampleCount - the MSAA sample count
     * @param textureState - the texture state bitmask
     * @returns a Promise that resolves when the pipeline is compiled and cached, or null if already cached
     */
    preWarmPipeline(fillMode, effect, sampleCount, textureState = 0) {
        sampleCount = WebGPUTextureHelper.GetSample(sampleCount);
        const cached = this._lookupRenderPipeline(fillMode, effect, sampleCount, textureState);
        if (cached) {
            return null;
        }
        const topology = WebGPUCacheRenderPipeline._GetTopology(fillMode);
        // Capture the cache token before any subsequent cache operations overwrite it
        const capturedParam = { token: this._parameter.token, pipeline: null };
        const promise = this._device.createRenderPipelineAsync(this._buildRenderPipelineDescriptor(effect, topology, sampleCount));
        // eslint-disable-next-line github/no-then
        return promise.then((pipeline) => {
            capturedParam.pipeline = pipeline;
            this._setRenderPipeline(capturedParam);
            WebGPUCacheRenderPipeline.NumCacheMiss++;
            return pipeline;
        });
    }
}
WebGPUCacheRenderPipeline.LogErrorIfNoVertexBuffer = false;
WebGPUCacheRenderPipeline.NumCacheHitWithoutHash = 0;
WebGPUCacheRenderPipeline.NumCacheHitWithHash = 0;
WebGPUCacheRenderPipeline.NumCacheMiss = 0;
WebGPUCacheRenderPipeline.NumPipelineCreationLastFrame = 0;
WebGPUCacheRenderPipeline._NumPipelineCreationCurrentFrame = 0;
//# sourceMappingURL=webgpuCacheRenderPipeline.js.map