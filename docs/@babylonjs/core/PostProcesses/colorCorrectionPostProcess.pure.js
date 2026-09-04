/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { PostProcess } from "./postProcess.pure.js";
import { serialize } from "../Misc/decorators.js";
import { SerializationHelper } from "../Misc/decorators.serialization.js";
import { ThinColorCorrectionPostProcess } from "./thinColorCorrectionPostProcess.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 *
 * This post-process allows the modification of rendered colors by using
 * a 'look-up table' (LUT). This effect is also called Color Grading.
 *
 * The object needs to be provided an url to a texture containing the color
 * look-up table: the texture must be 256 pixels wide and 16 pixels high.
 * Use an image editing software to tweak the LUT to match your needs.
 *
 * For an example of a color LUT, see here:
 * @see http://udn.epicgames.com/Three/rsrc/Three/ColorGrading/RGBTable16x1.png
 * For explanations on color grading, see here:
 * @see http://udn.epicgames.com/Three/ColorGrading.html
 *
 */
let ColorCorrectionPostProcess = (() => {
    var _a;
    let _classSuper = PostProcess;
    let _instanceExtraInitializers = [];
    let _get_colorTableUrl_decorators;
    return _a = class ColorCorrectionPostProcess extends _classSuper {
            /**
             * Gets the color table url used to create the LUT texture
             */
            get colorTableUrl() {
                return this._effectWrapper.colorTableUrl;
            }
            /**
             * Gets a string identifying the name of the class
             * @returns "ColorCorrectionPostProcess" string
             */
            getClassName() {
                return "ColorCorrectionPostProcess";
            }
            constructor(name, colorTableUrl, options, camera, samplingMode, engine, reusable) {
                const localOptions = {
                    samplers: ThinColorCorrectionPostProcess.Samplers,
                    size: typeof options === "number" ? options : undefined,
                    camera,
                    samplingMode,
                    engine,
                    reusable,
                    ...options,
                };
                const scene = camera?.getScene() || null;
                super(name, ThinColorCorrectionPostProcess.FragmentUrl, {
                    effectWrapper: typeof options === "number" || !options.effectWrapper ? new ThinColorCorrectionPostProcess(name, scene, colorTableUrl, localOptions) : undefined,
                    ...localOptions,
                });
                __runInitializers(this, _instanceExtraInitializers);
            }
            /**
             * @internal
             */
            static _Parse(parsedPostProcess, targetCamera, scene, rootUrl) {
                return SerializationHelper.Parse(() => {
                    return new _a(parsedPostProcess.name, parsedPostProcess.colorTableUrl, parsedPostProcess.options, targetCamera, parsedPostProcess.renderTargetSamplingMode, scene.getEngine(), parsedPostProcess.reusable);
                }, parsedPostProcess, scene, rootUrl);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_colorTableUrl_decorators = [serialize()];
            __esDecorate(_a, null, _get_colorTableUrl_decorators, { kind: "getter", name: "colorTableUrl", static: false, private: false, access: { has: obj => "colorTableUrl" in obj, get: obj => obj.colorTableUrl }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { ColorCorrectionPostProcess };
let _Registered = false;
/**
 * Register side effects for colorCorrectionPostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterColorCorrectionPostProcess() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ColorCorrectionPostProcess", ColorCorrectionPostProcess);
}
//# sourceMappingURL=colorCorrectionPostProcess.pure.js.map