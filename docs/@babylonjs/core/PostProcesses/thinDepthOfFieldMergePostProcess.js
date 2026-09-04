import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { EngineStore } from "../Engines/engineStore.js";
/**
 * @internal
 */
export class ThinDepthOfFieldMergePostProcess extends EffectWrapper {
    _gatherImports(useWebGPU, list) {
        if (useWebGPU) {
            this._webGPUReady = true;
            list.push(import("../ShadersWGSL/depthOfFieldMerge.fragment.js"));
        }
        else {
            list.push(import("../Shaders/depthOfFieldMerge.fragment.js"));
        }
    }
    constructor(name, engine = null, options) {
        super({
            ...options,
            name,
            engine: engine || EngineStore.LastCreatedEngine,
            useShaderStore: true,
            useAsPostProcess: true,
            fragmentShader: ThinDepthOfFieldMergePostProcess.FragmentUrl,
            samplers: ThinDepthOfFieldMergePostProcess.Samplers,
        });
    }
}
ThinDepthOfFieldMergePostProcess.FragmentUrl = "depthOfFieldMerge";
ThinDepthOfFieldMergePostProcess.Samplers = ["circleOfConfusionSampler", "blurStep0", "blurStep1", "blurStep2"];
//# sourceMappingURL=thinDepthOfFieldMergePostProcess.js.map