/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { serialize } from "../../../Misc/decorators.js";
import { SerializationHelper } from "../../../Misc/decorators.serialization.js";
import { PostProcess } from "../../postProcess.pure.js";
import { PostProcessRenderPipeline } from "../postProcessRenderPipeline.js";
import { PostProcessRenderEffect } from "../postProcessRenderEffect.js";

import { PassPostProcess } from "../../passPostProcess.pure.js";
import { ThinTAAPostProcess } from "../../thinTAAPostProcess.js";
import { Logger } from "../../../Misc/logger.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
import { RegisterPrePassRendererSceneComponent } from "../../../Rendering/prePassRendererSceneComponent.pure.js";
import { PrePassRenderer } from "../../../Rendering/prePassRenderer.pure.js";
/* eslint-disable @typescript-eslint/naming-convention */
class TAAEffectConfiguration {
    constructor() {
        this.name = "taa";
        this.enabled = true;
        this.texturesRequired = [11];
    }
}
/**
 * Simple implementation of Temporal Anti-Aliasing (TAA).
 * This can be used to improve image quality for still pictures (screenshots for e.g.).
 * Note that TAA post-process must be the first in the camera, so TAARenderingPipeline must be created before any other pipeline/post-processing.
 */
let TAARenderingPipeline = (() => {
    var _a;
    let _classSuper = PostProcessRenderPipeline;
    let _instanceExtraInitializers = [];
    let _set_samples_decorators;
    let __msaaSamples_decorators;
    let __msaaSamples_initializers = [];
    let __msaaSamples_extraInitializers = [];
    let _get_factor_decorators;
    let _get_disableOnCameraMove_decorators;
    let _get_reprojectHistory_decorators;
    let _get_clampHistory_decorators;
    let __isEnabled_decorators;
    let __isEnabled_initializers = [];
    let __isEnabled_extraInitializers = [];
    return _a = class TAARenderingPipeline extends _classSuper {
            /**
             * Number of accumulated samples (default: 16)
             */
            set samples(samples) {
                this._taaThinPostProcess.samples = samples;
            }
            get samples() {
                return this._taaThinPostProcess.samples;
            }
            /**
             * MSAA samples (default: 1)
             */
            set msaaSamples(samples) {
                if (this._msaaSamples === samples) {
                    return;
                }
                this._msaaSamples = samples;
                if (this._taaPostProcess) {
                    this._taaPostProcess.samples = samples;
                }
            }
            get msaaSamples() {
                return this._msaaSamples;
            }
            /**
             * The factor used to blend the history frame with current frame (default: 0.05)
             */
            get factor() {
                return this._taaThinPostProcess.factor;
            }
            set factor(value) {
                this._taaThinPostProcess.factor = value;
            }
            /**
             * Disable TAA on camera move (default: true).
             * You generally want to keep this enabled, otherwise you will get a ghost effect when the camera moves (but if it's what you want, go for it!)
             */
            get disableOnCameraMove() {
                return this._taaThinPostProcess.disableOnCameraMove;
            }
            set disableOnCameraMove(value) {
                this._taaThinPostProcess.disableOnCameraMove = value;
            }
            /**
             * Enables reprojecting the history texture with a per-pixel velocity.
             */
            get reprojectHistory() {
                return this._taaThinPostProcess.reprojectHistory;
            }
            set reprojectHistory(reproject) {
                if (this.reprojectHistory === reproject) {
                    return;
                }
                this._updateReprojection(reproject);
            }
            /**
             * Clamps the history pixel to the min and max of the 3x3 pixels surrounding the target pixel.
             * This can help further reduce ghosting and artifacts.
             */
            get clampHistory() {
                return this._taaThinPostProcess.clampHistory;
            }
            set clampHistory(history) {
                this._taaThinPostProcess.clampHistory = history;
            }
            /**
             * Gets or sets a boolean indicating if the render pipeline is enabled (default: true).
             */
            get isEnabled() {
                return this._isEnabled;
            }
            set isEnabled(value) {
                if (this._isEnabled === value) {
                    return;
                }
                this._isEnabled = value;
                this._taaThinPostProcess.disabled = !value;
                if (!value) {
                    if (this._cameras !== null) {
                        this._scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline(this._name, this._cameras);
                        this._cameras = this._camerasToBeAttached.slice();
                    }
                }
                else if (value) {
                    if (!this._isDirty) {
                        if (this._cameras !== null) {
                            this._taaThinPostProcess._reset();
                            this._scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(this._name, this._cameras);
                        }
                    }
                    else {
                        this._buildPipeline();
                    }
                }
            }
            /**
             * Gets active scene
             */
            get scene() {
                return this._scene;
            }
            /**
             * Returns true if TAA is supported by the running hardware
             */
            get isSupported() {
                const caps = this._scene.getEngine().getCaps();
                return caps.texelFetch;
            }
            /**
             * Constructor of the TAA rendering pipeline
             * @param name The rendering pipeline name
             * @param scene The scene linked to this pipeline
             * @param cameras The array of cameras that the rendering pipeline will be attached to (default: scene.cameras)
             * @param textureType The type of texture where the scene will be rendered (default: 0)
             */
            constructor(name, scene, cameras, textureType = 0) {
                RegisterPrePassRendererSceneComponent(PrePassRenderer);
                const engine = scene.getEngine();
                super(engine, name);
                /**
                 * The TAA PostProcess effect id in the pipeline
                 */
                this.TAARenderEffect = (__runInitializers(this, _instanceExtraInitializers), "TAARenderEffect");
                /**
                 * The pass PostProcess effect id in the pipeline
                 */
                this.TAAPassEffect = "TAAPassEffect";
                this._msaaSamples = __runInitializers(this, __msaaSamples_initializers, 1);
                this._isEnabled = (__runInitializers(this, __msaaSamples_extraInitializers), __runInitializers(this, __isEnabled_initializers, true));
                this._scene = __runInitializers(this, __isEnabled_extraInitializers);
                this._isDirty = false;
                this._camerasToBeAttached = [];
                this._pingpong = 0;
                this._cameras = cameras || scene.cameras;
                this._cameras = this._cameras.slice();
                this._camerasToBeAttached = this._cameras.slice();
                this._scene = scene;
                this._textureType = textureType;
                this._taaThinPostProcess = new ThinTAAPostProcess("TAA", this._scene);
                if (this.isSupported) {
                    this._createPingPongTextures(engine.getRenderWidth(), engine.getRenderHeight());
                    scene.postProcessRenderPipelineManager.addPipeline(this);
                    this._buildPipeline();
                }
            }
            /**
             * Get the class name
             * @returns "TAARenderingPipeline"
             */
            getClassName() {
                return "TAARenderingPipeline";
            }
            /**
             * Adds a camera to the pipeline
             * @param camera the camera to be added
             */
            addCamera(camera) {
                this._camerasToBeAttached.push(camera);
                this._buildPipeline();
            }
            /**
             * Removes a camera from the pipeline
             * @param camera the camera to remove
             */
            removeCamera(camera) {
                const index = this._camerasToBeAttached.indexOf(camera);
                this._camerasToBeAttached.splice(index, 1);
                this._buildPipeline();
            }
            /**
             * Removes the internal pipeline assets and detaches the pipeline from the scene cameras
             */
            dispose() {
                this._disposePostProcesses();
                this._scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline(this._name, this._cameras);
                this._scene.postProcessRenderPipelineManager.removePipeline(this._name);
                this._ping.dispose();
                this._pong.dispose();
                super.dispose();
            }
            _createPingPongTextures(width, height) {
                const engine = this._scene.getEngine();
                this._ping?.dispose();
                this._pong?.dispose();
                this._ping = engine.createRenderTargetTexture({ width, height }, { generateMipMaps: false, generateDepthBuffer: false, type: 2, samplingMode: 2 });
                this._pong = engine.createRenderTargetTexture({ width, height }, { generateMipMaps: false, generateDepthBuffer: false, type: 2, samplingMode: 2 });
                this._taaThinPostProcess.textureWidth = width;
                this._taaThinPostProcess.textureHeight = height;
            }
            _updateReprojection(reproject) {
                if (reproject) {
                    if (!this._scene.enablePrePassRenderer()) {
                        Logger.Warn("TAA reprojection requires PrePass which is not supported");
                        return;
                    }
                }
                this._taaThinPostProcess.reprojectHistory = reproject;
                this._buildPipeline();
            }
            _buildPipeline() {
                if (!this.isSupported) {
                    return;
                }
                if (!this._isEnabled) {
                    this._isDirty = true;
                    return;
                }
                this._isDirty = false;
                const engine = this._scene.getEngine();
                this._disposePostProcesses();
                if (this._cameras !== null) {
                    this._scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline(this._name, this._cameras);
                    // get back cameras to be used to reattach pipeline
                    this._cameras = this._camerasToBeAttached.slice();
                }
                this._reset();
                this._createTAAPostProcess();
                this.addEffect(new PostProcessRenderEffect(engine, this.TAARenderEffect, () => {
                    return this._taaPostProcess;
                }, true));
                this._createPassPostProcess();
                this.addEffect(new PostProcessRenderEffect(engine, this.TAAPassEffect, () => {
                    return this._passPostProcess;
                }, true));
                if (this._cameras !== null) {
                    this._scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(this._name, this._cameras);
                }
            }
            _disposePostProcesses() {
                for (let i = 0; i < this._cameras.length; i++) {
                    const camera = this._cameras[i];
                    this._taaPostProcess?.dispose(camera);
                    this._passPostProcess?.dispose(camera);
                    camera.getProjectionMatrix(true); // recompute the projection matrix
                }
                this._taaPostProcess = null;
                this._passPostProcess = null;
            }
            _createTAAPostProcess() {
                this._taaPostProcess = new PostProcess("TAA", "taa", {
                    uniforms: ["factor"],
                    samplers: ["historySampler"],
                    size: 1.0,
                    engine: this._scene.getEngine(),
                    textureType: this._textureType,
                    effectWrapper: this._taaThinPostProcess,
                });
                if (this.reprojectHistory) {
                    this._taaPostProcess._prePassEffectConfiguration = new TAAEffectConfiguration();
                }
                this._taaPostProcess.samples = this._msaaSamples;
                this._taaPostProcess.onActivateObservable.add(() => {
                    this._taaThinPostProcess.camera = this._scene.activeCamera;
                    if (this._taaPostProcess?.width !== this._ping.width || this._taaPostProcess?.height !== this._ping.height) {
                        const engine = this._scene.getEngine();
                        this._createPingPongTextures(engine.getRenderWidth(), engine.getRenderHeight());
                    }
                    this._taaThinPostProcess._updateJitter();
                    if (!this.reprojectHistory) {
                        this._scene.updateTransformMatrix(); // make sure the scene ubo is updated with the updated matrices
                    }
                    if (this._passPostProcess) {
                        this._passPostProcess.inputTexture = this._pingpong ? this._ping : this._pong;
                    }
                    this._pingpong = this._pingpong ^ 1;
                });
                this._taaPostProcess.onApplyObservable.add((effect) => {
                    effect._bindTexture("historySampler", this._pingpong ? this._ping.texture : this._pong.texture);
                    const prePassRenderer = this._scene.prePassRenderer;
                    if (this.reprojectHistory && prePassRenderer) {
                        const renderTarget = prePassRenderer.getRenderTarget();
                        const velocityIndex = prePassRenderer.getIndex(11);
                        effect.setTexture("velocitySampler", renderTarget.textures[velocityIndex]);
                    }
                });
            }
            _createPassPostProcess() {
                const engine = this._scene.getEngine();
                this._passPostProcess = new PassPostProcess("TAAPass", 1, null, 1, engine);
                this._passPostProcess.inputTexture = this._ping;
                this._passPostProcess.autoClear = false;
            }
            /**
             * Serializes the rendering pipeline (Used when exporting)
             * @returns the serialized object
             */
            serialize() {
                const serializationObject = SerializationHelper.Serialize(this);
                serializationObject.customType = "TAARenderingPipeline";
                return serializationObject;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _set_samples_decorators = [serialize("samples")];
            __msaaSamples_decorators = [serialize("msaaSamples")];
            _get_factor_decorators = [serialize()];
            _get_disableOnCameraMove_decorators = [serialize()];
            _get_reprojectHistory_decorators = [serialize()];
            _get_clampHistory_decorators = [serialize()];
            __isEnabled_decorators = [serialize("isEnabled")];
            __esDecorate(_a, null, _set_samples_decorators, { kind: "setter", name: "samples", static: false, private: false, access: { has: obj => "samples" in obj, set: (obj, value) => { obj.samples = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_factor_decorators, { kind: "getter", name: "factor", static: false, private: false, access: { has: obj => "factor" in obj, get: obj => obj.factor }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_disableOnCameraMove_decorators, { kind: "getter", name: "disableOnCameraMove", static: false, private: false, access: { has: obj => "disableOnCameraMove" in obj, get: obj => obj.disableOnCameraMove }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_reprojectHistory_decorators, { kind: "getter", name: "reprojectHistory", static: false, private: false, access: { has: obj => "reprojectHistory" in obj, get: obj => obj.reprojectHistory }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_clampHistory_decorators, { kind: "getter", name: "clampHistory", static: false, private: false, access: { has: obj => "clampHistory" in obj, get: obj => obj.clampHistory }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, __msaaSamples_decorators, { kind: "field", name: "_msaaSamples", static: false, private: false, access: { has: obj => "_msaaSamples" in obj, get: obj => obj._msaaSamples, set: (obj, value) => { obj._msaaSamples = value; } }, metadata: _metadata }, __msaaSamples_initializers, __msaaSamples_extraInitializers);
            __esDecorate(null, null, __isEnabled_decorators, { kind: "field", name: "_isEnabled", static: false, private: false, access: { has: obj => "_isEnabled" in obj, get: obj => obj._isEnabled, set: (obj, value) => { obj._isEnabled = value; } }, metadata: _metadata }, __isEnabled_initializers, __isEnabled_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { TAARenderingPipeline };
let _Registered = false;
/**
 * Parse the serialized pipeline
 * @param source Source pipeline.
 * @param scene The scene to load the pipeline to.
 * @param rootUrl The URL of the serialized pipeline.
 * @returns An instantiated pipeline from the serialized object.
 */
export function TAARenderingPipelineParse(source, scene, rootUrl) {
    return SerializationHelper.Parse(() => new TAARenderingPipeline(source._name, scene, source._ratio), source, scene, rootUrl);
}
/**
 * Register side effects for taaRenderingPipeline.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterTaaRenderingPipeline() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    TAARenderingPipeline.Parse = TAARenderingPipelineParse;
    RegisterClass("BABYLON.TAARenderingPipeline", TAARenderingPipeline);
}
//# sourceMappingURL=taaRenderingPipeline.pure.js.map