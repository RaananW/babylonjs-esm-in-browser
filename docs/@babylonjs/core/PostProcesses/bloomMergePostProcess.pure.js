/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { PostProcess } from "./postProcess.pure.js";

import { serialize } from "../Misc/decorators.js";
import { ThinBloomMergePostProcess } from "./thinBloomMergePostProcess.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * The BloomMergePostProcess merges blurred images with the original based on the values of the circle of confusion.
 */
let BloomMergePostProcess = (() => {
    var _a;
    let _classSuper = PostProcess;
    let _instanceExtraInitializers = [];
    let _get_weight_decorators;
    return _a = class BloomMergePostProcess extends _classSuper {
            /** Weight of the bloom to be added to the original input. */
            get weight() {
                return this._effectWrapper.weight;
            }
            set weight(value) {
                this._effectWrapper.weight = value;
            }
            /**
             * Gets a string identifying the name of the class
             * @returns "BloomMergePostProcess" string
             */
            getClassName() {
                return "BloomMergePostProcess";
            }
            /**
             * Creates a new instance of @see BloomMergePostProcess
             * @param name The name of the effect.
             * @param originalFromInput Post process which's input will be used for the merge.
             * @param blurred Blurred highlights post process which's output will be used.
             * @param weight Weight of the bloom to be added to the original input.
             * @param options The required width/height ratio to downsize to before computing the render pass.
             * @param camera The camera to apply the render pass to.
             * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
             * @param engine The engine which the post process will be applied. (default: current engine)
             * @param reusable If the post process can be reused on the same frame. (default: false)
             * @param textureType Type of textures used when performing the post process. (default: 0)
             * @param blockCompilation If compilation of the shader should not be done in the constructor. The updateEffect method can be used to compile the shader at a later time. (default: false)
             */
            constructor(name, originalFromInput, blurred, weight, options, camera = null, samplingMode, engine, reusable, textureType = 0, blockCompilation = false) {
                const blockCompilationFinal = typeof options === "number" ? blockCompilation : !!options.blockCompilation;
                const localOptions = {
                    uniforms: ThinBloomMergePostProcess.Uniforms,
                    samplers: ThinBloomMergePostProcess.Samplers,
                    size: typeof options === "number" ? options : undefined,
                    camera,
                    samplingMode,
                    engine,
                    reusable,
                    textureType,
                    ...options,
                    blockCompilation: true,
                };
                super(name, ThinBloomMergePostProcess.FragmentUrl, {
                    effectWrapper: typeof options === "number" || !options.effectWrapper ? new ThinBloomMergePostProcess(name, engine, localOptions) : undefined,
                    ...localOptions,
                });
                __runInitializers(this, _instanceExtraInitializers);
                this.weight = weight;
                this.externalTextureSamplerBinding = true;
                this.onApplyObservable.add((effect) => {
                    effect.setTextureFromPostProcess("textureSampler", originalFromInput);
                    effect.setTextureFromPostProcessOutput("bloomBlur", blurred);
                });
                if (!blockCompilationFinal) {
                    this.updateEffect();
                }
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_weight_decorators = [serialize()];
            __esDecorate(_a, null, _get_weight_decorators, { kind: "getter", name: "weight", static: false, private: false, access: { has: obj => "weight" in obj, get: obj => obj.weight }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { BloomMergePostProcess };
let _Registered = false;
/**
 * Register side effects for bloomMergePostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterBloomMergePostProcess() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.BloomMergePostProcess", BloomMergePostProcess);
}
//# sourceMappingURL=bloomMergePostProcess.pure.js.map