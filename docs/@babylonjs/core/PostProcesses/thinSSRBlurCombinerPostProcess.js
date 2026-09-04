import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { EngineStore } from "../Engines/engineStore.js";
import { TmpVectors } from "../Maths/math.vector.pure.js";
/**
 * @internal
 */
export class ThinSSRBlurCombinerPostProcess extends EffectWrapper {
    _gatherImports(useWebGPU, list) {
        if (useWebGPU) {
            this._webGPUReady = true;
            list.push(import("../ShadersWGSL/screenSpaceReflection2BlurCombiner.fragment.js"));
        }
        else {
            list.push(import("../Shaders/screenSpaceReflection2BlurCombiner.fragment.js"));
        }
    }
    constructor(name, engine = null, options) {
        super({
            ...options,
            name,
            engine: engine || EngineStore.LastCreatedEngine,
            useShaderStore: true,
            useAsPostProcess: true,
            fragmentShader: ThinSSRBlurCombinerPostProcess.FragmentUrl,
            uniforms: ThinSSRBlurCombinerPostProcess.Uniforms,
            samplers: ThinSSRBlurCombinerPostProcess.Samplers,
        });
        this.strength = 1;
        this.reflectionSpecularFalloffExponent = 1;
        this.camera = null;
        this._useFresnel = false;
        this._useScreenspaceDepth = false;
        this._inputTextureColorIsInGammaSpace = true;
        this._generateOutputInGammaSpace = true;
        this._debug = false;
        this._reflectivityThreshold = 0.04;
        this._normalsAreInWorldSpace = false;
        this._normalsAreUnsigned = false;
        this._updateEffectDefines();
    }
    get useFresnel() {
        return this._useFresnel;
    }
    set useFresnel(fresnel) {
        if (this._useFresnel === fresnel) {
            return;
        }
        this._useFresnel = fresnel;
        this._updateEffectDefines();
    }
    get useScreenspaceDepth() {
        return this._useScreenspaceDepth;
    }
    set useScreenspaceDepth(value) {
        if (this._useScreenspaceDepth === value) {
            return;
        }
        this._useScreenspaceDepth = value;
        this._updateEffectDefines();
    }
    get inputTextureColorIsInGammaSpace() {
        return this._inputTextureColorIsInGammaSpace;
    }
    set inputTextureColorIsInGammaSpace(gammaSpace) {
        if (this._inputTextureColorIsInGammaSpace === gammaSpace) {
            return;
        }
        this._inputTextureColorIsInGammaSpace = gammaSpace;
        this._updateEffectDefines();
    }
    get generateOutputInGammaSpace() {
        return this._generateOutputInGammaSpace;
    }
    set generateOutputInGammaSpace(gammaSpace) {
        if (this._generateOutputInGammaSpace === gammaSpace) {
            return;
        }
        this._generateOutputInGammaSpace = gammaSpace;
        this._updateEffectDefines();
    }
    get debug() {
        return this._debug;
    }
    set debug(value) {
        if (this._debug === value) {
            return;
        }
        this._debug = value;
        this._updateEffectDefines();
    }
    get reflectivityThreshold() {
        return this._reflectivityThreshold;
    }
    set reflectivityThreshold(threshold) {
        if (threshold === this._reflectivityThreshold) {
            return;
        }
        if ((threshold === 0 && this._reflectivityThreshold !== 0) || (threshold !== 0 && this._reflectivityThreshold === 0)) {
            this._reflectivityThreshold = threshold;
            this._updateEffectDefines();
        }
        else {
            this._reflectivityThreshold = threshold;
        }
    }
    get normalsAreInWorldSpace() {
        return this._normalsAreInWorldSpace;
    }
    set normalsAreInWorldSpace(value) {
        if (this._normalsAreInWorldSpace === value) {
            return;
        }
        this._normalsAreInWorldSpace = value;
        this._updateEffectDefines();
    }
    get normalsAreUnsigned() {
        return this._normalsAreUnsigned;
    }
    set normalsAreUnsigned(value) {
        if (this._normalsAreUnsigned === value) {
            return;
        }
        this._normalsAreUnsigned = value;
        this._updateEffectDefines();
    }
    bind(noDefaultBindings = false) {
        super.bind(noDefaultBindings);
        const effect = this._drawWrapper.effect;
        effect.setFloat("strength", this.strength);
        effect.setFloat("reflectionSpecularFalloffExponent", this.reflectionSpecularFalloffExponent);
        effect.setFloat("reflectivityThreshold", this.reflectivityThreshold);
        if (this.useFresnel && this.camera) {
            const projectionMatrix = this.camera.getProjectionMatrix();
            projectionMatrix.invertToRef(TmpVectors.Matrix[0]);
            effect.setMatrix("projection", projectionMatrix);
            effect.setMatrix("invProjectionMatrix", TmpVectors.Matrix[0]);
            effect.setMatrix("view", this.camera.getViewMatrix());
            if (this.useScreenspaceDepth) {
                effect.setFloat("nearPlaneZ", this.camera.minZ);
                effect.setFloat("farPlaneZ", this.camera.maxZ);
            }
        }
    }
    _updateEffectDefines() {
        let defines = "";
        if (this._debug) {
            defines += "#define SSRAYTRACE_DEBUG\n";
        }
        if (this._inputTextureColorIsInGammaSpace) {
            defines += "#define SSR_INPUT_IS_GAMMA_SPACE\n";
        }
        if (this._generateOutputInGammaSpace) {
            defines += "#define SSR_OUTPUT_IS_GAMMA_SPACE\n";
        }
        if (this._useFresnel) {
            defines += "#define SSR_BLEND_WITH_FRESNEL\n";
        }
        if (this._useScreenspaceDepth) {
            defines += "#define SSRAYTRACE_SCREENSPACE_DEPTH\n";
        }
        if (this._reflectivityThreshold === 0) {
            defines += "#define SSR_DISABLE_REFLECTIVITY_TEST\n";
        }
        if (this._normalsAreInWorldSpace) {
            defines += "#define SSR_NORMAL_IS_IN_WORLDSPACE\n";
        }
        if (this._normalsAreUnsigned) {
            defines += "#define SSR_DECODE_NORMAL\n";
        }
        this.updateEffect(defines);
    }
}
ThinSSRBlurCombinerPostProcess.FragmentUrl = "screenSpaceReflection2BlurCombiner";
ThinSSRBlurCombinerPostProcess.Uniforms = [
    "strength",
    "reflectionSpecularFalloffExponent",
    "reflectivityThreshold",
    "projection",
    "invProjectionMatrix",
    "nearPlaneZ",
    "farPlaneZ",
    "view",
];
ThinSSRBlurCombinerPostProcess.Samplers = ["textureSampler", "depthSampler", "normalSampler", "mainSampler", "reflectivitySampler"];
//# sourceMappingURL=thinSSRBlurCombinerPostProcess.js.map