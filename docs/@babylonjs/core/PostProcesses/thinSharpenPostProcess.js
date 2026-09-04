import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { EngineStore } from "../Engines/engineStore.js";
/**
 * Post process used to apply a sharpen effect
 */
export class ThinSharpenPostProcess extends EffectWrapper {
    _gatherImports(useWebGPU, list) {
        if (useWebGPU) {
            this._webGPUReady = true;
            list.push(import("../ShadersWGSL/sharpen.fragment.js"));
        }
        else {
            list.push(import("../Shaders/sharpen.fragment.js"));
        }
    }
    /**
     * Constructs a new sharpen post process
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
            fragmentShader: ThinSharpenPostProcess.FragmentUrl,
            uniforms: ThinSharpenPostProcess.Uniforms,
        });
        /**
         * How much of the original color should be applied. Setting this to 0 will display edge detection. (default: 1)
         */
        this.colorAmount = 1.0;
        /**
         * How much sharpness should be applied (default: 0.3)
         */
        this.edgeAmount = 0.3;
        /**
         * The width of the source texture
         */
        this.textureWidth = 0;
        /**
         * The height of the source texture
         */
        this.textureHeight = 0;
    }
    bind(noDefaultBindings = false) {
        super.bind(noDefaultBindings);
        const effect = this._drawWrapper.effect;
        effect.setFloat2("screenSize", this.textureWidth, this.textureHeight);
        effect.setFloat2("sharpnessAmounts", this.edgeAmount, this.colorAmount);
    }
}
/**
 * The fragment shader url
 */
ThinSharpenPostProcess.FragmentUrl = "sharpen";
/**
 * The list of uniforms used by the effect
 */
ThinSharpenPostProcess.Uniforms = ["sharpnessAmounts", "screenSize"];
//# sourceMappingURL=thinSharpenPostProcess.js.map