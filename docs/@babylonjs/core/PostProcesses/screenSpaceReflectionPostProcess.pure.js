/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { PostProcess } from "./postProcess.pure.js";

import { GeometryBufferRenderer } from "../Rendering/geometryBufferRenderer.pure.js";
import { serialize } from "../Misc/decorators.js";
import { SerializationHelper } from "../Misc/decorators.serialization.js";
import { ScreenSpaceReflectionsConfiguration } from "../Rendering/screenSpaceReflectionsConfiguration.js";
import { Logger } from "../Misc/logger.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * The ScreenSpaceReflectionPostProcess performs realtime reflections using only and only the available informations on the screen (positions and normals).
 * Basically, the screen space reflection post-process will compute reflections according the material's reflectivity.
 * @deprecated Use the new SSRRenderingPipeline instead.
 */
let ScreenSpaceReflectionPostProcess = (() => {
    var _a;
    let _classSuper = PostProcess;
    let _instanceExtraInitializers = [];
    let _threshold_decorators;
    let _threshold_initializers = [];
    let _threshold_extraInitializers = [];
    let _strength_decorators;
    let _strength_initializers = [];
    let _strength_extraInitializers = [];
    let _reflectionSpecularFalloffExponent_decorators;
    let _reflectionSpecularFalloffExponent_initializers = [];
    let _reflectionSpecularFalloffExponent_extraInitializers = [];
    let _step_decorators;
    let _step_initializers = [];
    let _step_extraInitializers = [];
    let _roughnessFactor_decorators;
    let _roughnessFactor_initializers = [];
    let _roughnessFactor_extraInitializers = [];
    let _get_enableSmoothReflections_decorators;
    let _get_reflectionSamples_decorators;
    let _get_smoothSteps_decorators;
    return _a = class ScreenSpaceReflectionPostProcess extends _classSuper {
            get _geometryBufferRenderer() {
                if (!this._forceGeometryBuffer) {
                    return null;
                }
                return this._scene.geometryBufferRenderer;
            }
            get _prePassRenderer() {
                if (this._forceGeometryBuffer) {
                    return null;
                }
                return this._scene.prePassRenderer;
            }
            /**
             * Gets a string identifying the name of the class
             * @returns "ScreenSpaceReflectionPostProcess" string
             */
            getClassName() {
                return "ScreenSpaceReflectionPostProcess";
            }
            /**
             * Creates a new instance of ScreenSpaceReflectionPostProcess.
             * @param name The name of the effect.
             * @param scene The scene containing the objects to calculate reflections.
             * @param options The required width/height ratio to downsize to before computing the render pass.
             * @param camera The camera to apply the render pass to.
             * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
             * @param engine The engine which the post process will be applied. (default: current engine)
             * @param reusable If the post process can be reused on the same frame. (default: false)
             * @param textureType Type of textures used when performing the post process. (default: 0)
             * @param blockCompilation If compilation of the shader should not be done in the constructor. The updateEffect method can be used to compile the shader at a later time. (default: true)
             * @param forceGeometryBuffer If this post process should use geometry buffer instead of prepass (default: false)
             */
            constructor(name, scene, options, camera, samplingMode, engine, reusable, textureType = 0, blockCompilation = false, forceGeometryBuffer = false) {
                super(name, "screenSpaceReflection", ["projection", "view", "threshold", "reflectionSpecularFalloffExponent", "strength", "stepSize", "roughnessFactor"], ["textureSampler", "normalSampler", "positionSampler", "reflectivitySampler"], options, camera, samplingMode, engine, reusable, "#define SSR_SUPPORTED\n#define REFLECTION_SAMPLES 64\n#define SMOOTH_STEPS 5\n", textureType, undefined, null, blockCompilation);
                /**
                 * Gets or sets a reflection threshold mainly used to adjust the reflection's height.
                 */
                this.threshold = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _threshold_initializers, 1.2));
                /**
                 * Gets or sets the current reflection strength. 1.0 is an ideal value but can be increased/decreased for particular results.
                 */
                this.strength = (__runInitializers(this, _threshold_extraInitializers), __runInitializers(this, _strength_initializers, 1));
                /**
                 * Gets or sets the falloff exponent used while computing fresnel. More the exponent is high, more the reflections will be discrete.
                 */
                this.reflectionSpecularFalloffExponent = (__runInitializers(this, _strength_extraInitializers), __runInitializers(this, _reflectionSpecularFalloffExponent_initializers, 3));
                /**
                 * Gets or sets the step size used to iterate until the effect finds the color of the reflection's pixel. Typically in interval [0.1, 1.0]
                 */
                this.step = (__runInitializers(this, _reflectionSpecularFalloffExponent_extraInitializers), __runInitializers(this, _step_initializers, 1.0));
                /**
                 * Gets or sets the factor applied when computing roughness. Default value is 0.2.
                 */
                this.roughnessFactor = (__runInitializers(this, _step_extraInitializers), __runInitializers(this, _roughnessFactor_initializers, 0.2));
                this._forceGeometryBuffer = (__runInitializers(this, _roughnessFactor_extraInitializers), false);
                this._enableSmoothReflections = false;
                this._reflectionSamples = 64;
                this._smoothSteps = 5;
                this._forceGeometryBuffer = forceGeometryBuffer;
                if (this._forceGeometryBuffer) {
                    // Get geometry buffer renderer and update effect
                    const geometryBufferRenderer = scene.enableGeometryBufferRenderer();
                    if (geometryBufferRenderer) {
                        if (geometryBufferRenderer.isSupported) {
                            geometryBufferRenderer.enablePosition = true;
                            geometryBufferRenderer.enableReflectivity = true;
                            if (geometryBufferRenderer.generateNormalsInWorldSpace) {
                                Logger.Error("ScreenSpaceReflectionPostProcess does not support generateNormalsInWorldSpace=true for the geometry buffer renderer!");
                            }
                        }
                    }
                }
                else {
                    const prePassRenderer = scene.enablePrePassRenderer();
                    prePassRenderer?.markAsDirty();
                    if (prePassRenderer?.generateNormalsInWorldSpace) {
                        Logger.Error("ScreenSpaceReflectionPostProcess does not support generateNormalsInWorldSpace=true for the prepass renderer!");
                    }
                    this._prePassEffectConfiguration = new ScreenSpaceReflectionsConfiguration();
                }
                this._updateEffectDefines();
                // On apply, send uniforms
                this.onApply = (effect) => {
                    const geometryBufferRenderer = this._geometryBufferRenderer;
                    const prePassRenderer = this._prePassRenderer;
                    if (!prePassRenderer && !geometryBufferRenderer) {
                        return;
                    }
                    if (geometryBufferRenderer) {
                        // Samplers
                        const positionIndex = geometryBufferRenderer.getTextureIndex(GeometryBufferRenderer.POSITION_TEXTURE_TYPE);
                        const roughnessIndex = geometryBufferRenderer.getTextureIndex(GeometryBufferRenderer.REFLECTIVITY_TEXTURE_TYPE);
                        effect.setTexture("normalSampler", geometryBufferRenderer.getGBuffer().textures[1]);
                        effect.setTexture("positionSampler", geometryBufferRenderer.getGBuffer().textures[positionIndex]);
                        effect.setTexture("reflectivitySampler", geometryBufferRenderer.getGBuffer().textures[roughnessIndex]);
                    }
                    else if (prePassRenderer) {
                        // Samplers
                        const positionIndex = prePassRenderer.getIndex(1);
                        const roughnessIndex = prePassRenderer.getIndex(3);
                        const normalIndex = prePassRenderer.getIndex(6);
                        effect.setTexture("normalSampler", prePassRenderer.getRenderTarget().textures[normalIndex]);
                        effect.setTexture("positionSampler", prePassRenderer.getRenderTarget().textures[positionIndex]);
                        effect.setTexture("reflectivitySampler", prePassRenderer.getRenderTarget().textures[roughnessIndex]);
                    }
                    // Uniforms
                    const camera = scene.activeCamera;
                    if (!camera) {
                        return;
                    }
                    const viewMatrix = camera.getViewMatrix(true);
                    const projectionMatrix = camera.getProjectionMatrix(true);
                    effect.setMatrix("projection", projectionMatrix);
                    effect.setMatrix("view", viewMatrix);
                    effect.setFloat("threshold", this.threshold);
                    effect.setFloat("reflectionSpecularFalloffExponent", this.reflectionSpecularFalloffExponent);
                    effect.setFloat("strength", this.strength);
                    effect.setFloat("stepSize", this.step);
                    effect.setFloat("roughnessFactor", this.roughnessFactor);
                };
                this._isSceneRightHanded = scene.useRightHandedSystem;
            }
            /**
             * Gets whether or not smoothing reflections is enabled.
             * Enabling smoothing will require more GPU power and can generate a drop in FPS.
             */
            get enableSmoothReflections() {
                return this._enableSmoothReflections;
            }
            /**
             * Sets whether or not smoothing reflections is enabled.
             * Enabling smoothing will require more GPU power and can generate a drop in FPS.
             */
            set enableSmoothReflections(enabled) {
                if (enabled === this._enableSmoothReflections) {
                    return;
                }
                this._enableSmoothReflections = enabled;
                this._updateEffectDefines();
            }
            /**
             * Gets the number of samples taken while computing reflections. More samples count is high,
             * more the post-process wil require GPU power and can generate a drop in FPS. Basically in interval [25, 100].
             */
            get reflectionSamples() {
                return this._reflectionSamples;
            }
            /**
             * Sets the number of samples taken while computing reflections. More samples count is high,
             * more the post-process wil require GPU power and can generate a drop in FPS. Basically in interval [25, 100].
             */
            set reflectionSamples(samples) {
                if (samples === this._reflectionSamples) {
                    return;
                }
                this._reflectionSamples = samples;
                this._updateEffectDefines();
            }
            /**
             * Gets the number of samples taken while smoothing reflections. More samples count is high,
             * more the post-process will require GPU power and can generate a drop in FPS.
             * Default value (5.0) work pretty well in all cases but can be adjusted.
             */
            get smoothSteps() {
                return this._smoothSteps;
            }
            /*
             * Sets the number of samples taken while smoothing reflections. More samples count is high,
             * more the post-process will require GPU power and can generate a drop in FPS.
             * Default value (5.0) work pretty well in all cases but can be adjusted.
             */
            set smoothSteps(steps) {
                if (steps === this._smoothSteps) {
                    return;
                }
                this._smoothSteps = steps;
                this._updateEffectDefines();
            }
            _updateEffectDefines() {
                const defines = [];
                if (this._geometryBufferRenderer || this._prePassRenderer) {
                    defines.push("#define SSR_SUPPORTED");
                }
                if (this._enableSmoothReflections) {
                    defines.push("#define ENABLE_SMOOTH_REFLECTIONS");
                }
                if (this._isSceneRightHanded) {
                    defines.push("#define RIGHT_HANDED_SCENE");
                }
                defines.push("#define REFLECTION_SAMPLES " + (this._reflectionSamples >> 0));
                defines.push("#define SMOOTH_STEPS " + (this._smoothSteps >> 0));
                this.updateEffect(defines.join("\n"));
            }
            /**
             * @internal
             */
            static _Parse(parsedPostProcess, targetCamera, scene, rootUrl) {
                return SerializationHelper.Parse(() => {
                    return new _a(parsedPostProcess.name, scene, parsedPostProcess.options, targetCamera, parsedPostProcess.renderTargetSamplingMode, scene.getEngine(), parsedPostProcess.textureType, parsedPostProcess.reusable);
                }, parsedPostProcess, scene, rootUrl);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _threshold_decorators = [serialize()];
            _strength_decorators = [serialize()];
            _reflectionSpecularFalloffExponent_decorators = [serialize()];
            _step_decorators = [serialize()];
            _roughnessFactor_decorators = [serialize()];
            _get_enableSmoothReflections_decorators = [serialize()];
            _get_reflectionSamples_decorators = [serialize()];
            _get_smoothSteps_decorators = [serialize()];
            __esDecorate(_a, null, _get_enableSmoothReflections_decorators, { kind: "getter", name: "enableSmoothReflections", static: false, private: false, access: { has: obj => "enableSmoothReflections" in obj, get: obj => obj.enableSmoothReflections }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_reflectionSamples_decorators, { kind: "getter", name: "reflectionSamples", static: false, private: false, access: { has: obj => "reflectionSamples" in obj, get: obj => obj.reflectionSamples }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_smoothSteps_decorators, { kind: "getter", name: "smoothSteps", static: false, private: false, access: { has: obj => "smoothSteps" in obj, get: obj => obj.smoothSteps }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _threshold_decorators, { kind: "field", name: "threshold", static: false, private: false, access: { has: obj => "threshold" in obj, get: obj => obj.threshold, set: (obj, value) => { obj.threshold = value; } }, metadata: _metadata }, _threshold_initializers, _threshold_extraInitializers);
            __esDecorate(null, null, _strength_decorators, { kind: "field", name: "strength", static: false, private: false, access: { has: obj => "strength" in obj, get: obj => obj.strength, set: (obj, value) => { obj.strength = value; } }, metadata: _metadata }, _strength_initializers, _strength_extraInitializers);
            __esDecorate(null, null, _reflectionSpecularFalloffExponent_decorators, { kind: "field", name: "reflectionSpecularFalloffExponent", static: false, private: false, access: { has: obj => "reflectionSpecularFalloffExponent" in obj, get: obj => obj.reflectionSpecularFalloffExponent, set: (obj, value) => { obj.reflectionSpecularFalloffExponent = value; } }, metadata: _metadata }, _reflectionSpecularFalloffExponent_initializers, _reflectionSpecularFalloffExponent_extraInitializers);
            __esDecorate(null, null, _step_decorators, { kind: "field", name: "step", static: false, private: false, access: { has: obj => "step" in obj, get: obj => obj.step, set: (obj, value) => { obj.step = value; } }, metadata: _metadata }, _step_initializers, _step_extraInitializers);
            __esDecorate(null, null, _roughnessFactor_decorators, { kind: "field", name: "roughnessFactor", static: false, private: false, access: { has: obj => "roughnessFactor" in obj, get: obj => obj.roughnessFactor, set: (obj, value) => { obj.roughnessFactor = value; } }, metadata: _metadata }, _roughnessFactor_initializers, _roughnessFactor_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { ScreenSpaceReflectionPostProcess };
let _Registered = false;
/**
 * Register side effects for screenSpaceReflectionPostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterScreenSpaceReflectionPostProcess() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ScreenSpaceReflectionPostProcess", ScreenSpaceReflectionPostProcess);
}
//# sourceMappingURL=screenSpaceReflectionPostProcess.pure.js.map