import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { EngineStore } from "../Engines/engineStore.js";
/**
 * Post process used to apply a convolution effect
 */
export class ThinConvolutionPostProcess extends EffectWrapper {
    _gatherImports(useWebGPU, list) {
        if (useWebGPU) {
            this._webGPUReady = true;
            list.push(import("../ShadersWGSL/convolution.fragment.js"));
        }
        else {
            list.push(import("../Shaders/convolution.fragment.js"));
        }
    }
    /**
     * Constructs a new convolution post process
     * @param name Name of the effect
     * @param engine Engine to use to render the effect. If not provided, the last created engine will be used
     * @param kernel Array of 9 values corresponding to the 3x3 kernel to be applied
     * @param options Options to configure the effect
     */
    constructor(name, engine = null, kernel, options) {
        super({
            ...options,
            name,
            engine: engine || EngineStore.LastCreatedEngine,
            useShaderStore: true,
            useAsPostProcess: true,
            fragmentShader: ThinConvolutionPostProcess.FragmentUrl,
            uniforms: ThinConvolutionPostProcess.Uniforms,
        });
        /**
         * The width of the source texture
         */
        this.textureWidth = 0;
        /**
         * The height of the source texture
         */
        this.textureHeight = 0;
        this.kernel = kernel;
    }
    bind(noDefaultBindings = false) {
        super.bind(noDefaultBindings);
        const effect = this._drawWrapper.effect;
        effect.setFloat2("screenSize", this.textureWidth, this.textureHeight);
        effect.setArray("kernel", this.kernel);
    }
}
// Statics
/**
 * Edge detection 0 see https://en.wikipedia.org/wiki/Kernel_(image_processing)
 */
ThinConvolutionPostProcess.EdgeDetect0Kernel = [1, 0, -1, 0, 0, 0, -1, 0, 1];
/**
 * Edge detection 1 see https://en.wikipedia.org/wiki/Kernel_(image_processing)
 */
ThinConvolutionPostProcess.EdgeDetect1Kernel = [0, 1, 0, 1, -4, 1, 0, 1, 0];
/**
 * Edge detection 2 see https://en.wikipedia.org/wiki/Kernel_(image_processing)
 */
ThinConvolutionPostProcess.EdgeDetect2Kernel = [-1, -1, -1, -1, 8, -1, -1, -1, -1];
/**
 * Kernel to sharpen an image see https://en.wikipedia.org/wiki/Kernel_(image_processing)
 */
ThinConvolutionPostProcess.SharpenKernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
/**
 * Kernel to emboss an image see https://en.wikipedia.org/wiki/Kernel_(image_processing)
 */
ThinConvolutionPostProcess.EmbossKernel = [-2, -1, 0, -1, 1, 1, 0, 1, 2];
/**
 * Kernel to blur an image see https://en.wikipedia.org/wiki/Kernel_(image_processing)
 */
ThinConvolutionPostProcess.GaussianKernel = [0, 1, 0, 1, 1, 1, 0, 1, 0];
/**
 * The fragment shader url
 */
ThinConvolutionPostProcess.FragmentUrl = "convolution";
/**
 * The list of uniforms used by the effect
 */
ThinConvolutionPostProcess.Uniforms = ["kernel", "screenSize"];
//# sourceMappingURL=thinConvolutionPostProcess.js.map