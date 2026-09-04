import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { EngineStore } from "../Engines/engineStore.js";
/**
 * Post process used to apply a screen space curvature post process
 */
export class ThinScreenSpaceCurvaturePostProcess extends EffectWrapper {
    _gatherImports(useWebGPU, list) {
        if (useWebGPU) {
            this._webGPUReady = true;
            list.push(import("../ShadersWGSL/screenSpaceCurvature.fragment.js"));
        }
        else {
            list.push(import("../Shaders/screenSpaceCurvature.fragment.js"));
        }
    }
    /**
     * Constructs a new screen space curvature post process
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
            fragmentShader: ThinScreenSpaceCurvaturePostProcess.FragmentUrl,
            uniforms: ThinScreenSpaceCurvaturePostProcess.Uniforms,
            samplers: ThinScreenSpaceCurvaturePostProcess.Samplers,
        });
        /**
         * Defines how much ridge the curvature effect displays.
         */
        this.ridge = 1;
        /**
         * Defines how much valley the curvature effect displays.
         */
        this.valley = 1;
    }
    bind(noDefaultBindings = false) {
        super.bind(noDefaultBindings);
        const effect = this._drawWrapper.effect;
        effect.setFloat("curvature_ridge", 0.5 / Math.max(this.ridge * this.ridge, 1e-4));
        effect.setFloat("curvature_valley", 0.7 / Math.max(this.valley * this.valley, 1e-4));
    }
}
/**
 * The fragment shader url
 */
ThinScreenSpaceCurvaturePostProcess.FragmentUrl = "screenSpaceCurvature";
/**
 * The list of uniforms used by the effect
 */
ThinScreenSpaceCurvaturePostProcess.Uniforms = ["curvature_ridge", "curvature_valley"];
/**
 * The list of samplers used by the effect
 */
ThinScreenSpaceCurvaturePostProcess.Samplers = ["normalSampler"];
//# sourceMappingURL=thinScreenSpaceCurvaturePostProcess.js.map