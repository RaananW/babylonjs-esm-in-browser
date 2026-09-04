import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { EngineStore } from "../Engines/engineStore.js";
/** Defines operator used for tonemapping */
export var TonemappingOperator;
(function (TonemappingOperator) {
    /** Hable */
    TonemappingOperator[TonemappingOperator["Hable"] = 0] = "Hable";
    /** Reinhard */
    TonemappingOperator[TonemappingOperator["Reinhard"] = 1] = "Reinhard";
    /** HejiDawson */
    TonemappingOperator[TonemappingOperator["HejiDawson"] = 2] = "HejiDawson";
    /** Photographic */
    TonemappingOperator[TonemappingOperator["Photographic"] = 3] = "Photographic";
})(TonemappingOperator || (TonemappingOperator = {}));
/**
 * Post process used to apply a tone mapping operator
 */
export class ThinTonemapPostProcess extends EffectWrapper {
    _gatherImports(useWebGPU, list) {
        if (useWebGPU) {
            this._webGPUReady = true;
            list.push(import("../ShadersWGSL/tonemap.fragment.js"));
        }
        else {
            list.push(import("../Shaders/tonemap.fragment.js"));
        }
    }
    /**
     * Constructs a new tone mapping post process
     * @param name Name of the effect
     * @param engine Engine to use to render the effect. If not provided, the last created engine will be used
     * @param options Options to configure the effect
     */
    constructor(name, engine = null, options) {
        const operator = options?.operator ?? 1 /* TonemappingOperator.Reinhard */;
        let defines = "#define ";
        if (operator === 0 /* TonemappingOperator.Hable */) {
            defines += "HABLE_TONEMAPPING";
        }
        else if (operator === 1 /* TonemappingOperator.Reinhard */) {
            defines += "REINHARD_TONEMAPPING";
        }
        else if (operator === 2 /* TonemappingOperator.HejiDawson */) {
            defines += "OPTIMIZED_HEJIDAWSON_TONEMAPPING";
        }
        else if (operator === 3 /* TonemappingOperator.Photographic */) {
            defines += "PHOTOGRAPHIC_TONEMAPPING";
        }
        super({
            ...options,
            name,
            engine: engine || EngineStore.LastCreatedEngine,
            useShaderStore: true,
            useAsPostProcess: true,
            fragmentShader: ThinTonemapPostProcess.FragmentUrl,
            uniforms: ThinTonemapPostProcess.Uniforms,
            defines,
        });
        /**
         * Gets the operator to use (default: Reinhard)
         */
        this.operator = 1 /* TonemappingOperator.Reinhard */;
        /**
         * Defines the required exposure adjustment (default: 1.0)
         */
        this.exposureAdjustment = 1;
        this.operator = operator;
        this.exposureAdjustment = options?.exposureAdjustment ?? 1;
    }
    bind(noDefaultBindings = false) {
        super.bind(noDefaultBindings);
        this._drawWrapper.effect.setFloat("_ExposureAdjustment", this.exposureAdjustment);
    }
}
/**
 * The fragment shader url
 */
ThinTonemapPostProcess.FragmentUrl = "tonemap";
/**
 * The list of uniforms used by the effect
 */
ThinTonemapPostProcess.Uniforms = ["_ExposureAdjustment"];
//# sourceMappingURL=thinTonemapPostProcess.js.map