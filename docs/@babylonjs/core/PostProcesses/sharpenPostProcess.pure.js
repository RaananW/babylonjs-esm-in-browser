/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { PostProcess } from "./postProcess.pure.js";

import { serialize } from "../Misc/decorators.js";
import { SerializationHelper } from "../Misc/decorators.serialization.js";
import { ThinSharpenPostProcess } from "./thinSharpenPostProcess.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * The SharpenPostProcess applies a sharpen kernel to every pixel
 * See http://en.wikipedia.org/wiki/Kernel_(image_processing)
 */
let SharpenPostProcess = (() => {
    var _a;
    let _classSuper = PostProcess;
    let _instanceExtraInitializers = [];
    let _get_colorAmount_decorators;
    let _get_edgeAmount_decorators;
    return _a = class SharpenPostProcess extends _classSuper {
            /**
             * How much of the original color should be applied. Setting this to 0 will display edge detection. (default: 1)
             */
            get colorAmount() {
                return this._effectWrapper.colorAmount;
            }
            set colorAmount(value) {
                this._effectWrapper.colorAmount = value;
            }
            /**
             * How much sharpness should be applied (default: 0.3)
             */
            get edgeAmount() {
                return this._effectWrapper.edgeAmount;
            }
            set edgeAmount(value) {
                this._effectWrapper.edgeAmount = value;
            }
            /**
             * Gets a string identifying the name of the class
             * @returns "SharpenPostProcess" string
             */
            getClassName() {
                return "SharpenPostProcess";
            }
            /**
             * Creates a new instance ConvolutionPostProcess
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
                    uniforms: ThinSharpenPostProcess.Uniforms,
                    size: typeof options === "number" ? options : undefined,
                    camera,
                    samplingMode,
                    engine,
                    reusable,
                    textureType,
                    blockCompilation,
                    ...options,
                };
                super(name, ThinSharpenPostProcess.FragmentUrl, {
                    effectWrapper: typeof options === "number" || !options.effectWrapper ? new ThinSharpenPostProcess(name, engine, localOptions) : undefined,
                    ...localOptions,
                });
                __runInitializers(this, _instanceExtraInitializers);
                this.onApply = (_effect) => {
                    this._effectWrapper.textureWidth = this.width;
                    this._effectWrapper.textureHeight = this.height;
                };
            }
            /**
             * @internal
             */
            static _Parse(parsedPostProcess, targetCamera, scene, rootUrl) {
                return SerializationHelper.Parse(() => {
                    return new _a(parsedPostProcess.name, parsedPostProcess.options, targetCamera, parsedPostProcess.renderTargetSamplingMode, scene.getEngine(), parsedPostProcess.reusable, parsedPostProcess.textureType);
                }, parsedPostProcess, scene, rootUrl);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_colorAmount_decorators = [serialize()];
            _get_edgeAmount_decorators = [serialize()];
            __esDecorate(_a, null, _get_colorAmount_decorators, { kind: "getter", name: "colorAmount", static: false, private: false, access: { has: obj => "colorAmount" in obj, get: obj => obj.colorAmount }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_edgeAmount_decorators, { kind: "getter", name: "edgeAmount", static: false, private: false, access: { has: obj => "edgeAmount" in obj, get: obj => obj.edgeAmount }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { SharpenPostProcess };
let _Registered = false;
/**
 * Register side effects for sharpenPostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterSharpenPostProcess() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.SharpenPostProcess", SharpenPostProcess);
}
//# sourceMappingURL=sharpenPostProcess.pure.js.map