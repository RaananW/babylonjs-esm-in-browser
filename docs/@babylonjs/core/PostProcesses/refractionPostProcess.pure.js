/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { Texture } from "../Materials/Textures/texture.pure.js";
import { PostProcess } from "./postProcess.pure.js";
import { serialize } from "../Misc/decorators.js";
import { SerializationHelper } from "../Misc/decorators.serialization.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * Post process which applies a refraction texture
 * @see https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/usePostProcesses#refraction
 */
let RefractionPostProcess = (() => {
    var _a;
    let _classSuper = PostProcess;
    let _color_decorators;
    let _color_initializers = [];
    let _color_extraInitializers = [];
    let _depth_decorators;
    let _depth_initializers = [];
    let _depth_extraInitializers = [];
    let _colorLevel_decorators;
    let _colorLevel_initializers = [];
    let _colorLevel_extraInitializers = [];
    let _refractionTextureUrl_decorators;
    let _refractionTextureUrl_initializers = [];
    let _refractionTextureUrl_extraInitializers = [];
    return _a = class RefractionPostProcess extends _classSuper {
            /**
             * Gets or sets the refraction texture
             * Please note that you are responsible for disposing the texture if you set it manually
             */
            get refractionTexture() {
                return this._refTexture;
            }
            set refractionTexture(value) {
                if (this._refTexture && this._ownRefractionTexture) {
                    this._refTexture.dispose();
                }
                this._refTexture = value;
                this._ownRefractionTexture = false;
            }
            /**
             * Gets a string identifying the name of the class
             * @returns "RefractionPostProcess" string
             */
            getClassName() {
                return "RefractionPostProcess";
            }
            /**
             * Initializes the RefractionPostProcess
             * @see https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/usePostProcesses#refraction
             * @param name The name of the effect.
             * @param refractionTextureUrl Url of the refraction texture to use
             * @param color the base color of the refraction (used to taint the rendering)
             * @param depth simulated refraction depth
             * @param colorLevel the coefficient of the base color (0 to remove base color tainting)
             * @param options The required width/height ratio to downsize to before computing the render pass.
             * @param camera The camera to apply the render pass to.
             * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
             * @param engine The engine which the post process will be applied. (default: current engine)
             * @param reusable If the post process can be reused on the same frame. (default: false)
             */
            constructor(name, refractionTextureUrl, color, depth, colorLevel, options, camera, samplingMode, engine, reusable) {
                super(name, "refraction", ["baseColor", "depth", "colorLevel"], ["refractionSampler"], options, camera, samplingMode, engine, reusable);
                this._ownRefractionTexture = true;
                /** the base color of the refraction (used to taint the rendering) */
                this.color = __runInitializers(this, _color_initializers, void 0);
                /** simulated refraction depth */
                this.depth = (__runInitializers(this, _color_extraInitializers), __runInitializers(this, _depth_initializers, void 0));
                /** the coefficient of the base color (0 to remove base color tainting) */
                this.colorLevel = (__runInitializers(this, _depth_extraInitializers), __runInitializers(this, _colorLevel_initializers, void 0));
                /** Gets the url used to load the refraction texture */
                this.refractionTextureUrl = (__runInitializers(this, _colorLevel_extraInitializers), __runInitializers(this, _refractionTextureUrl_initializers, void 0));
                __runInitializers(this, _refractionTextureUrl_extraInitializers);
                this.color = color;
                this.depth = depth;
                this.colorLevel = colorLevel;
                this.refractionTextureUrl = refractionTextureUrl;
                this.onActivateObservable.add((cam) => {
                    this._refTexture = this._refTexture || new Texture(refractionTextureUrl, cam.getScene());
                });
                this.onApplyObservable.add((effect) => {
                    effect.setColor3("baseColor", this.color);
                    effect.setFloat("depth", this.depth);
                    effect.setFloat("colorLevel", this.colorLevel);
                    effect.setTexture("refractionSampler", this._refTexture);
                });
            }
            // Methods
            /**
             * Disposes of the post process
             * @param camera Camera to dispose post process on
             */
            dispose(camera) {
                if (this._refTexture && this._ownRefractionTexture) {
                    this._refTexture.dispose();
                    this._refTexture = null;
                }
                super.dispose(camera);
            }
            /**
             * @internal
             */
            static _Parse(parsedPostProcess, targetCamera, scene, rootUrl) {
                return SerializationHelper.Parse(() => {
                    return new _a(parsedPostProcess.name, parsedPostProcess.refractionTextureUrl, parsedPostProcess.color, parsedPostProcess.depth, parsedPostProcess.colorLevel, parsedPostProcess.options, targetCamera, parsedPostProcess.renderTargetSamplingMode, scene.getEngine(), parsedPostProcess.reusable);
                }, parsedPostProcess, scene, rootUrl);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _color_decorators = [serialize()];
            _depth_decorators = [serialize()];
            _colorLevel_decorators = [serialize()];
            _refractionTextureUrl_decorators = [serialize()];
            __esDecorate(null, null, _color_decorators, { kind: "field", name: "color", static: false, private: false, access: { has: obj => "color" in obj, get: obj => obj.color, set: (obj, value) => { obj.color = value; } }, metadata: _metadata }, _color_initializers, _color_extraInitializers);
            __esDecorate(null, null, _depth_decorators, { kind: "field", name: "depth", static: false, private: false, access: { has: obj => "depth" in obj, get: obj => obj.depth, set: (obj, value) => { obj.depth = value; } }, metadata: _metadata }, _depth_initializers, _depth_extraInitializers);
            __esDecorate(null, null, _colorLevel_decorators, { kind: "field", name: "colorLevel", static: false, private: false, access: { has: obj => "colorLevel" in obj, get: obj => obj.colorLevel, set: (obj, value) => { obj.colorLevel = value; } }, metadata: _metadata }, _colorLevel_initializers, _colorLevel_extraInitializers);
            __esDecorate(null, null, _refractionTextureUrl_decorators, { kind: "field", name: "refractionTextureUrl", static: false, private: false, access: { has: obj => "refractionTextureUrl" in obj, get: obj => obj.refractionTextureUrl, set: (obj, value) => { obj.refractionTextureUrl = value; } }, metadata: _metadata }, _refractionTextureUrl_initializers, _refractionTextureUrl_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { RefractionPostProcess };
let _Registered = false;
/**
 * Register side effects for refractionPostProcess.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterRefractionPostProcess() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.RefractionPostProcess", RefractionPostProcess);
}
//# sourceMappingURL=refractionPostProcess.pure.js.map