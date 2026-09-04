/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { PostProcess } from "./postProcess.pure.js";
import { Logger } from "../Misc/logger.js";

import { serialize } from "../Misc/decorators.js";
import { ThinCircleOfConfusionPostProcess } from "./thinCircleOfConfusionPostProcess.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * The CircleOfConfusionPostProcess computes the circle of confusion value for each pixel given required lens parameters. See https://en.wikipedia.org/wiki/Circle_of_confusion
 */
let CircleOfConfusionPostProcess = (() => {
    var _a;
    let _classSuper = PostProcess;
    let _instanceExtraInitializers = [];
    let _get_lensSize_decorators;
    let _get_fStop_decorators;
    let _get_focusDistance_decorators;
    let _get_focalLength_decorators;
    return _a = class CircleOfConfusionPostProcess extends _classSuper {
            /**
             * Max lens size in scene units/1000 (eg. millimeter). Standard cameras are 50mm. (default: 50) The diameter of the resulting aperture can be computed by lensSize/fStop.
             */
            get lensSize() {
                return this._effectWrapper.lensSize;
            }
            set lensSize(value) {
                this._effectWrapper.lensSize = value;
            }
            /**
             * F-Stop of the effect's camera. The diameter of the resulting aperture can be computed by lensSize/fStop. (default: 1.4)
             */
            get fStop() {
                return this._effectWrapper.fStop;
            }
            set fStop(value) {
                this._effectWrapper.fStop = value;
            }
            /**
             * Distance away from the camera to focus on in scene units/1000 (eg. millimeter). (default: 2000)
             */
            get focusDistance() {
                return this._effectWrapper.focusDistance;
            }
            set focusDistance(value) {
                this._effectWrapper.focusDistance = value;
            }
            /**
             * Focal length of the effect's camera in scene units/1000 (eg. millimeter). (default: 50)
             */
            get focalLength() {
                return this._effectWrapper.focalLength;
            }
            set focalLength(value) {
                this._effectWrapper.focalLength = value;
            }
            /**
             * Gets a string identifying the name of the class
             * @returns "CircleOfConfusionPostProcess" string
             */
            getClassName() {
                return "CircleOfConfusionPostProcess";
            }
            /**
             * Creates a new instance CircleOfConfusionPostProcess
             * @param name The name of the effect.
             * @param depthTexture The depth texture of the scene to compute the circle of confusion. This must be set in order for this to function but may be set after initialization if needed.
             * @param options The required width/height ratio to downsize to before computing the render pass.
             * @param camera The camera to apply the render pass to.
             * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
             * @param engine The engine which the post process will be applied. (default: current engine)
             * @param reusable If the post process can be reused on the same frame. (default: false)
             * @param textureType Type of textures used when performing the post process. (default: 0)
             * @param blockCompilation If compilation of the shader should not be done in the constructor. The updateEffect method can be used to compile the shader at a later time. (default: false)
             */
            constructor(name, depthTexture, options, camera, samplingMode, engine, reusable, textureType = 0, blockCompilation = false) {
                const localOptions = {
                    uniforms: ThinCircleOfConfusionPostProcess.Uniforms,
                    samplers: ThinCircleOfConfusionPostProcess.Samplers,
                    defines: typeof options === "object" && options.depthNotNormalized ? ThinCircleOfConfusionPostProcess.DefinesDepthNotNormalized : undefined,
                    size: typeof options === "number" ? options : undefined,
                    camera,
                    samplingMode,
                    engine,
                    reusable,
                    textureType,
                    blockCompilation,
                    ...options,
                };
                super(name, ThinCircleOfConfusionPostProcess.FragmentUrl, {
                    effectWrapper: typeof options === "number" || !options.effectWrapper ? new ThinCircleOfConfusionPostProcess(name, engine, localOptions) : undefined,
                    ...localOptions,
                });
                this._depthTexture = (__runInitializers(this, _instanceExtraInitializers), null);
                this._depthTexture = depthTexture;
                this.onApplyObservable.add((effect) => {
                    if (!this._depthTexture) {
                        Logger.Warn("No depth texture set on CircleOfConfusionPostProcess");
                        return;
                    }
                    effect.setTexture("depthSampler", this._depthTexture);
                    this._effectWrapper.camera = this._depthTexture.activeCamera;
                });
            }
            /**
             * Depth texture to be used to compute the circle of confusion. This must be set here or in the constructor in order for the post process to function.
             */
            set depthTexture(value) {
                this._depthTexture = value;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_lensSize_decorators = [serialize()];
            _get_fStop_decorators = [serialize()];
            _get_focusDistance_decorators = [serialize()];
            _get_focalLength_decorators = [serialize()];
            __esDecorate(_a, null, _get_lensSize_decorators, { kind: "getter", name: "lensSize", static: false, private: false, access: { has: obj => "lensSize" in obj, get: obj => obj.lensSize }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_fStop_decorators, { kind: "getter", name: "fStop", static: false, private: false, access: { has: obj => "fStop" in obj, get: obj => obj.fStop }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_focusDistance_decorators, { kind: "getter", name: "focusDistance", static: false, private: false, access: { has: obj => "focusDistance" in obj, get: obj => obj.focusDistance }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_focalLength_decorators, { kind: "getter", name: "focalLength", static: false, private: false, access: { has: obj => "focalLength" in obj, get: obj => obj.focalLength }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { CircleOfConfusionPostProcess };
let _Registered = false;
/**
 * Register side effects for circleOfConfusionPostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterCircleOfConfusionPostProcess() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.CircleOfConfusionPostProcess", CircleOfConfusionPostProcess);
}
//# sourceMappingURL=circleOfConfusionPostProcess.pure.js.map