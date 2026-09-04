/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { Logger } from "../Misc/logger.js";
import { PostProcess } from "./postProcess.pure.js";

import { GeometryBufferRenderer } from "../Rendering/geometryBufferRenderer.pure.js";
import { MotionBlurConfiguration } from "../Rendering/motionBlurConfiguration.js";
import { serialize } from "../Misc/decorators.js";
import { SerializationHelper } from "../Misc/decorators.serialization.js";
import { ThinMotionBlurPostProcess } from "./thinMotionBlurPostProcess.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * The Motion Blur Post Process which blurs an image based on the objects velocity in scene.
 * Velocity can be affected by each object's rotation, position and scale depending on the transformation speed.
 * As an example, all you have to do is to create the post-process:
 *  var mb = new BABYLON.MotionBlurPostProcess(
 *      'mb', // The name of the effect.
 *      scene, // The scene containing the objects to blur according to their velocity.
 *      1.0, // The required width/height ratio to downsize to before computing the render pass.
 *      camera // The camera to apply the render pass to.
 * );
 * Then, all objects moving, rotating and/or scaling will be blurred depending on the transformation speed.
 */
let MotionBlurPostProcess = (() => {
    var _a;
    let _classSuper = PostProcess;
    let _instanceExtraInitializers = [];
    let _get_motionStrength_decorators;
    let _get_motionBlurSamples_decorators;
    let _get_isObjectBased_decorators;
    return _a = class MotionBlurPostProcess extends _classSuper {
            /**
             * Defines how much the image is blurred by the movement. Default value is equal to 1
             */
            get motionStrength() {
                return this._effectWrapper.motionStrength;
            }
            set motionStrength(value) {
                this._effectWrapper.motionStrength = value;
            }
            /**
             * Gets the number of iterations are used for motion blur quality. Default value is equal to 32
             */
            get motionBlurSamples() {
                return this._effectWrapper.motionBlurSamples;
            }
            /**
             * Sets the number of iterations to be used for motion blur quality
             */
            set motionBlurSamples(samples) {
                this._effectWrapper.motionBlurSamples = samples;
            }
            /**
             * Gets whether or not the motion blur post-process is in object based mode.
             */
            get isObjectBased() {
                return this._effectWrapper.isObjectBased;
            }
            /**
             * Sets whether or not the motion blur post-process is in object based mode.
             */
            set isObjectBased(value) {
                if (this.isObjectBased === value) {
                    return;
                }
                this._effectWrapper.isObjectBased = value;
                this._applyMode();
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
             * Gets a string identifying the name of the class
             * @returns "MotionBlurPostProcess" string
             */
            getClassName() {
                return "MotionBlurPostProcess";
            }
            /**
             * Creates a new instance MotionBlurPostProcess
             * @param name The name of the effect.
             * @param scene The scene containing the objects to blur according to their velocity.
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
                const localOptions = {
                    uniforms: ThinMotionBlurPostProcess.Uniforms,
                    samplers: ThinMotionBlurPostProcess.Samplers,
                    defines: ThinMotionBlurPostProcess.Defines,
                    size: typeof options === "number" ? options : undefined,
                    camera,
                    samplingMode,
                    engine,
                    reusable,
                    textureType,
                    blockCompilation,
                    ...options,
                };
                super(name, ThinMotionBlurPostProcess.FragmentUrl, {
                    effectWrapper: typeof options === "number" || !options.effectWrapper ? new ThinMotionBlurPostProcess(name, scene, localOptions) : undefined,
                    ...localOptions,
                });
                this._forcedGeometryBuffer = (__runInitializers(this, _instanceExtraInitializers), null);
                this._forceGeometryBuffer = false;
                if (forceGeometryBuffer instanceof GeometryBufferRenderer) {
                    this._forceGeometryBuffer = true;
                    this._forcedGeometryBuffer = forceGeometryBuffer;
                }
                else {
                    this._forceGeometryBuffer = forceGeometryBuffer;
                }
                // Set up assets
                if (this._forceGeometryBuffer) {
                    if (!this._forcedGeometryBuffer) {
                        scene.enableGeometryBufferRenderer();
                    }
                    if (this._geometryBufferRenderer) {
                        this._geometryBufferRenderer.enableVelocity = this.isObjectBased;
                    }
                }
                else {
                    scene.enablePrePassRenderer();
                    if (this._prePassRenderer) {
                        this._prePassRenderer.markAsDirty();
                        this._prePassEffectConfiguration = new MotionBlurConfiguration();
                    }
                }
                this._applyMode();
            }
            /**
             * Excludes the given skinned mesh from computing bones velocities.
             * Computing bones velocities can have a cost and that cost. The cost can be saved by calling this function and by passing the skinned mesh reference to ignore.
             * @param skinnedMesh The mesh containing the skeleton to ignore when computing the velocity map.
             */
            excludeSkinnedMesh(skinnedMesh) {
                if (skinnedMesh.skeleton) {
                    let list;
                    if (this._geometryBufferRenderer) {
                        list = this._geometryBufferRenderer.excludedSkinnedMeshesFromVelocity;
                    }
                    else if (this._prePassRenderer) {
                        list = this._prePassRenderer.excludedSkinnedMesh;
                    }
                    else {
                        return;
                    }
                    list.push(skinnedMesh);
                }
            }
            /**
             * Removes the given skinned mesh from the excluded meshes to integrate bones velocities while rendering the velocity map.
             * @param skinnedMesh The mesh containing the skeleton that has been ignored previously.
             * @see excludeSkinnedMesh to exclude a skinned mesh from bones velocity computation.
             */
            removeExcludedSkinnedMesh(skinnedMesh) {
                if (skinnedMesh.skeleton) {
                    let list;
                    if (this._geometryBufferRenderer) {
                        list = this._geometryBufferRenderer.excludedSkinnedMeshesFromVelocity;
                    }
                    else if (this._prePassRenderer) {
                        list = this._prePassRenderer.excludedSkinnedMesh;
                    }
                    else {
                        return;
                    }
                    const index = list.indexOf(skinnedMesh);
                    if (index !== -1) {
                        list.splice(index, 1);
                    }
                }
            }
            /**
             * Disposes the post process.
             * @param camera The camera to dispose the post process on.
             */
            dispose(camera) {
                if (this._geometryBufferRenderer && !this._forcedGeometryBuffer) {
                    // Clear previous transformation matrices dictionary used to compute objects velocities
                    this._geometryBufferRenderer._previousTransformationMatrices = {};
                    this._geometryBufferRenderer._previousBonesTransformationMatrices = {};
                    this._geometryBufferRenderer.excludedSkinnedMeshesFromVelocity = [];
                }
                super.dispose(camera);
            }
            /**
             * Called on the mode changed (object based or screen based).
             */
            _applyMode() {
                if (!this._geometryBufferRenderer && !this._prePassRenderer) {
                    // We can't get a velocity or depth texture. So, work as a passthrough.
                    Logger.Warn("Multiple Render Target support needed to compute object based motion blur");
                    return;
                }
                if (this._geometryBufferRenderer) {
                    this._geometryBufferRenderer.enableVelocity = this.isObjectBased;
                }
                if (this.isObjectBased) {
                    if (this._prePassRenderer && this._prePassEffectConfiguration) {
                        this._prePassEffectConfiguration.texturesRequired[0] = 2;
                    }
                    this.onApply = (effect) => this._onApplyObjectBased(effect);
                }
                else {
                    if (this._prePassRenderer && this._prePassEffectConfiguration) {
                        this._prePassEffectConfiguration.texturesRequired[0] = 5;
                    }
                    this.onApply = (effect) => this._onApplyScreenBased(effect);
                }
            }
            /**
             * Called on the effect is applied when the motion blur post-process is in object based mode.
             * @param effect
             */
            _onApplyObjectBased(effect) {
                this._effectWrapper.textureWidth = this.width;
                this._effectWrapper.textureHeight = this.height;
                if (this._geometryBufferRenderer) {
                    const velocityIndex = this._geometryBufferRenderer.getTextureIndex(GeometryBufferRenderer.VELOCITY_TEXTURE_TYPE);
                    effect.setTexture("velocitySampler", this._geometryBufferRenderer.getGBuffer().textures[velocityIndex]);
                }
                else if (this._prePassRenderer) {
                    const velocityIndex = this._prePassRenderer.getIndex(2);
                    effect.setTexture("velocitySampler", this._prePassRenderer.getRenderTarget().textures[velocityIndex]);
                }
            }
            /**
             * Called on the effect is applied when the motion blur post-process is in screen based mode.
             * @param effect
             */
            _onApplyScreenBased(effect) {
                this._effectWrapper.textureWidth = this.width;
                this._effectWrapper.textureHeight = this.height;
                if (this._geometryBufferRenderer) {
                    const depthIndex = this._geometryBufferRenderer.getTextureIndex(GeometryBufferRenderer.DEPTH_TEXTURE_TYPE);
                    effect.setTexture("depthSampler", this._geometryBufferRenderer.getGBuffer().textures[depthIndex]);
                }
                else if (this._prePassRenderer) {
                    const depthIndex = this._prePassRenderer.getIndex(5);
                    effect.setTexture("depthSampler", this._prePassRenderer.getRenderTarget().textures[depthIndex]);
                }
            }
            /**
             * @internal
             */
            static _Parse(parsedPostProcess, targetCamera, scene, rootUrl) {
                return SerializationHelper.Parse(() => {
                    return new _a(parsedPostProcess.name, scene, parsedPostProcess.options, targetCamera, parsedPostProcess.renderTargetSamplingMode, scene.getEngine(), parsedPostProcess.reusable, parsedPostProcess.textureType, false);
                }, parsedPostProcess, scene, rootUrl);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_motionStrength_decorators = [serialize()];
            _get_motionBlurSamples_decorators = [serialize()];
            _get_isObjectBased_decorators = [serialize()];
            __esDecorate(_a, null, _get_motionStrength_decorators, { kind: "getter", name: "motionStrength", static: false, private: false, access: { has: obj => "motionStrength" in obj, get: obj => obj.motionStrength }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_motionBlurSamples_decorators, { kind: "getter", name: "motionBlurSamples", static: false, private: false, access: { has: obj => "motionBlurSamples" in obj, get: obj => obj.motionBlurSamples }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_isObjectBased_decorators, { kind: "getter", name: "isObjectBased", static: false, private: false, access: { has: obj => "isObjectBased" in obj, get: obj => obj.isObjectBased }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { MotionBlurPostProcess };
let _Registered = false;
/**
 * Register side effects for motionBlurPostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterMotionBlurPostProcess() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.MotionBlurPostProcess", MotionBlurPostProcess);
}
//# sourceMappingURL=motionBlurPostProcess.pure.js.map