/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { Camera } from "../Cameras/camera.pure.js";
import { PostProcess } from "./postProcess.pure.js";

import { serialize } from "../Misc/decorators.js";
import { SerializationHelper } from "../Misc/decorators.serialization.js";
import { ThinTonemapPostProcess } from "./thinTonemapPostProcess.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * Defines a post process to apply tone mapping
 */
let TonemapPostProcess = (() => {
    var _a;
    let _classSuper = PostProcess;
    let _instanceExtraInitializers = [];
    let _get_exposureAdjustment_decorators;
    let _get_operator_decorators;
    return _a = class TonemapPostProcess extends _classSuper {
            /**
             * Defines the required exposure adjustment
             */
            get exposureAdjustment() {
                return this._effectWrapper.exposureAdjustment;
            }
            set exposureAdjustment(value) {
                this._effectWrapper.exposureAdjustment = value;
            }
            /**
             * Gets the operator used for tonemapping
             */
            get operator() {
                return this._effectWrapper.operator;
            }
            /**
             * Gets a string identifying the name of the class
             * @returns "TonemapPostProcess" string
             */
            getClassName() {
                return "TonemapPostProcess";
            }
            /**
             * Creates a new TonemapPostProcess
             * @param name defines the name of the postprocess
             * @param operator defines the operator to use
             * @param exposureAdjustment defines the required exposure adjustment
             * @param camera defines the camera to use (can be null)
             * @param samplingMode defines the required sampling mode (BABYLON.Texture.BILINEAR_SAMPLINGMODE by default)
             * @param engine defines the hosting engine (can be ignore if camera is set)
             * @param textureType defines the texture format to use (BABYLON.Engine.TEXTURETYPE_UNSIGNED_BYTE by default)
             * @param reusable If the post process can be reused on the same frame. (default: false)
             */
            constructor(name, operator, exposureAdjustment, camera, samplingMode = 2, engine, textureType = 0, reusable) {
                const cameraIsCamera = camera === null || camera instanceof Camera;
                const localOptions = {
                    operator,
                    exposureAdjustment,
                    uniforms: ThinTonemapPostProcess.Uniforms,
                    camera: cameraIsCamera ? camera : undefined,
                    samplingMode,
                    engine,
                    reusable,
                    textureType,
                };
                if (!cameraIsCamera) {
                    Object.assign(localOptions, camera);
                }
                super(name, ThinTonemapPostProcess.FragmentUrl, {
                    effectWrapper: cameraIsCamera || !camera.effectWrapper ? new ThinTonemapPostProcess(name, engine, localOptions) : undefined,
                    ...localOptions,
                });
                __runInitializers(this, _instanceExtraInitializers);
            }
            /**
             * @internal
             */
            static _Parse(parsedPostProcess, targetCamera, scene, rootUrl) {
                return SerializationHelper.Parse(() => {
                    return new _a(parsedPostProcess.name, parsedPostProcess.operator, parsedPostProcess.exposureAdjustment, targetCamera, parsedPostProcess.renderTargetSamplingMode, scene.getEngine(), parsedPostProcess.textureType, parsedPostProcess.reusable);
                }, parsedPostProcess, scene, rootUrl);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_exposureAdjustment_decorators = [serialize()];
            _get_operator_decorators = [serialize()];
            __esDecorate(_a, null, _get_exposureAdjustment_decorators, { kind: "getter", name: "exposureAdjustment", static: false, private: false, access: { has: obj => "exposureAdjustment" in obj, get: obj => obj.exposureAdjustment }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_operator_decorators, { kind: "getter", name: "operator", static: false, private: false, access: { has: obj => "operator" in obj, get: obj => obj.operator }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { TonemapPostProcess };
let _Registered = false;
/**
 * Register side effects for tonemapPostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterTonemapPostProcess() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.TonemapPostProcess", TonemapPostProcess);
}
//# sourceMappingURL=tonemapPostProcess.pure.js.map