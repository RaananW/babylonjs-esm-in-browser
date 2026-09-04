/** This file must only contain pure code and pure imports */
import { RegisterBufferAlign } from "../Buffers/buffer.align.pure.js";
import { InternalTexture } from "../Materials/Textures/internalTexture.js";
import { DataBuffer } from "../Buffers/dataBuffer.js";
import { Observable } from "../Misc/observable.pure.js";
import { Logger } from "../Misc/logger.js";

import { AbstractEngine } from "./abstractEngine.pure.js";
import { ThinEngine } from "./thinEngine.pure.js";
import { EngineStore } from "./engineStore.js";
import { ShaderCodeInliner } from "./Processors/shaderCodeInliner.js";
import { NativeShaderProcessor } from "./Native/nativeShaderProcessors.js";
import { NativeDataStream } from "./Native/nativeDataStream.js";
import { NativePipelineContext } from "./Native/nativePipelineContext.js";
import { NativeRenderTargetWrapper } from "./Native/nativeRenderTargetWrapper.js";
import { NativeHardwareTexture } from "./Native/nativeHardwareTexture.js";
import { getNativeAlphaMode, getNativeAttribType, getNativeSamplingMode, getNativeTextureFormat, getNativeStencilDepthFail, getNativeStencilDepthPass, getNativeStencilFunc, getNativeStencilOpFail, getNativeAddressMode, } from "./Native/nativeHelpers.js";
import { checkNonFloatVertexBuffers } from "../Buffers/buffer.nonFloatVertexBuffers.js";
import { NativeShaderProcessingContext } from "./Native/nativeShaderProcessingContext.js";
import { _TimeToken } from "../Instrumentation/timeToken.js";
import { PerfCounter } from "../Misc/perfCounter.js";
import { DecodeBase64UrlToBinary } from "../Misc/fileTools.pure.js";
const onNativeObjectInitialized = /*#__PURE__*/ new Observable();
if (typeof self !== "undefined" && !Object.prototype.hasOwnProperty.call(self, "_native")) {
    let __native;
    Object.defineProperty(self, "_native", {
        get: () => __native,
        set: (value) => {
            __native = value;
            if (__native) {
                onNativeObjectInitialized.notifyObservers(__native);
            }
        },
    });
}
/**
 * Returns _native only after it has been defined by BabylonNative.
 * @internal
 */
export async function AcquireNativeObjectAsync() {
    return await new Promise((resolve) => {
        if (typeof _native === "undefined") {
            onNativeObjectInitialized.addOnce((nativeObject) => resolve(nativeObject));
        }
        else {
            resolve(_native);
        }
    });
}
/**
 * Registers a constructor on the _native object. See NativeXRFrame for an example.
 * @internal
 */
export async function RegisterNativeTypeAsync(typeName, constructor) {
    (await AcquireNativeObjectAsync())[typeName] = constructor;
}
/**
 * Container for accessors for natively-stored mesh data buffers.
 */
