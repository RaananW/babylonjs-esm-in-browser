import { EngineStore } from "../Engines/engineStore.js";
import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
/**
 * Edge Adaptive Spatial Upsampling (EASU) post-process used by FSR 1
 */
export class ThinFSR1UpscalePostProcess extends EffectWrapper {
    /**
     * Creates a new FSR 1 upscale post process
     * @param name Name of the effect
     * @param engine Engine to use to render the effect. If not provided, the last created engine will be used
     * @param options Options to configure the effect
     */
    constructor(name, engine, options) {
        engine ?? (engine = EngineStore.LastCreatedEngine);
        super({
            ...options,
            name,
            engine,
            useShaderStore: true,
            useAsPostProcess: true,
            fragmentShader: ThinFSR1UpscalePostProcess.FragmentUrl,
            uniforms: ThinFSR1UpscalePostProcess.Uniforms,
        });
    }
    _gatherImports(useWebGPU, list) {
        if (useWebGPU) {
            this._webGPUReady = true;
            list.push(import("../ShadersWGSL/fsr1Upscale.fragment.js"));
        }
        else {
            list.push(import("../Shaders/fsr1Upscale.fragment.js"));
        }
    }
    /**
     * Sets the required constant values on the effect. Plain uniforms are used (rather than a uniform
     * buffer) so this works on every backend, including Babylon Native, which disables uniform buffers.
     * @param effect The effect to set the constants on (typically the one provided by onApplyObservable).
     * @param viewportWidth The rendered input width being upscaled
     * @param viewportHeight The rendered input height being upscaled
     * @param inputWidth The width of the texture containing the input viewport
     * @param inputHeight The height of the texture containing the input viewport
     * @param outputWidth The display width which the input image gets upscaled to
     * @param outputHeight The display height which the input image gets upscaled to
     */
    updateConstants(effect, viewportWidth, viewportHeight, inputWidth, inputHeight, outputWidth, outputHeight) {
        // Code based on FsrEasuCon from FSR 1:
        // https://github.com/GPUOpen-Effects/FidelityFX-FSR/blob/a21ffb8f6c13233ba336352bdff293894c706575/ffx-fsr/ffx_fsr1.h#L156
        const rcpInputWidth = 1 / inputWidth;
        const rcpInputHeight = 1 / inputHeight;
        const rcpOutputWidth = 1 / outputWidth;
        const rcpOutputHeight = 1 / outputHeight;
        // Upstream FSR packs these as uints and bitcasts them in the shader; this port declares
        // them as floats on both the GLSL and WGSL sides, so they are sent as floats.
        effect.setFloat4("con0", viewportWidth * rcpOutputWidth, viewportHeight * rcpOutputHeight, 0.5 * viewportWidth * rcpOutputWidth - 0.5, 0.5 * viewportHeight * rcpOutputHeight - 0.5);
        effect.setFloat4("con1", rcpInputWidth, rcpInputHeight, 1 * rcpInputWidth, -1 * rcpInputHeight);
        effect.setFloat4("con2", -1 * rcpInputWidth, 2 * rcpInputHeight, 1 * rcpInputWidth, 2 * rcpInputHeight);
        effect.setFloat4("con3", 0 * rcpInputWidth, 4 * rcpInputHeight, 0, 0);
    }
}
/**
 * The fragment shader URL
 */
ThinFSR1UpscalePostProcess.FragmentUrl = "fsr1Upscale";
/**
 * The list of uniforms used by the effect
 */
ThinFSR1UpscalePostProcess.Uniforms = ["con0", "con1", "con2", "con3"];
//# sourceMappingURL=thinFSR1UpscalePostProcess.js.map