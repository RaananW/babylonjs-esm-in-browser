/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { Logger } from "../Misc/logger.js";
import { PostProcess } from "./postProcess.pure.js";

import { EngineStore } from "../Engines/engineStore.js";
import { serialize } from "../Misc/decorators.js";
import { SerializationHelper } from "../Misc/decorators.serialization.js";
import { ThinScreenSpaceCurvaturePostProcess } from "./thinScreenSpaceCurvaturePostProcess.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * The Screen Space curvature effect can help highlighting ridge and valley of a model.
 */
let ScreenSpaceCurvaturePostProcess = (() => {
    var _a;
    let _classSuper = PostProcess;
    let _instanceExtraInitializers = [];
    let _get_ridge_decorators;
    let _get_valley_decorators;
    return _a = class ScreenSpaceCurvaturePostProcess extends _classSuper {
            /**
             * Defines how much ridge the curvature effect displays.
             */
            get ridge() {
                return this._effectWrapper.ridge;
            }
            set ridge(value) {
                this._effectWrapper.ridge = value;
            }
            /**
             * Defines how much valley the curvature effect displays.
             */
            get valley() {
                return this._effectWrapper.valley;
            }
            set valley(value) {
                this._effectWrapper.valley = value;
            }
            /**
             * Gets a string identifying the name of the class
             * @returns "ScreenSpaceCurvaturePostProcess" string
             */
            getClassName() {
                return "ScreenSpaceCurvaturePostProcess";
            }
            /**
             * Creates a new instance ScreenSpaceCurvaturePostProcess
             * @param name The name of the effect.
             * @param scene The scene containing the objects to blur according to their velocity.
             * @param options The required width/height ratio to downsize to before computing the render pass.
             * @param camera The camera to apply the render pass to.
             * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
             * @param engine The engine which the post process will be applied. (default: current engine)
             * @param reusable If the post process can be reused on the same frame. (default: false)
             * @param textureType Type of textures used when performing the post process. (default: 0)
             * @param blockCompilation If compilation of the shader should not be done in the constructor. The updateEffect method can be used to compile the shader at a later time. (default: false)
             */
            constructor(name, scene, options, camera, samplingMode, engine, reusable, textureType = 0, blockCompilation = false) {
                const localOptions = {
                    uniforms: ThinScreenSpaceCurvaturePostProcess.Uniforms,
                    samplers: ThinScreenSpaceCurvaturePostProcess.Samplers,
                    size: typeof options === "number" ? options : undefined,
                    camera,
                    samplingMode,
                    engine,
                    reusable,
                    textureType,
                    blockCompilation,
                    ...options,
                };
                super(name, ThinScreenSpaceCurvaturePostProcess.FragmentUrl, {
                    effectWrapper: typeof options === "number" || !options.effectWrapper ? new ThinScreenSpaceCurvaturePostProcess(name, engine, localOptions) : undefined,
                    ...localOptions,
                });
                this._geometryBufferRenderer = __runInitializers(this, _instanceExtraInitializers);
                this._geometryBufferRenderer = scene.enableGeometryBufferRenderer();
                if (!this._geometryBufferRenderer) {
                    // Geometry buffer renderer is not supported. So, work as a passthrough.
                    Logger.Error("Multiple Render Target support needed for screen space curvature post process. Please use IsSupported test first.");
                }
                else {
                    if (this._geometryBufferRenderer.generateNormalsInWorldSpace) {
                        Logger.Error("ScreenSpaceCurvaturePostProcess does not support generateNormalsInWorldSpace=true for the geometry buffer renderer!");
                    }
                    // Geometry buffer renderer is supported.
                    this.onApply = (effect) => {
                        const normalTexture = this._geometryBufferRenderer.getGBuffer().textures[1];
                        effect.setTexture("normalSampler", normalTexture);
                    };
                }
            }
            /**
             * Support test.
             */
            static get IsSupported() {
                const engine = EngineStore.LastCreatedEngine;
                if (!engine) {
                    return false;
                }
                return engine.getCaps().drawBuffersExtension;
            }
            /**
             * @internal
             */
            static _Parse(parsedPostProcess, targetCamera, scene, rootUrl) {
                return SerializationHelper.Parse(() => {
                    return new _a(parsedPostProcess.name, scene, parsedPostProcess.options, targetCamera, parsedPostProcess.renderTargetSamplingMode, scene.getEngine(), parsedPostProcess.reusable, parsedPostProcess.textureType);
                }, parsedPostProcess, scene, rootUrl);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_ridge_decorators = [serialize()];
            _get_valley_decorators = [serialize()];
            __esDecorate(_a, null, _get_ridge_decorators, { kind: "getter", name: "ridge", static: false, private: false, access: { has: obj => "ridge" in obj, get: obj => obj.ridge }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_valley_decorators, { kind: "getter", name: "valley", static: false, private: false, access: { has: obj => "valley" in obj, get: obj => obj.valley }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { ScreenSpaceCurvaturePostProcess };
let _Registered = false;
/**
 * Register side effects for screenSpaceCurvaturePostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterScreenSpaceCurvaturePostProcess() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ScreenSpaceCurvaturePostProcess", ScreenSpaceCurvaturePostProcess);
}
//# sourceMappingURL=screenSpaceCurvaturePostProcess.pure.js.map