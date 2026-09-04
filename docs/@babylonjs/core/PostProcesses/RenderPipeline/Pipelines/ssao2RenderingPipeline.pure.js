/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { Logger } from "../../../Misc/logger.js";
import { serialize } from "../../../Misc/decorators.js";
import { SerializationHelper } from "../../../Misc/decorators.serialization.js";
import { Texture } from "../../../Materials/Textures/texture.pure.js";
import { PostProcess } from "../../../PostProcesses/postProcess.pure.js";
import { PostProcessRenderPipeline } from "../../../PostProcesses/RenderPipeline/postProcessRenderPipeline.js";
import { PostProcessRenderEffect } from "../../../PostProcesses/RenderPipeline/postProcessRenderEffect.js";
import { PassPostProcess } from "../../../PostProcesses/passPostProcess.pure.js";
import { EngineStore } from "../../../Engines/engineStore.js";
import { SSAO2Configuration } from "../../../Rendering/ssao2Configuration.js";
import { PrePassRenderer } from "../../../Rendering/prePassRenderer.pure.js";
import { GeometryBufferRenderer } from "../../../Rendering/geometryBufferRenderer.pure.js";

import { ThinSSAO2RenderingPipeline } from "./thinSSAO2RenderingPipeline.js";
import { ThinSSAO2PostProcess } from "../../thinSSAO2PostProcess.js";
import { ThinSSAO2BlurPostProcess } from "../../thinSSAO2BlurPostProcess.js";
import { ThinSSAO2CombinePostProcess } from "../../thinSSAO2CombinePostProcess.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
import { RegisterPostProcessRenderPipelineManagerSceneComponent } from "../../../PostProcesses/RenderPipeline/postProcessRenderPipelineManagerSceneComponent.pure.js";
import { PostProcessRenderPipelineManager } from "../../../PostProcesses/RenderPipeline/postProcessRenderPipelineManager.js";
import { RegisterPrePassRendererSceneComponent } from "../../../Rendering/prePassRendererSceneComponent.pure.js";
import { RegisterGeometryBufferRendererSceneComponent } from "../../../Rendering/geometryBufferRendererSceneComponent.pure.js";
/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Render pipeline to produce ssao effect
 */
