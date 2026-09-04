import { EngineStore } from "../Engines/engineStore.js";
import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
/**
 * Robust Contrast Adaptive Sharpening (RCAS) post-process used by FSR 1
 */
export class ThinFSR1SharpenPostProcess extends EffectWrapper {
    /**
     * Creates a new FSR 1 sharpen post process
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
            fragmentShader: ThinFSR1SharpenPostProcess.FragmentUrl,
            uniforms: ThinFSR1SharpenPostProcess.Uniforms,
        });
    }
    _gatherImports(useWebGPU, list) {
        if (useWebGPU) {
            this._webGPUReady = true;
            list.push(import("../ShadersWGSL/fsr1Sharpen.fragment.js"));
        }
        else {
            list.push(import("../Shaders/fsr1Sharpen.fragment.js"));
        }
    }
    /**
     * Sets the required constant value on the effect. Plain uniforms are used (rather than a uniform
     * buffer) so this works on every backend, including Babylon Native, which disables uniform buffers.
     * @param effect The effect to set the constant on (typically the one provided by onApplyObservable).
     * @param sharpness The number of stops (halving) of the reduction of sharpness (0 = maximum sharpness)
     */
    updateConstants(effect, sharpness) {
        // Code based on FsrRcasCon from FSR 1:
        // https://github.com/GPUOpen-Effects/FidelityFX-FSR/blob/a21ffb8f6c13233ba336352bdff293894c706575/ffx-fsr/ffx_fsr1.h#L662
        sharpness = Math.pow(2, -sharpness);
        // Upstream FSR packs this as a uint and bitcasts it in the shader; this port declares it
        // as a float on both the GLSL and WGSL sides, so it is sent as one.
        // Since we haven't added the half-float shader yet, we don't need the second constant, which would require JS half-float calculation
        effect.setFloat4("con", sharpness, 0, 0, 0);
    }
}
/**
 * The fragment shader URL
 */
ThinFSR1SharpenPostProcess.FragmentUrl = "fsr1Sharpen";
/**
 * The list of uniforms used by the effect
 */
ThinFSR1SharpenPostProcess.Uniforms = ["con"];
//# sourceMappingURL=thinFSR1SharpenPostProcess.js.map