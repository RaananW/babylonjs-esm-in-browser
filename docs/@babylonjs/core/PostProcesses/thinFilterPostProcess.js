import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { EngineStore } from "../Engines/engineStore.js";
import { Matrix } from "../Maths/math.vector.pure.js";
/**
 * Post process used to apply a kernel filter
 */
export class ThinFilterPostProcess extends EffectWrapper {
    _gatherImports(useWebGPU, list) {
        if (useWebGPU) {
            this._webGPUReady = true;
            list.push(import("../ShadersWGSL/filter.fragment.js"));
        }
        else {
            list.push(import("../Shaders/filter.fragment.js"));
        }
    }
    /**
     * Constructs a new filter post process
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
            fragmentShader: ThinFilterPostProcess.FragmentUrl,
            uniforms: ThinFilterPostProcess.Uniforms,
        });
        /**
         * The matrix to be applied to the image
         */
        this.kernelMatrix = Matrix.Identity();
    }
    bind(noDefaultBindings = false) {
        super.bind(noDefaultBindings);
        this._drawWrapper.effect.setMatrix("kernelMatrix", this.kernelMatrix);
    }
}
/**
 * The fragment shader url
 */
ThinFilterPostProcess.FragmentUrl = "filter";
/**
 * The list of uniforms used by the effect
 */
ThinFilterPostProcess.Uniforms = ["kernelMatrix"];
//# sourceMappingURL=thinFilterPostProcess.js.map