/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { PostProcess } from "./postProcess.pure.js";

import { serialize } from "../Misc/decorators.js";
import { SerializationHelper } from "../Misc/decorators.serialization.js";
import { ThinConvolutionPostProcess } from "./thinConvolutionPostProcess.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * The ConvolutionPostProcess applies a 3x3 kernel to every pixel of the
 * input texture to perform effects such as edge detection or sharpening
 * See http://en.wikipedia.org/wiki/Kernel_(image_processing)
 */
let ConvolutionPostProcess = (() => {
    var _a;
    let _classSuper = PostProcess;
    let _instanceExtraInitializers = [];
    let _get_kernel_decorators;
    return _a = class ConvolutionPostProcess extends _classSuper {
            /** Array of 9 values corresponding to the 3x3 kernel to be applied */
            get kernel() {
                return this._effectWrapper.kernel;
            }
            set kernel(value) {
                this._effectWrapper.kernel = value;
            }
            /**
             * Gets a string identifying the name of the class
             * @returns "ConvolutionPostProcess" string
             */
            getClassName() {
                return "ConvolutionPostProcess";
            }
            /**
             * Creates a new instance ConvolutionPostProcess
             * @param name The name of the effect.
             * @param kernel Array of 9 values corresponding to the 3x3 kernel to be applied
             * @param options The required width/height ratio to downsize to before computing the render pass.
             * @param camera The camera to apply the render pass to.
             * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
             * @param engine The engine which the post process will be applied. (default: current engine)
             * @param reusable If the post process can be reused on the same frame. (default: false)
             * @param textureType Type of textures used when performing the post process. (default: 0)
             */
            constructor(name, kernel, options, camera, samplingMode, engine, reusable, textureType = 0) {
                const localOptions = {
                    uniforms: ThinConvolutionPostProcess.Uniforms,
                    size: typeof options === "number" ? options : undefined,
                    camera,
                    samplingMode,
                    engine,
                    reusable,
                    textureType,
                    ...options,
                };
                super(name, ThinConvolutionPostProcess.FragmentUrl, {
                    effectWrapper: typeof options === "number" || !options.effectWrapper ? new ThinConvolutionPostProcess(name, engine, kernel, localOptions) : undefined,
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
                    return new _a(parsedPostProcess.name, parsedPostProcess.kernel, parsedPostProcess.options, targetCamera, parsedPostProcess.renderTargetSamplingMode, scene.getEngine(), parsedPostProcess.reusable, parsedPostProcess.textureType);
                }, parsedPostProcess, scene, rootUrl);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_kernel_decorators = [serialize()];
            __esDecorate(_a, null, _get_kernel_decorators, { kind: "getter", name: "kernel", static: false, private: false, access: { has: obj => "kernel" in obj, get: obj => obj.kernel }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        // Statics
        /**
         * Edge detection 0 see https://en.wikipedia.org/wiki/Kernel_(image_processing)
         */
        _a.EdgeDetect0Kernel = ThinConvolutionPostProcess.EdgeDetect0Kernel,
        /**
         * Edge detection 1 see https://en.wikipedia.org/wiki/Kernel_(image_processing)
         */
        _a.EdgeDetect1Kernel = ThinConvolutionPostProcess.EdgeDetect1Kernel,
        /**
         * Edge detection 2 see https://en.wikipedia.org/wiki/Kernel_(image_processing)
         */
        _a.EdgeDetect2Kernel = ThinConvolutionPostProcess.EdgeDetect2Kernel,
        /**
         * Kernel to sharpen an image see https://en.wikipedia.org/wiki/Kernel_(image_processing)
         */
        _a.SharpenKernel = ThinConvolutionPostProcess.SharpenKernel,
        /**
         * Kernel to emboss an image see https://en.wikipedia.org/wiki/Kernel_(image_processing)
         */
        _a.EmbossKernel = ThinConvolutionPostProcess.EmbossKernel,
        /**
         * Kernel to blur an image see https://en.wikipedia.org/wiki/Kernel_(image_processing)
         */
        _a.GaussianKernel = ThinConvolutionPostProcess.GaussianKernel,
        _a;
})();
export { ConvolutionPostProcess };
let _Registered = false;
/**
 * Register side effects for convolutionPostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterConvolutionPostProcess() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ConvolutionPostProcess", ConvolutionPostProcess);
}
//# sourceMappingURL=convolutionPostProcess.pure.js.map