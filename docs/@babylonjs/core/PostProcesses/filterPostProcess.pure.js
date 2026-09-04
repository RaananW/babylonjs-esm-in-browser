/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { PostProcess } from "./postProcess.pure.js";
import { serializeAsMatrix } from "../Misc/decorators.js";
import { SerializationHelper } from "../Misc/decorators.serialization.js";
import { ThinFilterPostProcess } from "./thinFilterPostProcess.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * Applies a kernel filter to the image
 */
let FilterPostProcess = (() => {
    var _a;
    let _classSuper = PostProcess;
    let _instanceExtraInitializers = [];
    let _get_kernelMatrix_decorators;
    return _a = class FilterPostProcess extends _classSuper {
            /** The matrix to be applied to the image */
            get kernelMatrix() {
                return this._effectWrapper.kernelMatrix;
            }
            set kernelMatrix(value) {
                this._effectWrapper.kernelMatrix = value;
            }
            /**
             * Gets a string identifying the name of the class
             * @returns "FilterPostProcess" string
             */
            getClassName() {
                return "FilterPostProcess";
            }
            /**
             *
             * @param name The name of the effect.
             * @param kernelMatrix The matrix to be applied to the image
             * @param options The required width/height ratio to downsize to before computing the render pass.
             * @param camera The camera to apply the render pass to.
             * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
             * @param engine The engine which the post process will be applied. (default: current engine)
             * @param reusable If the post process can be reused on the same frame. (default: false)
             */
            constructor(name, kernelMatrix, options, camera, samplingMode, engine, reusable) {
                const localOptions = {
                    uniforms: ThinFilterPostProcess.Uniforms,
                    size: typeof options === "number" ? options : undefined,
                    camera,
                    samplingMode,
                    engine,
                    reusable,
                    ...options,
                };
                super(name, ThinFilterPostProcess.FragmentUrl, {
                    effectWrapper: typeof options === "number" || !options.effectWrapper ? new ThinFilterPostProcess(name, engine, localOptions) : undefined,
                    ...localOptions,
                });
                __runInitializers(this, _instanceExtraInitializers);
                this.kernelMatrix = kernelMatrix;
            }
            /**
             * @internal
             */
            static _Parse(parsedPostProcess, targetCamera, scene, rootUrl) {
                return SerializationHelper.Parse(() => {
                    return new _a(parsedPostProcess.name, parsedPostProcess.kernelMatrix, parsedPostProcess.options, targetCamera, parsedPostProcess.renderTargetSamplingMode, scene.getEngine(), parsedPostProcess.reusable);
                }, parsedPostProcess, scene, rootUrl);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_kernelMatrix_decorators = [serializeAsMatrix()];
            __esDecorate(_a, null, _get_kernelMatrix_decorators, { kind: "getter", name: "kernelMatrix", static: false, private: false, access: { has: obj => "kernelMatrix" in obj, get: obj => obj.kernelMatrix }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { FilterPostProcess };
let _Registered = false;
/**
 * Register side effects for filterPostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFilterPostProcess() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.FilterPostProcess", FilterPostProcess);
}
//# sourceMappingURL=filterPostProcess.pure.js.map