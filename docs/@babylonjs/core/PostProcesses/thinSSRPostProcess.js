
import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { Vector3, Matrix, Quaternion, TmpVectors } from "../Maths/math.vector.pure.js";
const Trs = Matrix.Compose(new Vector3(0.5, 0.5, 0.5), Quaternion.Identity(), new Vector3(0.5, 0.5, 0.5));
const TrsWebGPU = Matrix.Compose(new Vector3(0.5, 0.5, 1), Quaternion.Identity(), new Vector3(0.5, 0.5, 0));
/**
 * @internal
 */
export class ThinSSRPostProcess extends EffectWrapper {
    _gatherImports(useWebGPU, list) {
        if (useWebGPU) {
            this._webGPUReady = true;
            list.push(import("../ShadersWGSL/screenSpaceReflection2.fragment.js"));
        }
        else {
            list.push(import("../Shaders/screenSpaceReflection2.fragment.js"));
        }
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
    get useBlur() {
        return this._useBlur;
    }
    set useBlur(blur) {
        if (this._useBlur === blur) {
            return;
        }
        this._useBlur = blur;
        this._updateEffectDefines();
    }
    get enableSmoothReflections() {
        return this._enableSmoothReflections;
    }
    set enableSmoothReflections(enabled) {
        if (enabled === this._enableSmoothReflections) {
            return;
        }
        this._enableSmoothReflections = enabled;
        this._updateEffectDefines();
    }
    get environmentTexture() {
        return this._environmentTexture;
    }
    set environmentTexture(texture) {
        this._environmentTexture = texture;
        this._updateEffectDefines();
    }
    get environmentTextureIsProbe() {
        return this._environmentTextureIsProbe;
    }
    set environmentTextureIsProbe(isProbe) {
        this._environmentTextureIsProbe = isProbe;
        this._updateEffectDefines();
    }
    get attenuateScreenBorders() {
        return this._attenuateScreenBorders;
    }
    set attenuateScreenBorders(attenuate) {
        if (this._attenuateScreenBorders === attenuate) {
            return;
        }
        this._attenuateScreenBorders = attenuate;
        this._updateEffectDefines();
    }
    get attenuateIntersectionDistance() {
        return this._attenuateIntersectionDistance;
    }
    set attenuateIntersectionDistance(attenuate) {
        if (this._attenuateIntersectionDistance === attenuate) {
            return;
        }
        this._attenuateIntersectionDistance = attenuate;
        this._updateEffectDefines();
    }
    get attenuateIntersectionIterations() {
        return this._attenuateIntersectionIterations;
    }
    set attenuateIntersectionIterations(attenuate) {
        if (this._attenuateIntersectionIterations === attenuate) {
            return;
        }
        this._attenuateIntersectionIterations = attenuate;
        this._updateEffectDefines();
    }
    get attenuateFacingCamera() {
        return this._attenuateFacingCamera;
    }
    set attenuateFacingCamera(attenuate) {
        if (this._attenuateFacingCamera === attenuate) {
            return;
        }
        this._attenuateFacingCamera = attenuate;
        this._updateEffectDefines();
    }
    get attenuateBackfaceReflection() {
        return this._attenuateBackfaceReflection;
    }
    set attenuateBackfaceReflection(attenuate) {
        if (this._attenuateBackfaceReflection === attenuate) {
            return;
        }
        this._attenuateBackfaceReflection = attenuate;
        this._updateEffectDefines();
    }
    get clipToFrustum() {
        return this._clipToFrustum;
    }
    set clipToFrustum(clip) {
        if (this._clipToFrustum === clip) {
            return;
        }
        this._clipToFrustum = clip;
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
    get enableAutomaticThicknessComputation() {
        return this._enableAutomaticThicknessComputation;
    }
    set enableAutomaticThicknessComputation(automatic) {
        if (this._enableAutomaticThicknessComputation === automatic) {
            return;
        }
        this._enableAutomaticThicknessComputation = automatic;
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
    get textureWidth() {
        return this._textureWidth;
    }
    set textureWidth(width) {
        if (this._textureWidth === width) {
            return;
        }
        this._textureWidth = width;
    }
    get textureHeight() {
        return this._textureHeight;
    }
    set textureHeight(height) {
        if (this._textureHeight === height) {
            return;
        }
        this._textureHeight = height;
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
    constructor(name, scene, options) {
        super({
            ...options,
            name,
            engine: scene.getEngine(),
            useShaderStore: true,
            useAsPostProcess: true,
            fragmentShader: ThinSSRPostProcess.FragmentUrl,
            uniforms: ThinSSRPostProcess.Uniforms,
            samplers: ThinSSRPostProcess.Samplers,
            shaderLanguage: scene.getEngine().isWebGPU ? 1 /* ShaderLanguage.WGSL */ : 0 /* ShaderLanguage.GLSL */,
        });
        this.isSSRSupported = true;
        this.maxDistance = 1000.0;
        this.step = 1.0;
        this.thickness = 0.5;
        this.strength = 1;
        this.reflectionSpecularFalloffExponent = 1;
        this.maxSteps = 1000.0;
        this.roughnessFactor = 0.2;
        this.selfCollisionNumSkip = 1;
        this._reflectivityThreshold = 0.04;
        this._useBlur = false;
        this._enableSmoothReflections = false;
        this._environmentTextureIsProbe = false;
        this._attenuateScreenBorders = true;
        this._attenuateIntersectionDistance = true;
        this._attenuateIntersectionIterations = true;
        this._attenuateFacingCamera = false;
        this._attenuateBackfaceReflection = false;
        this._clipToFrustum = true;
        this._useFresnel = false;
        this._enableAutomaticThicknessComputation = false;
        this._inputTextureColorIsInGammaSpace = true;
        this._generateOutputInGammaSpace = true;
        this._debug = false;
        this._textureWidth = 0;
        this._textureHeight = 0;
        this.camera = null;
        this._useScreenspaceDepth = false;
        this._normalsAreInWorldSpace = false;
        this._normalsAreUnsigned = false;
        this._scene = scene;
        this._updateEffectDefines();
    }
    bind(noDefaultBindings = false) {
        super.bind(noDefaultBindings);
        const effect = this._drawWrapper.effect;
        const camera = this.camera;
        if (!camera) {
            return;
        }
        const viewMatrix = camera.getViewMatrix();
        const projectionMatrix = camera.getProjectionMatrix();
        projectionMatrix.invertToRef(TmpVectors.Matrix[0]);
        viewMatrix.invertToRef(TmpVectors.Matrix[1]);
        effect.setMatrix("projection", projectionMatrix);
        effect.setMatrix("view", viewMatrix);
        effect.setMatrix("invView", TmpVectors.Matrix[1]);
        effect.setMatrix("invProjectionMatrix", TmpVectors.Matrix[0]);
        effect.setFloat("thickness", this.thickness);
        effect.setFloat("reflectionSpecularFalloffExponent", this.reflectionSpecularFalloffExponent);
        effect.setFloat("strength", this.strength);
        effect.setFloat("stepSize", this.step);
        effect.setFloat("maxSteps", this.maxSteps);
        effect.setFloat("roughnessFactor", this.roughnessFactor);
        effect.setFloat("nearPlaneZ", camera.minZ);
        effect.setFloat("farPlaneZ", camera.maxZ);
        effect.setFloat("maxDistance", this.maxDistance);
        effect.setFloat("selfCollisionNumSkip", this.selfCollisionNumSkip);
        effect.setFloat("reflectivityThreshold", this._reflectivityThreshold);
        Matrix.ScalingToRef(this.textureWidth, this.textureHeight, 1, TmpVectors.Matrix[2]);
        projectionMatrix.multiplyToRef(this._scene.getEngine().isWebGPU ? TrsWebGPU : Trs, TmpVectors.Matrix[3]);
        TmpVectors.Matrix[3].multiplyToRef(TmpVectors.Matrix[2], TmpVectors.Matrix[4]);
        effect.setMatrix("projectionPixel", TmpVectors.Matrix[4]);
        if (this._environmentTexture) {
            effect.setTexture("envCubeSampler", this._environmentTexture);
            if (this._environmentTexture.boundingBoxSize) {
                effect.setVector3("vReflectionPosition", this._environmentTexture.boundingBoxPosition);
                effect.setVector3("vReflectionSize", this._environmentTexture.boundingBoxSize);
            }
        }
    }
    _updateEffectDefines() {
        const defines = [];
        if (this.isSSRSupported) {
            defines.push("#define SSR_SUPPORTED");
        }
        if (this._enableSmoothReflections) {
            defines.push("#define SSRAYTRACE_ENABLE_REFINEMENT");
        }
        if (this._scene.useRightHandedSystem) {
            defines.push("#define SSRAYTRACE_RIGHT_HANDED_SCENE");
        }
        if (this._useScreenspaceDepth) {
            defines.push("#define SSRAYTRACE_SCREENSPACE_DEPTH");
        }
        if (this._environmentTexture) {
            defines.push("#define SSR_USE_ENVIRONMENT_CUBE");
            if (this._environmentTexture.boundingBoxSize) {
                defines.push("#define SSR_USE_LOCAL_REFLECTIONMAP_CUBIC");
            }
            if (this._environmentTexture.gammaSpace) {
                defines.push("#define SSR_ENVIRONMENT_CUBE_IS_GAMMASPACE");
            }
        }
        if (this._environmentTextureIsProbe) {
            defines.push("#define SSR_INVERTCUBICMAP");
        }
        if (this._enableAutomaticThicknessComputation) {
            defines.push("#define SSRAYTRACE_USE_BACK_DEPTHBUFFER");
        }
        if (this._attenuateScreenBorders) {
            defines.push("#define SSR_ATTENUATE_SCREEN_BORDERS");
        }
        if (this._attenuateIntersectionDistance) {
            defines.push("#define SSR_ATTENUATE_INTERSECTION_DISTANCE");
        }
        if (this._attenuateIntersectionIterations) {
            defines.push("#define SSR_ATTENUATE_INTERSECTION_NUMITERATIONS");
        }
        if (this._attenuateFacingCamera) {
            defines.push("#define SSR_ATTENUATE_FACING_CAMERA");
        }
        if (this._attenuateBackfaceReflection) {
            defines.push("#define SSR_ATTENUATE_BACKFACE_REFLECTION");
        }
        if (this._clipToFrustum) {
            defines.push("#define SSRAYTRACE_CLIP_TO_FRUSTUM");
        }
        if (this.useBlur) {
            defines.push("#define SSR_USE_BLUR");
        }
        if (this._debug) {
            defines.push("#define SSRAYTRACE_DEBUG");
        }
        if (this._inputTextureColorIsInGammaSpace) {
            defines.push("#define SSR_INPUT_IS_GAMMA_SPACE");
        }
        if (this._generateOutputInGammaSpace) {
            defines.push("#define SSR_OUTPUT_IS_GAMMA_SPACE");
        }
        if (this._useFresnel) {
            defines.push("#define SSR_BLEND_WITH_FRESNEL");
        }
        if (this._reflectivityThreshold === 0) {
            defines.push("#define SSR_DISABLE_REFLECTIVITY_TEST");
        }
        if (this._normalsAreInWorldSpace) {
            defines.push("#define SSR_NORMAL_IS_IN_WORLDSPACE");
        }
        if (this._normalsAreUnsigned) {
            defines.push("#define SSR_DECODE_NORMAL");
        }
        if (this.camera && this.camera.mode === 1) {
            defines.push("#define ORTHOGRAPHIC_CAMERA");
        }
        this.updateEffect(defines.join("\n"));
    }
}
/**
 * The fragment shader url
 */
ThinSSRPostProcess.FragmentUrl = "screenSpaceReflection2";
/**
 * The list of uniforms used by the effect
 */
ThinSSRPostProcess.Uniforms = [
    "projection",
    "invProjectionMatrix",
    "view",
    "invView",
    "thickness",
    "reflectionSpecularFalloffExponent",
    "strength",
    "stepSize",
    "maxSteps",
    "roughnessFactor",
    "projectionPixel",
    "nearPlaneZ",
    "farPlaneZ",
    "maxDistance",
    "selfCollisionNumSkip",
    "vReflectionPosition",
    "vReflectionSize",
    "backSizeFactor",
    "reflectivityThreshold",
];
ThinSSRPostProcess.Samplers = ["textureSampler", "normalSampler", "reflectivitySampler", "depthSampler", "envCubeSampler", "backDepthSampler"];
//# sourceMappingURL=thinSSRPostProcess.js.map