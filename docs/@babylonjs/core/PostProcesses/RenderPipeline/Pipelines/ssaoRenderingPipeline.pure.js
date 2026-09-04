/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
/* eslint-disable @typescript-eslint/naming-convention */
import { Vector2, TmpVectors } from "../../../Maths/math.vector.pure.js";
import { Texture } from "../../../Materials/Textures/texture.pure.js";
import { PostProcess } from "../../../PostProcesses/postProcess.pure.js";
import { PostProcessRenderPipeline } from "../../../PostProcesses/RenderPipeline/postProcessRenderPipeline.js";
import { PostProcessRenderEffect } from "../../../PostProcesses/RenderPipeline/postProcessRenderEffect.js";
import { PassPostProcess } from "../../../PostProcesses/passPostProcess.pure.js";
import { BlurPostProcess } from "../../../PostProcesses/blurPostProcess.pure.js";

import { serialize } from "../../../Misc/decorators.js";
import { RegisterDepthRendererSceneComponent } from "../../../Rendering/depthRendererSceneComponent.pure.js";
import { DepthRenderer } from "../../../Rendering/depthRenderer.pure.js";
import { RawTexture } from "../../../Materials/Textures/rawTexture.js";
import { RandomRange } from "../../../Maths/math.scalar.functions.js";
/**
 * Render pipeline to produce ssao effect
 */
