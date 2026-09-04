import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { EngineStore } from "../Engines/engineStore.js";
/**
 * @internal
 */
export class ThinSSAO2BlurPostProcess extends EffectWrapper {
    _gatherImports(useWebGPU, list) {
        if (useWebGPU) {
            this._webGPUReady = true;
            list.push(import("../ShadersWGSL/ssao2.fragment.js"));
        }
        else {
            list.push(import("../Shaders/ssao2.fragment.js"));
        }
    }
    constructor(name, engine = null, isHorizontal, options) {
        super({
            ...options,
            name,
            engine: engine || EngineStore.LastCreatedEngine,
            useShaderStore: true,
            useAsPostProcess: true,
            fragmentShader: ThinSSAO2BlurPostProcess.FragmentUrl,
            uniforms: ThinSSAO2BlurPostProcess.Uniforms,
            samplers: ThinSSAO2BlurPostProcess.Samplers,
            defines: "#define BLUR\n" + (isHorizontal ? "#define BLUR_H\n" : ""),
        });
        this._bypassBlur = false;
        this.textureSize = 0;
        this.bilateralSamples = 16;
        this.bilateralSoften = 0;
        this.bilateralTolerance = 0;
        this._expensiveBlur = true;
        this._isHorizontal = isHorizontal;
        const defines = this._getDefinesForBlur(this.expensiveBlur, this.bypassBlur);
        const samplers = this._getSamplersForBlur(this.bypassBlur);
        this.updateEffect(defines, null, samplers);
    }
    set bypassBlur(b) {
        const defines = this._getDefinesForBlur(this.expensiveBlur, b);
        const samplers = this._getSamplersForBlur(b);
        this.updateEffect(defines, null, samplers);
        this._bypassBlur = b;
    }
    get bypassBlur() {
        return this._bypassBlur;
    }
    set expensiveBlur(b) {
        const defines = this._getDefinesForBlur(b, this._bypassBlur);
        this.updateEffect(defines);
        this._expensiveBlur = b;
    }
    get expensiveBlur() {
        return this._expensiveBlur;
    }
    bind(noDefaultBindings = false) {
        super.bind(noDefaultBindings);
        const effect = this._drawWrapper.effect;
        effect.setFloat("outSize", this.textureSize);
        effect.setInt("samples", this.bilateralSamples);
        effect.setFloat("soften", this.bilateralSoften);
        effect.setFloat("tolerance", this.bilateralTolerance);
    }
    _getSamplersForBlur(disabled) {
        return disabled ? ["textureSampler"] : ["textureSampler", "depthSampler"];
    }
    _getDefinesForBlur(bilateral, disabled) {
        let define = "#define BLUR\n";
        if (disabled) {
            define += "#define BLUR_BYPASS\n";
        }
        if (!bilateral) {
            define += "#define BLUR_LEGACY\n";
        }
        return this._isHorizontal ? define + "#define BLUR_H\n" : define;
    }
}
ThinSSAO2BlurPostProcess.FragmentUrl = "ssao2";
ThinSSAO2BlurPostProcess.Uniforms = ["outSize", "samples", "soften", "tolerance"];
ThinSSAO2BlurPostProcess.Samplers = ["textureSampler", "depthSampler"];
//# sourceMappingURL=thinSSAO2BlurPostProcess.js.map