let SSAO2RenderingPipeline = (() => {
    var _a;
    let _classSuper = PostProcessRenderPipeline;
    let _instanceExtraInitializers = [];
    let _get_totalStrength_decorators;
    let _get_maxZ_decorators;
    let _get_minZAspect_decorators;
    let _set_epsilon_decorators;
    let _set_samples_decorators;
    let __textureSamples_decorators;
    let __textureSamples_initializers = [];
    let __textureSamples_extraInitializers = [];
    let __forceGeometryBuffer_decorators;
    let __forceGeometryBuffer_initializers = [];
    let __forceGeometryBuffer_extraInitializers = [];
    let __ratio_decorators;
    let __ratio_initializers = [];
    let __ratio_extraInitializers = [];
    let __textureType_decorators;
    let __textureType_initializers = [];
    let __textureType_extraInitializers = [];
    let _get_radius_decorators;
    let _get_base_decorators;
    let _set_bypassBlur_decorators;
    let _set_expensiveBlur_decorators;
    let _get_bilateralSamples_decorators;
    let _get_bilateralSoften_decorators;
    let _get_bilateralTolerance_decorators;
    return _a = class SSAO2RenderingPipeline extends _classSuper {
            /**
             * The output strength of the SSAO post-process. Default value is 1.0.
             */
            get totalStrength() {
                return this._thinSSAORenderingPipeline.totalStrength;
            }
            set totalStrength(value) {
                this._thinSSAORenderingPipeline.totalStrength = value;
            }
            /**
             * Maximum depth value to still render AO. A smooth falloff makes the dimming more natural, so there will be no abrupt shading change.
             */
            get maxZ() {
                return this._thinSSAORenderingPipeline.maxZ;
            }
            set maxZ(value) {
                this._thinSSAORenderingPipeline.maxZ = value;
            }
            /**
             * In order to save performances, SSAO radius is clamped on close geometry. This ratio changes by how much.
             */
            get minZAspect() {
                return this._thinSSAORenderingPipeline.minZAspect;
            }
            set minZAspect(value) {
                this._thinSSAORenderingPipeline.minZAspect = value;
            }
            /**
             * Used in SSAO calculations to compensate for accuracy issues with depth values. Default 0.02.
             *
             * Normally you do not need to change this value, but you can experiment with it if you get a lot of in false self-occlusion on flat surfaces when using fewer than 16 samples. Useful range is normally [0..0.1] but higher values is allowed.
             */
            set epsilon(n) {
                this._thinSSAORenderingPipeline.epsilon = n;
            }
            get epsilon() {
                return this._thinSSAORenderingPipeline.epsilon;
            }
            /**
             * Number of samples used for the SSAO calculations. Default value is 8.
             */
            set samples(n) {
                this._thinSSAORenderingPipeline.samples = n;
            }
            get samples() {
                return this._thinSSAORenderingPipeline.samples;
            }
            /**
             * Number of samples to use for antialiasing.
             */
            set textureSamples(n) {
                this._textureSamples = n;
                if (this._prePassRenderer) {
                    this._prePassRenderer.samples = n;
                }
                else {
                    this._originalColorPostProcess.samples = n;
                }
            }
            get textureSamples() {
                return this._textureSamples;
            }
            get _geometryBufferRenderer() {
                if (!this._forceGeometryBuffer) {
                    return null;
                }
                return this._forcedGeometryBuffer ?? this._scene.geometryBufferRenderer;
            }
            get _prePassRenderer() {
                if (this._forceGeometryBuffer) {
                    return null;
                }
                return this._scene.prePassRenderer;
            }
            /**
             * The radius around the analyzed pixel used by the SSAO post-process. Default value is 2.0
             */
            get radius() {
                return this._thinSSAORenderingPipeline.radius;
            }
            set radius(value) {
                this._thinSSAORenderingPipeline.radius = value;
            }
            /**
             * The base color of the SSAO post-process
             * The final result is "base + ssao" between [0, 1]
             */
            get base() {
                return this._thinSSAORenderingPipeline.base;
            }
            set base(value) {
                this._thinSSAORenderingPipeline.base = value;
            }
            /**
             * Skips the denoising (blur) stage of the SSAO calculations.
             *
             * Useful to temporarily set while experimenting with the other SSAO2 settings.
             */
            set bypassBlur(b) {
                this._thinSSAORenderingPipeline.bypassBlur = b;
            }
            get bypassBlur() {
                return this._thinSSAORenderingPipeline.bypassBlur;
            }
            /**
             * Enables the configurable bilateral denoising (blurring) filter. Default is true.
             * Set to false to instead use a legacy bilateral filter that can't be configured.
             *
             * The denoising filter runs after the SSAO calculations and is a very important step. Both options results in a so called bilateral being used, but the "expensive" one can be
             * configured in several ways to fit your scene.
             */
            set expensiveBlur(b) {
                this._thinSSAORenderingPipeline.expensiveBlur = b;
            }
            get expensiveBlur() {
                return this._thinSSAORenderingPipeline.expensiveBlur;
            }
            /**
             * The number of samples the bilateral filter uses in both dimensions when denoising the SSAO calculations. Default value is 16.
             *
             * A higher value should result in smoother shadows but will use more processing time in the shaders.
             *
             * A high value can cause the shadows to get to blurry or create visible artifacts (bands) near sharp details in the geometry. The artifacts can sometimes be mitigated by increasing the bilateralSoften setting.
             */
            get bilateralSamples() {
                return this._thinSSAORenderingPipeline.bilateralSamples;
            }
            set bilateralSamples(n) {
                this._thinSSAORenderingPipeline.bilateralSamples = n;
            }
            /**
             * Controls the shape of the denoising kernel used by the bilateral filter. Default value is 0.
             *
             * By default the bilateral filter acts like a box-filter, treating all samples on the same depth with equal weights. This is effective to maximize the denoising effect given a limited set of samples. However, it also often results in visible ghosting around sharp shadow regions and can spread out lines over large areas so they are no longer visible.
             *
             * Increasing this setting will make the filter pay less attention to samples further away from the center sample, reducing many artifacts but at the same time increasing noise.
             *
             * Useful value range is [0..1].
             */
            get bilateralSoften() {
                return this._thinSSAORenderingPipeline.bilateralSoften;
            }
            set bilateralSoften(n) {
                this._thinSSAORenderingPipeline.bilateralSoften = n;
            }
            /**
             * How forgiving the bilateral denoiser should be when rejecting samples. Default value is 0.
             *
             * A higher value results in the bilateral filter being more forgiving and thus doing a better job at denoising slanted and curved surfaces, but can lead to shadows spreading out around corners or between objects that are close to each other depth wise.
             *
             * Useful value range is normally [0..1], but higher values are allowed.
             */
            get bilateralTolerance() {
                return this._thinSSAORenderingPipeline.bilateralTolerance;
            }
            set bilateralTolerance(n) {
                this._thinSSAORenderingPipeline.bilateralTolerance = n;
            }
            /**
             *  Support test.
             */
            static get IsSupported() {
                const engine = EngineStore.LastCreatedEngine;
                if (!engine) {
                    return false;
                }
                return engine._features.supportSSAO2;
            }
            /**
             * Indicates that the combine stage should use the current camera viewport to render the SSAO result on only a portion of the output texture (default: true).
             */
            get useViewportInCombineStage() {
                return this._thinSSAORenderingPipeline.useViewportInCombineStage;
            }
            set useViewportInCombineStage(b) {
                this._thinSSAORenderingPipeline.useViewportInCombineStage = b;
            }
            /**
             * Checks if all the post processes in the pipeline are ready.
             * @returns True if all the post processes in the pipeline are ready
             */
            isReady() {
                this._syncNormalsInWorldSpace();
                return this._thinSSAORenderingPipeline.isReady();
            }
            /**
             * Gets active scene
             */
            get scene() {
                return this._scene;
            }
            /**
             * Creates the SSAO2 rendering pipeline.
             * @param name The rendering pipeline name
             * @param scene The scene linked to this pipeline
             * @param ratio The size of the postprocesses. Can be a number shared between passes or an object for more precision: { ssaoRatio: 0.5, blurRatio: 1.0 }
             * @param cameras The array of cameras that the rendering pipeline will be attached to
             * @param forceGeometryBuffer Set to true if you want to use the legacy geometry buffer renderer. You can also pass an existing instance of GeometryBufferRenderer if you want to use your own geometry buffer renderer.
             * @param textureType The texture type used by the different post processes created by SSAO (default: 0)
             */
            constructor(name, scene, ratio, cameras, forceGeometryBuffer = false, textureType = 0) {
                RegisterPrePassRendererSceneComponent(PrePassRenderer);
                RegisterGeometryBufferRendererSceneComponent(GeometryBufferRenderer);
                super(scene.getEngine(), name);
                // Members
                /**
                 * @ignore
                 * The PassPostProcess id in the pipeline that contains the original scene color
                 */
                this.SSAOOriginalSceneColorEffect = (__runInitializers(this, _instanceExtraInitializers), "SSAOOriginalSceneColorEffect");
                /**
                 * @ignore
                 * The SSAO PostProcess id in the pipeline
                 */
                this.SSAORenderEffect = "SSAORenderEffect";
                /**
                 * @ignore
                 * The horizontal blur PostProcess id in the pipeline
                 */
                this.SSAOBlurHRenderEffect = "SSAOBlurHRenderEffect";
                /**
                 * @ignore
                 * The vertical blur PostProcess id in the pipeline
                 */
                this.SSAOBlurVRenderEffect = "SSAOBlurVRenderEffect";
                /**
                 * @ignore
                 * The PostProcess id in the pipeline that combines the SSAO-Blur output with the original scene color (SSAOOriginalSceneColorEffect)
                 */
                this.SSAOCombineRenderEffect = "SSAOCombineRenderEffect";
                this._textureSamples = __runInitializers(this, __textureSamples_initializers, 1);
                this._forcedGeometryBuffer = (__runInitializers(this, __textureSamples_extraInitializers), null);
                /**
                 * Force rendering the geometry through geometry buffer.
                 */
                this._forceGeometryBuffer = __runInitializers(this, __forceGeometryBuffer_initializers, false);
                /**
                 * Ratio object used for SSAO ratio and blur ratio
                 */
                this._ratio = (__runInitializers(this, __forceGeometryBuffer_extraInitializers), __runInitializers(this, __ratio_initializers, void 0));
                /*
                 * The texture type used by the different post processes created by SSAO
                 */
                this._textureType = (__runInitializers(this, __ratio_extraInitializers), __runInitializers(this, __textureType_initializers, void 0));
                this._scene = __runInitializers(this, __textureType_extraInitializers);
                this._currentCameraMode = -1;
                this._thinSSAORenderingPipeline = new ThinSSAO2RenderingPipeline(name, scene);
                this._scene = scene;
                this._ratio = ratio;
                this._textureType = textureType;
                if (forceGeometryBuffer instanceof GeometryBufferRenderer) {
                    this._forceGeometryBuffer = true;
                    this._forcedGeometryBuffer = forceGeometryBuffer;
                }
                else {
                    this._forceGeometryBuffer = forceGeometryBuffer;
                }
                if (!this.isSupported) {
                    Logger.Error("The current engine does not support SSAO 2.");
                    return;
                }
                const ssaoRatio = this._ratio.ssaoRatio || ratio;
                const blurRatio = this._ratio.blurRatio || ratio;
                // Set up assets
                if (this._forceGeometryBuffer) {
                    if (!this._forcedGeometryBuffer) {
                        scene.enableGeometryBufferRenderer();
                    }
                }
                else {
                    scene.enablePrePassRenderer();
                }
                this._syncNormalsInWorldSpace();
                this._originalColorPostProcess = new PassPostProcess("SSAOOriginalSceneColor", 1.0, null, Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), undefined, this._textureType);
                this._originalColorPostProcess.onBeforeRenderObservable.add(() => {
                    this._syncNormalsInWorldSpace();
                    const camera = this._scene.activeCamera;
                    this._thinSSAORenderingPipeline._ssaoPostProcess.camera = camera;
                    if (camera && this._currentCameraMode !== camera.mode) {
                        this._currentCameraMode = camera.mode;
                        this._thinSSAORenderingPipeline._ssaoPostProcess.updateEffect();
                    }
                });
                this._originalColorPostProcess.samples = this.textureSamples;
                this._createSSAOPostProcess(1.0, textureType);
                this._createBlurPostProcess(ssaoRatio, blurRatio, this._textureType);
                this._createSSAOCombinePostProcess(blurRatio, this._textureType);
                // Set up pipeline
                this.addEffect(new PostProcessRenderEffect(scene.getEngine(), this.SSAOOriginalSceneColorEffect, () => {
                    return this._originalColorPostProcess;
                }, true));
                this.addEffect(new PostProcessRenderEffect(scene.getEngine(), this.SSAORenderEffect, () => {
                    return this._ssaoPostProcess;
                }, true));
                this.addEffect(new PostProcessRenderEffect(scene.getEngine(), this.SSAOBlurHRenderEffect, () => {
                    return this._blurHPostProcess;
                }, true));
                this.addEffect(new PostProcessRenderEffect(scene.getEngine(), this.SSAOBlurVRenderEffect, () => {
                    return this._blurVPostProcess;
                }, true));
                this.addEffect(new PostProcessRenderEffect(scene.getEngine(), this.SSAOCombineRenderEffect, () => {
                    return this._ssaoCombinePostProcess;
                }, true));
                // Finish
                scene.postProcessRenderPipelineManager.addPipeline(this);
                if (cameras) {
                    scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(name, cameras);
                }
            }
            // Public Methods
            /**
             * Get the class name
             * @returns "SSAO2RenderingPipeline"
             */
            getClassName() {
                return "SSAO2RenderingPipeline";
            }
            /**
             * Removes the internal pipeline assets and detaches the pipeline from the scene cameras
             * @param disableGeometryBufferRenderer Set to true if you want to disable the Geometry Buffer renderer
             */
            dispose(disableGeometryBufferRenderer = false) {
                for (let i = 0; i < this._scene.cameras.length; i++) {
                    const camera = this._scene.cameras[i];
                    this._originalColorPostProcess.dispose(camera);
                    this._ssaoPostProcess.dispose(camera);
                    this._blurHPostProcess.dispose(camera);
                    this._blurVPostProcess.dispose(camera);
                    this._ssaoCombinePostProcess.dispose(camera);
                }
                if (disableGeometryBufferRenderer && !this._forcedGeometryBuffer) {
                    this._scene.disableGeometryBufferRenderer();
                }
                this._scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline(this._name, this._scene.cameras);
                this._scene.postProcessRenderPipelineManager.removePipeline(this._name);
                this._thinSSAORenderingPipeline.dispose();
                super.dispose();
            }
            // Private Methods
            _syncNormalsInWorldSpace() {
                const renderer = this._forceGeometryBuffer ? this._geometryBufferRenderer : this._prePassRenderer;
                const normalsInWorldSpace = !!renderer?.generateNormalsInWorldSpace;
                this._thinSSAORenderingPipeline._ssaoPostProcess.normalsInWorldSpace = normalsInWorldSpace;
            }
            /** @internal */
            _rebuild() {
                super._rebuild();
            }
            _createBlurPostProcess(ssaoRatio, blurRatio, textureType) {
                this._blurHPostProcess = this._createBlurFilter("BlurH", ssaoRatio, textureType, true);
                this._blurVPostProcess = this._createBlurFilter("BlurV", blurRatio, textureType, false);
            }
            _createBlurFilter(name, ratio, textureType, horizontal) {
                const blurFilter = new PostProcess(name, ThinSSAO2BlurPostProcess.FragmentUrl, {
                    size: ratio,
                    samplingMode: 2,
                    engine: this._scene.getEngine(),
                    textureType: this._textureType,
                    effectWrapper: horizontal ? this._thinSSAORenderingPipeline._ssaoBlurXPostProcess : this._thinSSAORenderingPipeline._ssaoBlurYPostProcess,
                });
                blurFilter.onApply = (effect) => {
                    const ratio = this._ratio.blurRatio || this._ratio;
                    const ssaoCombineSize = horizontal ? this._originalColorPostProcess.width * ratio : this._originalColorPostProcess.height * ratio;
                    const originalColorSize = horizontal ? this._originalColorPostProcess.width : this._originalColorPostProcess.height;
                    this._thinSSAORenderingPipeline._ssaoBlurXPostProcess.textureSize = ssaoCombineSize > 0 ? ssaoCombineSize : originalColorSize;
                    this._thinSSAORenderingPipeline._ssaoBlurYPostProcess.textureSize = ssaoCombineSize > 0 ? ssaoCombineSize : originalColorSize;
                    if (this._geometryBufferRenderer) {
                        effect.setTexture("depthSampler", this._geometryBufferRenderer.getGBuffer().textures[0]);
                    }
                    else if (this._prePassRenderer) {
                        effect.setTexture("depthSampler", this._prePassRenderer.getRenderTarget().textures[this._prePassRenderer.getIndex(5)]);
                    }
                };
                blurFilter.samples = this.textureSamples;
                blurFilter.autoClear = false;
                return blurFilter;
            }
            _getTextureSize() {
                const engine = this._scene.getEngine();
                const prePassRenderer = this._prePassRenderer;
                let textureSize = { width: engine.getRenderWidth(), height: engine.getRenderHeight() };
                if (prePassRenderer && this._scene.activeCamera?._getFirstPostProcess() === this._ssaoPostProcess) {
                    const renderTarget = prePassRenderer.getRenderTarget();
                    if (renderTarget && renderTarget.textures) {
                        textureSize = renderTarget.textures[prePassRenderer.getIndex(4)].getSize();
                    }
                }
                else if (this._ssaoPostProcess.inputTexture) {
                    textureSize.width = this._ssaoPostProcess.inputTexture.width;
                    textureSize.height = this._ssaoPostProcess.inputTexture.height;
                }
                return textureSize;
            }
            _createSSAOPostProcess(ratio, textureType) {
                this._ssaoPostProcess = new PostProcess("ssao", ThinSSAO2PostProcess.FragmentUrl, {
                    size: ratio,
                    samplingMode: 2,
                    engine: this._scene.getEngine(),
                    textureType,
                    effectWrapper: this._thinSSAORenderingPipeline._ssaoPostProcess,
                });
                this._ssaoPostProcess.autoClear = false;
                this._ssaoPostProcess.onApply = (effect) => {
                    if (this._geometryBufferRenderer) {
                        effect.setTexture("depthSampler", this._geometryBufferRenderer.getGBuffer().textures[0]);
                        effect.setTexture("normalSampler", this._geometryBufferRenderer.getGBuffer().textures[1]);
                    }
                    else if (this._prePassRenderer) {
                        effect.setTexture("depthSampler", this._prePassRenderer.getRenderTarget().textures[this._prePassRenderer.getIndex(5)]);
                        effect.setTexture("normalSampler", this._prePassRenderer.getRenderTarget().textures[this._prePassRenderer.getIndex(6)]);
                    }
                    const textureSize = this._getTextureSize();
                    this._thinSSAORenderingPipeline._ssaoPostProcess.textureWidth = textureSize.width;
                    this._thinSSAORenderingPipeline._ssaoPostProcess.textureHeight = textureSize.height;
                };
                this._ssaoPostProcess.samples = this.textureSamples;
                if (!this._forceGeometryBuffer) {
                    this._ssaoPostProcess._prePassEffectConfiguration = new SSAO2Configuration();
                }
            }
            _createSSAOCombinePostProcess(ratio, textureType) {
                this._ssaoCombinePostProcess = new PostProcess("ssaoCombine", ThinSSAO2CombinePostProcess.FragmentUrl, {
                    size: ratio,
                    samplingMode: 2,
                    engine: this._scene.getEngine(),
                    textureType,
                    effectWrapper: this._thinSSAORenderingPipeline._ssaoCombinePostProcess,
                });
                this._ssaoCombinePostProcess.onApply = (effect) => {
                    this._thinSSAORenderingPipeline._ssaoCombinePostProcess.camera = this._scene.activeCamera;
                    effect.setTextureFromPostProcessOutput("originalColor", this._originalColorPostProcess);
                };
                this._ssaoCombinePostProcess.autoClear = false;
                this._ssaoCombinePostProcess.samples = this.textureSamples;
            }
            /**
             * Serialize the rendering pipeline (Used when exporting)
             * @returns the serialized object
             */
            serialize() {
                const serializationObject = SerializationHelper.Serialize(this);
                serializationObject.customType = "SSAO2RenderingPipeline";
                return serializationObject;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_totalStrength_decorators = [serialize()];
            _get_maxZ_decorators = [serialize()];
            _get_minZAspect_decorators = [serialize()];
            _set_epsilon_decorators = [serialize("epsilon")];
            _set_samples_decorators = [serialize("samples")];
            __textureSamples_decorators = [serialize("textureSamples")];
            __forceGeometryBuffer_decorators = [serialize()];
            __ratio_decorators = [serialize()];
            __textureType_decorators = [serialize()];
            _get_radius_decorators = [serialize()];
            _get_base_decorators = [serialize()];
            _set_bypassBlur_decorators = [serialize("bypassBlur")];
            _set_expensiveBlur_decorators = [serialize("expensiveBlur")];
            _get_bilateralSamples_decorators = [serialize()];
            _get_bilateralSoften_decorators = [serialize()];
            _get_bilateralTolerance_decorators = [serialize()];
            __esDecorate(_a, null, _get_totalStrength_decorators, { kind: "getter", name: "totalStrength", static: false, private: false, access: { has: obj => "totalStrength" in obj, get: obj => obj.totalStrength }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_maxZ_decorators, { kind: "getter", name: "maxZ", static: false, private: false, access: { has: obj => "maxZ" in obj, get: obj => obj.maxZ }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_minZAspect_decorators, { kind: "getter", name: "minZAspect", static: false, private: false, access: { has: obj => "minZAspect" in obj, get: obj => obj.minZAspect }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _set_epsilon_decorators, { kind: "setter", name: "epsilon", static: false, private: false, access: { has: obj => "epsilon" in obj, set: (obj, value) => { obj.epsilon = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _set_samples_decorators, { kind: "setter", name: "samples", static: false, private: false, access: { has: obj => "samples" in obj, set: (obj, value) => { obj.samples = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_radius_decorators, { kind: "getter", name: "radius", static: false, private: false, access: { has: obj => "radius" in obj, get: obj => obj.radius }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_base_decorators, { kind: "getter", name: "base", static: false, private: false, access: { has: obj => "base" in obj, get: obj => obj.base }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _set_bypassBlur_decorators, { kind: "setter", name: "bypassBlur", static: false, private: false, access: { has: obj => "bypassBlur" in obj, set: (obj, value) => { obj.bypassBlur = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _set_expensiveBlur_decorators, { kind: "setter", name: "expensiveBlur", static: false, private: false, access: { has: obj => "expensiveBlur" in obj, set: (obj, value) => { obj.expensiveBlur = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_bilateralSamples_decorators, { kind: "getter", name: "bilateralSamples", static: false, private: false, access: { has: obj => "bilateralSamples" in obj, get: obj => obj.bilateralSamples }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_bilateralSoften_decorators, { kind: "getter", name: "bilateralSoften", static: false, private: false, access: { has: obj => "bilateralSoften" in obj, get: obj => obj.bilateralSoften }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_bilateralTolerance_decorators, { kind: "getter", name: "bilateralTolerance", static: false, private: false, access: { has: obj => "bilateralTolerance" in obj, get: obj => obj.bilateralTolerance }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, __textureSamples_decorators, { kind: "field", name: "_textureSamples", static: false, private: false, access: { has: obj => "_textureSamples" in obj, get: obj => obj._textureSamples, set: (obj, value) => { obj._textureSamples = value; } }, metadata: _metadata }, __textureSamples_initializers, __textureSamples_extraInitializers);
            __esDecorate(null, null, __forceGeometryBuffer_decorators, { kind: "field", name: "_forceGeometryBuffer", static: false, private: false, access: { has: obj => "_forceGeometryBuffer" in obj, get: obj => obj._forceGeometryBuffer, set: (obj, value) => { obj._forceGeometryBuffer = value; } }, metadata: _metadata }, __forceGeometryBuffer_initializers, __forceGeometryBuffer_extraInitializers);
            __esDecorate(null, null, __ratio_decorators, { kind: "field", name: "_ratio", static: false, private: false, access: { has: obj => "_ratio" in obj, get: obj => obj._ratio, set: (obj, value) => { obj._ratio = value; } }, metadata: _metadata }, __ratio_initializers, __ratio_extraInitializers);
            __esDecorate(null, null, __textureType_decorators, { kind: "field", name: "_textureType", static: false, private: false, access: { has: obj => "_textureType" in obj, get: obj => obj._textureType, set: (obj, value) => { obj._textureType = value; } }, metadata: _metadata }, __textureType_initializers, __textureType_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { SSAO2RenderingPipeline };
let _Registered = false;
/**
 * Parse the serialized pipeline
 * @param source Source pipeline.
 * @param scene The scene to load the pipeline to.
 * @param rootUrl The URL of the serialized pipeline.
 * @returns An instantiated pipeline from the serialized object.
 */
export function SSAO2RenderingPipelineParse(source, scene, rootUrl) {
    return SerializationHelper.Parse(() => new SSAO2RenderingPipeline(source._name, scene, source._ratio, undefined, source._forceGeometryBuffer, source._textureType), source, scene, rootUrl);
}
/**
 * Register side effects for ssao2RenderingPipeline.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterSsao2RenderingPipeline() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    // Eagerly register the Scene.postProcessRenderPipelineManager getter (and inject its concrete class).
    // The base PostProcessRenderPipeline constructor also registers it, but consumers may access the manager
    // (e.g. to subscribe to its observables) before constructing the SSAO2 pipeline, so register it as soon as
    // the SSAO2 module is imported. Idempotent.
    RegisterPostProcessRenderPipelineManagerSceneComponent(PostProcessRenderPipelineManager);
    SSAO2RenderingPipeline.Parse = SSAO2RenderingPipelineParse;
    RegisterClass("BABYLON.SSAO2RenderingPipeline", SSAO2RenderingPipeline);
}
//# sourceMappingURL=ssao2RenderingPipeline.pure.js.map