let SSAORenderingPipeline = (() => {
    var _a;
    let _classSuper = PostProcessRenderPipeline;
    let _totalStrength_decorators;
    let _totalStrength_initializers = [];
    let _totalStrength_extraInitializers = [];
    let _radius_decorators;
    let _radius_initializers = [];
    let _radius_extraInitializers = [];
    let _area_decorators;
    let _area_initializers = [];
    let _area_extraInitializers = [];
    let _fallOff_decorators;
    let _fallOff_initializers = [];
    let _fallOff_extraInitializers = [];
    let _base_decorators;
    let _base_initializers = [];
    let _base_extraInitializers = [];
    return _a = class SSAORenderingPipeline extends _classSuper {
            /**
             * Gets active scene
             */
            get scene() {
                return this._scene;
            }
            /**
             * @constructor
             * @param name - The rendering pipeline name
             * @param scene - The scene linked to this pipeline
             * @param ratio - The size of the postprocesses. Can be a number shared between passes or an object for more precision: { ssaoRatio: 0.5, combineRatio: 1.0 }
             * @param cameras - The array of cameras that the rendering pipeline will be attached to
             */
            constructor(name, scene, ratio, cameras) {
                RegisterDepthRendererSceneComponent(DepthRenderer);
                super(scene.getEngine(), name);
                // Members
                /**
                 * @ignore
                 * The PassPostProcess id in the pipeline that contains the original scene color
                 */
                this.SSAOOriginalSceneColorEffect = "SSAOOriginalSceneColorEffect";
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
                /**
                 * The output strength of the SSAO post-process. Default value is 1.0.
                 */
                this.totalStrength = __runInitializers(this, _totalStrength_initializers, 1.0);
                /**
                 * The radius around the analyzed pixel used by the SSAO post-process. Default value is 0.0006
                 */
                this.radius = (__runInitializers(this, _totalStrength_extraInitializers), __runInitializers(this, _radius_initializers, 0.0001));
                /**
                 * Related to fallOff, used to interpolate SSAO samples (first interpolate function input) based on the occlusion difference of each pixel
                 * Must not be equal to fallOff and superior to fallOff.
                 * Default value is 0.0075
                 */
                this.area = (__runInitializers(this, _radius_extraInitializers), __runInitializers(this, _area_initializers, 0.0075));
                /**
                 * Related to area, used to interpolate SSAO samples (second interpolate function input) based on the occlusion difference of each pixel
                 * Must not be equal to area and inferior to area.
                 * Default value is 0.000001
                 */
                this.fallOff = (__runInitializers(this, _area_extraInitializers), __runInitializers(this, _fallOff_initializers, 0.000001));
                /**
                 * The base color of the SSAO post-process
                 * The final result is "base + ssao" between [0, 1]
                 */
                this.base = (__runInitializers(this, _fallOff_extraInitializers), __runInitializers(this, _base_initializers, 0.5));
                this._scene = __runInitializers(this, _base_extraInitializers);
                this._firstUpdate = true;
                this._scene = scene;
                // Set up assets
                this._createRandomTexture();
                const ssaoRatio = ratio.ssaoRatio || ratio;
                const combineRatio = ratio.combineRatio || ratio;
                this._originalColorPostProcess = new PassPostProcess("SSAOOriginalSceneColor", combineRatio, null, Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false);
                this._createSSAOPostProcess(ssaoRatio);
                this._createBlurPostProcess(ssaoRatio);
                this._createSSAOCombinePostProcess(combineRatio);
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
            /**
             * @internal
             */
            _attachCameras(cameras, unique) {
                super._attachCameras(cameras, unique);
                for (const camera of this._cameras) {
                    this._scene.enableDepthRenderer(camera).getDepthMap(); // Force depth renderer "on"
                }
            }
            // Public Methods
            /**
             * Get the class name
             * @returns "SSAORenderingPipeline"
             */
            getClassName() {
                return "SSAORenderingPipeline";
            }
            /**
             * Removes the internal pipeline assets and detaches the pipeline from the scene cameras
             * @param disableDepthRender - If the depth renderer should be disabled on the scene
             */
            dispose(disableDepthRender = false) {
                for (let i = 0; i < this._scene.cameras.length; i++) {
                    const camera = this._scene.cameras[i];
                    this._originalColorPostProcess.dispose(camera);
                    this._ssaoPostProcess.dispose(camera);
                    this._blurHPostProcess.dispose(camera);
                    this._blurVPostProcess.dispose(camera);
                    this._ssaoCombinePostProcess.dispose(camera);
                }
                this._randomTexture.dispose();
                if (disableDepthRender) {
                    this._scene.disableDepthRenderer();
                }
                this._scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline(this._name, this._scene.cameras);
                this._scene.postProcessRenderPipelineManager.removePipeline(this._name);
                super.dispose();
            }
            // Private Methods
            _createBlurPostProcess(ratio) {
                const size = 16;
                this._blurHPostProcess = new BlurPostProcess("BlurH", new Vector2(1, 0), size, ratio, null, Texture.BILINEAR_SAMPLINGMODE, this._scene.getEngine(), false, 0);
                this._blurVPostProcess = new BlurPostProcess("BlurV", new Vector2(0, 1), size, ratio, null, Texture.BILINEAR_SAMPLINGMODE, this._scene.getEngine(), false, 0);
                this._blurHPostProcess.onActivateObservable.add(() => {
                    const dw = this._blurHPostProcess.width / this._scene.getEngine().getRenderWidth();
                    this._blurHPostProcess.kernel = size * dw;
                });
                this._blurVPostProcess.onActivateObservable.add(() => {
                    const dw = this._blurVPostProcess.height / this._scene.getEngine().getRenderHeight();
                    this._blurVPostProcess.kernel = size * dw;
                });
            }
            /** @internal */
            _rebuild() {
                this._firstUpdate = true;
                super._rebuild();
            }
            _createSSAOPostProcess(ratio) {
                const numSamples = 16;
                const sampleSphere = [
                    0.5381, 0.1856, -0.4319, 0.1379, 0.2486, 0.443, 0.3371, 0.5679, -0.0057, -0.6999, -0.0451, -0.0019, 0.0689, -0.1598, -0.8547, 0.056, 0.0069, -0.1843, -0.0146, 0.1402,
                    0.0762, 0.01, -0.1924, -0.0344, -0.3577, -0.5301, -0.4358, -0.3169, 0.1063, 0.0158, 0.0103, -0.5869, 0.0046, -0.0897, -0.494, 0.3287, 0.7119, -0.0154, -0.0918, -0.0533,
                    0.0596, -0.5411, 0.0352, -0.0631, 0.546, -0.4776, 0.2847, -0.0271,
                ];
                const samplesFactor = 1.0 / numSamples;
                this._ssaoPostProcess = new PostProcess("ssao", "ssao", ["sampleSphere", "samplesFactor", "randTextureTiles", "totalStrength", "radius", "area", "fallOff", "base", "range", "viewport"], ["randomSampler"], ratio, null, Texture.BILINEAR_SAMPLINGMODE, this._scene.getEngine(), false, "#define SAMPLES " + numSamples + "\n#define SSAO");
                this._ssaoPostProcess.externalTextureSamplerBinding = true;
                this._ssaoPostProcess.onApply = (effect) => {
                    if (this._firstUpdate) {
                        effect.setArray3("sampleSphere", sampleSphere);
                        effect.setFloat("samplesFactor", samplesFactor);
                        effect.setFloat("randTextureTiles", 4.0);
                    }
                    effect.setFloat("totalStrength", this.totalStrength);
                    effect.setFloat("radius", this.radius);
                    effect.setFloat("area", this.area);
                    effect.setFloat("fallOff", this.fallOff);
                    effect.setFloat("base", this.base);
                    effect.setTexture("textureSampler", this._scene.enableDepthRenderer(this._scene.activeCamera).getDepthMap());
                    effect.setTexture("randomSampler", this._randomTexture);
                };
            }
            _createSSAOCombinePostProcess(ratio) {
                this._ssaoCombinePostProcess = new PostProcess("ssaoCombine", "ssaoCombine", [], ["originalColor", "viewport"], ratio, null, Texture.BILINEAR_SAMPLINGMODE, this._scene.getEngine(), false);
                this._ssaoCombinePostProcess.onApply = (effect) => {
                    effect.setVector4("viewport", TmpVectors.Vector4[0].copyFromFloats(0, 0, 1.0, 1.0));
                    effect.setTextureFromPostProcess("originalColor", this._originalColorPostProcess);
                };
            }
            _createRandomTexture() {
                const size = 512;
                const data = new Uint8Array(size * size * 4);
                for (let index = 0; index < data.length;) {
                    data[index++] = Math.floor(Math.max(0.0, RandomRange(-1.0, 1.0)) * 255);
                    data[index++] = Math.floor(Math.max(0.0, RandomRange(-1.0, 1.0)) * 255);
                    data[index++] = Math.floor(Math.max(0.0, RandomRange(-1.0, 1.0)) * 255);
                    data[index++] = 255;
                }
                const texture = RawTexture.CreateRGBATexture(data, size, size, this._scene, false, false, 2);
                texture.name = "SSAORandomTexture";
                texture.wrapU = Texture.WRAP_ADDRESSMODE;
                texture.wrapV = Texture.WRAP_ADDRESSMODE;
                this._randomTexture = texture;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _totalStrength_decorators = [serialize()];
            _radius_decorators = [serialize()];
            _area_decorators = [serialize()];
            _fallOff_decorators = [serialize()];
            _base_decorators = [serialize()];
            __esDecorate(null, null, _totalStrength_decorators, { kind: "field", name: "totalStrength", static: false, private: false, access: { has: obj => "totalStrength" in obj, get: obj => obj.totalStrength, set: (obj, value) => { obj.totalStrength = value; } }, metadata: _metadata }, _totalStrength_initializers, _totalStrength_extraInitializers);
            __esDecorate(null, null, _radius_decorators, { kind: "field", name: "radius", static: false, private: false, access: { has: obj => "radius" in obj, get: obj => obj.radius, set: (obj, value) => { obj.radius = value; } }, metadata: _metadata }, _radius_initializers, _radius_extraInitializers);
            __esDecorate(null, null, _area_decorators, { kind: "field", name: "area", static: false, private: false, access: { has: obj => "area" in obj, get: obj => obj.area, set: (obj, value) => { obj.area = value; } }, metadata: _metadata }, _area_initializers, _area_extraInitializers);
            __esDecorate(null, null, _fallOff_decorators, { kind: "field", name: "fallOff", static: false, private: false, access: { has: obj => "fallOff" in obj, get: obj => obj.fallOff, set: (obj, value) => { obj.fallOff = value; } }, metadata: _metadata }, _fallOff_initializers, _fallOff_extraInitializers);
            __esDecorate(null, null, _base_decorators, { kind: "field", name: "base", static: false, private: false, access: { has: obj => "base" in obj, get: obj => obj.base, set: (obj, value) => { obj.base = value; } }, metadata: _metadata }, _base_initializers, _base_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { SSAORenderingPipeline };
//# sourceMappingURL=ssaoRenderingPipeline.pure.js.map