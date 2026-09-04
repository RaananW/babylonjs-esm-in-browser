/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { PostProcess } from "./postProcess.pure.js";

import { serialize } from "../Misc/decorators.js";
import { SerializationHelper } from "../Misc/decorators.serialization.js";
import { ThinChromaticAberrationPostProcess } from "./thinChromaticAberrationPostProcess.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * The ChromaticAberrationPostProcess separates the rgb channels in an image to produce chromatic distortion around the edges of the screen
 */
let ChromaticAberrationPostProcess = (() => {
    var _a;
    let _classSuper = PostProcess;
    let _instanceExtraInitializers = [];
    let _get_aberrationAmount_decorators;
    let _get_radialIntensity_decorators;
    let _get_direction_decorators;
    let _get_centerPosition_decorators;
    let _get_screenWidth_decorators;
    let _get_screenHeight_decorators;
    return _a = class ChromaticAberrationPostProcess extends _classSuper {
            /**
             * The amount of separation of rgb channels (default: 30)
             */
            get aberrationAmount() {
                return this._effectWrapper.aberrationAmount;
            }
            set aberrationAmount(value) {
                this._effectWrapper.aberrationAmount = value;
            }
            /**
             * The amount the effect will increase for pixels closer to the edge of the screen. (default: 0)
             */
            get radialIntensity() {
                return this._effectWrapper.radialIntensity;
            }
            set radialIntensity(value) {
                this._effectWrapper.radialIntensity = value;
            }
            /**
             * The normalized direction in which the rgb channels should be separated. If set to 0,0 radial direction will be used. (default: Vector2(0.707,0.707))
             */
            get direction() {
                return this._effectWrapper.direction;
            }
            set direction(value) {
                this._effectWrapper.direction = value;
            }
            /**
             * The center position where the radialIntensity should be around. [0.5,0.5 is center of screen, 1,1 is top right corner] (default: Vector2(0.5 ,0.5))
             */
            get centerPosition() {
                return this._effectWrapper.centerPosition;
            }
            set centerPosition(value) {
                this._effectWrapper.centerPosition = value;
            }
            /** The width of the screen to apply the effect on */
            get screenWidth() {
                return this._effectWrapper.screenWidth;
            }
            set screenWidth(value) {
                this._effectWrapper.screenWidth = value;
            }
            /** The height of the screen to apply the effect on */
            get screenHeight() {
                return this._effectWrapper.screenHeight;
            }
            set screenHeight(value) {
                this._effectWrapper.screenHeight = value;
            }
            /**
             * Gets a string identifying the name of the class
             * @returns "ChromaticAberrationPostProcess" string
             */
            getClassName() {
                return "ChromaticAberrationPostProcess";
            }
            /**
             * Creates a new instance ChromaticAberrationPostProcess
             * @param name The name of the effect.
             * @param screenWidth The width of the screen to apply the effect on.
             * @param screenHeight The height of the screen to apply the effect on.
             * @param options The required width/height ratio to downsize to before computing the render pass.
             * @param camera The camera to apply the render pass to.
             * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
             * @param engine The engine which the post process will be applied. (default: current engine)
             * @param reusable If the post process can be reused on the same frame. (default: false)
             * @param textureType Type of textures used when performing the post process. (default: 0)
             * @param blockCompilation If compilation of the shader should not be done in the constructor. The updateEffect method can be used to compile the shader at a later time. (default: false)
             */
            constructor(name, screenWidth, screenHeight, options, camera, samplingMode, engine, reusable, textureType = 0, blockCompilation = false) {
                const localOptions = {
                    uniforms: ThinChromaticAberrationPostProcess.Uniforms,
                    size: typeof options === "number" ? options : undefined,
                    camera,
                    samplingMode,
                    engine,
                    reusable,
                    textureType,
                    blockCompilation,
                    ...options,
                };
                super(name, ThinChromaticAberrationPostProcess.FragmentUrl, {
                    effectWrapper: typeof options === "number" || !options.effectWrapper ? new ThinChromaticAberrationPostProcess(name, engine, localOptions) : undefined,
                    ...localOptions,
                });
                __runInitializers(this, _instanceExtraInitializers);
                this.screenWidth = screenWidth;
                this.screenHeight = screenHeight;
            }
            /**
             * @internal
             */
            static _Parse(parsedPostProcess, targetCamera, scene, rootUrl) {
                return SerializationHelper.Parse(() => {
                    return new _a(parsedPostProcess.name, parsedPostProcess.screenWidth, parsedPostProcess.screenHeight, parsedPostProcess.options, targetCamera, parsedPostProcess.renderTargetSamplingMode, scene.getEngine(), parsedPostProcess.reusable, parsedPostProcess.textureType, false);
                }, parsedPostProcess, scene, rootUrl);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_aberrationAmount_decorators = [serialize()];
            _get_radialIntensity_decorators = [serialize()];
            _get_direction_decorators = [serialize()];
            _get_centerPosition_decorators = [serialize()];
            _get_screenWidth_decorators = [serialize()];
            _get_screenHeight_decorators = [serialize()];
            __esDecorate(_a, null, _get_aberrationAmount_decorators, { kind: "getter", name: "aberrationAmount", static: false, private: false, access: { has: obj => "aberrationAmount" in obj, get: obj => obj.aberrationAmount }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_radialIntensity_decorators, { kind: "getter", name: "radialIntensity", static: false, private: false, access: { has: obj => "radialIntensity" in obj, get: obj => obj.radialIntensity }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_direction_decorators, { kind: "getter", name: "direction", static: false, private: false, access: { has: obj => "direction" in obj, get: obj => obj.direction }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_centerPosition_decorators, { kind: "getter", name: "centerPosition", static: false, private: false, access: { has: obj => "centerPosition" in obj, get: obj => obj.centerPosition }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_screenWidth_decorators, { kind: "getter", name: "screenWidth", static: false, private: false, access: { has: obj => "screenWidth" in obj, get: obj => obj.screenWidth }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_screenHeight_decorators, { kind: "getter", name: "screenHeight", static: false, private: false, access: { has: obj => "screenHeight" in obj, get: obj => obj.screenHeight }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { ChromaticAberrationPostProcess };
let _Registered = false;
/**
 * Register side effects for chromaticAberrationPostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterChromaticAberrationPostProcess() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ChromaticAberrationPostProcess", ChromaticAberrationPostProcess);
}
//# sourceMappingURL=chromaticAberrationPostProcess.pure.js.map