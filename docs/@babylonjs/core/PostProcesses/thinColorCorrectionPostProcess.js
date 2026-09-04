import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { Texture } from "../Materials/Textures/texture.pure.js";
/**
 * Post process used to apply color correction
 */
export class ThinColorCorrectionPostProcess extends EffectWrapper {
    _gatherImports(useWebGPU, list) {
        if (useWebGPU) {
            this._webGPUReady = true;
            list.push(import("../ShadersWGSL/colorCorrection.fragment.js"));
        }
        else {
            list.push(import("../Shaders/colorCorrection.fragment.js"));
        }
    }
    /**
     * Constructs a new black and white post process
     * @param name Name of the effect
     * @param scene The scene the effect belongs to
     * @param colorTableUrl URL of the color table texture
     * @param options Options to configure the effect
     */
    constructor(name, scene, colorTableUrl, options) {
        super({
            ...options,
            name,
            engine: scene?.getEngine(),
            useShaderStore: true,
            useAsPostProcess: true,
            fragmentShader: ThinColorCorrectionPostProcess.FragmentUrl,
            samplers: ThinColorCorrectionPostProcess.Samplers,
        });
        this._colorTableTexture = new Texture(colorTableUrl, scene, true, false, Texture.TRILINEAR_SAMPLINGMODE);
        this._colorTableTexture.anisotropicFilteringLevel = 1;
        this._colorTableTexture.wrapU = Texture.CLAMP_ADDRESSMODE;
        this._colorTableTexture.wrapV = Texture.CLAMP_ADDRESSMODE;
        this.colorTableUrl = colorTableUrl;
    }
    bind(noDefaultBindings = false) {
        super.bind(noDefaultBindings);
        this._drawWrapper.effect.setTexture("colorTable", this._colorTableTexture);
    }
}
/**
 * The fragment shader url
 */
ThinColorCorrectionPostProcess.FragmentUrl = "colorCorrection";
/**
 * The list of uniforms used by the effect
 */
ThinColorCorrectionPostProcess.Samplers = ["colorTable"];
//# sourceMappingURL=thinColorCorrectionPostProcess.js.map