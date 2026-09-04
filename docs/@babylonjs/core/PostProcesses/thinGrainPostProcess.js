import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { EngineStore } from "../Engines/engineStore.js";
/**
 * Post process used to render a grain effect
 */
export class ThinGrainPostProcess extends EffectWrapper {
    _gatherImports(useWebGPU, list) {
        if (useWebGPU) {
            this._webGPUReady = true;
            list.push(import("../ShadersWGSL/grain.fragment.js"));
        }
        else {
            list.push(import("../Shaders/grain.fragment.js"));
        }
    }
    /**
     * Constructs a new grain post process
     * @param name Name of the effect
     * @param engine Engine to use to render the effect. If not provided, the last created engine will be used
     * @param options Options to configure the effect
     */
    constructor(name, engine = null, options) {
        super({
            ...options,
            name,
            engine: engine || EngineStore.LastCreatedEngine,
            useShaderStore: true,
            useAsPostProcess: true,
            fragmentShader: ThinGrainPostProcess.FragmentUrl,
            uniforms: ThinGrainPostProcess.Uniforms,
        });
        /**
         * The intensity of the grain added (default: 30)
         */
        this.intensity = 30;
        /**
         * If the grain should be randomized on every frame
         */
        this.animated = false;
    }
    bind(noDefaultBindings = false) {
        super.bind(noDefaultBindings);
        this._drawWrapper.effect.setFloat("intensity", this.intensity);
        this._drawWrapper.effect.setFloat("animatedSeed", this.animated ? Math.random() + 1 : 1);
    }
}
/**
 * The fragment shader url
 */
ThinGrainPostProcess.FragmentUrl = "grain";
/**
 * The list of uniforms used by the effect
 */
ThinGrainPostProcess.Uniforms = ["intensity", "animatedSeed"];
//# sourceMappingURL=thinGrainPostProcess.js.map