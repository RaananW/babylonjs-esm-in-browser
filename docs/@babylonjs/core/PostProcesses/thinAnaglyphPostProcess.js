import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { EngineStore } from "../Engines/engineStore.js";
/**
 * Postprocess used to generate anaglyphic rendering
 */
export class ThinAnaglyphPostProcess extends EffectWrapper {
    _gatherImports(useWebGPU, list) {
        if (useWebGPU) {
            this._webGPUReady = true;
            list.push(import("../ShadersWGSL/anaglyph.fragment.js"));
        }
        else {
            list.push(import("../Shaders/anaglyph.fragment.js"));
        }
    }
    /**
     * Constructs a new anaglyph post process
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
            fragmentShader: ThinAnaglyphPostProcess.FragmentUrl,
            samplers: ThinAnaglyphPostProcess.Samplers,
        });
    }
}
/**
 * The fragment shader url
 */
ThinAnaglyphPostProcess.FragmentUrl = "anaglyph";
/**
 * The list of samplers used by the effect
 */
ThinAnaglyphPostProcess.Samplers = ["leftSampler"];
//# sourceMappingURL=thinAnaglyphPostProcess.js.map