/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { PostProcess } from "./postProcess.pure.js";

import { serialize } from "../Misc/decorators.js";
import { SerializationHelper } from "../Misc/decorators.serialization.js";
import { ThinGrainPostProcess } from "./thinGrainPostProcess.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * The GrainPostProcess adds noise to the image at mid luminance levels
 */
let GrainPostProcess = (() => {
    var _a;
    let _classSuper = PostProcess;
    let _instanceExtraInitializers = [];
    let _get_intensity_decorators;
    let _get_animated_decorators;
    return _a = class GrainPostProcess extends _classSuper {
            /**
             * The intensity of the grain added (default: 30)
             */
            get intensity() {
                return this._effectWrapper.intensity;
            }
            set intensity(value) {
                this._effectWrapper.intensity = value;
            }
            /**
             * If the grain should be randomized on every frame
             */
            get animated() {
                return this._effectWrapper.animated;
            }
            set animated(value) {
                this._effectWrapper.animated = value;
            }
            /**
             * Gets a string identifying the name of the class
             * @returns "GrainPostProcess" string
             */
            getClassName() {
                return "GrainPostProcess";
            }
            /**
             * Creates a new instance of @see GrainPostProcess
             * @param name The name of the effect.
             * @param options The required width/height ratio to downsize to before computing the render pass.
             * @param camera The camera to apply the render pass to.
             * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
             * @param engine The engine which the post process will be applied. (default: current engine)
             * @param reusable If the post process can be reused on the same frame. (default: false)
             * @param textureType Type of textures used when performing the post process. (default: 0)
             * @param blockCompilation If compilation of the shader should not be done in the constructor. The updateEffect method can be used to compile the shader at a later time. (default: false)
             */
            constructor(name, options, camera, samplingMode, engine, reusable, textureType = 0, blockCompilation = false) {
                const localOptions = {
                    uniforms: ThinGrainPostProcess.Uniforms,
                    size: typeof options === "number" ? options : undefined,
                    camera,
                    samplingMode,
                    engine,
                    reusable,
                    textureType,
                    blockCompilation,
                    ...options,
                };
                super(name, ThinGrainPostProcess.FragmentUrl, {
                    effectWrapper: typeof options === "number" || !options.effectWrapper ? new ThinGrainPostProcess(name, engine, localOptions) : undefined,
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
            _get_intensity_decorators = [serialize()];
            _get_animated_decorators = [serialize()];
            __esDecorate(_a, null, _get_intensity_decorators, { kind: "getter", name: "intensity", static: false, private: false, access: { has: obj => "intensity" in obj, get: obj => obj.intensity }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_animated_decorators, { kind: "getter", name: "animated", static: false, private: false, access: { has: obj => "animated" in obj, get: obj => obj.animated }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { GrainPostProcess };
let _Registered = false;
/**
 * Register side effects for grainPostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterGrainPostProcess() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.GrainPostProcess", GrainPostProcess);
}
//# sourceMappingURL=grainPostProcess.pure.js.map