class NativeDataBuffer extends DataBuffer {
}
/** @internal */
class CommandBufferEncoder {
    constructor(_engine) {
        this._engine = _engine;
        this._pending = new Array();
        this._isCommandBufferScopeActive = false;
        this._commandStream = ThinNativeEngine._createNativeDataStream();
        this._engine.setCommandDataStream(this._commandStream);
    }
    beginCommandScope() {
        if (this._isCommandBufferScopeActive) {
            throw new Error("Command scope already active.");
        }
        this._isCommandBufferScopeActive = true;
    }
    endCommandScope() {
        if (!this._isCommandBufferScopeActive) {
            throw new Error("Command scope is not active.");
        }
        this._isCommandBufferScopeActive = false;
        this._submit();
    }
    startEncodingCommand(command) {
        this._commandStream.writeNativeData(command);
    }
    encodeCommandArgAsUInt32(commandArg) {
        this._commandStream.writeUint32(commandArg);
    }
    encodeCommandArgAsUInt32s(commandArg) {
        this._commandStream.writeUint32Array(commandArg);
    }
    encodeCommandArgAsInt32(commandArg) {
        this._commandStream.writeInt32(commandArg);
    }
    encodeCommandArgAsInt32s(commandArg) {
        this._commandStream.writeInt32Array(commandArg);
    }
    encodeCommandArgAsFloat32(commandArg) {
        this._commandStream.writeFloat32(commandArg);
    }
    encodeCommandArgAsFloat32s(commandArg) {
        this._commandStream.writeFloat32Array(commandArg);
    }
    encodeCommandArgAsNativeData(commandArg) {
        this._commandStream.writeNativeData(commandArg);
        this._pending.push(commandArg);
    }
    finishEncodingCommand() {
        if (!this._isCommandBufferScopeActive) {
            this._submit();
        }
    }
    _submit() {
        this._engine.submitCommands();
        this._pending.length = 0;
    }
}
const remappedAttributesNames = [];
/** @internal */
export class ThinNativeEngine extends ThinEngine {
    /** @internal */
    static _createNativeDataStream() {
        return new NativeDataStream();
    }
    constructor(options = {}) {
        super(null, false, undefined, options.adaptToDeviceRatio);
        this._initializeNativeEngine(options.adaptToDeviceRatio ?? false);
    }
    //////////////////////////////////////////////////////////////////////
    /**
     * Keeps as a separate function to use in NativeEngine
     * @internal
     */
    _initializeNativeEngine(adaptToDeviceRatio) {
        // ThinNativeEngine relies on VertexBuffer.effective{Buffer,ByteOffset,ByteStride}
        // (defined in Buffers/buffer.align.pure) to bind vertex attributes through
        // recordVertexBuffer. Register the side effect here so the engine is usable
        // on its own without callers having to remember to import the wrapper module.
        // The registration is idempotent.
        RegisterBufferAlign();
        this._engine = new _native.Engine({
            version: AbstractEngine.Version,
            nonFloatVertexBuffers: true,
        });
        this._camera = _native.Camera ? new _native.Camera() : null;
        this._commandBufferEncoder = new CommandBufferEncoder(this._engine);
        this._frameStats = { gpuTimeNs: Number.NaN };
        this._boundBuffersVertexArray = null;
        this._currentDepthTest = _native.Engine.DEPTH_TEST_LEQUAL;
        this._depthTestEnabled = true;
        this._stencilTest = false;
        this._stencilMask = 255;
        this._stencilFunc = 519;
        this._stencilFuncRef = 0;
        this._stencilFuncMask = 255;
        this._stencilOpStencilFail = 7680;
        this._stencilOpDepthFail = 7680;
        this._stencilOpStencilDepthPass = 7681;
        this._zOffset = 0;
        this._zOffsetUnits = 0;
        this._cachedCulling = true;
        this._cachedReverseSide = false;
        this._cachedCullBackFaces = true;
        this._cachedZOffset = 0;
        this._cachedZOffsetUnits = 0;
        this._depthWrite = true;
        // warning for non supported fill mode has already been displayed
        this._fillModeWarningDisplayed = false;
        this._drawCalls = new PerfCounter();
        if (_native.Engine.PROTOCOL_VERSION !== ThinNativeEngine.PROTOCOL_VERSION) {
            throw new Error(`Protocol version mismatch: ${_native.Engine.PROTOCOL_VERSION} (Native) !== ${ThinNativeEngine.PROTOCOL_VERSION} (JS)`);
        }
        // Prefer setRenderResetCallback (accurate name -- fires when bgfx is (re)initialized,
        // i.e. on device restore). Fall back to the legacy setDeviceLostCallback for backward
        // compatibility with older BabylonNative builds. See BabylonNative #1722.
        const renderResetCallback = () => {
            this.onContextLostObservable.notifyObservers(this);
            this._contextWasLost = true;
            this._restoreEngineAfterContextLost();
        };
        if (this._engine.setRenderResetCallback) {
            this._engine.setRenderResetCallback(renderResetCallback);
        }
        else if (this._engine.setDeviceLostCallback) {
            this._engine.setDeviceLostCallback(renderResetCallback);
        }
        this._webGLVersion = 2;
        this.disableUniformBuffers = true;
        this._shaderPlatformName = "NATIVE";
        // Babylon Native is not WebGL and has no _gl context. Report a distinct engine name (like
        // WebGPU reports "WebGPU") so application/feature code that branches on engine.name === "WebGL"
        // to touch the WebGL-only _gl context skips the native engine instead of dereferencing null.
        this._name = "Native";
        // TODO: Initialize this more correctly based on the hardware capabilities.
        // Init caps
        this._caps = {
            maxTexturesImageUnits: 16,
            maxVertexTextureImageUnits: 16,
            maxCombinedTexturesImageUnits: 32,
            maxTextureSize: _native.Engine.CAPS_LIMITS_MAX_TEXTURE_SIZE,
            maxCubemapTextureSize: 512,
            maxRenderTextureSize: 512,
            maxVertexAttribs: 16,
            maxVaryingVectors: 16,
            maxDrawBuffers: 8,
            maxFragmentUniformVectors: 16,
            maxVertexUniformVectors: 256,
            shaderFloatPrecision: 23, // TODO: is this correct?
            standardDerivatives: true,
            astc: null,
            pvrtc: null,
            etc1: null,
            etc2: null,
            bptc: null,
            maxAnisotropy: 16, // TODO: Retrieve this smartly. Currently set to D3D11 maximum allowable value.
            uintIndices: true,
            fragmentDepthSupported: false,
            highPrecisionShaderSupported: true,
            colorBufferFloat: true,
            blendFloat: true,
            supportFloatTexturesResolve: false,
            rg11b10ufColorRenderable: false,
            textureFloat: true,
            textureFloatLinearFiltering: true,
            textureFloatRender: true,
            textureHalfFloat: true,
            textureHalfFloatLinearFiltering: true,
            textureHalfFloatRender: true,
            textureLOD: true,
            texelFetch: true,
            drawBuffersExtension: true,
            depthTextureExtension: false,
            vertexArrayObject: true,
            instancedArrays: true,
            supportOcclusionQuery: false,
            canUseTimestampForTimerQuery: false,
            blendMinMax: false,
            maxMSAASamples: 16,
            canUseGLInstanceID: true,
            canUseGLVertexID: true,
            supportComputeShaders: false,
            supportSRGBBuffers: true,
            supportTransformFeedbacks: false,
            textureMaxLevel: false,
            texture2DArrayMaxLayerCount: _native.Engine.CAPS_LIMITS_MAX_TEXTURE_LAYERS,
            disableMorphTargetTexture: false,
            parallelShaderCompile: { COMPLETION_STATUS_KHR: 0 },
            textureNorm16: false,
            blendParametersPerTarget: false,
            dualSourceBlending: false,
            supportReadWriteStorageTextures: false,
        };
        this._features = {
            forceBitmapOverHTMLImageElement: true,
            supportRenderAndCopyToLodForFloatTextures: false,
            supportDepthStencilTexture: false,
            supportShadowSamplers: false,
            uniformBufferHardCheckMatrix: false,
            allowTexturePrefiltering: false,
            trackUbosInFrame: false,
            checkUbosContentBeforeUpload: false,
            supportCSM: false,
            basisNeedsPOT: false,
            support3DTextures: false,
            needTypeSuffixInShaderConstants: false,
            supportMSAA: true,
            supportSSAO2: false,
            supportIBLShadows: false,
            supportExtendedTextureFormats: false,
            supportSwitchCaseInShader: false,
            supportSyncTextureRead: false,
            needsInvertingBitmap: true,
            useUBOBindingCache: true,
            needShaderCodeInlining: true,
            needToAlwaysBindUniformBuffers: false,
            supportRenderPasses: true,
            supportSpriteInstancing: false,
            forceVertexBufferStrideAndOffsetMultiple4Bytes: true,
            _checkNonFloatVertexBuffersDontRecreatePipelineContext: false,
        };
        Logger.Log("Babylon Native (v" + AbstractEngine.Version + ") launched");
        // Wrappers
        if (typeof URL === "undefined") {
            window.URL = {
                createObjectURL: function () { },
                revokeObjectURL: function () { },
            };
        }
        // TODO: Remove in next protocol version update
        if (typeof Blob === "undefined") {
            window.Blob = function (v) {
                return v;
            };
        }
        // polyfill for Chakra
        if (!Array.prototype.flat) {
            Object.defineProperty(Array.prototype, "flat", {
                configurable: true,
                value: function flat(depth) {
                    depth = isNaN(depth) ? 1 : Number(depth);
                    return depth
                        ? Array.prototype.reduce.call(this, function (acc, cur) {
                            if (Array.isArray(cur)) {
                                // eslint-disable-next-line prefer-spread
                                acc.push.apply(acc, flat.call(cur, depth - 1));
                            }
                            else {
                                acc.push(cur);
                            }
                            return acc;
                        }, [])
                        : Array.prototype.slice.call(this);
                },
                writable: true,
            });
        }
        // Currently we do not fully configure the ThinEngine on construction of NativeEngine.
        // Setup resolution scaling based on display settings.
        const devicePixelRatio = window ? window.devicePixelRatio || 1.0 : 1.0;
        this._hardwareScalingLevel = adaptToDeviceRatio ? 1.0 / devicePixelRatio : 1.0;
        this._engine.setHardwareScalingLevel(this._hardwareScalingLevel);
        this._lastDevicePixelRatio = devicePixelRatio;
        this.resize();
        const currentDepthFunction = this.getDepthFunction();
        if (currentDepthFunction) {
            this.setDepthFunction(currentDepthFunction);
        }
        // Shader processor
        this._shaderProcessor = new NativeShaderProcessor();
        this.onNewSceneAddedObservable.add((scene) => {
            this._wrapSceneRenderWithCommandScope(scene);
        });
    }
    /**
     * Brackets a scene's render with a command scope, so the commands it encodes are submitted together.
     * @param scene the scene whose render should be wrapped
     */
    _wrapSceneRenderWithCommandScope(scene) {
        const originalRender = scene.render;
        scene.render = (...args) => {
            this._commandBufferEncoder.beginCommandScope();
            try {
                originalRender.apply(scene, args);
            }
            catch (renderException) {
                // The scope must be closed even when the render throws. Otherwise it stays
                // open forever and every later frame fails with "Command scope already
                // active.", so one recoverable error permanently breaks the engine instead
                // of affecting just this frame.
                try {
                    this._commandBufferEncoder.endCommandScope();
                }
                catch (endException) {
                    // Never let this replace the root cause; report it separately instead.
                    Logger.Error(`Failed to end the command scope while unwinding a render error: ${endException}`);
                }
                throw renderException;
            }
            this._commandBufferEncoder.endCommandScope();
        };
    }
    setHardwareScalingLevel(level) {
        super.setHardwareScalingLevel(level);
        this._engine.setHardwareScalingLevel(level);
    }
    dispose() {
        super.dispose();
        if (this._boundBuffersVertexArray) {
            this._deleteVertexArray(this._boundBuffersVertexArray);
        }
        this._engine.dispose();
    }
    /**
     * Enable scissor test on a specific rectangle (ie. render will only be executed on a specific portion of the screen)
     * @param x defines the x-coordinate of the bottom left corner of the clear rectangle
     * @param y defines the y-coordinate of the corner of the clear rectangle
     * @param width defines the width of the clear rectangle
     * @param height defines the height of the clear rectangle
     */
    enableScissor(x, y, width, height) {
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETSCISSOR);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(x);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(y);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(width);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(height);
        this._commandBufferEncoder.finishEncodingCommand();
    }
    /**
     * Disable previously set scissor test rectangle
     */
    disableScissor() {
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETSCISSOR);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(0);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(0);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(0);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(0);
        this._commandBufferEncoder.finishEncodingCommand();
    }
    /**
     * Can be used to override the current requestAnimationFrame requester.
     * @internal
     */
    _queueNewFrame(bindedRenderFunction, requester) {
        // Use the provided requestAnimationFrame, unless the requester is the window. In that case, we will default to the Babylon Native version of requestAnimationFrame.
        if (requester?.requestAnimationFrame && requester !== this.getHostWindow()) {
            return requester.requestAnimationFrame(bindedRenderFunction);
        }
        else {
            this._engine.requestAnimationFrame(bindedRenderFunction);
        }
        return 0;
    }
    _restoreEngineAfterContextLost() {
        this._clearEmptyResources();
        const depthTest = this._depthCullingState.depthTest; // backup those values because the call to initEngine / wipeCaches will reset them
        const depthFunc = this._depthCullingState.depthFunc;
        const depthMask = this._depthCullingState.depthMask;
        const stencilTest = this._stencilState.stencilTest;
        this._rebuildGraphicsResources();
        this._depthCullingState.depthTest = depthTest;
        this._depthCullingState.depthFunc = depthFunc;
        this._depthCullingState.depthMask = depthMask;
        this._stencilState.stencilTest = stencilTest;
        this._flagContextRestored();
    }
    /**
     * Override default engine behavior.
     * @param framebuffer
     */
    _bindUnboundFramebuffer(framebuffer) {
        if (this._currentFramebuffer !== framebuffer) {
            if (this._currentFramebuffer) {
                this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_UNBINDFRAMEBUFFER);
                this._commandBufferEncoder.encodeCommandArgAsNativeData(this._currentFramebuffer);
                this._commandBufferEncoder.finishEncodingCommand();
            }
            if (framebuffer) {
                this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_BINDFRAMEBUFFER);
                this._commandBufferEncoder.encodeCommandArgAsNativeData(framebuffer);
                this._commandBufferEncoder.finishEncodingCommand();
            }
            this._currentFramebuffer = framebuffer;
        }
    }
    /**
     * Gets host document
     * @returns the host document object
     */
    getHostDocument() {
        return null;
    }
    clear(color, backBuffer, depth, stencil = false, stencilClearValue = 0) {
        if (depth && this.useReverseDepthBuffer) {
            // Reverse-Z: the scene is rendered with a flipped projection (near maps to 1, far to 0), so the
            // depth buffer is cleared to 0 and the comparison must accept greater values. The WebGL engine
            // sets depthCullingState.depthFunc = GEQUAL here and relies on applyStates() running the depth
            // comparison to the GL context before each draw. The native draw path does not call applyStates()
            // (only depth-test enable/disable is reconciled in _flushDepthTestState()), so setting the shared
            // state alone would never reach the backend. Route the comparison through the native command path
            // as well -- mirroring the WebGPU engine's clear path, which calls setDepthFunctionToGreaterOrEqual().
            this._depthCullingState.depthFunc = 518;
            this.setDepthFunction(518);
        }
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_CLEAR);
        this._commandBufferEncoder.encodeCommandArgAsUInt32(backBuffer && color ? 1 : 0);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(color ? color.r : 0);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(color ? color.g : 0);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(color ? color.b : 0);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(color ? color.a : 1);
        this._commandBufferEncoder.encodeCommandArgAsUInt32(depth ? 1 : 0);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(depth && this.useReverseDepthBuffer ? 0 : 1);
        this._commandBufferEncoder.encodeCommandArgAsUInt32(stencil ? 1 : 0);
        this._commandBufferEncoder.encodeCommandArgAsUInt32(stencilClearValue);
        this._commandBufferEncoder.finishEncodingCommand();
    }
    createIndexBuffer(indices, updateable, _label) {
        const data = this._normalizeIndexData(indices);
        const buffer = new NativeDataBuffer();
        buffer.references = 1;
        buffer.is32Bits = data.BYTES_PER_ELEMENT === 4;
        if (data.byteLength) {
            buffer.nativeIndexBuffer = this._engine.createIndexBuffer(data.buffer, data.byteOffset, data.byteLength, buffer.is32Bits, updateable ?? false);
        }
        return buffer;
    }
    createVertexBuffer(vertices, updateable, _label) {
        const data = ArrayBuffer.isView(vertices) ? vertices : new Float32Array(vertices);
        const buffer = new NativeDataBuffer();
        buffer.references = 1;
        if (data.byteLength) {
            buffer.nativeVertexBuffer = this._engine.createVertexBuffer(data.buffer, data.byteOffset, data.byteLength, updateable ?? false);
        }
        return buffer;
    }
    _recordVertexArrayObject(vertexArray, vertexBuffers, indexBuffer, effect, overrideVertexBuffers) {
        if (!effect._checkedNonFloatVertexBuffers) {
            checkNonFloatVertexBuffers(vertexBuffers, effect);
            effect._checkedNonFloatVertexBuffers = true;
        }
        if (indexBuffer) {
            this._engine.recordIndexBuffer(vertexArray, indexBuffer.nativeIndexBuffer);
        }
        const attributes = effect.getAttributesNames();
        for (let index = 0; index < attributes.length; index++) {
            const location = effect.getAttributeLocation(index);
            if (location >= 0) {
                const kind = attributes[index];
                let vertexBuffer = null;
                if (overrideVertexBuffers) {
                    vertexBuffer = overrideVertexBuffers[kind];
                }
                if (!vertexBuffer) {
                    vertexBuffer = vertexBuffers[kind];
                }
                if (vertexBuffer) {
                    const buffer = vertexBuffer.effectiveBuffer;
                    if (buffer && buffer.nativeVertexBuffer) {
                        this._engine.recordVertexBuffer(vertexArray, buffer.nativeVertexBuffer, location, vertexBuffer.effectiveByteOffset, vertexBuffer.effectiveByteStride, vertexBuffer.getSize(), getNativeAttribType(vertexBuffer.type), vertexBuffer.normalized, vertexBuffer.getInstanceDivisor());
                    }
                }
            }
        }
    }
    bindBuffers(vertexBuffers, indexBuffer, effect) {
        if (this._boundBuffersVertexArray) {
            this._deleteVertexArray(this._boundBuffersVertexArray);
        }
        this._boundBuffersVertexArray = this._engine.createVertexArray();
        this._recordVertexArrayObject(this._boundBuffersVertexArray, vertexBuffers, indexBuffer, effect);
        this.bindVertexArrayObject(this._boundBuffersVertexArray);
    }
    recordVertexArrayObject(vertexBuffers, indexBuffer, effect, overrideVertexBuffers) {
        const vertexArray = this._engine.createVertexArray();
        this._recordVertexArrayObject(vertexArray, vertexBuffers, indexBuffer, effect, overrideVertexBuffers);
        return vertexArray;
    }
    _deleteVertexArray(vertexArray) {
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_DELETEVERTEXARRAY);
        this._commandBufferEncoder.encodeCommandArgAsNativeData(vertexArray);
        this._commandBufferEncoder.finishEncodingCommand();
    }
    bindVertexArrayObject(vertexArray) {
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_BINDVERTEXARRAY);
        this._commandBufferEncoder.encodeCommandArgAsNativeData(vertexArray);
        this._commandBufferEncoder.finishEncodingCommand();
    }
    releaseVertexArrayObject(vertexArray) {
        this._deleteVertexArray(vertexArray);
    }
    getAttributes(pipelineContext, attributesNames) {
        const nativePipelineContext = pipelineContext;
        const nativeShaderProcessingContext = nativePipelineContext.shaderProcessingContext;
        remappedAttributesNames.length = 0;
        for (let index = 0; index < attributesNames.length; index++) {
            const origAttributeName = attributesNames[index];
            const attributeName = nativeShaderProcessingContext.remappedAttributeNames[origAttributeName] ?? origAttributeName;
            remappedAttributesNames[index] = attributeName;
        }
        return this._engine.getAttributes(nativePipelineContext.program, remappedAttributesNames);
    }
    /**
     * Triangle Fan and Line Loop are not supported by modern rendering API
     * @param fillMode  defines the primitive to use
     * @returns true if supported
     */
    _checkSupportedFillMode(fillMode) {
        if (fillMode == 5 || fillMode == 8) {
            if (!this._fillModeWarningDisplayed) {
                Logger.Warn("Line Loop and Triangle Fan are not supported fill modes with Babylon Native. Elements with these fill mode will not be visible.");
                this._fillModeWarningDisplayed = true;
            }
            return false;
        }
        return true;
    }
    /**
     * Draw a list of indexed primitives
     * @param fillMode defines the primitive to use
     * @param indexStart defines the starting index
     * @param indexCount defines the number of index to draw
     * @param instancesCount defines the number of instances to draw (if instantiation is enabled)
     */
    drawElementsType(fillMode, indexStart, indexCount, instancesCount) {
        if (!this._checkSupportedFillMode(fillMode)) {
            return;
        }
        // Apply states
        this._flushDepthTestState();
        this._drawCalls.addCount(1, false);
        if (instancesCount) {
            this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_DRAWINDEXEDINSTANCED);
            this._commandBufferEncoder.encodeCommandArgAsUInt32(fillMode);
            this._commandBufferEncoder.encodeCommandArgAsUInt32(indexStart);
            this._commandBufferEncoder.encodeCommandArgAsUInt32(indexCount);
            this._commandBufferEncoder.encodeCommandArgAsUInt32(instancesCount);
        }
        else {
            this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_DRAWINDEXED);
            this._commandBufferEncoder.encodeCommandArgAsUInt32(fillMode);
            this._commandBufferEncoder.encodeCommandArgAsUInt32(indexStart);
            this._commandBufferEncoder.encodeCommandArgAsUInt32(indexCount);
        }
        this._commandBufferEncoder.finishEncodingCommand();
    }
    /**
     * Draw a list of unindexed primitives
     * @param fillMode defines the primitive to use
     * @param verticesStart defines the index of first vertex to draw
     * @param verticesCount defines the count of vertices to draw
     * @param instancesCount defines the number of instances to draw (if instantiation is enabled)
     */
    drawArraysType(fillMode, verticesStart, verticesCount, instancesCount) {
        if (!this._checkSupportedFillMode(fillMode)) {
            return;
        }
        // Apply states
        this._flushDepthTestState();
        this._drawCalls.addCount(1, false);
        if (instancesCount) {
            this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_DRAWINSTANCED);
            this._commandBufferEncoder.encodeCommandArgAsUInt32(fillMode);
            this._commandBufferEncoder.encodeCommandArgAsUInt32(verticesStart);
            this._commandBufferEncoder.encodeCommandArgAsUInt32(verticesCount);
            this._commandBufferEncoder.encodeCommandArgAsUInt32(instancesCount);
        }
        else {
            this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_DRAW);
            this._commandBufferEncoder.encodeCommandArgAsUInt32(fillMode);
            this._commandBufferEncoder.encodeCommandArgAsUInt32(verticesStart);
            this._commandBufferEncoder.encodeCommandArgAsUInt32(verticesCount);
        }
        this._commandBufferEncoder.finishEncodingCommand();
    }
    createPipelineContext(shaderProcessingContext) {
        const isAsync = !!this._caps.parallelShaderCompile;
        return new NativePipelineContext(this, isAsync, shaderProcessingContext);
    }
    createMaterialContext() {
        return undefined;
    }
    createDrawContext() {
        return undefined;
    }
    /**
     * Function is not technically Async
     * @internal
     */
    // eslint-disable-next-line no-restricted-syntax
    _preparePipelineContextAsync(pipelineContext, vertexSourceCode, fragmentSourceCode, createAsRaw, _rawVertexSourceCode, _rawFragmentSourceCode, _rebuildRebind, defines, _transformFeedbackVaryings, _key, onReady) {
        if (createAsRaw) {
            this.createRawShaderProgram();
        }
        else {
            this.createShaderProgram(pipelineContext, vertexSourceCode, fragmentSourceCode, defines);
        }
        onReady();
    }
    /**
     * @internal
     */
    _getShaderProcessingContext(_shaderLanguage) {
        return new NativeShaderProcessingContext();
    }
    /**
     * @internal
     */
    _executeWhenRenderingStateIsCompiled(pipelineContext, action) {
        const nativePipelineContext = pipelineContext;
        if (nativePipelineContext.isAsync) {
            if (nativePipelineContext.onCompiled) {
                const oldHandler = nativePipelineContext.onCompiled;
                nativePipelineContext.onCompiled = () => {
                    oldHandler();
                    action();
                };
            }
            else {
                nativePipelineContext.onCompiled = action;
            }
        }
        else {
            action();
        }
    }
    createRawShaderProgram() {
        throw new Error("Not Supported");
    }
    createShaderProgram(pipelineContext, vertexCode, fragmentCode, defines) {
        const nativePipelineContext = pipelineContext;
        this.onBeforeShaderCompilationObservable.notifyObservers(this);
        const vertexInliner = new ShaderCodeInliner(vertexCode);
        vertexInliner.processCode();
        vertexCode = vertexInliner.code;
        const fragmentInliner = new ShaderCodeInliner(fragmentCode);
        fragmentInliner.processCode();
        fragmentCode = fragmentInliner.code;
        vertexCode = ThinEngine._ConcatenateShader(vertexCode, defines);
        fragmentCode = ThinEngine._ConcatenateShader(fragmentCode, defines);
        const onSuccess = () => {
            nativePipelineContext.isCompiled = true;
            nativePipelineContext.onCompiled?.();
            this.onAfterShaderCompilationObservable.notifyObservers(this);
        };
        if (pipelineContext.isAsync) {
            nativePipelineContext.program = this._engine.createProgramAsync(vertexCode, fragmentCode, onSuccess, (error) => {
                nativePipelineContext.compilationError = error;
            });
        }
        else {
            try {
                nativePipelineContext.program = this._engine.createProgram(vertexCode, fragmentCode);
                onSuccess();
            }
            catch (e) {
                const message = e?.message;
                throw new Error("SHADER ERROR" + (typeof message === "string" ? "\n" + message : ""), { cause: e });
            }
        }
        return nativePipelineContext.program;
    }
    /**
     * Inline functions in shader code that are marked to be inlined
     * @param code code to inline
     * @returns inlined code
     */
    inlineShaderCode(code) {
        const sci = new ShaderCodeInliner(code);
        sci.debug = false;
        sci.processCode();
        return sci.code;
    }
    _setProgram(program) {
        if (this._currentProgram !== program) {
            this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETPROGRAM);
            this._commandBufferEncoder.encodeCommandArgAsNativeData(program);
            this._commandBufferEncoder.finishEncodingCommand();
            this._currentProgram = program;
        }
    }
    _deletePipelineContext(pipelineContext) {
        const nativePipelineContext = pipelineContext;
        if (nativePipelineContext && nativePipelineContext.program) {
            this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_DELETEPROGRAM);
            this._commandBufferEncoder.encodeCommandArgAsNativeData(nativePipelineContext.program);
            this._commandBufferEncoder.finishEncodingCommand();
        }
    }
    getUniforms(pipelineContext, uniformsNames) {
        const nativePipelineContext = pipelineContext;
        return this._engine.getUniforms(nativePipelineContext.program, uniformsNames);
    }
    bindUniformBlock(pipelineContext, blockName, index) {
        // TODO
        throw new Error("Not Implemented");
    }
    bindSamplers(effect) {
        const nativePipelineContext = effect.getPipelineContext();
        this._setProgram(nativePipelineContext.program);
        // TODO: share this with engine?
        const samplers = effect.getSamplers();
        for (let index = 0; index < samplers.length; index++) {
            const uniform = effect.getUniform(samplers[index]);
            if (uniform) {
                this._boundUniforms[index] = uniform;
            }
        }
        this._currentEffect = null;
    }
    getRenderWidth(useScreen = false) {
        if (!useScreen && this._currentRenderTarget) {
            return this._currentRenderTarget.width;
        }
        return this._engine.getRenderWidth();
    }
    getRenderHeight(useScreen = false) {
        if (!useScreen && this._currentRenderTarget) {
            return this._currentRenderTarget.height;
        }
        return this._engine.getRenderHeight();
    }
    setViewport(viewport, requiredWidth, requiredHeight) {
        this._cachedViewport = viewport;
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETVIEWPORT);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(viewport.x);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(viewport.y);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(viewport.width);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(viewport.height);
        this._commandBufferEncoder.finishEncodingCommand();
    }
    setStateCullFaceType(cullBackFaces, force) {
        const cullBack = this.cullBackFaces ?? cullBackFaces ?? true;
        if (this._cachedCullBackFaces === cullBack && !force) {
            return;
        }
        this._cachedCullBackFaces = cullBack;
        // Native uses an immediate command-buffer state model (no lazy _depthCullingState), so
        // re-issue the last COMMAND_SETSTATE payload with only the cull face changed. The zOffset
        // values are the ones that command actually encoded rather than the live _zOffset fields,
        // which setZOffset()/setZOffsetUnits() can update independently (and encode with the
        // opposite sign under a reverse depth buffer).
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETSTATE);
        this._commandBufferEncoder.encodeCommandArgAsUInt32(this._cachedCulling ? 1 : 0);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(this._cachedZOffset);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(this._cachedZOffsetUnits);
        this._commandBufferEncoder.encodeCommandArgAsUInt32(cullBack ? 1 : 0);
        this._commandBufferEncoder.encodeCommandArgAsUInt32(this._cachedReverseSide ? 1 : 0);
        this._commandBufferEncoder.finishEncodingCommand();
    }
    setState(culling, zOffset = 0, force, reverseSide = false, cullBackFaces, stencil, zOffsetUnits = 0) {
        this._zOffset = zOffset;
        this._zOffsetUnits = zOffsetUnits;
        if (this._zOffset !== 0) {
            Logger.Warn("zOffset is not supported in Native engine.");
        }
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETSTATE);
        this._commandBufferEncoder.encodeCommandArgAsUInt32(culling ? 1 : 0);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(zOffset);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(zOffsetUnits);
        this._commandBufferEncoder.encodeCommandArgAsUInt32((this.cullBackFaces ?? cullBackFaces ?? true) ? 1 : 0);
        this._commandBufferEncoder.encodeCommandArgAsUInt32(reverseSide ? 1 : 0);
        this._commandBufferEncoder.finishEncodingCommand();
        // Cache the resolved state so setStateCullFaceType() can re-issue it with a new cull face.
        this._cachedCulling = culling;
        this._cachedReverseSide = reverseSide;
        this._cachedCullBackFaces = this.cullBackFaces ?? cullBackFaces ?? true;
        this._cachedZOffset = zOffset;
        this._cachedZOffsetUnits = zOffsetUnits;
    }
    /**
     * Gets the client rect of native canvas.  Needed for InputManager.
     * @returns a client rectangle
     */
    getInputElementClientRect() {
        const rect = {
            bottom: this.getRenderHeight(),
            height: this.getRenderHeight(),
            left: 0,
            right: this.getRenderWidth(),
            top: 0,
            width: this.getRenderWidth(),
            x: 0,
            y: 0,
            toJSON: () => { },
        };
        return rect;
    }
    /**
     * Set the z offset Factor to apply to current rendering
     * @param value defines the offset to apply
     */
    setZOffset(value) {
        if (value !== this._zOffset) {
            this._zOffset = value;
            this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETZOFFSET);
            this._commandBufferEncoder.encodeCommandArgAsFloat32(this.useReverseDepthBuffer ? -value : value);
            this._commandBufferEncoder.finishEncodingCommand();
        }
    }
    /**
     * Gets the current value of the zOffset Factor
     * @returns the current zOffset Factor state
     */
    getZOffset() {
        return this._zOffset;
    }
    /**
     * Set the z offset Units to apply to current rendering
     * @param value defines the offset to apply
     */
    setZOffsetUnits(value) {
        if (value !== this._zOffsetUnits) {
            this._zOffsetUnits = value;
            this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETZOFFSETUNITS);
            this._commandBufferEncoder.encodeCommandArgAsFloat32(this.useReverseDepthBuffer ? -value : value);
            this._commandBufferEncoder.finishEncodingCommand();
        }
    }
    /**
     * Gets the current value of the zOffset Units
     * @returns the current zOffset Units state
     */
    getZOffsetUnits() {
        return this._zOffsetUnits;
    }
    /**
     * Enable or disable depth buffering
     * @param enable defines the state to set
     */
    setDepthBuffer(enable) {
        // Keep the shared depth-culling state in sync so that code paths which toggle
        // depth testing through engine.depthCullingState.depthTest (for example
        // EffectRenderer.applyEffectWrapper) are also honored on the native side. The
        // native draw path does not go through the WebGL applyStates() flush, so the
        // value is reconciled in _flushDepthTestState() right before each draw.
        this._depthCullingState.depthTest = enable;
        this._encodeDepthTest(enable);
    }
    _encodeDepthTest(enable) {
        this._depthTestEnabled = enable;
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETDEPTHTEST);
        this._commandBufferEncoder.encodeCommandArgAsUInt32(enable ? this._currentDepthTest : _native.Engine.DEPTH_TEST_ALWAYS);
        this._commandBufferEncoder.finishEncodingCommand();
    }
    _flushDepthTestState() {
        // Unlike the WebGL engine, the native engine does not call applyStates() before
        // a draw, so depth-test toggles made directly on engine.depthCullingState are
        // flushed here to match the cross-engine contract.
        if (this._depthCullingState.depthTest !== this._depthTestEnabled) {
            this._encodeDepthTest(this._depthCullingState.depthTest);
        }
    }
    applyStates() {
        // The base ThinEngine.applyStates() drives the WebGL context (this._gl) directly, which is null on
        // Native. Flush the depth-culling state through the native command path instead, so callers that
        // mutate engine.depthCullingState directly and then call applyStates() (e.g. the depth-peeling / OIT
        // renderer) take effect. Alpha and stencil state are applied on Native via their dedicated setters
        // (setAlphaMode / setStencil*), which encode their commands when called.
        const depthCullingState = this._depthCullingState;
        if (depthCullingState.depthFunc !== null && depthCullingState.depthFunc !== undefined) {
            this.setDepthFunction(depthCullingState.depthFunc);
        }
        this.setDepthBuffer(depthCullingState.depthTest);
        this.setDepthWrite(depthCullingState.depthMask);
    }
    /**
     * Gets a boolean indicating if depth writing is enabled
     * @returns the current depth writing state
     */
    getDepthWrite() {
        return this._depthWrite;
    }
    getDepthFunction() {
        switch (this._currentDepthTest) {
            case _native.Engine.DEPTH_TEST_NEVER:
                return 512;
            case _native.Engine.DEPTH_TEST_ALWAYS:
                return 519;
            case _native.Engine.DEPTH_TEST_GREATER:
                return 516;
            case _native.Engine.DEPTH_TEST_GEQUAL:
                return 518;
            case _native.Engine.DEPTH_TEST_NOTEQUAL:
                return 517;
            case _native.Engine.DEPTH_TEST_EQUAL:
                return 514;
            case _native.Engine.DEPTH_TEST_LESS:
                return 513;
            case _native.Engine.DEPTH_TEST_LEQUAL:
                return 515;
        }
        return null;
    }
    setDepthFunction(depthFunc) {
        let nativeDepthFunc = 0;
        switch (depthFunc) {
            case 512:
                nativeDepthFunc = _native.Engine.DEPTH_TEST_NEVER;
                break;
            case 519:
                nativeDepthFunc = _native.Engine.DEPTH_TEST_ALWAYS;
                break;
            case 516:
                nativeDepthFunc = _native.Engine.DEPTH_TEST_GREATER;
                break;
            case 518:
                nativeDepthFunc = _native.Engine.DEPTH_TEST_GEQUAL;
                break;
            case 517:
                nativeDepthFunc = _native.Engine.DEPTH_TEST_NOTEQUAL;
                break;
            case 514:
                nativeDepthFunc = _native.Engine.DEPTH_TEST_EQUAL;
                break;
            case 513:
                nativeDepthFunc = _native.Engine.DEPTH_TEST_LESS;
                break;
            case 515:
                nativeDepthFunc = _native.Engine.DEPTH_TEST_LEQUAL;
                break;
        }
        this._currentDepthTest = nativeDepthFunc;
        // Route through _encodeDepthTest so the tracked _depthTestEnabled state stays in
        // sync with the encoded command. Because COMMAND_SETDEPTHTEST conflates the
        // compare function and the enable bit (DEPTH_TEST_ALWAYS == disabled), encoding
        // the new function directly here would silently re-enable depth testing while
        // depth testing is logically disabled; _encodeDepthTest honors the current
        // depthCullingState.depthTest and only emits the new function when enabled.
        this._encodeDepthTest(this._depthCullingState.depthTest);
    }
    /**
     * Enable or disable depth writing
     * @param enable defines the state to set
     */
    setDepthWrite(enable) {
        this._depthWrite = enable;
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETDEPTHWRITE);
        this._commandBufferEncoder.encodeCommandArgAsUInt32(Number(enable));
        this._commandBufferEncoder.finishEncodingCommand();
    }
    /**
     * Enable or disable color writing
     * @param enable defines the state to set
     */
    setColorWrite(enable) {
        this._colorWrite = enable;
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETCOLORWRITE);
        this._commandBufferEncoder.encodeCommandArgAsUInt32(Number(enable));
        this._commandBufferEncoder.finishEncodingCommand();
    }
    /**
     * Gets a boolean indicating if color writing is enabled
     * @returns the current color writing state
     */
    getColorWrite() {
        return this._colorWrite;
    }
    applyStencil() {
        this._setStencil(this._stencilMask, getNativeStencilOpFail(this._stencilOpStencilFail), getNativeStencilDepthFail(this._stencilOpDepthFail), getNativeStencilDepthPass(this._stencilOpStencilDepthPass), getNativeStencilFunc(this._stencilFunc), this._stencilFuncRef);
    }
    _setStencil(mask, stencilOpFail, depthOpFail, depthOpPass, func, ref) {
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETSTENCIL);
        this._commandBufferEncoder.encodeCommandArgAsUInt32(mask);
        this._commandBufferEncoder.encodeCommandArgAsUInt32(stencilOpFail);
        this._commandBufferEncoder.encodeCommandArgAsUInt32(depthOpFail);
        this._commandBufferEncoder.encodeCommandArgAsUInt32(depthOpPass);
        this._commandBufferEncoder.encodeCommandArgAsUInt32(func);
        this._commandBufferEncoder.encodeCommandArgAsUInt32(ref);
        this._commandBufferEncoder.finishEncodingCommand();
    }
    /**
     * Enable or disable the stencil buffer
     * @param enable defines if the stencil buffer must be enabled or disabled
     */
    setStencilBuffer(enable) {
        this._stencilTest = enable;
        if (enable) {
            this.applyStencil();
        }
        else {
            this._setStencil(255, _native.Engine.STENCIL_OP_FAIL_S_KEEP, _native.Engine.STENCIL_OP_FAIL_Z_KEEP, _native.Engine.STENCIL_OP_PASS_Z_KEEP, _native.Engine.STENCIL_TEST_ALWAYS, 0);
        }
    }
    /**
     * Gets a boolean indicating if stencil buffer is enabled
     * @returns the current stencil buffer state
     */
    getStencilBuffer() {
        return this._stencilTest;
    }
    /**
     * Gets the current stencil operation when stencil passes
     * @returns a number defining stencil operation to use when stencil passes
     */
    getStencilOperationPass() {
        return this._stencilOpStencilDepthPass;
    }
    /**
     * Sets the stencil operation to use when stencil passes
     * @param operation defines the stencil operation to use when stencil passes
     */
    setStencilOperationPass(operation) {
        this._stencilOpStencilDepthPass = operation;
        this.applyStencil();
    }
    /**
     * Sets the current stencil mask
     * @param mask defines the new stencil mask to use
     */
    setStencilMask(mask) {
        this._stencilMask = mask;
        this.applyStencil();
    }
    /**
     * Sets the current stencil function
     * @param stencilFunc defines the new stencil function to use
     */
    setStencilFunction(stencilFunc) {
        this._stencilFunc = stencilFunc;
        this.applyStencil();
    }
    /**
     * Sets the current stencil reference
     * @param reference defines the new stencil reference to use
     */
    setStencilFunctionReference(reference) {
        this._stencilFuncRef = reference;
        this.applyStencil();
    }
    /**
     * Sets the current stencil mask
     * @param mask defines the new stencil mask to use
     */
    setStencilFunctionMask(mask) {
        this._stencilFuncMask = mask;
    }
    /**
     * Sets the stencil operation to use when stencil fails
     * @param operation defines the stencil operation to use when stencil fails
     */
    setStencilOperationFail(operation) {
        this._stencilOpStencilFail = operation;
        this.applyStencil();
    }
    /**
     * Sets the stencil operation to use when depth fails
     * @param operation defines the stencil operation to use when depth fails
     */
    setStencilOperationDepthFail(operation) {
        this._stencilOpDepthFail = operation;
        this.applyStencil();
    }
    /**
     * Gets the current stencil mask
     * @returns a number defining the new stencil mask to use
     */
    getStencilMask() {
        return this._stencilMask;
    }
    /**
     * Gets the current stencil function
     * @returns a number defining the stencil function to use
     */
    getStencilFunction() {
        return this._stencilFunc;
    }
    /**
     * Gets the current stencil reference value
     * @returns a number defining the stencil reference value to use
     */
    getStencilFunctionReference() {
        return this._stencilFuncRef;
    }
    /**
     * Gets the current stencil mask
     * @returns a number defining the stencil mask to use
     */
    getStencilFunctionMask() {
        return this._stencilFuncMask;
    }
    /**
     * Gets the current stencil operation when stencil fails
     * @returns a number defining stencil operation to use when stencil fails
     */
    getStencilOperationFail() {
        return this._stencilOpStencilFail;
    }
    /**
     * Gets the current stencil operation when depth fails
     * @returns a number defining stencil operation to use when depth fails
     */
    getStencilOperationDepthFail() {
        return this._stencilOpDepthFail;
    }
    /**
     * Sets alpha constants used by some alpha blending modes
     * @param r defines the red component
     * @param g defines the green component
     * @param b defines the blue component
     * @param a defines the alpha component
     */
    setAlphaConstants(r, g, b, a) {
        throw new Error("Setting alpha blend constant color not yet implemented.");
    }
    /**
     * Sets the current alpha mode
     * @param mode defines the mode to use (one of the BABYLON.undefined)
     * @param noDepthWriteChange defines if depth writing state should remains unchanged (false by default)
     * @param targetIndex defines the index of the target to set the alpha mode for (default is 0)
     * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/advanced/transparent_rendering
     */
    setAlphaMode(mode, noDepthWriteChange = false, targetIndex = 0) {
        if (this._alphaMode[targetIndex] === mode) {
            return;
        }
        const nativeMode = getNativeAlphaMode(mode);
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETBLENDMODE);
        this._commandBufferEncoder.encodeCommandArgAsUInt32(nativeMode);
        this._commandBufferEncoder.finishEncodingCommand();
        if (!noDepthWriteChange) {
            this.setDepthWrite(mode === 0);
        }
        this._alphaMode[targetIndex] = mode;
    }
    setInt(uniform, int) {
        if (!uniform) {
            return false;
        }
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETINT);
        this._commandBufferEncoder.encodeCommandArgAsNativeData(uniform);
        this._commandBufferEncoder.encodeCommandArgAsInt32(int);
        this._commandBufferEncoder.finishEncodingCommand();
        return true;
    }
    setIntArray(uniform, array) {
        if (!uniform) {
            return false;
        }
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETINTARRAY);
        this._commandBufferEncoder.encodeCommandArgAsNativeData(uniform);
        this._commandBufferEncoder.encodeCommandArgAsInt32s(array);
        this._commandBufferEncoder.finishEncodingCommand();
        return true;
    }
    setIntArray2(uniform, array) {
        if (!uniform) {
            return false;
        }
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETINTARRAY2);
        this._commandBufferEncoder.encodeCommandArgAsNativeData(uniform);
        this._commandBufferEncoder.encodeCommandArgAsInt32s(array);
        this._commandBufferEncoder.finishEncodingCommand();
        return true;
    }
    setIntArray3(uniform, array) {
        if (!uniform) {
            return false;
        }
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETINTARRAY3);
        this._commandBufferEncoder.encodeCommandArgAsNativeData(uniform);
        this._commandBufferEncoder.encodeCommandArgAsInt32s(array);
        this._commandBufferEncoder.finishEncodingCommand();
        return true;
    }
    setIntArray4(uniform, array) {
        if (!uniform) {
            return false;
        }
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETINTARRAY4);
        this._commandBufferEncoder.encodeCommandArgAsNativeData(uniform);
        this._commandBufferEncoder.encodeCommandArgAsInt32s(array);
        this._commandBufferEncoder.finishEncodingCommand();
        return true;
    }
    setFloatArray(uniform, array) {
        if (!uniform) {
            return false;
        }
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETFLOATARRAY);
        this._commandBufferEncoder.encodeCommandArgAsNativeData(uniform);
        this._commandBufferEncoder.encodeCommandArgAsFloat32s(array);
        this._commandBufferEncoder.finishEncodingCommand();
        return true;
    }
    setFloatArray2(uniform, array) {
        if (!uniform) {
            return false;
        }
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETFLOATARRAY2);
        this._commandBufferEncoder.encodeCommandArgAsNativeData(uniform);
        this._commandBufferEncoder.encodeCommandArgAsFloat32s(array);
        this._commandBufferEncoder.finishEncodingCommand();
        return true;
    }
    setFloatArray3(uniform, array) {
        if (!uniform) {
            return false;
        }
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETFLOATARRAY3);
        this._commandBufferEncoder.encodeCommandArgAsNativeData(uniform);
        this._commandBufferEncoder.encodeCommandArgAsFloat32s(array);
        this._commandBufferEncoder.finishEncodingCommand();
        return true;
    }
    setFloatArray4(uniform, array) {
        if (!uniform) {
            return false;
        }
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETFLOATARRAY4);
        this._commandBufferEncoder.encodeCommandArgAsNativeData(uniform);
        this._commandBufferEncoder.encodeCommandArgAsFloat32s(array);
        this._commandBufferEncoder.finishEncodingCommand();
        return true;
    }
    setArray(uniform, array) {
        if (!uniform) {
            return false;
        }
        return this.setFloatArray(uniform, new Float32Array(array));
    }
    setArray2(uniform, array) {
        if (!uniform) {
            return false;
        }
        return this.setFloatArray2(uniform, new Float32Array(array));
    }
    setArray3(uniform, array) {
        if (!uniform) {
            return false;
        }
        return this.setFloatArray3(uniform, new Float32Array(array));
    }
    setArray4(uniform, array) {
        if (!uniform) {
            return false;
        }
        return this.setFloatArray4(uniform, new Float32Array(array));
    }
    setMatrices(uniform, matrices) {
        if (!uniform) {
            return false;
        }
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETMATRICES);
        this._commandBufferEncoder.encodeCommandArgAsNativeData(uniform);
        this._commandBufferEncoder.encodeCommandArgAsFloat32s(matrices);
        this._commandBufferEncoder.finishEncodingCommand();
        return true;
    }
    setMatrix3x3(uniform, matrix) {
        if (!uniform) {
            return false;
        }
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETMATRIX3X3);
        this._commandBufferEncoder.encodeCommandArgAsNativeData(uniform);
        this._commandBufferEncoder.encodeCommandArgAsFloat32s(matrix);
        this._commandBufferEncoder.finishEncodingCommand();
        return true;
    }
    setMatrix2x2(uniform, matrix) {
        if (!uniform) {
            return false;
        }
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETMATRIX2X2);
        this._commandBufferEncoder.encodeCommandArgAsNativeData(uniform);
        this._commandBufferEncoder.encodeCommandArgAsFloat32s(matrix);
        this._commandBufferEncoder.finishEncodingCommand();
        return true;
    }
    setFloat(uniform, value) {
        if (!uniform) {
            return false;
        }
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETFLOAT);
        this._commandBufferEncoder.encodeCommandArgAsNativeData(uniform);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(value);
        this._commandBufferEncoder.finishEncodingCommand();
        return true;
    }
    setFloat2(uniform, x, y) {
        if (!uniform) {
            return false;
        }
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETFLOAT2);
        this._commandBufferEncoder.encodeCommandArgAsNativeData(uniform);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(x);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(y);
        this._commandBufferEncoder.finishEncodingCommand();
        return true;
    }
    setFloat3(uniform, x, y, z) {
        if (!uniform) {
            return false;
        }
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETFLOAT3);
        this._commandBufferEncoder.encodeCommandArgAsNativeData(uniform);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(x);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(y);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(z);
        this._commandBufferEncoder.finishEncodingCommand();
        return true;
    }
    setFloat4(uniform, x, y, z, w) {
        if (!uniform) {
            return false;
        }
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETFLOAT4);
        this._commandBufferEncoder.encodeCommandArgAsNativeData(uniform);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(x);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(y);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(z);
        this._commandBufferEncoder.encodeCommandArgAsFloat32(w);
        this._commandBufferEncoder.finishEncodingCommand();
        return true;
    }
    setColor3(uniform, color3) {
        if (!uniform) {
            return false;
        }
        this.setFloat3(uniform, color3.r, color3.g, color3.b);
        return true;
    }
    setColor4(uniform, color3, alpha) {
        if (!uniform) {
            return false;
        }
        this.setFloat4(uniform, color3.r, color3.g, color3.b, alpha);
        return true;
    }
    wipeCaches(bruteForce) {
        if (this.preventCacheWipeBetweenFrames) {
            return;
        }
        this.resetTextureCache();
        this._currentEffect = null;
        if (bruteForce) {
            this._currentProgram = null;
            this._stencilStateComposer.reset();
            this._depthCullingState.reset();
            this._alphaState.reset();
        }
        this._cachedVertexBuffers = null;
        this._cachedIndexBuffer = null;
        this._cachedEffectForVertexBuffers = null;
    }
    _createTexture() {
        return this._engine.createTexture();
    }
    _deleteTexture(texture) {
        if (texture) {
            this._engine.deleteTexture(texture.underlyingResource);
        }
    }
    /**
     * Update the content of a dynamic texture
     * @param texture defines the texture to update
     * @param canvas defines the canvas containing the source
     * @param invertY defines if data must be stored with Y axis inverted
     * @param premulAlpha defines if alpha is stored as premultiplied
     * @param format defines the format of the data
     */
    updateDynamicTexture(texture, canvas, invertY, premulAlpha = false, format) {
        if (!!texture && !!texture._hardwareTexture) {
            const destination = texture._hardwareTexture.underlyingResource;
            const context = canvas.getContext();
            // flush need to happen before getCanvasTexture: flush will create the render target synchronously (if it's not been created before)
            context.flush();
            const source = canvas.getCanvasTexture();
            this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_COPYTEXTURE);
            this._commandBufferEncoder.encodeCommandArgAsNativeData(source);
            this._commandBufferEncoder.encodeCommandArgAsNativeData(destination);
            this._commandBufferEncoder.finishEncodingCommand();
            texture.isReady = true;
        }
    }
    createDynamicTexture(width, height, generateMipMaps, samplingMode) {
        // Canvas dimensions are integral in browsers. Coerce before allocating so the native dimensions and byte length agree.
        // Keep at least 1x1 because many bgfx methods assume a non-zero texture size.
        width = Math.max(Math.floor(width), 1);
        height = Math.max(Math.floor(height), 1);
        return this.createRawTexture(new Uint8Array(width * height * 4), width, height, 5, false, false, samplingMode);
    }
    createVideoElement(constraints) {
        // create native object depending on stream. Only NativeCamera is supported for now.
        if (this._camera) {
            return this._camera.createVideo(constraints);
        }
        return null;
    }
    updateVideoTexture(texture, video, invertY) {
        if (texture && texture._hardwareTexture && this._camera) {
            const webGLTexture = texture._hardwareTexture.underlyingResource;
            this._camera.updateVideoTexture(webGLTexture, video, invertY);
        }
    }
    createRawTexture(data, width, height, format, generateMipMaps, invertY, samplingMode, compression = null, type = 0, creationFlags = 0, useSRGBBuffer = false) {
        const texture = new InternalTexture(this, 3 /* InternalTextureSource.Raw */);
        texture.format = format;
        texture.generateMipMaps = generateMipMaps;
        texture.samplingMode = samplingMode;
        texture.invertY = invertY;
        texture.baseWidth = width;
        texture.baseHeight = height;
        texture.width = texture.baseWidth;
        texture.height = texture.baseHeight;
        texture._compression = compression;
        texture.type = type;
        texture._useSRGBBuffer = this._getUseSRGBBuffer(useSRGBBuffer, !generateMipMaps);
        this.updateRawTexture(texture, data, format, invertY, compression, type, texture._useSRGBBuffer);
        if (texture._hardwareTexture) {
            const webGLTexture = texture._hardwareTexture.underlyingResource;
            const filter = getNativeSamplingMode(samplingMode);
            this._setTextureSampling(webGLTexture, filter);
        }
        this._internalTexturesCache.push(texture);
        return texture;
    }
    createRawTexture2DArray(data, width, height, depth, format, generateMipMaps, invertY, samplingMode, compression = null, textureType = 0) {
        const texture = new InternalTexture(this, 11 /* InternalTextureSource.Raw2DArray */);
        texture.baseWidth = width;
        texture.baseHeight = height;
        texture.baseDepth = depth;
        texture.width = width;
        texture.height = height;
        texture.depth = depth;
        texture.format = format;
        texture.type = textureType;
        texture.generateMipMaps = generateMipMaps;
        texture.samplingMode = samplingMode;
        texture.is2DArray = true;
        if (texture._hardwareTexture) {
            const nativeTexture = texture._hardwareTexture.underlyingResource;
            this._engine.loadRawTexture2DArray(nativeTexture, data, width, height, depth, getNativeTextureFormat(format, textureType), generateMipMaps, invertY);
            const filter = getNativeSamplingMode(samplingMode);
            this._setTextureSampling(nativeTexture, filter);
        }
        texture.isReady = true;
        this._internalTexturesCache.push(texture);
        return texture;
    }
    updateRawTexture(texture, bufferView, format, invertY, compression = null, type = 0, useSRGBBuffer = false) {
        if (!texture) {
            return;
        }
        if (bufferView && texture._hardwareTexture) {
            const underlyingResource = texture._hardwareTexture.underlyingResource;
            this._engine.loadRawTexture(underlyingResource, bufferView, texture.width, texture.height, getNativeTextureFormat(format, type), texture.generateMipMaps, texture.invertY);
        }
        texture.isReady = true;
    }
    // TODO: Refactor to share more logic with babylon.engine.ts version.
    /**
     * Usually called from Texture.ts.
     * Passed information to create a NativeTexture
     * @param url defines a value which contains one of the following:
     * * A conventional http URL, e.g. 'http://...' or 'file://...'
     * * A base64 string of in-line texture data, e.g. 'data:image/jpg;base64,/...'
     * * An indicator that data being passed using the buffer parameter, e.g. 'data:mytexture.jpg'
     * @param noMipmap defines a boolean indicating that no mipmaps shall be generated.  Ignored for compressed textures.  They must be in the file
     * @param invertY when true, image is flipped when loaded.  You probably want true. Certain compressed textures may invert this if their default is inverted (eg. ktx)
     * @param scene needed for loading to the correct scene
     * @param samplingMode mode with should be used sample / access the texture (Default: Texture.TRILINEAR_SAMPLINGMODE)
     * @param onLoad optional callback to be called upon successful completion
     * @param onError optional callback to be called upon failure
     * @param buffer a source of a file previously fetched as either a base64 string, an ArrayBuffer (compressed or image format), HTMLImageElement (image format), or a Blob
     * @param fallback an internal argument in case the function must be called again, due to etc1 not having alpha capabilities
     * @param format internal format.  Default: RGB when extension is '.jpg' else RGBA.  Ignored for compressed textures
     * @param forcedExtension defines the extension to use to pick the right loader
     * @param mimeType defines an optional mime type
     * @param loaderOptions options to be passed to the loader
     * @param creationFlags specific flags to use when creating the texture (1 for storage textures, for eg)
     * @param useSRGBBuffer defines if the texture must be loaded in a sRGB GPU buffer (if supported by the GPU).
     * @returns a InternalTexture for assignment back into BABYLON.Texture
     */
    createTexture(url, noMipmap, invertY, scene, samplingMode = 3, onLoad = null, onError = null, buffer = null, fallback = null, format = null, forcedExtension = null, mimeType, loaderOptions, creationFlags, useSRGBBuffer = false) {
        url = url || "";
        const fromData = url.substring(0, 5) === "data:";
        //const fromBlob = url.substring(0, 5) === "blob:";
        const isBase64 = fromData && url.indexOf(";base64,") !== -1;
        const texture = fallback ? fallback : new InternalTexture(this, 1 /* InternalTextureSource.Url */);
        const originalUrl = url;
        if (this._transformTextureUrl && !isBase64 && !fallback && !buffer) {
            url = this._transformTextureUrl(url);
        }
        // establish the file extension, if possible
        const lastDot = url.lastIndexOf(".");
        const extension = forcedExtension ? forcedExtension : lastDot > -1 ? url.substring(lastDot).toLowerCase() : "";
        // some formats are already supported by bimg, no need to try to load them with JS
        // leaving TextureLoader extension check for future use
        let loaderPromise = null;
        if (extension.endsWith(".basis") || extension.endsWith(".ktx") || extension.endsWith(".ktx2") || mimeType === "image/ktx" || mimeType === "image/ktx2") {
            loaderPromise = AbstractEngine.GetCompatibleTextureLoader(extension);
        }
        if (scene) {
            scene.addPendingData(texture);
        }
        texture.url = url;
        texture.generateMipMaps = !noMipmap;
        texture.samplingMode = samplingMode;
        texture.invertY = invertY;
        texture._useSRGBBuffer = this._getUseSRGBBuffer(useSRGBBuffer, noMipmap);
        if (!this.doNotHandleContextLost) {
            // Keep a link to the buffer only if we plan to handle context lost
            texture._buffer = buffer;
        }
        let onLoadObserver = null;
        if (onLoad && !fallback) {
            onLoadObserver = texture.onLoadedObservable.add(onLoad);
        }
        if (!fallback) {
            this._internalTexturesCache.push(texture);
        }
        const onInternalError = (message, exception) => {
            if (scene) {
                scene.removePendingData(texture);
            }
            if (url === originalUrl) {
                if (onLoadObserver) {
                    texture.onLoadedObservable.remove(onLoadObserver);
                }
                if (EngineStore.UseFallbackTexture) {
                    this.createTexture(EngineStore.FallbackTexture, noMipmap, texture.invertY, scene, samplingMode, null, onError, buffer, texture);
                }
                if (onError) {
                    onError((message || "Unknown error") + (EngineStore.UseFallbackTexture ? " - Fallback texture was used" : ""), exception);
                }
            }
            else {
                // fall back to the original url if the transformed url fails to load
                Logger.Warn(`Failed to load ${url}, falling back to ${originalUrl}`);
                this.createTexture(originalUrl, noMipmap, texture.invertY, scene, samplingMode, onLoad, onError, buffer, texture, format, forcedExtension, mimeType, loaderOptions);
            }
        };
        // processing for non-image formats
        if (loaderPromise) {
            throw new Error("Loading textures from IInternalTextureLoader not yet implemented.");
        }
        else {
            const onload = (data) => {
                if (!texture._hardwareTexture) {
                    if (scene) {
                        scene.removePendingData(texture);
                    }
                    return;
                }
                const underlyingResource = texture._hardwareTexture.underlyingResource;
                this._engine.loadTexture(underlyingResource, data, !noMipmap, invertY, texture._useSRGBBuffer, () => {
                    texture.baseWidth = this._engine.getTextureWidth(underlyingResource);
                    texture.baseHeight = this._engine.getTextureHeight(underlyingResource);
                    texture.width = texture.baseWidth;
                    texture.height = texture.baseHeight;
                    texture.isReady = true;
                    const filter = getNativeSamplingMode(samplingMode);
                    this._setTextureSampling(underlyingResource, filter);
                    if (scene) {
                        scene.removePendingData(texture);
                    }
                    texture.onLoadedObservable.notifyObservers(texture);
                    texture.onLoadedObservable.clear();
                }, () => {
                    throw new Error("Could not load a native texture.");
                });
            };
            if (fromData && buffer) {
                if (buffer instanceof ArrayBuffer) {
                    onload(new Uint8Array(buffer));
                }
                else if (ArrayBuffer.isView(buffer)) {
                    onload(buffer);
                }
                else if (typeof buffer === "string") {
                    onload(new Uint8Array(DecodeBase64UrlToBinary(buffer)));
                }
                else {
                    throw new Error("Unsupported buffer type");
                }
            }
            else {
                if (isBase64) {
                    onload(new Uint8Array(DecodeBase64UrlToBinary(url)));
                }
                else {
                    this._loadFile(url, (data) => onload(new Uint8Array(data)), undefined, undefined, true, (request, exception) => {
                        onInternalError("Unable to load " + (request ? request.responseURL : url, exception));
                    });
                }
            }
        }
        return texture;
    }
    /**
     * Wraps an external native texture in a Babylon texture.
     * @param texture defines the external texture
     * @param hasMipMaps defines whether the external texture has mip maps
     * @param samplingMode defines the sampling mode for the external texture (default: 3)
     * @returns the babylon internal texture
     */
    wrapNativeTexture(texture, hasMipMaps = false, samplingMode = 3) {
        const hardwareTexture = new NativeHardwareTexture(texture, this._engine);
        const internalTexture = new InternalTexture(this, 15 /* InternalTextureSource.External */, true);
        internalTexture._hardwareTexture = hardwareTexture;
        internalTexture.baseWidth = this._engine.getTextureWidth(texture);
        internalTexture.baseHeight = this._engine.getTextureHeight(texture);
        internalTexture.width = internalTexture.baseWidth;
        internalTexture.height = internalTexture.baseHeight;
        if (this._engine.getTextureLayerCount) {
            const layerCount = this._engine.getTextureLayerCount(texture);
            if (layerCount > 1) {
                internalTexture.is2DArray = true;
                internalTexture.baseDepth = internalTexture.depth = layerCount;
            }
        }
        internalTexture.isReady = true;
        internalTexture.useMipMaps = hasMipMaps;
        this.updateTextureSamplingMode(samplingMode, internalTexture);
        return internalTexture;
    }
    /**
     * Replaces the underlying native texture handle of a texture previously created via {@link wrapNativeTexture},
     * preserving the InternalTexture identity.
     *
     * Intended for the device-loss / device-restored flow (a DisableRendering / EnableRendering cycle from the host
     * application): when the host recreates its external resource on the new graphics device, it calls this method to
     * repoint Babylon's wrapper at the new handle without losing references held by materials, render-target wrappers,
     * particle systems, etc.
     *
     * The new handle must match the wrapped texture's recorded dimensions. To change dimensions, dispose the wrapped
     * texture and call {@link wrapNativeTexture} again. Sampling mode and mip-map flag are properties of the logical
     * wrapped texture and are re-applied to the new resource. Any render-target wrapper holding this texture as its
     * color attachment has its framebuffer rebuilt with the new handle.
     *
     * Throws if the target was not produced by {@link wrapNativeTexture}, if the new handle's dimensions don't match,
     * if the wrapped texture is part of a multi render-target, or if the wrapper has a depth/stencil texture (these
     * are not supported in this version; dispose and re-wrap).
     * @param internalTexture defines the wrapped InternalTexture to repoint
     * @param texture defines the new native texture handle to wrap
     */
    updateWrappedNativeTexture(internalTexture, texture) {
        if (internalTexture.source !== 15 /* InternalTextureSource.External */) {
            throw new Error("updateWrappedNativeTexture: target InternalTexture was not produced by wrapNativeTexture.");
        }
        const newWidth = this._engine.getTextureWidth(texture);
        const newHeight = this._engine.getTextureHeight(texture);
        if (newWidth !== internalTexture.baseWidth || newHeight !== internalTexture.baseHeight) {
            throw new Error(`updateWrappedNativeTexture: new handle dimensions (${newWidth}x${newHeight}) must match the wrapped texture's dimensions (${internalTexture.baseWidth}x${internalTexture.baseHeight}).`);
        }
        if (this._engine.getTextureLayerCount) {
            const newLayerCount = this._engine.getTextureLayerCount(texture);
            const oldLayerCount = internalTexture.is2DArray ? internalTexture.depth : 1;
            if (newLayerCount !== oldLayerCount) {
                throw new Error(`updateWrappedNativeTexture: new handle layer count (${newLayerCount}) must match the wrapped texture's layer count (${oldLayerCount}).`);
            }
        }
        // Pre-validate before mutating any state so a thrown precondition leaves the InternalTexture untouched.
        // Note: rtWrapper.texture only returns _textures[0]; walk every attachment to catch the multi-RT case where
        // the wrapped texture is at index > 0.
        for (const rtWrapper of this._renderTargetWrapperCache) {
            if (!rtWrapper.textures?.includes(internalTexture)) {
                continue;
            }
            if (rtWrapper.isMulti) {
                throw new Error("updateWrappedNativeTexture: wrapped texture is part of a multi render-target; not supported. Dispose and re-wrap.");
            }
            if (rtWrapper._depthStencilTexture) {
                // After a DisableRendering / EnableRendering cycle the bgfx framebuffer + the depth/stencil texture's
                // bgfx handle are both stale. Rebuilding the depth/stencil texture from the wrapper's stored settings
                // is feasible but non-trivial; v1 rejects and asks the caller to dispose + re-wrap.
                throw new Error("updateWrappedNativeTexture: wrapped texture's render-target wrapper has a depth/stencil texture; not supported. Dispose and re-wrap.");
            }
        }
        internalTexture._hardwareTexture = new NativeHardwareTexture(texture, this._engine);
        internalTexture.isReady = true;
        this.updateTextureSamplingMode(internalTexture.samplingMode, internalTexture);
        // Rebuild the framebuffer of any render-target wrapper holding this wrapped texture as its color attachment.
        // After a DisableRendering / EnableRendering cycle the bgfx framebuffer handle is stale; the consumer-supplied
        // new texture is the moment we have a fresh handle to rebuild against.
        for (const rtWrapper of this._renderTargetWrapperCache) {
            if (rtWrapper.texture !== internalTexture) {
                continue;
            }
            const nativeRTWrapper = rtWrapper;
            // NativeRenderTargetWrapper._framebuffer setter releases the old framebuffer before assigning,
            // so no manual _releaseFramebufferObjects call is needed (and would double-delete the handle).
            nativeRTWrapper._framebuffer = this._engine.createFrameBuffer(texture, rtWrapper.width, rtWrapper.height, rtWrapper._generateStencilBuffer, rtWrapper._generateDepthBuffer, rtWrapper.samples ?? 1);
        }
    }
    _createDepthStencilTexture(size, options, rtWrapper) {
        // TODO: handle other options?
        const generateStencil = options.generateStencil || false;
        const samples = options.samples || 1;
        const nativeRTWrapper = rtWrapper;
        const texture = new InternalTexture(this, 12 /* InternalTextureSource.DepthStencil */);
        const width = size.width ?? size;
        const height = size.height ?? size;
        const layers = size.layers || 0;
        const depth = size.depth || 0;
        // Populate the standard depth/stencil texture metadata, mirroring ThinEngine._setupDepthStencilTexture.
        // In particular `samples` must be set so consumers such as the FrameGraph texture manager report the
        // correct sample count; leaving it at the InternalTexture default (0) breaks FrameGraph MSAA
        // depth/output sample-count validation. `is2DArray`/`depth` matter for the texture-array depth targets
        // used by cascaded shadow maps.
        texture.baseWidth = width;
        texture.baseHeight = height;
        texture.width = width;
        texture.height = height;
        texture.is2DArray = layers > 0;
        texture.depth = layers || depth;
        texture.isReady = true;
        texture.samples = samples;
        texture.generateMipMaps = false;
        texture.samplingMode = options.bilinearFiltering ? 2 : 1;
        texture.type = 0;
        texture._comparisonFunction = options.comparisonFunction ?? 0;
        const framebuffer = this._engine.createFrameBuffer(texture._hardwareTexture.underlyingResource, width, height, generateStencil, true, samples);
        nativeRTWrapper._framebufferDepthStencil = framebuffer;
        return texture;
    }
    /**
     * @internal
     */
    _releaseFramebufferObjects(framebuffer) {
        if (framebuffer) {
            this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_DELETEFRAMEBUFFER);
            this._commandBufferEncoder.encodeCommandArgAsNativeData(framebuffer);
            this._commandBufferEncoder.finishEncodingCommand();
        }
    }
    /**
     * @internal Engine abstraction for loading and creating an image bitmap from a given source string.
     * @param imageSource source to load the image from.
     * @param _options An object that sets options for the image's extraction.
     * @returns ImageBitmap
     */
    async _createImageBitmapFromSource(imageSource, _options) {
        const promise = new Promise((resolve, reject) => {
            const image = this.createCanvasImage();
            image.onload = () => {
                try {
                    const imageBitmap = this._engine.createImageBitmap(image);
                    resolve(imageBitmap);
                }
                catch (error) {
                    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                    reject(`Error loading image ${image.src} with exception: ${error}`);
                }
            };
            image.onerror = (error) => {
                // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                reject(`Error loading image ${image.src} with exception: ${error}`);
            };
            image.src = imageSource;
        });
        return await promise;
    }
    /**
     * Engine abstraction for createImageBitmap
     * @param image source for image
     * @param options An object that sets options for the image's extraction.
     * @returns ImageBitmap
     */
    async createImageBitmap(image, options) {
        // Back-compat: Because of the previous Blob hack, this could be an array of BlobParts.
        if (Array.isArray(image)) {
            const arr = image;
            if (arr.length) {
                return this._engine.createImageBitmap(arr[0]);
            }
        }
        if (image instanceof Blob) {
            const data = await image.arrayBuffer();
            return this._engine.createImageBitmap(data);
        }
        throw new Error("Unsupported data for createImageBitmap.");
    }
    /**
     * Resize an image and returns the image data as an uint8array
     * @param image image to resize
     * @param bufferWidth destination buffer width
     * @param bufferHeight destination buffer height
     * @returns an uint8array containing RGBA values of bufferWidth * bufferHeight size
     */
    resizeImageBitmap(image, bufferWidth, bufferHeight) {
        return this._engine.resizeImageBitmap(image, bufferWidth, bufferHeight);
    }
    /** @internal */
    _createHardwareTexture() {
        return new NativeHardwareTexture(this._createTexture(), this._engine);
    }
    /** @internal */
    _createHardwareRenderTargetWrapper(isMulti, isCube, size) {
        const rtWrapper = new NativeRenderTargetWrapper(isMulti, isCube, size, this);
        this._renderTargetWrapperCache.push(rtWrapper);
        return rtWrapper;
    }
    /** @internal */
    _createInternalTexture(size, options, _delayGPUTextureCreation = true, source = 0 /* InternalTextureSource.Unknown */) {
        let generateMipMaps;
        let type = 0;
        let samplingMode = 3;
        let format = 5;
        let useSRGBBuffer = false;
        let samples = 1;
        let label;
        if (options !== undefined && typeof options === "object") {
            generateMipMaps = !!options.generateMipMaps;
            type = options.type === undefined ? 0 : options.type;
            samplingMode = options.samplingMode === undefined ? 3 : options.samplingMode;
            format = options.format === undefined ? 5 : options.format;
            useSRGBBuffer = options.useSRGBBuffer === undefined ? false : options.useSRGBBuffer;
            samples = options.samples ?? 1;
            label = options.label;
        }
        else {
            generateMipMaps = !!options;
        }
        useSRGBBuffer = this._getUseSRGBBuffer(useSRGBBuffer, !generateMipMaps);
        if (type === 1 && !this._caps.textureFloatLinearFiltering) {
            // if floating point linear (gl.FLOAT) then force to NEAREST_SAMPLINGMODE
            samplingMode = 1;
        }
        else if (type === 2 && !this._caps.textureHalfFloatLinearFiltering) {
            // if floating point linear (HALF_FLOAT) then force to NEAREST_SAMPLINGMODE
            samplingMode = 1;
        }
        if (type === 1 && !this._caps.textureFloat) {
            type = 0;
            Logger.Warn("Float textures are not supported. Type forced to TEXTURETYPE_UNSIGNED_BYTE");
        }
        const texture = new InternalTexture(this, source);
        const width = size.width ?? size;
        const height = size.height ?? size;
        const layers = size.layers || 0;
        if (layers !== 0) {
            throw new Error("Texture layers are not supported in Babylon Native");
        }
        const nativeTexture = texture._hardwareTexture.underlyingResource;
        const nativeTextureFormat = getNativeTextureFormat(format, type);
        // TODO(bgfx-msaa-mips): stopgap workaround for a bgfx bug -- D3D11/D3D12/Vulkan backends share one
        // texture descriptor between the MSAA render target and the non-MSAA resolve target, so requesting
        // both mips > 1 and samples > 1 makes the API (D3D11 E_INVALIDARG, Vulkan VUID-02257, ...) reject the
        // MSAA texture creation. Force hasMips = false here to keep the combo from reaching bgfx. The fix
        // belongs in bgfx (separate descs per target, like OpenGL/WebGL do with a non-mipped renderbuffer);
        // this guard should be removed once a fixed bgfx ships in a stable BabylonNative npm release. Tracked
        // in BabylonNative#1714. Cost: MSAA RTs on Native lose post-resolve auto-mipgen and diverge from
        // WebGL/WebGPU semantics -- texture.generateMipMaps stays true on the InternalTexture but the
        // underlying bgfx resource has 1 mip.
        const hasMips = samples > 1 ? false : generateMipMaps;
        // REVIEW: We are always setting the renderTarget flag as we don't know whether the texture will be used as a render target.
        this._engine.initializeTexture(nativeTexture, width, height, hasMips, nativeTextureFormat, true, useSRGBBuffer, samples);
        this._setTextureSampling(nativeTexture, getNativeSamplingMode(samplingMode));
        texture._useSRGBBuffer = useSRGBBuffer;
        texture.baseWidth = width;
        texture.baseHeight = height;
        texture.width = width;
        texture.height = height;
        texture.depth = layers;
        texture.isReady = true;
        texture.samples = samples;
        texture.generateMipMaps = generateMipMaps;
        texture.samplingMode = samplingMode;
        texture.type = type;
        texture.format = format;
        texture.label = label;
        this._internalTexturesCache.push(texture);
        return texture;
    }
    createRenderTargetTexture(size, options) {
        const rtWrapper = this._createHardwareRenderTargetWrapper(false, false, size);
        let generateDepthBuffer = true;
        let generateStencilBuffer = false;
        let noColorAttachment = false;
        let colorAttachment = undefined;
        let samples = 1;
        if (options !== undefined && typeof options === "object") {
            generateDepthBuffer = options.generateDepthBuffer ?? true;
            generateStencilBuffer = !!options.generateStencilBuffer;
            noColorAttachment = !!options.noColorAttachment;
            colorAttachment = options.colorAttachment;
            samples = options.samples ?? 1;
        }
        const texture = colorAttachment || (noColorAttachment ? null : this._createInternalTexture(size, options, true, 5 /* InternalTextureSource.RenderTarget */));
        const width = size.width ?? size;
        const height = size.height ?? size;
        const framebuffer = this._engine.createFrameBuffer(texture ? texture._hardwareTexture.underlyingResource : null, width, height, generateStencilBuffer, generateDepthBuffer, samples);
        rtWrapper._framebuffer = framebuffer;
        rtWrapper._generateDepthBuffer = generateDepthBuffer;
        rtWrapper._generateStencilBuffer = generateStencilBuffer;
        rtWrapper._samples = samples;
        rtWrapper.setTextures(texture);
        return rtWrapper;
    }
    createRenderTargetCubeTexture(size, options) {
        const rtWrapper = this._createHardwareRenderTargetWrapper(false, true, size);
        let generateDepthBuffer = true;
        let generateStencilBuffer = false;
        let generateMipMaps = false;
        let type = 0;
        let samplingMode = 3;
        let format = 5;
        let samples = 1;
        let label;
        if (options !== undefined && typeof options === "object") {
            generateDepthBuffer = options.generateDepthBuffer ?? true;
            generateStencilBuffer = !!options.generateStencilBuffer;
            generateMipMaps = !!options.generateMipMaps;
            type = options.type ?? 0;
            samplingMode = options.samplingMode ?? 3;
            format = options.format ?? 5;
            samples = options.samples ?? 1;
            label = options.label;
        }
        // Match _createInternalTexture: float/half-float RTTs that the platform can't linearly filter fall
        // back to NEAREST so the cube RTT never carries an unsupported sampling mode.
        if (type === 1 && !this._caps.textureFloatLinearFiltering) {
            samplingMode = 1;
        }
        else if (type === 2 && !this._caps.textureHalfFloatLinearFiltering) {
            samplingMode = 1;
        }
        if (type === 1 && !this._caps.textureFloat) {
            type = 0;
            Logger.Warn("Float textures are not supported. Type forced to TEXTURETYPE_UNSIGNED_BYTE");
        }
        const texture = new InternalTexture(this, 5 /* InternalTextureSource.RenderTarget */);
        texture.isCube = true;
        texture.baseWidth = size;
        texture.baseHeight = size;
        texture.width = size;
        texture.height = size;
        texture.isReady = true;
        texture.samples = samples;
        texture.generateMipMaps = generateMipMaps;
        texture.samplingMode = samplingMode;
        texture.type = type;
        texture.format = format;
        texture.label = label;
        const nativeTexture = texture._hardwareTexture.underlyingResource;
        const nativeTextureFormat = getNativeTextureFormat(format, type);
        // See the createRenderTargetTexture MSAA/mips note: avoid the mips + samples combo on bgfx.
        const hasMips = samples > 1 ? false : generateMipMaps;
        this._engine.initializeTexture(nativeTexture, size, size, hasMips, nativeTextureFormat, /*renderTarget*/ true, /*srgb*/ false, samples, /*isCube*/ true);
        this._setTextureSampling(nativeTexture, getNativeSamplingMode(samplingMode));
        // The native engine cannot render to all six faces through one framebuffer, so create one
        // framebuffer per face (the C++ side binds the matching cube layer); bindFramebuffer(faceIndex)
        // then selects the right one.
        const framebuffers = [];
        for (let face = 0; face < 6; face++) {
            framebuffers.push(this._engine.createFrameBuffer(nativeTexture, size, size, generateStencilBuffer, generateDepthBuffer, samples, face));
        }
        rtWrapper._framebuffers = framebuffers;
        rtWrapper._generateDepthBuffer = generateDepthBuffer;
        rtWrapper._generateStencilBuffer = generateStencilBuffer;
        rtWrapper._samples = samples;
        rtWrapper.setTextures(texture);
        // Track the hand-built cube RTT texture the same way _createInternalTexture tracks 2D textures so it
        // participates in engine-wide lifecycle management (dispose iteration, context rebuild, stats).
        this._internalTexturesCache.push(texture);
        return rtWrapper;
    }
    createMultipleRenderTarget(size, options, _initializeBuffers = true) {
        const rtWrapper = this._createHardwareRenderTargetWrapper(true, false, size);
        let generateMipMaps = false;
        let generateDepthBuffer = true;
        let generateStencilBuffer = false;
        let generateDepthTexture = false;
        let textureCount = 1;
        let samples = 1;
        let types = [];
        let samplingModes = [];
        let formats = [];
        let targets = [];
        let faceIndex = [];
        let layerIndex = [];
        let labels = [];
        let dontCreateTextures = false;
        if (options !== undefined) {
            generateMipMaps = options.generateMipMaps ?? false;
            generateDepthBuffer = options.generateDepthBuffer ?? true;
            generateStencilBuffer = options.generateStencilBuffer ?? false;
            generateDepthTexture = options.generateDepthTexture ?? false;
            textureCount = options.textureCount ?? 1;
            samples = options.samples ?? 1;
            types = options.types || types;
            samplingModes = options.samplingModes || samplingModes;
            formats = options.formats || formats;
            targets = options.targetTypes || targets;
            faceIndex = options.faceIndex || faceIndex;
            layerIndex = options.layerIndex || layerIndex;
            labels = options.labels || labels;
            dontCreateTextures = options.dontCreateTextures ?? false;
        }
        rtWrapper.label = options?.label ?? "MultiRenderTargetWrapper";
        const width = size.width ?? size;
        const height = size.height ?? size;
        const textures = [];
        const attachments = [];
        for (let i = 0; i < textureCount; i++) {
            const samplingMode = samplingModes[i] || 3;
            let type = types[i] || 0;
            const format = formats[i] || 5;
            const target = targets[i] || 3553;
            attachments.push(i);
            // target === -1 marks an attachment with no engine-created texture; dontCreateTextures defers them.
            if (target === -1 || dontCreateTextures) {
                continue;
            }
            if (type === 1 && !this._caps.textureFloat) {
                type = 0;
                Logger.Warn("Float textures are not supported. Multi render target attachment forced to TEXTURETYPE_UNSIGNED_BYTE type");
            }
            const texture = new InternalTexture(this, 6 /* InternalTextureSource.MultiRenderTarget */);
            const nativeTexture = texture._hardwareTexture.underlyingResource;
            if (target !== 3553) {
                // Native multi render targets currently only attach 2D color textures; cube / 2D-array
                // attachments are created as 2D so the attachment still exists and mrt.textures[i] is populated.
                Logger.Warn("Multi render target attachment target " + target + " is not supported on Native; using a 2D texture.");
            }
            // bgfx auto-generates the mip chain on resolve; avoid the mips + MSAA combo (see createRenderTargetTexture).
            const hasMips = samples > 1 ? false : generateMipMaps;
            this._engine.initializeTexture(nativeTexture, width, height, hasMips, getNativeTextureFormat(format, type), /*renderTarget*/ true, /*srgb*/ false, samples);
            this._setTextureSampling(nativeTexture, getNativeSamplingMode(samplingMode));
            texture.baseWidth = width;
            texture.baseHeight = height;
            texture.width = width;
            texture.height = height;
            texture.isReady = true;
            texture.samples = samples;
            texture.generateMipMaps = generateMipMaps;
            texture.samplingMode = samplingMode;
            texture.type = type;
            texture.format = format;
            texture.label = labels[i] ?? rtWrapper.label + "-Texture" + i;
            textures[i] = texture;
            this._internalTexturesCache.push(texture);
        }
        rtWrapper._generateDepthBuffer = generateDepthBuffer || generateDepthTexture;
        rtWrapper._generateStencilBuffer = generateStencilBuffer;
        rtWrapper._samples = samples;
        rtWrapper._attachments = attachments;
        rtWrapper.setTextures(textures);
        rtWrapper.setLayerAndFaceIndices(layerIndex, faceIndex);
        // The native engine creates one framebuffer with all the color attachments (bgfx writes to every
        // attachment of the bound framebuffer, so there is no drawBuffers equivalent to issue per draw).
        this._createMultiRenderTargetFramebuffer(rtWrapper);
        return rtWrapper;
    }
    /**
     * Creates (or recreates) the native framebuffer of a multi render target from the color attachment
     * textures currently held by the wrapper. bgfx binds a fixed attachment set when a framebuffer is
     * created and cannot re-point an individual attachment the way GL's framebufferTexture2D can, so the
     * whole framebuffer has to be recreated whenever an attachment is swapped after creation (e.g. the OIT
     * depth-peeling renderer replaces every attachment via MultiRenderTarget.setInternalTexture).
     * @param rtWrapper The multi render target wrapper to build the framebuffer for.
     * @internal
     */
    _createMultiRenderTargetFramebuffer(rtWrapper) {
        const textures = rtWrapper.textures;
        if (!textures) {
            return;
        }
        const colorHandles = [];
        for (const texture of textures) {
            const handle = texture?._hardwareTexture?.underlyingResource;
            if (handle) {
                colorHandles.push(handle);
            }
        }
        // bgfx framebuffers use a dense, ordered attachment list, so only (re)build once every expected color
        // attachment is present. Building from a partial set (e.g. attachments deferred via dontCreateTextures /
        // targetTypes[i] === -1, or filled out of order) would compress the attachment indices -- attachment 2
        // would become attachment 1, etc. -- and produce a framebuffer that does not match the MRT layout. The
        // count match guarantees the collected handles are contiguous and in attachment order.
        const expectedCount = rtWrapper._attachments ? rtWrapper._attachments.length : colorHandles.length;
        if (colorHandles.length === 0 || colorHandles.length !== expectedCount) {
            return;
        }
        const width = rtWrapper.width;
        const height = rtWrapper.height;
        if (this._engine.createMultiFrameBuffer) {
            rtWrapper._framebuffer = this._engine.createMultiFrameBuffer(colorHandles, width, height, rtWrapper._generateStencilBuffer, rtWrapper._generateDepthBuffer, rtWrapper._samples);
        }
        else {
            // Older Babylon Native binaries (predating multi render target support) do not expose createMultiFrameBuffer.
            // Fall back to a single-attachment framebuffer bound to the first color target so the scene keeps rendering.
            // Warn once (limit 1): the framebuffer can be rebuilt many times during attachment setup/swaps.
            Logger.Warn("createMultiFrameBuffer is not supported by this version of Babylon Native; multi render targets are unavailable. Falling back to a single-attachment framebuffer bound to the first color target.", 1);
            rtWrapper._framebuffer = this._engine.createFrameBuffer(colorHandles[0], width, height, rtWrapper._generateStencilBuffer, rtWrapper._generateDepthBuffer, rtWrapper._samples);
        }
    }
    generateMipMapsForCubemap(_texture, _unbind = true) {
        // The WebGL path rebinds gl.TEXTURE_CUBE_MAP and calls gl.generateMipmap; both deref _gl, which is
        // null on Native. bgfx auto-generates the mip chain when a render target texture created with mips is
        // resolved (the same way 2D RTTs get their mips here -- unBindFramebuffer issues no explicit mipgen),
        // so this is a no-op on Native.
    }
    bindAttachments(_attachments) {
        // No-op on Native: bgfx renders to every color attachment of the bound framebuffer, so there is
        // no gl.drawBuffers equivalent to select a subset.
    }
    buildTextureLayout(textureStatus, _backBufferLayout = false) {
        // Native has no gl draw-buffer enums; return a per-attachment index list (consumers only use the
        // length/order, and bindAttachments is a no-op).
        const result = [];
        for (let i = 0; i < textureStatus.length; i++) {
            result.push(textureStatus[i] ? i : -1);
        }
        return result;
    }
    restoreSingleAttachment() {
        // No-op on Native (see bindAttachments).
    }
    restoreSingleAttachmentForRenderTarget() {
        // No-op on Native (see bindAttachments).
    }
    generateMipMapsMultiFramebuffer(_texture) {
        // No-op on Native: bgfx auto-generates mips on render-target resolve (as for 2D/cube RTTs).
    }
    resolveMultiFramebuffer(_texture) {
        // No-op on Native: bgfx resolves MSAA render targets automatically.
    }
    unBindMultiColorAttachmentFramebuffer(_rtWrapper, _disableGenerateMipMaps = false, onBeforeUnbind) {
        this._currentRenderTarget = null;
        if (onBeforeUnbind) {
            onBeforeUnbind();
        }
        this._bindUnboundFramebuffer(null);
    }
    updateMultipleRenderTargetTextureSampleCount(rtWrapper, samples, _initializeBuffers = true) {
        if (!rtWrapper || rtWrapper.samples === samples) {
            return samples;
        }
        const textures = rtWrapper.textures;
        if (!textures) {
            return rtWrapper.samples;
        }
        const nativeRTWrapper = rtWrapper;
        // bgfx couples MSAA to the texture creation flags (see updateRenderTargetTextureSampleCount), so
        // changing the sample count after the fact requires reissuing every color attachment's underlying
        // bgfx handle with the new MSAA flag. initializeTexture disposes the old handle and allocates a fresh
        // one while preserving the InternalTexture / Graphics::Texture identity; only the internal bgfx handle
        // rotates. Afterwards the framebuffer is recreated so its attachment list refers to the new handles.
        for (const texture of textures) {
            // Wrapped (External-source) textures own an opaque external handle (format=-1); reinitializing
            // would destroy it and getNativeTextureFormat would throw, so leave those attachments untouched.
            if (!texture?._hardwareTexture || texture.source === 15 /* InternalTextureSource.External */) {
                continue;
            }
            const nativeTexture = texture._hardwareTexture.underlyingResource;
            // See the bgfx-msaa-mips workaround in updateRenderTargetTextureSampleCount (BabylonNative#1714).
            const hasMips = samples > 1 ? false : texture.generateMipMaps;
            this._engine.initializeTexture(nativeTexture, texture.baseWidth, texture.baseHeight, hasMips, getNativeTextureFormat(texture.format, texture.type), 
            /*renderTarget*/ true, texture._useSRGBBuffer, samples);
            texture.samples = samples;
        }
        nativeRTWrapper._samples = samples;
        this._createMultiRenderTargetFramebuffer(nativeRTWrapper);
        return samples;
    }
    updateRenderTargetTextureSampleCount(rtWrapper, samples) {
        if (rtWrapper.samples === samples) {
            return samples;
        }
        const texture = rtWrapper.texture;
        if (!texture?._hardwareTexture) {
            return rtWrapper.samples;
        }
        // Wrapped (External-source) textures carry an opaque external handle with unknown format/type.
        // Recreating the underlying bgfx texture here would destroy the wrapped handle, breaking the
        // consumer's ownership contract, and getNativeTextureFormat would throw on format=-1 anyway.
        // Reject the request explicitly with a targeted error rather than failing deeper in the stack.
        if (texture.source === 15 /* InternalTextureSource.External */) {
            throw new Error("updateRenderTargetTextureSampleCount: changing MSAA samples is not supported on wrapped (External-source) textures. Dispose and re-wrap with the desired samples.");
        }
        const nativeRTWrapper = rtWrapper;
        const nativeTexture = texture._hardwareTexture.underlyingResource;
        // bgfx couples MSAA to the texture creation flags, so changing samples after the fact requires
        // recreating the underlying bgfx texture handle with the new MSAA flag. initializeTexture on the
        // Native side calls Graphics::Texture::Create2D, which disposes the existing bgfx handle and
        // allocates a fresh one. The Graphics::Texture / InternalTexture wrapper identity is preserved --
        // only the internal bgfx handle rotates. After the texture is reissued we also recreate the
        // framebuffer so its attachment list refers to the new handle.
        //
        // TODO(bgfx-msaa-mips): stopgap workaround for a bgfx bug. D3D11 forbids MipLevels > 1 on
        // multisampled textures (E_INVALIDARG on CreateTexture2D); D3D12/Vulkan have equivalent rules. bgfx's
        // D3D11 backend uses one D3D11_TEXTURE2D_DESC for both the MSAA render texture (m_rt2d) and the
        // non-MSAA sample target (m_texture2d) and doesn't reset desc.MipLevels between them -- so requesting
        // samples > 1 with hasMips = true crashes at m_rt2d creation. The trigger in practice is the glTF
        // transmission helper, which creates an `opaqueSceneTexture` RTT with generateMipmaps: true and
        // immediately sets samples = 4. WebGL2 sidesteps this with a separate non-mipped multisample
        // renderbuffer; bgfx D3D11 conflates the two-stage pattern. The proper fix lives in bgfx (per-backend
        // patches reset MipLevels=1 for the MSAA target). Tracked in BabylonNative#1714. Until that ships
        // through bgfx -> bgfx.cmake -> BabylonNative -> stable npm, force hasMips = false here so the bad
        // combo never reaches bgfx. Cost: MSAA RTs on Native lose post-resolve auto-mipgen and diverge from
        // WebGL/WebGPU semantics -- texture.generateMipMaps still reads true on the JS side, but the
        // underlying bgfx resource has 1 mip level. Remove this guard once a fixed bgfx is in stable BN npm.
        const hasMips = samples > 1 ? false : texture.generateMipMaps;
        const nativeTextureFormat = getNativeTextureFormat(texture.format, texture.type);
        const isCube = texture.isCube;
        this._engine.initializeTexture(nativeTexture, texture.baseWidth, texture.baseHeight, hasMips, nativeTextureFormat, 
        /*renderTarget*/ true, texture._useSRGBBuffer, samples, isCube);
        if (isCube) {
            // Cube RTTs render through one framebuffer per face (see createRenderTargetCubeTexture). The
            // underlying bgfx handle was just rotated, so recreate all six attachments; the _framebuffers
            // setter releases the stale ones and keeps _framebuffer aliased to face 0 for single-target paths.
            const framebuffers = [];
            for (let face = 0; face < 6; face++) {
                framebuffers.push(this._engine.createFrameBuffer(nativeTexture, texture.baseWidth, texture.baseHeight, rtWrapper._generateStencilBuffer, rtWrapper._generateDepthBuffer, samples, face));
            }
            nativeRTWrapper._framebuffers = framebuffers;
        }
        else {
            // NativeRenderTargetWrapper._framebuffer setter releases the old framebuffer before assigning,
            // so no manual _releaseFramebufferObjects call is needed (and would double-delete the handle).
            nativeRTWrapper._framebuffer = this._engine.createFrameBuffer(nativeTexture, texture.baseWidth, texture.baseHeight, rtWrapper._generateStencilBuffer, rtWrapper._generateDepthBuffer, samples);
        }
        rtWrapper._samples = samples;
        texture.samples = samples;
        return samples;
    }
    updateTextureSamplingMode(samplingMode, texture) {
        if (texture._hardwareTexture) {
            const filter = getNativeSamplingMode(samplingMode);
            this._setTextureSampling(texture._hardwareTexture.underlyingResource, filter);
        }
        texture.samplingMode = samplingMode;
    }
    bindFramebuffer(texture, faceIndex, requiredWidth, requiredHeight, forceFullscreenViewport) {
        const nativeRTWrapper = texture;
        if (this._currentRenderTarget) {
            this.unBindFramebuffer(this._currentRenderTarget);
        }
        this._currentRenderTarget = texture;
        if (requiredWidth || requiredHeight) {
            throw new Error("Required width/height for frame buffers not yet supported in NativeEngine.");
        }
        if (nativeRTWrapper._framebuffers) {
            // Cube render target: bind the framebuffer for the requested face.
            this._bindUnboundFramebuffer(nativeRTWrapper._framebuffers[faceIndex ?? 0]);
        }
        else if (faceIndex) {
            throw new Error("Cuboid frame buffers are not yet supported in NativeEngine.");
        }
        else if (nativeRTWrapper._framebufferDepthStencil) {
            this._bindUnboundFramebuffer(nativeRTWrapper._framebufferDepthStencil);
        }
        else {
            this._bindUnboundFramebuffer(nativeRTWrapper._framebuffer);
        }
    }
    unBindFramebuffer(texture, disableGenerateMipMaps = false, onBeforeUnbind) {
        // NOTE: Disabling mipmap generation is not yet supported in NativeEngine.
        this._currentRenderTarget = null;
        if (onBeforeUnbind) {
            onBeforeUnbind();
        }
        this._bindUnboundFramebuffer(null);
    }
    createDynamicVertexBuffer(data) {
        return this.createVertexBuffer(data, true);
    }
    updateDynamicIndexBuffer(indexBuffer, indices, offset = 0) {
        const buffer = indexBuffer;
        const data = this._normalizeIndexData(indices);
        buffer.is32Bits = data.BYTES_PER_ELEMENT === 4;
        this._engine.updateDynamicIndexBuffer(buffer.nativeIndexBuffer, data.buffer, data.byteOffset, data.byteLength, offset);
    }
    updateDynamicVertexBuffer(vertexBuffer, data, byteOffset = 0, byteLength) {
        const buffer = vertexBuffer;
        const dataView = data instanceof Array ? new Float32Array(data) : ArrayBuffer.isView(data) ? data : new Uint8Array(data);
        const byteView = new Uint8Array(dataView.buffer, dataView.byteOffset, byteLength ?? dataView.byteLength);
        this._engine.updateDynamicVertexBuffer(buffer.nativeVertexBuffer, byteView.buffer, byteView.byteOffset, byteView.byteLength, byteOffset);
    }
    // TODO: Refactor to share more logic with base Engine implementation.
    /**
     * @internal
     */
    _setTexture(channel, texture, isPartOfTextureArray = false, depthStencilTexture = false) {
        const uniform = this._boundUniforms[channel];
        if (!uniform) {
            return false;
        }
        // Not ready?
        if (!texture) {
            if (this._boundTexturesCache[channel] != null) {
                this._activeChannel = channel;
                this._boundTexturesCache[channel] = null;
                this._unsetNativeTexture(uniform);
            }
            return false;
        }
        // Video
        if (texture.video) {
            this._activeChannel = channel;
            texture.update();
        }
        else if (texture.delayLoadState === 4) {
            // Delay loading
            texture.delayLoad();
            return false;
        }
        let internalTexture;
        if (depthStencilTexture) {
            internalTexture = texture.depthStencilTexture;
        }
        else if (texture.isReady()) {
            internalTexture = texture.getInternalTexture();
        }
        else if (texture.isCube) {
            internalTexture = this.emptyCubeTexture;
        }
        else if (texture.is3D) {
            internalTexture = this.emptyTexture3D;
        }
        else if (texture.is2DArray) {
            internalTexture = this.emptyTexture2DArray;
        }
        else {
            internalTexture = this.emptyTexture;
        }
        this._activeChannel = channel;
        if (!internalTexture || !internalTexture._hardwareTexture) {
            return false;
        }
        this._setTextureWrapMode(internalTexture._hardwareTexture.underlyingResource, getNativeAddressMode(texture.wrapU), getNativeAddressMode(texture.wrapV), getNativeAddressMode(texture.wrapR));
        this._updateAnisotropicLevel(texture);
        this._setNativeTexture(uniform, internalTexture._hardwareTexture.underlyingResource);
        return true;
    }
    // filter is a NativeFilter.XXXX value.
    _setTextureSampling(texture, filter) {
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETTEXTURESAMPLING);
        this._commandBufferEncoder.encodeCommandArgAsNativeData(texture);
        this._commandBufferEncoder.encodeCommandArgAsUInt32(filter);
        this._commandBufferEncoder.finishEncodingCommand();
    }
    // addressModes are NativeAddressMode.XXXX values.
    _setTextureWrapMode(texture, addressModeU, addressModeV, addressModeW) {
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETTEXTUREWRAPMODE);
        this._commandBufferEncoder.encodeCommandArgAsNativeData(texture);
        this._commandBufferEncoder.encodeCommandArgAsUInt32(addressModeU);
        this._commandBufferEncoder.encodeCommandArgAsUInt32(addressModeV);
        this._commandBufferEncoder.encodeCommandArgAsUInt32(addressModeW);
        this._commandBufferEncoder.finishEncodingCommand();
    }
    _setNativeTexture(uniform, texture) {
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETTEXTURE);
        this._commandBufferEncoder.encodeCommandArgAsNativeData(uniform);
        this._commandBufferEncoder.encodeCommandArgAsNativeData(texture);
        this._commandBufferEncoder.finishEncodingCommand();
    }
    _unsetNativeTexture(uniform) {
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_UNSETTEXTURE);
        this._commandBufferEncoder.encodeCommandArgAsNativeData(uniform);
        this._commandBufferEncoder.finishEncodingCommand();
    }
    // TODO: Share more of this logic with the base implementation.
    // TODO: Rename to match naming in base implementation once refactoring allows different parameters.
    _updateAnisotropicLevel(texture) {
        const internalTexture = texture.getInternalTexture();
        const value = texture.anisotropicFilteringLevel;
        if (!internalTexture || !internalTexture._hardwareTexture) {
            return;
        }
        if (internalTexture._cachedAnisotropicFilteringLevel !== value) {
            this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_SETTEXTUREANISOTROPICLEVEL);
            this._commandBufferEncoder.encodeCommandArgAsNativeData(internalTexture._hardwareTexture.underlyingResource);
            this._commandBufferEncoder.encodeCommandArgAsUInt32(value);
            this._commandBufferEncoder.finishEncodingCommand();
            internalTexture._cachedAnisotropicFilteringLevel = value;
        }
    }
    /**
     * @internal
     */
    _bindTexture(channel, texture) {
        const uniform = this._boundUniforms[channel];
        if (!uniform) {
            return;
        }
        if (texture && texture._hardwareTexture) {
            const underlyingResource = texture._hardwareTexture.underlyingResource;
            this._setNativeTexture(uniform, underlyingResource);
        }
        else {
            this._unsetNativeTexture(uniform);
        }
    }
    /**
     * Unbind all textures
     */
    unbindAllTextures() {
        this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_DISCARDALLTEXTURES);
        this._commandBufferEncoder.finishEncodingCommand();
    }
    _deleteBuffer(buffer) {
        if (buffer.nativeIndexBuffer) {
            this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_DELETEINDEXBUFFER);
            this._commandBufferEncoder.encodeCommandArgAsNativeData(buffer.nativeIndexBuffer);
            this._commandBufferEncoder.finishEncodingCommand();
            delete buffer.nativeIndexBuffer;
        }
        if (buffer.nativeVertexBuffer) {
            this._commandBufferEncoder.startEncodingCommand(_native.Engine.COMMAND_DELETEVERTEXBUFFER);
            this._commandBufferEncoder.encodeCommandArgAsNativeData(buffer.nativeVertexBuffer);
            this._commandBufferEncoder.finishEncodingCommand();
            delete buffer.nativeVertexBuffer;
        }
    }
    /**
     * Create a canvas
     * @param width width
     * @param height height
     * @returns ICanvas interface
     */
    createCanvas(width, height) {
        if (!_native.Canvas) {
            throw new Error("Native Canvas plugin not available.");
        }
        const canvas = new _native.Canvas();
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }
    /**
     * Create an image to use with canvas
     * @returns IImage interface
     */
    createCanvasImage() {
        if (!_native.Image) {
            throw new Error("Native Canvas plugin not available.");
        }
        const image = new _native.Image();
        return image;
    }
    /**
     * Create a 2D path to use with canvas
     * @returns IPath2D interface
     * @param d SVG path string
     */
    createCanvasPath2D(d) {
        if (!_native.Path2D) {
            throw new Error("Native Canvas plugin not available.");
        }
        const path2d = new _native.Path2D(d);
        return path2d;
    }
    /**
     * Update a portion of an internal texture
     * @param texture defines the texture to update
     * @param imageData defines the data to store into the texture
     * @param xOffset defines the x coordinates of the update rectangle
     * @param yOffset defines the y coordinates of the update rectangle
     * @param width defines the width of the update rectangle
     * @param height defines the height of the update rectangle
     * @param faceIndex defines the face index if texture is a cube (0 by default)
     * @param lod defines the lod level to update (0 by default)
     * @param generateMipMaps defines whether to generate mipmaps or not
     */
    updateTextureData(texture, imageData, xOffset, yOffset, width, height, faceIndex = 0, lod = 0, generateMipMaps = false) {
        if (!texture._hardwareTexture) {
            return;
        }
        if (!this._engine.updateTextureData) {
            throw new Error("updateTextureData not implemented.");
        }
        // bgfx updates the requested sub-rectangle of the existing texture (faceIndex selects the cube
        // face / array layer, lod selects the mip level). invertY is forwarded so the native side can match
        // the vertical orientation the base texture upload uses. Mip regeneration after a partial update is
        // not supported on Native, so generateMipMaps is ignored (consistent with the other raw-texture paths).
        this._engine.updateTextureData(texture._hardwareTexture.underlyingResource, imageData, xOffset, yOffset, width, height, faceIndex, lod, texture.invertY);
    }
    /**
     * @internal
     */
    _uploadCompressedDataToTextureDirectly(texture, internalFormat, width, height, data, faceIndex = 0, lod = 0) {
        throw new Error("_uploadCompressedDataToTextureDirectly not implemented.");
    }
    /**
     * @internal
     */
    _uploadDataToTextureDirectly(texture, imageData, faceIndex = 0, lod = 0) {
        throw new Error("_uploadDataToTextureDirectly not implemented.");
    }
    /**
     * @internal
     */
    _uploadArrayBufferViewToTexture(texture, imageData, faceIndex = 0, lod = 0) {
        throw new Error("_uploadArrayBufferViewToTexture not implemented.");
    }
    getFontOffset(font) {
        // TODO
        const result = { ascent: 0, height: 0, descent: 0 };
        return result;
    }
    /**
     * No equivalent for native. Do nothing.
     */
    flushFramebuffer() { }
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    _readTexturePixels(texture, width, height, faceIndex, level, buffer, _flushRenderer, _noDataConversion, x, y) {
        if (faceIndex !== undefined && faceIndex !== -1) {
            throw new Error(`Reading cubemap faces is not supported, but faceIndex is ${faceIndex}.`);
        }
        return (this._engine
            .readTexture(texture._hardwareTexture?.underlyingResource, level ?? 0, x ?? 0, y ?? 0, width, height, buffer?.buffer ?? null, buffer?.byteOffset ?? 0, buffer?.byteLength ?? 0)
            // eslint-disable-next-line github/no-then
            .then((rawBuffer) => {
            if (!buffer) {
                buffer = new Uint8Array(rawBuffer);
            }
            return buffer;
        }));
    }
    startTimeQuery() {
        if (!this._gpuFrameTimeToken) {
            this._gpuFrameTimeToken = new _TimeToken();
        }
        // Always return the same time token. For native, we don't need a start marker, we just query for native frame stats.
        return this._gpuFrameTimeToken;
    }
    endTimeQuery(token) {
        this._engine.populateFrameStats(this._frameStats);
        return this._frameStats.gpuTimeNs;
    }
}
// This must match the protocol version in NativeEngine.cpp
ThinNativeEngine.PROTOCOL_VERSION = 9;
//# sourceMappingURL=thinNativeEngine.pure.js.map