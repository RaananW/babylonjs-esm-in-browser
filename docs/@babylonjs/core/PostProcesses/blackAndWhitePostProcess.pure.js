/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { PostProcess } from "./postProcess.pure.js";
import { serialize } from "../Misc/decorators.js";
import { SerializationHelper } from "../Misc/decorators.serialization.js";
import { ThinBlackAndWhitePostProcess } from "./thinBlackAndWhitePostProcess.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * Post process used to render in black and white
 */
let BlackAndWhitePostProcess = (() => {
    var _a;
    let _classSuper = PostProcess;
    let _instanceExtraInitializers = [];
    let _get_degree_decorators;
    return _a = class BlackAndWhitePostProcess extends _classSuper {
            /**
             * Linear about to convert he result to black and white (default: 1)
             */
            get degree() {
                return this._effectWrapper.degree;
            }
            set degree(value) {
                this._effectWrapper.degree = value;
            }
            /**
             * Gets a string identifying the name of the class
             * @returns "BlackAndWhitePostProcess" string
             */
            getClassName() {
                return "BlackAndWhitePostProcess";
            }
            /**
             * Creates a black and white post process
             * @see https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/usePostProcesses#black-and-white
             * @param name The name of the effect.
             * @param options The required width/height ratio to downsize to before computing the render pass.
             * @param camera The camera to apply the render pass to.
             * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
             * @param engine The engine which the post process will be applied. (default: current engine)
             * @param reusable If the post process can be reused on the same frame. (default: false)
             */
            constructor(name, options, camera = null, samplingMode, engine, reusable) {
                const localOptions = {
                    uniforms: ThinBlackAndWhitePostProcess.Uniforms,
                    size: typeof options === "number" ? options : undefined,
                    camera,
                    samplingMode,
                    engine,
                    reusable,
                    ...options,
                };
                super(name, ThinBlackAndWhitePostProcess.FragmentUrl, {
                    effectWrapper: typeof options === "number" || !options.effectWrapper ? new ThinBlackAndWhitePostProcess(name, engine, localOptions) : undefined,
                    ...localOptions,
                });
                __runInitializers(this, _instanceExtraInitializers);
            }
            /**
             * @internal
             */
            static _Parse(parsedPostProcess, targetCamera, scene, rootUrl) {
                return SerializationHelper.Parse(() => {
                    return new _a(parsedPostProcess.name, parsedPostProcess.options, targetCamera, parsedPostProcess.renderTargetSamplingMode, scene.getEngine(), parsedPostProcess.reusable);
                }, parsedPostProcess, scene, rootUrl);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_degree_decorators = [serialize()];
            __esDecorate(_a, null, _get_degree_decorators, { kind: "getter", name: "degree", static: false, private: false, access: { has: obj => "degree" in obj, get: obj => obj.degree }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { BlackAndWhitePostProcess };
let _Registered = false;
/**
 * Register side effects for blackAndWhitePostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterBlackAndWhitePostProcess() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.BlackAndWhitePostProcess", BlackAndWhitePostProcess);
}
//# sourceMappingURL=blackAndWhitePostProcess.pure.js.map