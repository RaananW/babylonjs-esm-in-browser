import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { EngineStore } from "../Engines/engineStore.js";
import { TmpVectors } from "../Maths/math.vector.pure.js";
/**
 * @internal
 */
export class ThinSSAO2CombinePostProcess extends EffectWrapper {
    _gatherImports(useWebGPU, list) {
        if (useWebGPU) {
            this._webGPUReady = true;
            list.push(import("../ShadersWGSL/ssaoCombine.fragment.js"));
        }
        else {
            list.push(import("../Shaders/ssaoCombine.fragment.js"));
        }
    }
    constructor(name, engine = null, options) {
        super({
            ...options,
            name,
            engine: engine || EngineStore.LastCreatedEngine,
            useShaderStore: true,
            useAsPostProcess: true,
            fragmentShader: ThinSSAO2CombinePostProcess.FragmentUrl,
            uniforms: ThinSSAO2CombinePostProcess.Uniforms,
            samplers: ThinSSAO2CombinePostProcess.Samplers,
        });
        this.camera = null;
        this.useViewportInCombineStage = true;
    }
    bind(noDefaultBindings = false) {
        super.bind(noDefaultBindings);
        const effect = this._drawWrapper.effect;
        if (this.camera) {
            const viewport = this.camera.viewport;
            if (this.useViewportInCombineStage) {
                effect.setVector4("viewport", TmpVectors.Vector4[0].copyFromFloats(viewport.x, viewport.y, viewport.width, viewport.height));
            }
            else {
                effect.setVector4("viewport", TmpVectors.Vector4[0].copyFromFloats(0, 0, 1, 1));
            }
        }
    }
}
ThinSSAO2CombinePostProcess.FragmentUrl = "ssaoCombine";
ThinSSAO2CombinePostProcess.Uniforms = ["viewport"];
ThinSSAO2CombinePostProcess.Samplers = ["originalColor"];
//# sourceMappingURL=thinSSAO2CombinePostProcess.js.map