/** This file must only contain pure code and pure imports */
import { __classPrivateFieldGet, __classPrivateFieldSet, __esDecorate, __runInitializers } from "../../tslib.es6.js";
/* eslint-disable @typescript-eslint/naming-convention */
import { serialize, expandToProperty, addAccessorsForMaterialProperty } from "../../Misc/decorators.js";
import { GetEnvironmentFuzzBRDFTexture, GetOpenPBREnvironmentBRDFTexture } from "../../Misc/brdfTextureTools.js";
import { Color3, Color4 } from "../../Maths/math.color.pure.js";
import { ImageProcessingConfiguration, RegisterImageProcessingConfiguration } from "../imageProcessingConfiguration.pure.js";
import { Texture } from "../Textures/texture.pure.js";
import { Material } from "../material.pure.js";
import { SerializationHelper } from "../../Misc/decorators.serialization.js";
import { MaterialDefines } from "../materialDefines.js";
import { ImageProcessingDefinesMixin } from "../imageProcessingConfiguration.defines.js";
import { EffectFallbacks } from "../effectFallbacks.js";
import { AddClipPlaneUniforms, BindClipPlane } from "../clipPlaneMaterialHelper.js";
import { PrepareVertexPullingUniforms, BindVertexPullingUniforms } from "../vertexPullingHelper.functions.js";
import { BindBonesParameters, BindFogParameters, BindLights, BindLogDepth, BindMorphTargetParameters, BindTextureMatrix, BindIBLParameters, BindIBLSamplers, HandleFallbacksForShadows, PrepareAttributesForBakedVertexAnimation, PrepareAttributesForBones, PrepareAttributesForInstances, PrepareAttributesForMorphTargets, PrepareDefinesForAttributes, PrepareDefinesForFrameBoundValues, PrepareDefinesForLights, PrepareDefinesForIBL, PrepareDefinesForMergedUV, PrepareDefinesForMisc, PrepareDefinesForMultiview, PrepareDefinesForOIT, PrepareDefinesForPrePass, PrepareUniformsAndSamplersList, PrepareUniformsAndSamplersForIBL, PrepareUniformLayoutForIBL, AreLightsTexturesReady, } from "../materialHelper.functions.js";

import { VertexBuffer } from "../../Buffers/buffer.pure.js";
import { MaterialHelperGeometryRendering } from "../materialHelper.geometryrendering.js";
import { PrePassConfiguration } from "../prePassConfiguration.js";
import { _ShaderImportLoader } from "../../Misc/shaderImportLoader.js";
import { MaterialFlags } from "../materialFlags.js";
import { Logger } from "../../Misc/logger.js";
import { UVDefinesMixin } from "../uv.defines.js";
import { PrepassDefinesMixin } from "../prepass.defines.js";
import { EnvironmentLightingDefinesMixin } from "../environmentLighting.defines.js";
import { Vector2, Vector3, Vector4, TmpVectors } from "../../Maths/math.vector.pure.js";
import { ImageProcessingMixin } from "../imageProcessing.js";
import { PushMaterial } from "../pushMaterial.js";
import { SmartArray } from "../../Misc/smartArray.js";
import { Tools } from "../../Misc/tools.pure.js";
import { GeometryBufferRenderer } from "../../Rendering/geometryBufferRenderer.pure.js";
import { RegisterClass } from "../../Misc/typeStore.js";
const onCreatedEffectParameters = { effect: null, subMesh: null };
function _GetComponentCount(value) {
    if (typeof value === "number") {
        return 1;
    }
    if (value instanceof Vector2) {
        return 2;
    }
    if (value instanceof Vector3 || value instanceof Color3) {
        return 3;
    }
    if (value instanceof Vector4 || value instanceof Color4) {
        return 4;
    }
    throw new Error("Unsupported OpenPBR property type.");
}
class Uniform {
    populateVectorFromLinkedProperties(vector) {
        const destinationSize = _GetComponentCount(vector);
        for (const propKey in this.linkedProperties) {
            const prop = this.linkedProperties[propKey];
            const sourceSize = prop.numComponents;
            if (destinationSize < sourceSize || prop.targetUniformComponentOffset > destinationSize - sourceSize) {
                if (sourceSize == 1) {
                    Logger.Error(`Float property ${prop.name} has an offset that is too large.`);
                }
                else {
                    Logger.Error(`Vector${sourceSize} property ${prop.name} won't fit in Vector${destinationSize} or has an offset that is too large.`);
                }
                return;
            }
            if (typeof prop.value === "number") {
                Uniform._tmpArray[prop.targetUniformComponentOffset] = prop.value;
            }
            else {
                prop.value.toArray(Uniform._tmpArray, prop.targetUniformComponentOffset);
            }
        }
        vector.fromArray(Uniform._tmpArray);
    }
    constructor(name, componentNum) {
        this.linkedProperties = {};
        /**
         * Cached key of the first entry of `linkedProperties`, set when the first
         * property is linked. Used by the per-frame bind loop to avoid an
         * `Object.keys(linkedProperties)[0]` allocation when reading scalar
         * uniforms.
         */
        this.firstLinkedKey = "";
        this.name = name;
        this.numComponents = componentNum;
    }
}
Uniform._tmpArray = [0, 0, 0, 0];
/**
 * Defines a property for the OpenPBRMaterial.
 */
class Property {
    /**
     * Creates a new Property instance.
     * @param name The name of the property in the shader
     * @param defaultValue The default value of the property
     * @param targetUniformName The name of the property in the shader uniform block
     * @param targetUniformComponentNum The number of components in the target uniform. All properties that are
     * packed into the same uniform must agree on the size of the target uniform.
     * @param targetUniformComponentOffset The offset in the uniform where this property will be packed.
     * @param requiredDefine Optional define name. When provided, the per-frame
     *  bind loop will skip pushing the owning uniform to the UBO unless
     *  `defines[requiredDefine]` is true.
     */
    constructor(name, defaultValue, targetUniformName, targetUniformComponentNum, targetUniformComponentOffset = 0, requiredDefine) {
        // public includeAlphaFromProp: string = "";
        /**
         * If not given a type, there will be no uniform defined for this property and
         * it will be assumed that the value will be packed into the already existing "uniformName" uniform.
         */
        this.targetUniformComponentNum = 4; // Default to vec4
        this.targetUniformComponentOffset = 0;
        this.name = name;
        this.targetUniformName = targetUniformName;
        this.defaultValue = defaultValue;
        this.value = defaultValue;
        this.targetUniformComponentNum = targetUniformComponentNum;
        this.targetUniformComponentOffset = targetUniformComponentOffset;
        this.requiredDefine = requiredDefine;
    }
    /**
     * Returns the number of components of the property based on its default value type.
     */
    get numComponents() {
        if (typeof this.defaultValue === "number") {
            return 1;
        }
        return _GetComponentCount(this.defaultValue);
    }
}
class Sampler {
    /**
     * The name of the sampler used in the shader.
     * If this naming changes, we'll also need to change:
     * - samplerFragmentDeclaration.fx
     * - openpbr.fragment.fx
     */
    get samplerName() {
        return this.samplerPrefix + "Sampler";
    }
    /**
     * The name of the sampler info used in the shader.
     * If this naming changes, we'll also need to change:
     * - openpbr.vertex.fx
     * - openpbr.fragment.fx
     */
    get samplerInfoName() {
        return "v" + this.samplerPrefix.charAt(0).toUpperCase() + this.samplerPrefix.slice(1) + "Infos";
    }
    /**
     * The name of the matrix used for this sampler in the shader.
     * If this naming changes, we'll also need to change:
     * - materialHelper.functions.BindTextureMatrix
     * - samplerVertexImplementation.fx
     * - openpbr.fragment.fx
     */
    get samplerMatrixName() {
        return this.samplerPrefix + "Matrix";
    }
    /**
     * Creates a new Sampler instance.
     * @param name The name of the texture property
     * @param samplerPrefix The prefix used for the name of the sampler in the shader
     * @param textureDefine The define used in the shader for this sampler
     */
    constructor(name, samplerPrefix, textureDefine) {
        this.value = null; // Texture value, default to null
        this.samplerPrefix = ""; // The name of the sampler in the shader
        this.textureDefine = ""; // The define used in the shader for this sampler
        this.name = name;
        this.samplerPrefix = samplerPrefix;
        this.textureDefine = textureDefine;
    }
}
class OpenPBRMaterialDefinesBase extends PrepassDefinesMixin(UVDefinesMixin(MaterialDefines)) {
}
class OpenPBRMaterialDefinesWithEnvLighting extends EnvironmentLightingDefinesMixin(OpenPBRMaterialDefinesBase) {
}
/**
 * Manages the defines for the PBR Material.
 * @internal
 */
export class OpenPBRMaterialDefines extends ImageProcessingDefinesMixin(OpenPBRMaterialDefinesWithEnvLighting) {
    /**
     * Initializes the PBR Material defines.
     * @param externalProperties The external properties
     */
    constructor(externalProperties) {
        super(externalProperties);
        this.NUM_SAMPLES = "0";
        this.REALTIME_FILTERING = false;
        this.IBL_CDF_FILTERING = false;
        this.LIGHTCOUNT = 0;
        this.VERTEXCOLOR = false;
        this.BAKED_VERTEX_ANIMATION_TEXTURE = false;
        this.VERTEXALPHA = false;
        this.ALPHATEST = false;
        this.DEPTHPREPASS = false;
        this.ALPHABLEND = false;
        this.ALPHA_FROM_BASE_COLOR_TEXTURE = false;
        this.ALPHATESTVALUE = "0.5";
        this.PREMULTIPLYALPHA = false;
        this.REFLECTIVITY_GAMMA = false;
        this.REFLECTIVITYDIRECTUV = 0;
        this.SPECULARTERM = false;
        this.LODBASEDMICROSFURACE = true;
        this.SPECULAR_ROUGHNESS_FROM_METALNESS_TEXTURE_GREEN = false;
        this.BASE_METALNESS_FROM_METALNESS_TEXTURE_BLUE = false;
        this.AOSTOREINMETALMAPRED = false;
        this.SPECULAR_WEIGHT_IN_ALPHA = false;
        this.SPECULAR_WEIGHT_FROM_SPECULAR_COLOR_TEXTURE = false;
        this.SPECULAR_ROUGHNESS_ANISOTROPY_FROM_TANGENT_TEXTURE = false;
        this.COAT_ROUGHNESS_FROM_GREEN_CHANNEL = false;
        this.COAT_ROUGHNESS_ANISOTROPY_FROM_TANGENT_TEXTURE = false;
        this.USE_GLTF_STYLE_ANISOTROPY = false;
        this.THIN_FILM_THICKNESS_FROM_THIN_FILM_TEXTURE = false;
        this.FUZZ_ROUGHNESS_FROM_TEXTURE_ALPHA = false;
        this.SUBSURFACE_WEIGHT_FROM_TEXTURE_ALPHA = false;
        this.GEOMETRY_THICKNESS_FROM_GREEN_CHANNEL = false;
        this.ENVIRONMENTBRDF = false;
        this.ENVIRONMENTBRDF_RGBD = false;
        this.FUZZENVIRONMENTBRDF = false;
        this.NORMAL = false;
        this.TANGENT = false;
        this.OBJECTSPACE_NORMALMAP = false;
        this.PARALLAX = false;
        this.PARALLAX_RHS = false;
        this.PARALLAXOCCLUSION = false;
        this.NORMALXYSCALE = true;
        /**
         * Enables anisotropic logic. Still needed because it's used in pbrHelperFunctions
         */
        this.ANISOTROPIC = false;
        /**
         * Tells the shader to use OpenPBR's anisotropic roughness remapping
         */
        this.ANISOTROPIC_OPENPBR = true;
        /**
         * Tells the shader to apply anisotropy to the base layer
         */
        this.ANISOTROPIC_BASE = false;
        /**
         * Tells the shader to apply anisotropy to the coat layer
         */
        this.ANISOTROPIC_COAT = false;
        /**
         * Number of samples to use for the fuzz IBL lighting calculations
         */
        this.FUZZ_IBL_SAMPLES = 6;
        /**
         * Enables the 4-tap rotated-grid kernel for refractive background blur.
         * When false, a single dithered sample is used instead.
         */
        this.REFRACTION_HIGH_QUALITY_BLUR = false;
        /**
         * Tells the shader to enable the fuzz layer
         */
        this.FUZZ = false;
        /**
         * Tells the shader to enable the thin film layer
         */
        this.THIN_FILM = false;
        /**
         * Tells the shader to enable the legacy iridescence code
         * Iridescence is the name of thin film interference in the PBR material.
         */
        this.IRIDESCENCE = false;
        /**
         * Tells the shader to enable dispersion in refraction
         */
        this.DISPERSION = false;
        /**
         * Enables subsurface scattering
         */
        this.SCATTERING = false;
        /**
         * Enables the use of screen-space irradiance texture for scattering
         */
        this.USE_IRRADIANCE_TEXTURE_FOR_SCATTERING = false;
        /**
         * Number of samples used by the screen-space SSS convolution kernel.
         */
        this.SSS_SAMPLE_COUNT = 16;
        /**
         * Indicates that the irradiance texture is from the legacy GeometryBufferRenderer.
         * We use this to handle direct lights which don't render in the legacy GBuffer irradiance.
         */
        this.USE_IRRADIANCE_TEXTURE_FOR_SCATTERING_GBUFFER = false;
        /**
         * Enables transmission slab
         */
        this.TRANSMISSION_SLAB = false;
        /**
         * Enables transmission slab with volume
         */
        this.TRANSMISSION_SLAB_VOLUME = false;
        /**
         * Enables subsurface slab
         */
        this.SUBSURFACE_SLAB = false;
        /**
         * Enables thin-walled geometry
         */
        this.GEOMETRY_THIN_WALLED = false;
        /**
         * Refraction of the 2D background texture. Might include the rest of the scene or just the background.
         */
        this.REFRACTED_BACKGROUND = false;
        /**
         * Refraction of direct lights.
         */
        this.REFRACTED_LIGHTS = false;
        /**
         * Refraction of the environment texture (IBL).
         */
        this.REFRACTED_ENVIRONMENT = false;
        this.REFRACTED_ENVIRONMENT_OPPOSITEZ = false;
        this.REFRACTED_ENVIRONMENT_LOCAL_CUBE = false;
        this.RADIANCEOCCLUSION = false;
        this.HORIZONOCCLUSION = false;
        this.INSTANCES = false;
        this.THIN_INSTANCES = false;
        this.INSTANCESCOLOR = false;
        this.NUM_BONE_INFLUENCERS = 0;
        this.BonesPerMesh = 0;
        this.BONETEXTURE = false;
        this.BONES_VELOCITY_ENABLED = false;
        this.NONUNIFORMSCALING = false;
        this.MORPHTARGETS = false;
        this.MORPHTARGETS_POSITION = false;
        this.MORPHTARGETS_NORMAL = false;
        this.MORPHTARGETS_TANGENT = false;
        this.MORPHTARGETS_UV = false;
        this.MORPHTARGETS_UV2 = false;
        this.MORPHTARGETS_COLOR = false;
        this.MORPHTARGETTEXTURE_HASPOSITIONS = false;
        this.MORPHTARGETTEXTURE_HASNORMALS = false;
        this.MORPHTARGETTEXTURE_HASTANGENTS = false;
        this.MORPHTARGETTEXTURE_HASUVS = false;
        this.MORPHTARGETTEXTURE_HASUV2S = false;
        this.MORPHTARGETTEXTURE_HASCOLORS = false;
        this.NUM_MORPH_INFLUENCERS = 0;
        this.MORPHTARGETS_TEXTURE = false;
        this.USEPHYSICALLIGHTFALLOFF = false;
        this.USEGLTFLIGHTFALLOFF = false;
        this.TWOSIDEDLIGHTING = false;
        this.MIRRORED = false;
        this.SHADOWFLOAT = false;
        this.CLIPPLANE = false;
        this.CLIPPLANE2 = false;
        this.CLIPPLANE3 = false;
        this.CLIPPLANE4 = false;
        this.CLIPPLANE5 = false;
        this.CLIPPLANE6 = false;
        this.POINTSIZE = false;
        this.FOG = false;
        this.LOGARITHMICDEPTH = false;
        this.CAMERA_ORTHOGRAPHIC = false;
        this.CAMERA_PERSPECTIVE = false;
        this.AREALIGHTSUPPORTED = true;
        this.FORCENORMALFORWARD = false;
        this.SPECULARAA = false;
        this.UNLIT = false;
        this.DECAL_AFTER_DETAIL = false;
        this.TEXTURE_REPETITION_MODE = 0;
        this.DEBUGMODE = 0;
        this.USE_VERTEX_PULLING = false;
        this.VERTEX_PULLING_USE_INDEX_BUFFER = false;
        this.VERTEX_PULLING_INDEX_BUFFER_32BITS = false;
        this.RIGHT_HANDED = false;
        this.CLUSTLIGHT_SLICES = 0;
        this.CLUSTLIGHT_BATCH = 0;
        // BRDF defines
        this.BRDF_V_HEIGHT_CORRELATED = true;
        this.MS_BRDF_ENERGY_CONSERVATION = true;
        this.SPHERICAL_HARMONICS = true;
        this.SPECULAR_GLOSSINESS_ENERGY_CONSERVATION = true;
        this.MIX_IBL_RADIANCE_WITH_IRRADIANCE = true;
        this.LEGACY_SPECULAR_ENERGY_CONSERVATION = false;
        this.BASE_DIFFUSE_MODEL = 0;
        this.DIELECTRIC_SPECULAR_MODEL = 1;
        this.CONDUCTOR_SPECULAR_MODEL = 1;
        this.rebuild();
    }
    /**
     * Resets the PBR Material defines.
     */
    reset() {
        super.reset();
        this.ALPHATESTVALUE = "0.5";
        this.NORMALXYSCALE = true;
    }
}
class OpenPBRMaterialBase extends ImageProcessingMixin(PushMaterial) {
}
/**
 * A Physically based material that follows the specification of OpenPBR.
 *
 * For more information, please refer to the documentation :
 * https://academysoftwarefoundation.github.io/OpenPBR/index.html
 */
let OpenPBRMaterial = (() => {
    var _a, _OpenPBRMaterial_baseWeight_accessor_storage, _OpenPBRMaterial_baseWeightTexture_accessor_storage, _OpenPBRMaterial_baseColor_accessor_storage, _OpenPBRMaterial_baseColorTexture_accessor_storage, _OpenPBRMaterial_baseDiffuseRoughness_accessor_storage, _OpenPBRMaterial_baseDiffuseRoughnessTexture_accessor_storage, _OpenPBRMaterial_baseMetalness_accessor_storage, _OpenPBRMaterial_baseMetalnessTexture_accessor_storage, _OpenPBRMaterial_specularWeight_accessor_storage, _OpenPBRMaterial_specularWeightTexture_accessor_storage, _OpenPBRMaterial_specularColor_accessor_storage, _OpenPBRMaterial_specularColorTexture_accessor_storage, _OpenPBRMaterial_specularRoughness_accessor_storage, _OpenPBRMaterial_specularRoughnessTexture_accessor_storage, _OpenPBRMaterial_specularRoughnessAnisotropy_accessor_storage, _OpenPBRMaterial_specularRoughnessAnisotropyTexture_accessor_storage, _OpenPBRMaterial_specularIor_accessor_storage, _OpenPBRMaterial_transmissionWeight_accessor_storage, _OpenPBRMaterial_transmissionWeightTexture_accessor_storage, _OpenPBRMaterial_transmissionColor_accessor_storage, _OpenPBRMaterial_transmissionColorTexture_accessor_storage, _OpenPBRMaterial_transmissionDepth_accessor_storage, _OpenPBRMaterial_transmissionDepthTexture_accessor_storage, _OpenPBRMaterial_transmissionScatter_accessor_storage, _OpenPBRMaterial_transmissionScatterTexture_accessor_storage, _OpenPBRMaterial_transmissionScatterAnisotropy_accessor_storage, _OpenPBRMaterial_transmissionDispersionScale_accessor_storage, _OpenPBRMaterial_transmissionDispersionScaleTexture_accessor_storage, _OpenPBRMaterial_transmissionDispersionAbbeNumber_accessor_storage, _OpenPBRMaterial_subsurfaceWeight_accessor_storage, _OpenPBRMaterial_subsurfaceWeightTexture_accessor_storage, _OpenPBRMaterial_subsurfaceColor_accessor_storage, _OpenPBRMaterial_subsurfaceColorTexture_accessor_storage, _OpenPBRMaterial_subsurfaceRadius_accessor_storage, _OpenPBRMaterial_subsurfaceRadiusScale_accessor_storage, _OpenPBRMaterial_subsurfaceRadiusScaleTexture_accessor_storage, _OpenPBRMaterial_subsurfaceScatterAnisotropy_accessor_storage, _OpenPBRMaterial_coatWeight_accessor_storage, _OpenPBRMaterial_coatWeightTexture_accessor_storage, _OpenPBRMaterial_coatColor_accessor_storage, _OpenPBRMaterial_coatColorTexture_accessor_storage, _OpenPBRMaterial_coatRoughness_accessor_storage, _OpenPBRMaterial_coatRoughnessTexture_accessor_storage, _OpenPBRMaterial_coatRoughnessAnisotropy_accessor_storage, _OpenPBRMaterial_coatRoughnessAnisotropyTexture_accessor_storage, _OpenPBRMaterial_coatIor_accessor_storage, _OpenPBRMaterial_coatDarkening_accessor_storage, _OpenPBRMaterial_coatDarkeningTexture_accessor_storage, _OpenPBRMaterial_fuzzWeight_accessor_storage, _OpenPBRMaterial_fuzzWeightTexture_accessor_storage, _OpenPBRMaterial_fuzzColor_accessor_storage, _OpenPBRMaterial_fuzzColorTexture_accessor_storage, _OpenPBRMaterial_fuzzRoughness_accessor_storage, _OpenPBRMaterial_fuzzRoughnessTexture_accessor_storage, _OpenPBRMaterial_geometryThinWalled_accessor_storage, _OpenPBRMaterial_geometryNormalTexture_accessor_storage, _OpenPBRMaterial_geometryTangent_accessor_storage, _OpenPBRMaterial_geometryTangentTexture_accessor_storage, _OpenPBRMaterial_geometryCoatNormalTexture_accessor_storage, _OpenPBRMaterial_geometryCoatTangent_accessor_storage, _OpenPBRMaterial_geometryCoatTangentTexture_accessor_storage, _OpenPBRMaterial_geometryOpacity_accessor_storage, _OpenPBRMaterial_geometryOpacityTexture_accessor_storage, _OpenPBRMaterial_geometryThickness_accessor_storage, _OpenPBRMaterial_geometryThicknessTexture_accessor_storage, _OpenPBRMaterial_emissionLuminance_accessor_storage, _OpenPBRMaterial_emissionColor_accessor_storage, _OpenPBRMaterial_emissionColorTexture_accessor_storage, _OpenPBRMaterial_thinFilmWeight_accessor_storage, _OpenPBRMaterial_thinFilmWeightTexture_accessor_storage, _OpenPBRMaterial_thinFilmThickness_accessor_storage, _OpenPBRMaterial_thinFilmThicknessMin_accessor_storage, _OpenPBRMaterial_thinFilmThicknessTexture_accessor_storage, _OpenPBRMaterial_thinFilmIor_accessor_storage, _OpenPBRMaterial_ambientOcclusionTexture_accessor_storage, _OpenPBRMaterial_directIntensity_accessor_storage, _OpenPBRMaterial_environmentIntensity_accessor_storage, _OpenPBRMaterial_useSpecularWeightFromTextureAlpha_accessor_storage, _OpenPBRMaterial_forceAlphaTest_accessor_storage, _OpenPBRMaterial_alphaCutOff_accessor_storage, _OpenPBRMaterial_useAmbientOcclusionFromMetallicTextureRed_accessor_storage, _OpenPBRMaterial_useAmbientInGrayScale_accessor_storage, _OpenPBRMaterial_useObjectSpaceNormalMap_accessor_storage, _OpenPBRMaterial_useParallax_accessor_storage, _OpenPBRMaterial_useParallaxOcclusion_accessor_storage, _OpenPBRMaterial_parallaxScaleBias_accessor_storage, _OpenPBRMaterial_disableLighting_accessor_storage, _OpenPBRMaterial_forceIrradianceInFragment_accessor_storage, _OpenPBRMaterial_maxSimultaneousLights_accessor_storage, _OpenPBRMaterial_invertNormalMapX_accessor_storage, _OpenPBRMaterial_invertNormalMapY_accessor_storage, _OpenPBRMaterial_twoSidedLighting_accessor_storage, _OpenPBRMaterial_useAlphaFresnel_accessor_storage, _OpenPBRMaterial_useLinearAlphaFresnel_accessor_storage, _OpenPBRMaterial_environmentBRDFTexture_accessor_storage, _OpenPBRMaterial_forceNormalForward_accessor_storage, _OpenPBRMaterial_enableSpecularAntiAliasing_accessor_storage, _OpenPBRMaterial_useHorizonOcclusion_accessor_storage, _OpenPBRMaterial_useRadianceOcclusion_accessor_storage, _OpenPBRMaterial_unlit_accessor_storage, _OpenPBRMaterial_applyDecalMapAfterDetailMap_accessor_storage, _OpenPBRMaterial_debugMode_accessor_storage;
    let _classSuper = OpenPBRMaterialBase;
    let _instanceExtraInitializers = [];
    let _baseWeight_decorators;
    let _baseWeight_initializers = [];
    let _baseWeight_extraInitializers = [];
    let _baseWeightTexture_decorators;
    let _baseWeightTexture_initializers = [];
    let _baseWeightTexture_extraInitializers = [];
    let _baseColor_decorators;
    let _baseColor_initializers = [];
    let _baseColor_extraInitializers = [];
    let _baseColorTexture_decorators;
    let _baseColorTexture_initializers = [];
    let _baseColorTexture_extraInitializers = [];
    let _baseDiffuseRoughness_decorators;
    let _baseDiffuseRoughness_initializers = [];
    let _baseDiffuseRoughness_extraInitializers = [];
    let _baseDiffuseRoughnessTexture_decorators;
    let _baseDiffuseRoughnessTexture_initializers = [];
    let _baseDiffuseRoughnessTexture_extraInitializers = [];
    let _baseMetalness_decorators;
    let _baseMetalness_initializers = [];
    let _baseMetalness_extraInitializers = [];
    let _baseMetalnessTexture_decorators;
    let _baseMetalnessTexture_initializers = [];
    let _baseMetalnessTexture_extraInitializers = [];
    let _specularWeight_decorators;
    let _specularWeight_initializers = [];
    let _specularWeight_extraInitializers = [];
    let _specularWeightTexture_decorators;
    let _specularWeightTexture_initializers = [];
    let _specularWeightTexture_extraInitializers = [];
    let _specularColor_decorators;
    let _specularColor_initializers = [];
    let _specularColor_extraInitializers = [];
    let _specularColorTexture_decorators;
    let _specularColorTexture_initializers = [];
    let _specularColorTexture_extraInitializers = [];
    let _specularRoughness_decorators;
    let _specularRoughness_initializers = [];
    let _specularRoughness_extraInitializers = [];
    let _specularRoughnessTexture_decorators;
    let _specularRoughnessTexture_initializers = [];
    let _specularRoughnessTexture_extraInitializers = [];
    let _specularRoughnessAnisotropy_decorators;
    let _specularRoughnessAnisotropy_initializers = [];
    let _specularRoughnessAnisotropy_extraInitializers = [];
    let _specularRoughnessAnisotropyTexture_decorators;
    let _specularRoughnessAnisotropyTexture_initializers = [];
    let _specularRoughnessAnisotropyTexture_extraInitializers = [];
    let _specularIor_decorators;
    let _specularIor_initializers = [];
    let _specularIor_extraInitializers = [];
    let _transmissionWeight_decorators;
    let _transmissionWeight_initializers = [];
    let _transmissionWeight_extraInitializers = [];
    let _transmissionWeightTexture_decorators;
    let _transmissionWeightTexture_initializers = [];
    let _transmissionWeightTexture_extraInitializers = [];
    let _transmissionColor_decorators;
    let _transmissionColor_initializers = [];
    let _transmissionColor_extraInitializers = [];
    let _transmissionColorTexture_decorators;
    let _transmissionColorTexture_initializers = [];
    let _transmissionColorTexture_extraInitializers = [];
    let _transmissionDepth_decorators;
    let _transmissionDepth_initializers = [];
    let _transmissionDepth_extraInitializers = [];
    let _transmissionDepthTexture_decorators;
    let _transmissionDepthTexture_initializers = [];
    let _transmissionDepthTexture_extraInitializers = [];
    let _transmissionScatter_decorators;
    let _transmissionScatter_initializers = [];
    let _transmissionScatter_extraInitializers = [];
    let _transmissionScatterTexture_decorators;
    let _transmissionScatterTexture_initializers = [];
    let _transmissionScatterTexture_extraInitializers = [];
    let _transmissionScatterAnisotropy_decorators;
    let _transmissionScatterAnisotropy_initializers = [];
    let _transmissionScatterAnisotropy_extraInitializers = [];
    let _transmissionDispersionScale_decorators;
    let _transmissionDispersionScale_initializers = [];
    let _transmissionDispersionScale_extraInitializers = [];
    let _transmissionDispersionScaleTexture_decorators;
    let _transmissionDispersionScaleTexture_initializers = [];
    let _transmissionDispersionScaleTexture_extraInitializers = [];
    let _transmissionDispersionAbbeNumber_decorators;
    let _transmissionDispersionAbbeNumber_initializers = [];
    let _transmissionDispersionAbbeNumber_extraInitializers = [];
    let _subsurfaceWeight_decorators;
    let _subsurfaceWeight_initializers = [];
    let _subsurfaceWeight_extraInitializers = [];
    let _subsurfaceWeightTexture_decorators;
    let _subsurfaceWeightTexture_initializers = [];
    let _subsurfaceWeightTexture_extraInitializers = [];
    let _subsurfaceColor_decorators;
    let _subsurfaceColor_initializers = [];
    let _subsurfaceColor_extraInitializers = [];
    let _subsurfaceColorTexture_decorators;
    let _subsurfaceColorTexture_initializers = [];
    let _subsurfaceColorTexture_extraInitializers = [];
    let _subsurfaceRadius_decorators;
    let _subsurfaceRadius_initializers = [];
    let _subsurfaceRadius_extraInitializers = [];
    let _subsurfaceRadiusScale_decorators;
    let _subsurfaceRadiusScale_initializers = [];
    let _subsurfaceRadiusScale_extraInitializers = [];
    let _subsurfaceRadiusScaleTexture_decorators;
    let _subsurfaceRadiusScaleTexture_initializers = [];
    let _subsurfaceRadiusScaleTexture_extraInitializers = [];
    let _subsurfaceScatterAnisotropy_decorators;
    let _subsurfaceScatterAnisotropy_initializers = [];
    let _subsurfaceScatterAnisotropy_extraInitializers = [];
    let _coatWeight_decorators;
    let _coatWeight_initializers = [];
    let _coatWeight_extraInitializers = [];
    let _coatWeightTexture_decorators;
    let _coatWeightTexture_initializers = [];
    let _coatWeightTexture_extraInitializers = [];
    let _coatColor_decorators;
    let _coatColor_initializers = [];
    let _coatColor_extraInitializers = [];
    let _coatColorTexture_decorators;
    let _coatColorTexture_initializers = [];
    let _coatColorTexture_extraInitializers = [];
    let _coatRoughness_decorators;
    let _coatRoughness_initializers = [];
    let _coatRoughness_extraInitializers = [];
    let _coatRoughnessTexture_decorators;
    let _coatRoughnessTexture_initializers = [];
    let _coatRoughnessTexture_extraInitializers = [];
    let _coatRoughnessAnisotropy_decorators;
    let _coatRoughnessAnisotropy_initializers = [];
    let _coatRoughnessAnisotropy_extraInitializers = [];
    let _coatRoughnessAnisotropyTexture_decorators;
    let _coatRoughnessAnisotropyTexture_initializers = [];
    let _coatRoughnessAnisotropyTexture_extraInitializers = [];
    let _coatIor_decorators;
    let _coatIor_initializers = [];
    let _coatIor_extraInitializers = [];
    let _coatDarkening_decorators;
    let _coatDarkening_initializers = [];
    let _coatDarkening_extraInitializers = [];
    let _coatDarkeningTexture_decorators;
    let _coatDarkeningTexture_initializers = [];
    let _coatDarkeningTexture_extraInitializers = [];
    let _fuzzWeight_decorators;
    let _fuzzWeight_initializers = [];
    let _fuzzWeight_extraInitializers = [];
    let _fuzzWeightTexture_decorators;
    let _fuzzWeightTexture_initializers = [];
    let _fuzzWeightTexture_extraInitializers = [];
    let _fuzzColor_decorators;
    let _fuzzColor_initializers = [];
    let _fuzzColor_extraInitializers = [];
    let _fuzzColorTexture_decorators;
    let _fuzzColorTexture_initializers = [];
    let _fuzzColorTexture_extraInitializers = [];
    let _fuzzRoughness_decorators;
    let _fuzzRoughness_initializers = [];
    let _fuzzRoughness_extraInitializers = [];
    let _fuzzRoughnessTexture_decorators;
    let _fuzzRoughnessTexture_initializers = [];
    let _fuzzRoughnessTexture_extraInitializers = [];
    let _geometryThinWalled_decorators;
    let _geometryThinWalled_initializers = [];
    let _geometryThinWalled_extraInitializers = [];
    let _geometryNormalTexture_decorators;
    let _geometryNormalTexture_initializers = [];
    let _geometryNormalTexture_extraInitializers = [];
    let _geometryTangent_decorators;
    let _geometryTangent_initializers = [];
    let _geometryTangent_extraInitializers = [];
    let _geometryTangentTexture_decorators;
    let _geometryTangentTexture_initializers = [];
    let _geometryTangentTexture_extraInitializers = [];
    let _geometryCoatNormalTexture_decorators;
    let _geometryCoatNormalTexture_initializers = [];
    let _geometryCoatNormalTexture_extraInitializers = [];
    let _geometryCoatTangent_decorators;
    let _geometryCoatTangent_initializers = [];
    let _geometryCoatTangent_extraInitializers = [];
    let _geometryCoatTangentTexture_decorators;
    let _geometryCoatTangentTexture_initializers = [];
    let _geometryCoatTangentTexture_extraInitializers = [];
    let _geometryOpacity_decorators;
    let _geometryOpacity_initializers = [];
    let _geometryOpacity_extraInitializers = [];
    let _geometryOpacityTexture_decorators;
    let _geometryOpacityTexture_initializers = [];
    let _geometryOpacityTexture_extraInitializers = [];
    let _geometryThickness_decorators;
    let _geometryThickness_initializers = [];
    let _geometryThickness_extraInitializers = [];
    let _geometryThicknessTexture_decorators;
    let _geometryThicknessTexture_initializers = [];
    let _geometryThicknessTexture_extraInitializers = [];
    let _emissionLuminance_decorators;
    let _emissionLuminance_initializers = [];
    let _emissionLuminance_extraInitializers = [];
    let _emissionColor_decorators;
    let _emissionColor_initializers = [];
    let _emissionColor_extraInitializers = [];
    let _emissionColorTexture_decorators;
    let _emissionColorTexture_initializers = [];
    let _emissionColorTexture_extraInitializers = [];
    let _thinFilmWeight_decorators;
    let _thinFilmWeight_initializers = [];
    let _thinFilmWeight_extraInitializers = [];
    let _thinFilmWeightTexture_decorators;
    let _thinFilmWeightTexture_initializers = [];
    let _thinFilmWeightTexture_extraInitializers = [];
    let _thinFilmThickness_decorators;
    let _thinFilmThickness_initializers = [];
    let _thinFilmThickness_extraInitializers = [];
    let _thinFilmThicknessMin_decorators;
    let _thinFilmThicknessMin_initializers = [];
    let _thinFilmThicknessMin_extraInitializers = [];
    let _thinFilmThicknessTexture_decorators;
    let _thinFilmThicknessTexture_initializers = [];
    let _thinFilmThicknessTexture_extraInitializers = [];
    let _thinFilmIor_decorators;
    let _thinFilmIor_initializers = [];
    let _thinFilmIor_extraInitializers = [];
    let _ambientOcclusionTexture_decorators;
    let _ambientOcclusionTexture_initializers = [];
    let _ambientOcclusionTexture_extraInitializers = [];
    let _directIntensity_decorators;
    let _directIntensity_initializers = [];
    let _directIntensity_extraInitializers = [];
    let _environmentIntensity_decorators;
    let _environmentIntensity_initializers = [];
    let _environmentIntensity_extraInitializers = [];
    let _useSpecularWeightFromTextureAlpha_decorators;
    let _useSpecularWeightFromTextureAlpha_initializers = [];
    let _useSpecularWeightFromTextureAlpha_extraInitializers = [];
    let _forceAlphaTest_decorators;
    let _forceAlphaTest_initializers = [];
    let _forceAlphaTest_extraInitializers = [];
    let _alphaCutOff_decorators;
    let _alphaCutOff_initializers = [];
    let _alphaCutOff_extraInitializers = [];
    let _useAmbientOcclusionFromMetallicTextureRed_decorators;
    let _useAmbientOcclusionFromMetallicTextureRed_initializers = [];
    let _useAmbientOcclusionFromMetallicTextureRed_extraInitializers = [];
    let _useAmbientInGrayScale_decorators;
    let _useAmbientInGrayScale_initializers = [];
    let _useAmbientInGrayScale_extraInitializers = [];
    let _get_usePhysicalLightFalloff_decorators;
    let _get_useGLTFLightFalloff_decorators;
    let _useObjectSpaceNormalMap_decorators;
    let _useObjectSpaceNormalMap_initializers = [];
    let _useObjectSpaceNormalMap_extraInitializers = [];
    let _useParallax_decorators;
    let _useParallax_initializers = [];
    let _useParallax_extraInitializers = [];
    let _useParallaxOcclusion_decorators;
    let _useParallaxOcclusion_initializers = [];
    let _useParallaxOcclusion_extraInitializers = [];
    let _parallaxScaleBias_decorators;
    let _parallaxScaleBias_initializers = [];
    let _parallaxScaleBias_extraInitializers = [];
    let _disableLighting_decorators;
    let _disableLighting_initializers = [];
    let _disableLighting_extraInitializers = [];
    let _forceIrradianceInFragment_decorators;
    let _forceIrradianceInFragment_initializers = [];
    let _forceIrradianceInFragment_extraInitializers = [];
    let _maxSimultaneousLights_decorators;
    let _maxSimultaneousLights_initializers = [];
    let _maxSimultaneousLights_extraInitializers = [];
    let _invertNormalMapX_decorators;
    let _invertNormalMapX_initializers = [];
    let _invertNormalMapX_extraInitializers = [];
    let _invertNormalMapY_decorators;
    let _invertNormalMapY_initializers = [];
    let _invertNormalMapY_extraInitializers = [];
    let _twoSidedLighting_decorators;
    let _twoSidedLighting_initializers = [];
    let _twoSidedLighting_extraInitializers = [];
    let _useAlphaFresnel_decorators;
    let _useAlphaFresnel_initializers = [];
    let _useAlphaFresnel_extraInitializers = [];
    let _useLinearAlphaFresnel_decorators;
    let _useLinearAlphaFresnel_initializers = [];
    let _useLinearAlphaFresnel_extraInitializers = [];
    let _environmentBRDFTexture_decorators;
    let _environmentBRDFTexture_initializers = [];
    let _environmentBRDFTexture_extraInitializers = [];
    let _forceNormalForward_decorators;
    let _forceNormalForward_initializers = [];
    let _forceNormalForward_extraInitializers = [];
    let _enableSpecularAntiAliasing_decorators;
    let _enableSpecularAntiAliasing_initializers = [];
    let _enableSpecularAntiAliasing_extraInitializers = [];
    let _useHorizonOcclusion_decorators;
    let _useHorizonOcclusion_initializers = [];
    let _useHorizonOcclusion_extraInitializers = [];
    let _useRadianceOcclusion_decorators;
    let _useRadianceOcclusion_initializers = [];
    let _useRadianceOcclusion_extraInitializers = [];
    let _unlit_decorators;
    let _unlit_initializers = [];
    let _unlit_extraInitializers = [];
    let _applyDecalMapAfterDetailMap_decorators;
    let _applyDecalMapAfterDetailMap_initializers = [];
    let _applyDecalMapAfterDetailMap_extraInitializers = [];
    let _debugMode_decorators;
    let _debugMode_initializers = [];
    let _debugMode_extraInitializers = [];
    let _get_transparencyMode_decorators;
    return _a = class OpenPBRMaterial extends _classSuper {
            /**
             * Base Weight is a multiplier on the diffuse and metal lobes.
             * See OpenPBR's specs for base_weight
             */
            get baseWeight() { return __classPrivateFieldGet(this, _OpenPBRMaterial_baseWeight_accessor_storage, "f"); }
            set baseWeight(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_baseWeight_accessor_storage, value, "f"); }
            /**
             * Base Weight is a multiplier on the diffuse and metal lobes.
             * See OpenPBR's specs for base_weight
             */
            get baseWeightTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_baseWeightTexture_accessor_storage, "f"); }
            set baseWeightTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_baseWeightTexture_accessor_storage, value, "f"); }
            /**
             * Color of the base diffuse lobe.
             * See OpenPBR's specs for base_color
             */
            get baseColor() { return __classPrivateFieldGet(this, _OpenPBRMaterial_baseColor_accessor_storage, "f"); }
            set baseColor(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_baseColor_accessor_storage, value, "f"); }
            /**
             * Base Color Texture property.
             * See OpenPBR's specs for base_color
             */
            get baseColorTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_baseColorTexture_accessor_storage, "f"); }
            set baseColorTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_baseColorTexture_accessor_storage, value, "f"); }
            /**
             * Roughness of the diffuse lobe.
             * See OpenPBR's specs for base_diffuse_roughness
             */
            get baseDiffuseRoughness() { return __classPrivateFieldGet(this, _OpenPBRMaterial_baseDiffuseRoughness_accessor_storage, "f"); }
            set baseDiffuseRoughness(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_baseDiffuseRoughness_accessor_storage, value, "f"); }
            /**
             * Roughness texture of the diffuse lobe.
             * See OpenPBR's specs for base_diffuse_roughness
             */
            get baseDiffuseRoughnessTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_baseDiffuseRoughnessTexture_accessor_storage, "f"); }
            set baseDiffuseRoughnessTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_baseDiffuseRoughnessTexture_accessor_storage, value, "f"); }
            /**
             * Metalness of the base lobe.
             * See OpenPBR's specs for base_metalness
             */
            get baseMetalness() { return __classPrivateFieldGet(this, _OpenPBRMaterial_baseMetalness_accessor_storage, "f"); }
            set baseMetalness(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_baseMetalness_accessor_storage, value, "f"); }
            /**
             * Metalness texture.
             * See OpenPBR's specs for base_metalness
             */
            get baseMetalnessTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_baseMetalnessTexture_accessor_storage, "f"); }
            set baseMetalnessTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_baseMetalnessTexture_accessor_storage, value, "f"); }
            /**
             * Weight of the specular lobe.
             * See OpenPBR's specs for specular_weight
             */
            get specularWeight() { return __classPrivateFieldGet(this, _OpenPBRMaterial_specularWeight_accessor_storage, "f"); }
            set specularWeight(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_specularWeight_accessor_storage, value, "f"); }
            /**
             * Weight texture of the specular lobe.
             * See OpenPBR's specs for specular_weight
             */
            get specularWeightTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_specularWeightTexture_accessor_storage, "f"); }
            set specularWeightTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_specularWeightTexture_accessor_storage, value, "f"); }
            /**
             * Color of the specular lobe.
             * See OpenPBR's specs for specular_color
             */
            get specularColor() { return __classPrivateFieldGet(this, _OpenPBRMaterial_specularColor_accessor_storage, "f"); }
            set specularColor(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_specularColor_accessor_storage, value, "f"); }
            /**
             * Specular Color Texture property.
             * See OpenPBR's specs for specular_color
             */
            get specularColorTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_specularColorTexture_accessor_storage, "f"); }
            set specularColorTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_specularColorTexture_accessor_storage, value, "f"); }
            /**
             * Roughness of the specular lobe.
             * See OpenPBR's specs for specular_roughness
             */
            get specularRoughness() { return __classPrivateFieldGet(this, _OpenPBRMaterial_specularRoughness_accessor_storage, "f"); }
            set specularRoughness(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_specularRoughness_accessor_storage, value, "f"); }
            /**
             * Roughness texture of the specular lobe.
             * See OpenPBR's specs for specular_roughness
             */
            get specularRoughnessTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_specularRoughnessTexture_accessor_storage, "f"); }
            set specularRoughnessTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_specularRoughnessTexture_accessor_storage, value, "f"); }
            /**
             * Anisotropic roughness of the specular lobe.
             * See OpenPBR's specs for specular_roughness_anisotropy
             */
            get specularRoughnessAnisotropy() { return __classPrivateFieldGet(this, _OpenPBRMaterial_specularRoughnessAnisotropy_accessor_storage, "f"); }
            set specularRoughnessAnisotropy(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_specularRoughnessAnisotropy_accessor_storage, value, "f"); }
            /**
             * Anisotropic Roughness texture.
             * See OpenPBR's specs for specular_roughness
             */
            get specularRoughnessAnisotropyTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_specularRoughnessAnisotropyTexture_accessor_storage, "f"); }
            set specularRoughnessAnisotropyTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_specularRoughnessAnisotropyTexture_accessor_storage, value, "f"); }
            /**
             * IOR of the specular lobe.
             * See OpenPBR's specs for specular_ior
             */
            get specularIor() { return __classPrivateFieldGet(this, _OpenPBRMaterial_specularIor_accessor_storage, "f"); }
            set specularIor(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_specularIor_accessor_storage, value, "f"); }
            /**
             * Transmission weight of the surface.
             * See OpenPBR's specs for transmission_weight
             */
            get transmissionWeight() { return __classPrivateFieldGet(this, _OpenPBRMaterial_transmissionWeight_accessor_storage, "f"); }
            set transmissionWeight(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_transmissionWeight_accessor_storage, value, "f"); }
            /**
             * Transmission weight texture.
             * See OpenPBR's specs for transmission_weight
             */
            get transmissionWeightTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_transmissionWeightTexture_accessor_storage, "f"); }
            set transmissionWeightTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_transmissionWeightTexture_accessor_storage, value, "f"); }
            /**
             * Transmission color of the surface.
             * See OpenPBR's specs for transmission_color
             */
            get transmissionColor() { return __classPrivateFieldGet(this, _OpenPBRMaterial_transmissionColor_accessor_storage, "f"); }
            set transmissionColor(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_transmissionColor_accessor_storage, value, "f"); }
            /**
             * Transmission color texture.
             * See OpenPBR's specs for transmission_color
             */
            get transmissionColorTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_transmissionColorTexture_accessor_storage, "f"); }
            set transmissionColorTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_transmissionColorTexture_accessor_storage, value, "f"); }
            /**
             * Transmission depth of the volume
             * See OpenPBR's specs for transmission_depth
             */
            get transmissionDepth() { return __classPrivateFieldGet(this, _OpenPBRMaterial_transmissionDepth_accessor_storage, "f"); }
            set transmissionDepth(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_transmissionDepth_accessor_storage, value, "f"); }
            /**
             * Transmission depth texture.
             * See OpenPBR's specs for transmission_depth
             */
            get transmissionDepthTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_transmissionDepthTexture_accessor_storage, "f"); }
            set transmissionDepthTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_transmissionDepthTexture_accessor_storage, value, "f"); }
            /**
             * Transmission scatter of the surface.
             * See OpenPBR's specs for transmission_scatter
             */
            get transmissionScatter() { return __classPrivateFieldGet(this, _OpenPBRMaterial_transmissionScatter_accessor_storage, "f"); }
            set transmissionScatter(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_transmissionScatter_accessor_storage, value, "f"); }
            /**
             * Transmission scatter texture.
             * See OpenPBR's specs for transmission_scatter
             */
            get transmissionScatterTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_transmissionScatterTexture_accessor_storage, "f"); }
            set transmissionScatterTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_transmissionScatterTexture_accessor_storage, value, "f"); }
            /**
             * Transmission scatter anisotropy
             * See OpenPBR's specs for transmission_scatter_anisotropy
             */
            get transmissionScatterAnisotropy() { return __classPrivateFieldGet(this, _OpenPBRMaterial_transmissionScatterAnisotropy_accessor_storage, "f"); }
            set transmissionScatterAnisotropy(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_transmissionScatterAnisotropy_accessor_storage, value, "f"); }
            /**
             * Transmission Dispersion Scale factor.
             * See OpenPBR's specs for transmission_dispersion_scale
             */
            get transmissionDispersionScale() { return __classPrivateFieldGet(this, _OpenPBRMaterial_transmissionDispersionScale_accessor_storage, "f"); }
            set transmissionDispersionScale(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_transmissionDispersionScale_accessor_storage, value, "f"); }
            /**
             * Transmission Dispersion Scale texture.
             * See OpenPBR's specs for transmission_dispersion_scale
             */
            get transmissionDispersionScaleTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_transmissionDispersionScaleTexture_accessor_storage, "f"); }
            set transmissionDispersionScaleTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_transmissionDispersionScaleTexture_accessor_storage, value, "f"); }
            /**
             * Transmission Dispersion Abbe number.
             * See OpenPBR's specs for transmission_dispersion_abbe_number
             */
            get transmissionDispersionAbbeNumber() { return __classPrivateFieldGet(this, _OpenPBRMaterial_transmissionDispersionAbbeNumber_accessor_storage, "f"); }
            set transmissionDispersionAbbeNumber(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_transmissionDispersionAbbeNumber_accessor_storage, value, "f"); }
            /**
             * Defines the amount of subsurface scattering on the surface.
             * See OpenPBR's specs for subsurface_weight
             */
            get subsurfaceWeight() { return __classPrivateFieldGet(this, _OpenPBRMaterial_subsurfaceWeight_accessor_storage, "f"); }
            set subsurfaceWeight(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_subsurfaceWeight_accessor_storage, value, "f"); }
            /**
             * Subsurface weight texture.
             * See OpenPBR's specs for subsurface_weight
             */
            get subsurfaceWeightTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_subsurfaceWeightTexture_accessor_storage, "f"); }
            set subsurfaceWeightTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_subsurfaceWeightTexture_accessor_storage, value, "f"); }
            /**
             * Defines the color of the subsurface scattering in the volume.
             * See OpenPBR's specs for subsurface_color
             */
            get subsurfaceColor() { return __classPrivateFieldGet(this, _OpenPBRMaterial_subsurfaceColor_accessor_storage, "f"); }
            set subsurfaceColor(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_subsurfaceColor_accessor_storage, value, "f"); }
            /**
             * Subsurface color texture.
             * See OpenPBR's specs for subsurface_color
             */
            get subsurfaceColorTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_subsurfaceColorTexture_accessor_storage, "f"); }
            set subsurfaceColorTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_subsurfaceColorTexture_accessor_storage, value, "f"); }
            /**
             * Defines the radius of the subsurface scattering in the volume.
             * See OpenPBR's specs for subsurface_radius
             */
            get subsurfaceRadius() { return __classPrivateFieldGet(this, _OpenPBRMaterial_subsurfaceRadius_accessor_storage, "f"); }
            set subsurfaceRadius(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_subsurfaceRadius_accessor_storage, value, "f"); }
            /**
             * Defines the scale factor applied to the subsurface radius.
             * See OpenPBR's specs for subsurface_radius_scale
             */
            get subsurfaceRadiusScale() { return __classPrivateFieldGet(this, _OpenPBRMaterial_subsurfaceRadiusScale_accessor_storage, "f"); }
            set subsurfaceRadiusScale(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_subsurfaceRadiusScale_accessor_storage, value, "f"); }
            /**
             * Subsurface radius scale texture.
             * See OpenPBR's specs for subsurface_radius_scale
             */
            get subsurfaceRadiusScaleTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_subsurfaceRadiusScaleTexture_accessor_storage, "f"); }
            set subsurfaceRadiusScaleTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_subsurfaceRadiusScaleTexture_accessor_storage, value, "f"); }
            /**
             * Defines the anisotropy of the subsurface scattering in the volume.
             * See OpenPBR's specs for subsurface_scatter_anisotropy
             */
            get subsurfaceScatterAnisotropy() { return __classPrivateFieldGet(this, _OpenPBRMaterial_subsurfaceScatterAnisotropy_accessor_storage, "f"); }
            set subsurfaceScatterAnisotropy(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_subsurfaceScatterAnisotropy_accessor_storage, value, "f"); }
            /**
             * Defines the amount of clear coat on the surface.
             * See OpenPBR's specs for coat_weight
             */
            get coatWeight() { return __classPrivateFieldGet(this, _OpenPBRMaterial_coatWeight_accessor_storage, "f"); }
            set coatWeight(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_coatWeight_accessor_storage, value, "f"); }
            /**
             * Coat weight texture.
             * See OpenPBR's specs for coat_weight
             */
            get coatWeightTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_coatWeightTexture_accessor_storage, "f"); }
            set coatWeightTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_coatWeightTexture_accessor_storage, value, "f"); }
            /**
             * Defines the color of the clear coat on the surface.
             * See OpenPBR's specs for coat_color
             */
            get coatColor() { return __classPrivateFieldGet(this, _OpenPBRMaterial_coatColor_accessor_storage, "f"); }
            set coatColor(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_coatColor_accessor_storage, value, "f"); }
            /**
             * Color texture of the clear coat.
             * See OpenPBR's specs for coat_color
             */
            get coatColorTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_coatColorTexture_accessor_storage, "f"); }
            set coatColorTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_coatColorTexture_accessor_storage, value, "f"); }
            /**
             * Defines the roughness of the clear coat on the surface.
             * See OpenPBR's specs for coat_roughness
             */
            get coatRoughness() { return __classPrivateFieldGet(this, _OpenPBRMaterial_coatRoughness_accessor_storage, "f"); }
            set coatRoughness(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_coatRoughness_accessor_storage, value, "f"); }
            /**
             * Roughness texture of the clear coat.
             * See OpenPBR's specs for coat_roughness
             */
            get coatRoughnessTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_coatRoughnessTexture_accessor_storage, "f"); }
            set coatRoughnessTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_coatRoughnessTexture_accessor_storage, value, "f"); }
            /**
             * Defines the anisotropy of the clear coat on the surface.
             * See OpenPBR's specs for coat_roughness_anisotropy
             */
            get coatRoughnessAnisotropy() { return __classPrivateFieldGet(this, _OpenPBRMaterial_coatRoughnessAnisotropy_accessor_storage, "f"); }
            set coatRoughnessAnisotropy(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_coatRoughnessAnisotropy_accessor_storage, value, "f"); }
            /**
             * Anisotropic Roughness texture of the clear coat.
             * See OpenPBR's specs for coat_roughness_anisotropy
             */
            get coatRoughnessAnisotropyTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_coatRoughnessAnisotropyTexture_accessor_storage, "f"); }
            set coatRoughnessAnisotropyTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_coatRoughnessAnisotropyTexture_accessor_storage, value, "f"); }
            /**
             * Defines the IOR of the clear coat on the surface.
             * See OpenPBR's specs for coat_ior
             */
            get coatIor() { return __classPrivateFieldGet(this, _OpenPBRMaterial_coatIor_accessor_storage, "f"); }
            set coatIor(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_coatIor_accessor_storage, value, "f"); }
            /**
             * Defines the amount that interreflections within the coat allow the underlying surface
             * to be darkened. A value of 1.0 means that the physically correct amount of darkening
             * is applied, while a value of 0.0 means that no darkening is applied.
             * See OpenPBR's specs for coat_darkening
             */
            get coatDarkening() { return __classPrivateFieldGet(this, _OpenPBRMaterial_coatDarkening_accessor_storage, "f"); }
            set coatDarkening(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_coatDarkening_accessor_storage, value, "f"); }
            /**
             * Defines the amount that interreflections within the coat allow the underlying surface
             * to be darkened. A value of 1.0 means that the physically correct amount of darkening
             * is applied, while a value of 0.0 means that no darkening is applied.
             * See OpenPBR's specs for coat_darkening
             */
            get coatDarkeningTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_coatDarkeningTexture_accessor_storage, "f"); }
            set coatDarkeningTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_coatDarkeningTexture_accessor_storage, value, "f"); }
            /**
             * Defines the weight of the fuzz layer on the surface.
             * See OpenPBR's specs for fuzz_weight
             */
            get fuzzWeight() { return __classPrivateFieldGet(this, _OpenPBRMaterial_fuzzWeight_accessor_storage, "f"); }
            set fuzzWeight(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_fuzzWeight_accessor_storage, value, "f"); }
            /**
             * Weight texture of the fuzz layer.
             * See OpenPBR's specs for fuzz_weight
             */
            get fuzzWeightTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_fuzzWeightTexture_accessor_storage, "f"); }
            set fuzzWeightTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_fuzzWeightTexture_accessor_storage, value, "f"); }
            /**
             * Defines the color of the fuzz layer on the surface.
             * See OpenPBR's specs for fuzz_color
             */
            get fuzzColor() { return __classPrivateFieldGet(this, _OpenPBRMaterial_fuzzColor_accessor_storage, "f"); }
            set fuzzColor(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_fuzzColor_accessor_storage, value, "f"); }
            /**
             * Color texture of the fuzz layer.
             * See OpenPBR's specs for fuzz_color
             */
            get fuzzColorTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_fuzzColorTexture_accessor_storage, "f"); }
            set fuzzColorTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_fuzzColorTexture_accessor_storage, value, "f"); }
            /**
             * Defines the roughness of the fuzz layer on the surface.
             * See OpenPBR's specs for fuzz_roughness
             */
            get fuzzRoughness() { return __classPrivateFieldGet(this, _OpenPBRMaterial_fuzzRoughness_accessor_storage, "f"); }
            set fuzzRoughness(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_fuzzRoughness_accessor_storage, value, "f"); }
            /**
             * Roughness texture of the fuzz layer.
             * See OpenPBR's specs for fuzz_roughness
             */
            get fuzzRoughnessTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_fuzzRoughnessTexture_accessor_storage, "f"); }
            set fuzzRoughnessTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_fuzzRoughnessTexture_accessor_storage, value, "f"); }
            /**
             * Defines whether the geometry is thin-walled (like a sheet of paper) or not.
             * See OpenPBR's specs for geometry_thin_walled
             */
            get geometryThinWalled() { return __classPrivateFieldGet(this, _OpenPBRMaterial_geometryThinWalled_accessor_storage, "f"); }
            set geometryThinWalled(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_geometryThinWalled_accessor_storage, value, "f"); }
            /**
             * Defines the normal of the material's geometry.
             * See OpenPBR's specs for geometry_normal
             */
            get geometryNormalTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_geometryNormalTexture_accessor_storage, "f"); }
            set geometryNormalTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_geometryNormalTexture_accessor_storage, value, "f"); }
            /**
             * Defines the tangent of the material's geometry. Used only for anisotropic reflections.
             * See OpenPBR's specs for geometry_tangent
             */
            get geometryTangent() { return __classPrivateFieldGet(this, _OpenPBRMaterial_geometryTangent_accessor_storage, "f"); }
            set geometryTangent(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_geometryTangent_accessor_storage, value, "f"); }
            /**
             * Defines the angle of the tangent of the material's geometry. Used only for anisotropic reflections.
             * See OpenPBR's specs for geometry_tangent
             */
            get geometryTangentAngle() {
                return Math.atan2(this.geometryTangent.y, this.geometryTangent.x);
            }
            set geometryTangentAngle(value) {
                this.geometryTangent = new Vector2(Math.cos(value), Math.sin(value));
            }
            /**
             * Defines the tangent of the material's geometry. Used only for anisotropic reflections.
             * See OpenPBR's specs for geometry_tangent
             */
            get geometryTangentTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_geometryTangentTexture_accessor_storage, "f"); }
            set geometryTangentTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_geometryTangentTexture_accessor_storage, value, "f"); }
            /**
             * Defines the normal of the material's coat layer.
             * See OpenPBR's specs for geometry_coat_normal
             */
            get geometryCoatNormalTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_geometryCoatNormalTexture_accessor_storage, "f"); }
            set geometryCoatNormalTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_geometryCoatNormalTexture_accessor_storage, value, "f"); }
            /**
             * Defines the tangent of the material's coat layer. Used only for anisotropic reflections.
             * See OpenPBR's specs for geometry_coat_tangent
             */
            get geometryCoatTangent() { return __classPrivateFieldGet(this, _OpenPBRMaterial_geometryCoatTangent_accessor_storage, "f"); }
            set geometryCoatTangent(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_geometryCoatTangent_accessor_storage, value, "f"); }
            /**
             * Defines the angle of the tangent of the material's coat layer.
             */
            get geometryCoatTangentAngle() {
                return Math.atan2(this.geometryCoatTangent.y, this.geometryCoatTangent.x);
            }
            /**
             * Defines the angle of the tangent of the material's coat layer.
             */
            set geometryCoatTangentAngle(value) {
                this.geometryCoatTangent = new Vector2(Math.cos(value), Math.sin(value));
            }
            /**
             * Defines the tangent of the material's coat layer. Used only for anisotropic reflections.
             * See OpenPBR's specs for geometry_coat_tangent
             */
            get geometryCoatTangentTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_geometryCoatTangentTexture_accessor_storage, "f"); }
            set geometryCoatTangentTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_geometryCoatTangentTexture_accessor_storage, value, "f"); }
            /**
             * Defines the opacity of the material's geometry.
             * See OpenPBR's specs for geometry_opacity
             */
            get geometryOpacity() { return __classPrivateFieldGet(this, _OpenPBRMaterial_geometryOpacity_accessor_storage, "f"); }
            set geometryOpacity(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_geometryOpacity_accessor_storage, value, "f"); }
            /**
             * Defines the opacity texture of the material's geometry.
             * See OpenPBR's specs for geometry_opacity
             */
            get geometryOpacityTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_geometryOpacityTexture_accessor_storage, "f"); }
            set geometryOpacityTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_geometryOpacityTexture_accessor_storage, value, "f"); }
            /**
             * Defines the thickness of the material's geometry.
             * Not part of OpenPBR's specs but useful for rasterization approximations of volume.
             */
            get geometryThickness() { return __classPrivateFieldGet(this, _OpenPBRMaterial_geometryThickness_accessor_storage, "f"); }
            set geometryThickness(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_geometryThickness_accessor_storage, value, "f"); }
            /**
             * Defines the thickness of the material's geometry.
             * Not part of OpenPBR's specs but useful for rasterization approximations of volume.
             */
            get geometryThicknessTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_geometryThicknessTexture_accessor_storage, "f"); }
            set geometryThicknessTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_geometryThicknessTexture_accessor_storage, value, "f"); }
            /**
             * Defines the luminance of the material's emission.
             * See OpenPBR's specs for emission_luminance
             */
            get emissionLuminance() { return __classPrivateFieldGet(this, _OpenPBRMaterial_emissionLuminance_accessor_storage, "f"); }
            set emissionLuminance(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_emissionLuminance_accessor_storage, value, "f"); }
            /**
             * Defines the color of the material's emission.
             * See OpenPBR's specs for emission_color
             */
            get emissionColor() { return __classPrivateFieldGet(this, _OpenPBRMaterial_emissionColor_accessor_storage, "f"); }
            set emissionColor(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_emissionColor_accessor_storage, value, "f"); }
            /**
             * Defines the texture of the material's emission color.
             * See OpenPBR's specs for emission_color
             */
            get emissionColorTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_emissionColorTexture_accessor_storage, "f"); }
            set emissionColorTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_emissionColorTexture_accessor_storage, value, "f"); }
            /**
             * Defines the weight of the thin film layer on top of the base layer for iridescent effects.
             */
            get thinFilmWeight() { return __classPrivateFieldGet(this, _OpenPBRMaterial_thinFilmWeight_accessor_storage, "f"); }
            set thinFilmWeight(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_thinFilmWeight_accessor_storage, value, "f"); }
            /**
             * Thin film weight texture.
             */
            get thinFilmWeightTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_thinFilmWeightTexture_accessor_storage, "f"); }
            set thinFilmWeightTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_thinFilmWeightTexture_accessor_storage, value, "f"); }
            /**
             * Defines the thickness of the thin film layer in μm. If a texture is provided for thinFilmWeightTexture,
             * this value will act as a multiplier to the texture values.
             * See OpenPBR's specs for thin_film_thickness
             */
            get thinFilmThickness() { return __classPrivateFieldGet(this, _OpenPBRMaterial_thinFilmThickness_accessor_storage, "f"); }
            set thinFilmThickness(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_thinFilmThickness_accessor_storage, value, "f"); }
            /**
             * Defines the minimum thickness of the thin film layer in μm.
             */
            get thinFilmThicknessMin() { return __classPrivateFieldGet(this, _OpenPBRMaterial_thinFilmThicknessMin_accessor_storage, "f"); }
            set thinFilmThicknessMin(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_thinFilmThicknessMin_accessor_storage, value, "f"); }
            /**
             * Defines the maximum thickness of the thin film layer in μm.
             */
            get thinFilmThicknessTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_thinFilmThicknessTexture_accessor_storage, "f"); }
            set thinFilmThicknessTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_thinFilmThicknessTexture_accessor_storage, value, "f"); }
            /**
             * Defines the index of refraction of the thin film layer.
             */
            get thinFilmIor() { return __classPrivateFieldGet(this, _OpenPBRMaterial_thinFilmIor_accessor_storage, "f"); }
            set thinFilmIor(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_thinFilmIor_accessor_storage, value, "f"); }
            /**
             * Defines the ambient occlusion texture.
             */
            get ambientOcclusionTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_ambientOcclusionTexture_accessor_storage, "f"); }
            set ambientOcclusionTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_ambientOcclusionTexture_accessor_storage, value, "f"); }
            /**
             * Controls the sample count of the screen-space SSS convolution kernel.
             * Use the SSS_QUALITY_LOW / MEDIUM / HIGH constants (8 / 16 / 32 samples).
             * Higher quality reduces noise at the cost of GPU time. Default: MEDIUM.
             */
            get sssQuality() {
                return this._sssQuality;
            }
            set sssQuality(value) {
                if (this._sssQuality !== value) {
                    this._sssQuality = value;
                    this.markAsDirty(1);
                }
            }
            /**
             * Defines the irradiance texture used for subsurface scattering.
             * If it's not provided, the irradiance will be looked for in the scene.geometryBufferRenderer.
             * Accepts a {@link ThinTexture} so that an {@link InternalTexture} obtained from a frame graph
             * handle can be wrapped with `new ThinTexture(internalTexture)` and assigned directly.
             * Setting this property marks all sub-meshes as textures-dirty so the shader recompiles.
             */
            get sssIrradianceTexture() {
                return this._sssIrradianceTexture;
            }
            set sssIrradianceTexture(value) {
                if (this._sssIrradianceTexture === value) {
                    return;
                }
                this._sssIrradianceTexture = value;
                this._markAllSubMeshesAsTexturesDirty();
            }
            /**
             * Defines the depth texture used for subsurface scattering. This is the depth defined
             * in screen space. If it's not provided, the depth will be looked for in the scene.geometryBufferRenderer.
             * Accepts a {@link ThinTexture} so that an {@link InternalTexture} obtained from a frame graph
             * handle can be wrapped with `new ThinTexture(internalTexture)` and assigned directly.
             * Setting this property marks all sub-meshes as textures-dirty so the shader recompiles.
             */
            get sssDepthTexture() {
                return this._sssDepthTexture;
            }
            set sssDepthTexture(value) {
                if (this._sssDepthTexture === value) {
                    return;
                }
                this._sssDepthTexture = value;
                this._markAllSubMeshesAsTexturesDirty();
            }
            /**
             * Intensity of the direct lights e.g. the four lights available in your scene.
             * This impacts both the direct diffuse and specular highlights.
             */
            get directIntensity() { return __classPrivateFieldGet(this, _OpenPBRMaterial_directIntensity_accessor_storage, "f"); }
            set directIntensity(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_directIntensity_accessor_storage, value, "f"); }
            /**
             * Intensity of the environment e.g. how much the environment will light the object
             * either through harmonics for rough material or through the reflection for shiny ones.
             */
            get environmentIntensity() { return __classPrivateFieldGet(this, _OpenPBRMaterial_environmentIntensity_accessor_storage, "f"); }
            set environmentIntensity(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_environmentIntensity_accessor_storage, value, "f"); }
            /**
             * Specifies that the specular weight is stored in the alpha channel of the specular weight texture.
             */
            get useSpecularWeightFromTextureAlpha() { return __classPrivateFieldGet(this, _OpenPBRMaterial_useSpecularWeightFromTextureAlpha_accessor_storage, "f"); }
            set useSpecularWeightFromTextureAlpha(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_useSpecularWeightFromTextureAlpha_accessor_storage, value, "f"); }
            /**
             * Enforces alpha test in opaque or blend mode in order to improve the performances of some situations.
             */
            get forceAlphaTest() { return __classPrivateFieldGet(this, _OpenPBRMaterial_forceAlphaTest_accessor_storage, "f"); }
            set forceAlphaTest(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_forceAlphaTest_accessor_storage, value, "f"); }
            /**
             * Defines the alpha limits in alpha test mode.
             */
            get alphaCutOff() { return __classPrivateFieldGet(this, _OpenPBRMaterial_alphaCutOff_accessor_storage, "f"); }
            set alphaCutOff(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_alphaCutOff_accessor_storage, value, "f"); }
            /**
             * Specifies if the metallic texture contains the ambient occlusion information in its red channel.
             */
            get useAmbientOcclusionFromMetallicTextureRed() { return __classPrivateFieldGet(this, _OpenPBRMaterial_useAmbientOcclusionFromMetallicTextureRed_accessor_storage, "f"); }
            set useAmbientOcclusionFromMetallicTextureRed(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_useAmbientOcclusionFromMetallicTextureRed_accessor_storage, value, "f"); }
            /**
             * Specifies if the ambient texture contains the ambient occlusion information in its red channel only.
             */
            get useAmbientInGrayScale() { return __classPrivateFieldGet(this, _OpenPBRMaterial_useAmbientInGrayScale_accessor_storage, "f"); }
            set useAmbientInGrayScale(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_useAmbientInGrayScale_accessor_storage, value, "f"); }
            /**
             * Specifies if we can see through the surface of the material due to subsurface scattering or transmission.
             */
            get hasTransparency() {
                return this.subsurfaceWeight > 0 || this.transmissionWeight > 0;
            }
            /** Specifies if the material has scattering properties such as subsurface scattering or transmission scattering. */
            get hasScattering() {
                return (this.transmissionWeight > 0 && this.transmissionDepth > 0 && !this.transmissionScatter.equals(Color3.BlackReadOnly)) || this.subsurfaceWeight > 0;
            }
            /**
             * BJS is using an hardcoded light falloff based on a manually sets up range.
             * In PBR, one way to represents the falloff is to use the inverse squared root algorithm.
             * This parameter can help you switch back to the BJS mode in order to create scenes using both materials.
             */
            get usePhysicalLightFalloff() {
                return this._lightFalloff === Material.LIGHTFALLOFF_PHYSICAL;
            }
            /**
             * BJS is using an hardcoded light falloff based on a manually sets up range.
             * In PBR, one way to represents the falloff is to use the inverse squared root algorithm.
             * This parameter can help you switch back to the BJS mode in order to create scenes using both materials.
             */
            set usePhysicalLightFalloff(value) {
                if (value !== this.usePhysicalLightFalloff) {
                    // Ensure the effect will be rebuilt.
                    this._markAllSubMeshesAsTexturesDirty();
                    if (value) {
                        this._lightFalloff = Material.LIGHTFALLOFF_PHYSICAL;
                    }
                    else {
                        this._lightFalloff = Material.LIGHTFALLOFF_STANDARD;
                    }
                }
            }
            /**
             * In order to support the falloff compatibility with gltf, a special mode has been added
             * to reproduce the gltf light falloff.
             */
            get useGLTFLightFalloff() {
                return this._lightFalloff === Material.LIGHTFALLOFF_GLTF;
            }
            /**
             * In order to support the falloff compatibility with gltf, a special mode has been added
             * to reproduce the gltf light falloff.
             */
            set useGLTFLightFalloff(value) {
                if (value !== this.useGLTFLightFalloff) {
                    // Ensure the effect will be rebuilt.
                    this._markAllSubMeshesAsTexturesDirty();
                    if (value) {
                        this._lightFalloff = Material.LIGHTFALLOFF_GLTF;
                    }
                    else {
                        this._lightFalloff = Material.LIGHTFALLOFF_STANDARD;
                    }
                }
            }
            /**
             * Allows using an object space normal map (instead of tangent space).
             */
            get useObjectSpaceNormalMap() { return __classPrivateFieldGet(this, _OpenPBRMaterial_useObjectSpaceNormalMap_accessor_storage, "f"); }
            set useObjectSpaceNormalMap(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_useObjectSpaceNormalMap_accessor_storage, value, "f"); }
            /**
             * Allows using the normal map in parallax mode.
             */
            get useParallax() { return __classPrivateFieldGet(this, _OpenPBRMaterial_useParallax_accessor_storage, "f"); }
            set useParallax(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_useParallax_accessor_storage, value, "f"); }
            /**
             * Allows using the normal map in parallax occlusion mode.
             */
            get useParallaxOcclusion() { return __classPrivateFieldGet(this, _OpenPBRMaterial_useParallaxOcclusion_accessor_storage, "f"); }
            set useParallaxOcclusion(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_useParallaxOcclusion_accessor_storage, value, "f"); }
            /**
             * Controls the scale bias of the parallax mode.
             */
            get parallaxScaleBias() { return __classPrivateFieldGet(this, _OpenPBRMaterial_parallaxScaleBias_accessor_storage, "f"); }
            set parallaxScaleBias(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_parallaxScaleBias_accessor_storage, value, "f"); }
            /**
             * If sets to true, disables all the lights affecting the material.
             */
            get disableLighting() { return __classPrivateFieldGet(this, _OpenPBRMaterial_disableLighting_accessor_storage, "f"); }
            set disableLighting(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_disableLighting_accessor_storage, value, "f"); }
            /**
             * Force the shader to compute irradiance in the fragment shader in order to take normal mapping into account.
             */
            get forceIrradianceInFragment() { return __classPrivateFieldGet(this, _OpenPBRMaterial_forceIrradianceInFragment_accessor_storage, "f"); }
            set forceIrradianceInFragment(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_forceIrradianceInFragment_accessor_storage, value, "f"); }
            /**
             * Number of Simultaneous lights allowed on the material.
             */
            get maxSimultaneousLights() { return __classPrivateFieldGet(this, _OpenPBRMaterial_maxSimultaneousLights_accessor_storage, "f"); }
            set maxSimultaneousLights(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_maxSimultaneousLights_accessor_storage, value, "f"); }
            /**
             * If sets to true, x component of normal map value will invert (x = 1.0 - x).
             */
            get invertNormalMapX() { return __classPrivateFieldGet(this, _OpenPBRMaterial_invertNormalMapX_accessor_storage, "f"); }
            set invertNormalMapX(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_invertNormalMapX_accessor_storage, value, "f"); }
            /**
             * If sets to true, y component of normal map value will invert (y = 1.0 - y).
             */
            get invertNormalMapY() { return __classPrivateFieldGet(this, _OpenPBRMaterial_invertNormalMapY_accessor_storage, "f"); }
            set invertNormalMapY(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_invertNormalMapY_accessor_storage, value, "f"); }
            /**
             * If sets to true and backfaceCulling is false, normals will be flipped on the backside.
             */
            get twoSidedLighting() { return __classPrivateFieldGet(this, _OpenPBRMaterial_twoSidedLighting_accessor_storage, "f"); }
            set twoSidedLighting(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_twoSidedLighting_accessor_storage, value, "f"); }
            /**
             * A fresnel is applied to the alpha of the model to ensure grazing angles edges are not alpha tested.
             * And/Or occlude the blended part. (alpha is converted to gamma to compute the fresnel)
             */
            get useAlphaFresnel() { return __classPrivateFieldGet(this, _OpenPBRMaterial_useAlphaFresnel_accessor_storage, "f"); }
            set useAlphaFresnel(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_useAlphaFresnel_accessor_storage, value, "f"); }
            /**
             * A fresnel is applied to the alpha of the model to ensure grazing angles edges are not alpha tested.
             * And/Or occlude the blended part. (alpha stays linear to compute the fresnel)
             */
            get useLinearAlphaFresnel() { return __classPrivateFieldGet(this, _OpenPBRMaterial_useLinearAlphaFresnel_accessor_storage, "f"); }
            set useLinearAlphaFresnel(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_useLinearAlphaFresnel_accessor_storage, value, "f"); }
            /**
             * Let user defines the brdf lookup texture used for IBL.
             * A default 8bit version is embedded but you could point at :
             * * Default texture: https://assets.babylonjs.com/environments/correlatedMSBRDF_RGBD.png
             * * Default 16bit pixel depth texture: https://assets.babylonjs.com/environments/correlatedMSBRDF.dds
             * * LEGACY Default None correlated https://assets.babylonjs.com/environments/uncorrelatedBRDF_RGBD.png
             * * LEGACY Default None correlated 16bit pixel depth https://assets.babylonjs.com/environments/uncorrelatedBRDF.dds
             */
            get environmentBRDFTexture() { return __classPrivateFieldGet(this, _OpenPBRMaterial_environmentBRDFTexture_accessor_storage, "f"); }
            set environmentBRDFTexture(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_environmentBRDFTexture_accessor_storage, value, "f"); }
            /**
             * Force normal to face away from face.
             */
            get forceNormalForward() { return __classPrivateFieldGet(this, _OpenPBRMaterial_forceNormalForward_accessor_storage, "f"); }
            set forceNormalForward(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_forceNormalForward_accessor_storage, value, "f"); }
            /**
             * Enables specular anti aliasing in the PBR shader.
             * It will both interacts on the Geometry for analytical and IBL lighting.
             * It also prefilter the roughness map based on the normalmap values.
             */
            get enableSpecularAntiAliasing() { return __classPrivateFieldGet(this, _OpenPBRMaterial_enableSpecularAntiAliasing_accessor_storage, "f"); }
            set enableSpecularAntiAliasing(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_enableSpecularAntiAliasing_accessor_storage, value, "f"); }
            /**
             * This parameters will enable/disable Horizon occlusion to prevent normal maps to look shiny when the normal
             * makes the reflect vector face the model (under horizon).
             */
            get useHorizonOcclusion() { return __classPrivateFieldGet(this, _OpenPBRMaterial_useHorizonOcclusion_accessor_storage, "f"); }
            set useHorizonOcclusion(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_useHorizonOcclusion_accessor_storage, value, "f"); }
            /**
             * This parameters will enable/disable radiance occlusion by preventing the radiance to lit
             * too much the area relying on ambient texture to define their ambient occlusion.
             */
            get useRadianceOcclusion() { return __classPrivateFieldGet(this, _OpenPBRMaterial_useRadianceOcclusion_accessor_storage, "f"); }
            set useRadianceOcclusion(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_useRadianceOcclusion_accessor_storage, value, "f"); }
            /**
             * If set to true, no lighting calculations will be applied.
             */
            get unlit() { return __classPrivateFieldGet(this, _OpenPBRMaterial_unlit_accessor_storage, "f"); }
            set unlit(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_unlit_accessor_storage, value, "f"); }
            /**
             * If sets to true, the decal map will be applied after the detail map. Else, it is applied before (default: false)
             */
            get applyDecalMapAfterDetailMap() { return __classPrivateFieldGet(this, _OpenPBRMaterial_applyDecalMapAfterDetailMap_accessor_storage, "f"); }
            set applyDecalMapAfterDetailMap(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_applyDecalMapAfterDetailMap_accessor_storage, value, "f"); }
            /**
             * Set the texture used for refraction of the background of transparent materials
             * @internal
             */
            get backgroundRefractionTexture() {
                return this._backgroundRefractionTexture;
            }
            set backgroundRefractionTexture(texture) {
                this._backgroundRefractionTexture = texture;
                this._markAllSubMeshesAsTexturesDirty();
            }
            /**
             * When true, uses a 4-tap rotated-grid kernel for refractive background blur,
             * eliminating bilinear block artifacts at the cost of 3 extra texture samples.
             * When false, a single dithered sample is used. Default: true.
             */
            get refractionHighQualityBlur() {
                return this._refractionHighQualityBlur;
            }
            set refractionHighQualityBlur(value) {
                if (this._refractionHighQualityBlur !== value) {
                    this._refractionHighQualityBlur = value;
                    this.markAsDirty(1);
                }
            }
            /**
             * Enables realtime filtering on the texture.
             */
            get realTimeFiltering() {
                return this._realTimeFiltering;
            }
            set realTimeFiltering(b) {
                this._realTimeFiltering = b;
                this.markAsDirty(1);
            }
            /**
             * Quality switch for realtime filtering
             */
            get realTimeFilteringQuality() {
                return this._realTimeFilteringQuality;
            }
            set realTimeFilteringQuality(n) {
                this._realTimeFilteringQuality = n;
                this.markAsDirty(1);
            }
            /**
             * The number of samples used to compute the fuzz IBL lighting.
             */
            get fuzzSampleNumber() {
                return this._fuzzSampleNumber;
            }
            set fuzzSampleNumber(n) {
                this._fuzzSampleNumber = n;
                this.markAsDirty(1);
            }
            /**
             * Can this material render to several textures at once
             */
            get canRenderToMRT() {
                return true;
            }
            /**
             * @internal
             * This is reserved for the inspector.
             * Defines the material debug mode.
             * It helps seeing only some components of the material while troubleshooting.
             */
            get debugMode() { return __classPrivateFieldGet(this, _OpenPBRMaterial_debugMode_accessor_storage, "f"); }
            set debugMode(value) { __classPrivateFieldSet(this, _OpenPBRMaterial_debugMode_accessor_storage, value, "f"); }
            /**
             * Instantiates a new OpenPBRMaterial instance.
             *
             * @param name The material name
             * @param scene The scene the material will be use in.
             * @param forceGLSL Use the GLSL code generation for the shader (even on WebGPU). Default is false
             */
            constructor(name, scene, forceGLSL = false) {
                super(name, scene, undefined, forceGLSL || _a.ForceGLSL);
                _OpenPBRMaterial_baseWeight_accessor_storage.set(this, (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _baseWeight_initializers, void 0)));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._baseWeight = (__runInitializers(this, _baseWeight_extraInitializers), new Property("base_weight", 1, "vBaseWeight", 1));
                _OpenPBRMaterial_baseWeightTexture_accessor_storage.set(this, __runInitializers(this, _baseWeightTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._baseWeightTexture = (__runInitializers(this, _baseWeightTexture_extraInitializers), new Sampler("base_weight", "baseWeight", "BASE_WEIGHT"));
                _OpenPBRMaterial_baseColor_accessor_storage.set(this, __runInitializers(this, _baseColor_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._baseColor = (__runInitializers(this, _baseColor_extraInitializers), new Property("base_color", Color3.White(), "vBaseColor", 4));
                _OpenPBRMaterial_baseColorTexture_accessor_storage.set(this, __runInitializers(this, _baseColorTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._baseColorTexture = (__runInitializers(this, _baseColorTexture_extraInitializers), new Sampler("base_color", "baseColor", "BASE_COLOR"));
                _OpenPBRMaterial_baseDiffuseRoughness_accessor_storage.set(this, __runInitializers(this, _baseDiffuseRoughness_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._baseDiffuseRoughness = (__runInitializers(this, _baseDiffuseRoughness_extraInitializers), new Property("base_diffuse_roughness", 0, "vBaseDiffuseRoughness", 1));
                _OpenPBRMaterial_baseDiffuseRoughnessTexture_accessor_storage.set(this, __runInitializers(this, _baseDiffuseRoughnessTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._baseDiffuseRoughnessTexture = (__runInitializers(this, _baseDiffuseRoughnessTexture_extraInitializers), new Sampler("base_diffuse_roughness", "baseDiffuseRoughness", "BASE_DIFFUSE_ROUGHNESS"));
                _OpenPBRMaterial_baseMetalness_accessor_storage.set(this, __runInitializers(this, _baseMetalness_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._baseMetalness = (__runInitializers(this, _baseMetalness_extraInitializers), new Property("base_metalness", 0, "vReflectanceInfo", 4, 0));
                _OpenPBRMaterial_baseMetalnessTexture_accessor_storage.set(this, __runInitializers(this, _baseMetalnessTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._baseMetalnessTexture = (__runInitializers(this, _baseMetalnessTexture_extraInitializers), new Sampler("base_metalness", "baseMetalness", "BASE_METALNESS"));
                _OpenPBRMaterial_specularWeight_accessor_storage.set(this, __runInitializers(this, _specularWeight_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._specularWeight = (__runInitializers(this, _specularWeight_extraInitializers), new Property("specular_weight", 1, "vReflectanceInfo", 4, 3));
                _OpenPBRMaterial_specularWeightTexture_accessor_storage.set(this, __runInitializers(this, _specularWeightTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._specularWeightTexture = (__runInitializers(this, _specularWeightTexture_extraInitializers), new Sampler("specular_weight", "specularWeight", "SPECULAR_WEIGHT"));
                _OpenPBRMaterial_specularColor_accessor_storage.set(this, __runInitializers(this, _specularColor_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._specularColor = (__runInitializers(this, _specularColor_extraInitializers), new Property("specular_color", Color3.White(), "vSpecularColor", 4));
                _OpenPBRMaterial_specularColorTexture_accessor_storage.set(this, __runInitializers(this, _specularColorTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._specularColorTexture = (__runInitializers(this, _specularColorTexture_extraInitializers), new Sampler("specular_color", "specularColor", "SPECULAR_COLOR"));
                _OpenPBRMaterial_specularRoughness_accessor_storage.set(this, __runInitializers(this, _specularRoughness_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._specularRoughness = (__runInitializers(this, _specularRoughness_extraInitializers), new Property("specular_roughness", 0.3, "vReflectanceInfo", 4, 1));
                _OpenPBRMaterial_specularRoughnessTexture_accessor_storage.set(this, __runInitializers(this, _specularRoughnessTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._specularRoughnessTexture = (__runInitializers(this, _specularRoughnessTexture_extraInitializers), new Sampler("specular_roughness", "specularRoughness", "SPECULAR_ROUGHNESS"));
                _OpenPBRMaterial_specularRoughnessAnisotropy_accessor_storage.set(this, __runInitializers(this, _specularRoughnessAnisotropy_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._specularRoughnessAnisotropy = (__runInitializers(this, _specularRoughnessAnisotropy_extraInitializers), new Property("specular_roughness_anisotropy", 0, "vSpecularAnisotropy", 3, 2));
                _OpenPBRMaterial_specularRoughnessAnisotropyTexture_accessor_storage.set(this, __runInitializers(this, _specularRoughnessAnisotropyTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._specularRoughnessAnisotropyTexture = (__runInitializers(this, _specularRoughnessAnisotropyTexture_extraInitializers), new Sampler("specular_roughness_anisotropy", "specularRoughnessAnisotropy", "SPECULAR_ROUGHNESS_ANISOTROPY"));
                _OpenPBRMaterial_specularIor_accessor_storage.set(this, __runInitializers(this, _specularIor_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._specularIor = (__runInitializers(this, _specularIor_extraInitializers), new Property("specular_ior", 1.5, "vReflectanceInfo", 4, 2));
                _OpenPBRMaterial_transmissionWeight_accessor_storage.set(this, __runInitializers(this, _transmissionWeight_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._transmissionWeight = (__runInitializers(this, _transmissionWeight_extraInitializers), new Property("transmission_weight", 0.0, "vTransmissionWeight", 1));
                _OpenPBRMaterial_transmissionWeightTexture_accessor_storage.set(this, __runInitializers(this, _transmissionWeightTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._transmissionWeightTexture = (__runInitializers(this, _transmissionWeightTexture_extraInitializers), new Sampler("transmission_weight", "transmissionWeight", "TRANSMISSION_WEIGHT"));
                _OpenPBRMaterial_transmissionColor_accessor_storage.set(this, __runInitializers(this, _transmissionColor_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._transmissionColor = (__runInitializers(this, _transmissionColor_extraInitializers), new Property("transmission_color", Color3.White(), "vTransmissionColor", 3, 0));
                _OpenPBRMaterial_transmissionColorTexture_accessor_storage.set(this, __runInitializers(this, _transmissionColorTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._transmissionColorTexture = (__runInitializers(this, _transmissionColorTexture_extraInitializers), new Sampler("transmission_color", "transmissionColor", "TRANSMISSION_COLOR"));
                _OpenPBRMaterial_transmissionDepth_accessor_storage.set(this, __runInitializers(this, _transmissionDepth_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._transmissionDepth = (__runInitializers(this, _transmissionDepth_extraInitializers), new Property("transmission_depth", 0.0, "vTransmissionDepth", 1, 0));
                _OpenPBRMaterial_transmissionDepthTexture_accessor_storage.set(this, __runInitializers(this, _transmissionDepthTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._transmissionDepthTexture = (__runInitializers(this, _transmissionDepthTexture_extraInitializers), new Sampler("transmission_depth", "transmissionDepth", "TRANSMISSION_DEPTH"));
                _OpenPBRMaterial_transmissionScatter_accessor_storage.set(this, __runInitializers(this, _transmissionScatter_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._transmissionScatter = (__runInitializers(this, _transmissionScatter_extraInitializers), new Property("transmission_scatter", Color3.Black(), "vTransmissionScatter", 3, 0));
                _OpenPBRMaterial_transmissionScatterTexture_accessor_storage.set(this, __runInitializers(this, _transmissionScatterTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._transmissionScatterTexture = (__runInitializers(this, _transmissionScatterTexture_extraInitializers), new Sampler("transmission_scatter", "transmissionScatter", "TRANSMISSION_SCATTER"));
                _OpenPBRMaterial_transmissionScatterAnisotropy_accessor_storage.set(this, __runInitializers(this, _transmissionScatterAnisotropy_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._transmissionScatterAnisotropy = (__runInitializers(this, _transmissionScatterAnisotropy_extraInitializers), new Property("transmission_scatter_anisotropy", 0.0, "vTransmissionScatterAnisotropy", 1, 0));
                _OpenPBRMaterial_transmissionDispersionScale_accessor_storage.set(this, __runInitializers(this, _transmissionDispersionScale_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._transmissionDispersionScale = (__runInitializers(this, _transmissionDispersionScale_extraInitializers), new Property("transmission_dispersion_scale", 0.0, "vTransmissionDispersionScale", 1, 0));
                _OpenPBRMaterial_transmissionDispersionScaleTexture_accessor_storage.set(this, __runInitializers(this, _transmissionDispersionScaleTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._transmissionDispersionScaleTexture = (__runInitializers(this, _transmissionDispersionScaleTexture_extraInitializers), new Sampler("transmission_dispersion_scale", "transmissionDispersionScale", "TRANSMISSION_DISPERSION_SCALE"));
                _OpenPBRMaterial_transmissionDispersionAbbeNumber_accessor_storage.set(this, __runInitializers(this, _transmissionDispersionAbbeNumber_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._transmissionDispersionAbbeNumber = (__runInitializers(this, _transmissionDispersionAbbeNumber_extraInitializers), new Property("transmission_dispersion_abbe_number", 20.0, "vTransmissionDispersionAbbeNumber", 1, 0));
                _OpenPBRMaterial_subsurfaceWeight_accessor_storage.set(this, __runInitializers(this, _subsurfaceWeight_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._subsurfaceWeight = (__runInitializers(this, _subsurfaceWeight_extraInitializers), new Property("subsurface_weight", 0.0, "vSubsurfaceWeight", 1, 0, "SUBSURFACE_SLAB"));
                _OpenPBRMaterial_subsurfaceWeightTexture_accessor_storage.set(this, __runInitializers(this, _subsurfaceWeightTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._subsurfaceWeightTexture = (__runInitializers(this, _subsurfaceWeightTexture_extraInitializers), new Sampler("subsurface_weight", "subsurfaceWeight", "SUBSURFACE_WEIGHT"));
                _OpenPBRMaterial_subsurfaceColor_accessor_storage.set(this, __runInitializers(this, _subsurfaceColor_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._subsurfaceColor = (__runInitializers(this, _subsurfaceColor_extraInitializers), new Property("subsurface_color", new Color3(0.8, 0.8, 0.8), "vSubsurfaceColor", 3, 0, "SUBSURFACE_SLAB"));
                _OpenPBRMaterial_subsurfaceColorTexture_accessor_storage.set(this, __runInitializers(this, _subsurfaceColorTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._subsurfaceColorTexture = (__runInitializers(this, _subsurfaceColorTexture_extraInitializers), new Sampler("subsurface_color", "subsurfaceColor", "SUBSURFACE_COLOR"));
                _OpenPBRMaterial_subsurfaceRadius_accessor_storage.set(this, __runInitializers(this, _subsurfaceRadius_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._subsurfaceRadius = (__runInitializers(this, _subsurfaceRadius_extraInitializers), new Property("subsurface_radius", 0.1, "vSubsurfaceRadius", 1, 0, "SUBSURFACE_SLAB"));
                _OpenPBRMaterial_subsurfaceRadiusScale_accessor_storage.set(this, __runInitializers(this, _subsurfaceRadiusScale_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._subsurfaceRadiusScale = (__runInitializers(this, _subsurfaceRadiusScale_extraInitializers), new Property("subsurface_radius_scale", new Color3(1, 0.5, 0.25), "vSubsurfaceRadiusScale", 3, 0, "SUBSURFACE_SLAB"));
                _OpenPBRMaterial_subsurfaceRadiusScaleTexture_accessor_storage.set(this, __runInitializers(this, _subsurfaceRadiusScaleTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._subsurfaceRadiusScaleTexture = (__runInitializers(this, _subsurfaceRadiusScaleTexture_extraInitializers), new Sampler("subsurface_radius_scale", "subsurfaceRadiusScale", "SUBSURFACE_RADIUS_SCALE"));
                _OpenPBRMaterial_subsurfaceScatterAnisotropy_accessor_storage.set(this, __runInitializers(this, _subsurfaceScatterAnisotropy_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._subsurfaceScatterAnisotropy = (__runInitializers(this, _subsurfaceScatterAnisotropy_extraInitializers), new Property("subsurface_scatter_anisotropy", 0.0, "vSubsurfaceScatterAnisotropy", 1, 0, "SUBSURFACE_SLAB"));
                _OpenPBRMaterial_coatWeight_accessor_storage.set(this, __runInitializers(this, _coatWeight_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._coatWeight = (__runInitializers(this, _coatWeight_extraInitializers), new Property("coat_weight", 0.0, "vCoatWeight", 1, 0));
                _OpenPBRMaterial_coatWeightTexture_accessor_storage.set(this, __runInitializers(this, _coatWeightTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._coatWeightTexture = (__runInitializers(this, _coatWeightTexture_extraInitializers), new Sampler("coat_weight", "coatWeight", "COAT_WEIGHT"));
                _OpenPBRMaterial_coatColor_accessor_storage.set(this, __runInitializers(this, _coatColor_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._coatColor = (__runInitializers(this, _coatColor_extraInitializers), new Property("coat_color", Color3.White(), "vCoatColor", 3, 0));
                _OpenPBRMaterial_coatColorTexture_accessor_storage.set(this, __runInitializers(this, _coatColorTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._coatColorTexture = (__runInitializers(this, _coatColorTexture_extraInitializers), new Sampler("coat_color", "coatColor", "COAT_COLOR"));
                _OpenPBRMaterial_coatRoughness_accessor_storage.set(this, __runInitializers(this, _coatRoughness_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._coatRoughness = (__runInitializers(this, _coatRoughness_extraInitializers), new Property("coat_roughness", 0.0, "vCoatRoughness", 1, 0));
                _OpenPBRMaterial_coatRoughnessTexture_accessor_storage.set(this, __runInitializers(this, _coatRoughnessTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._coatRoughnessTexture = (__runInitializers(this, _coatRoughnessTexture_extraInitializers), new Sampler("coat_roughness", "coatRoughness", "COAT_ROUGHNESS"));
                _OpenPBRMaterial_coatRoughnessAnisotropy_accessor_storage.set(this, __runInitializers(this, _coatRoughnessAnisotropy_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._coatRoughnessAnisotropy = (__runInitializers(this, _coatRoughnessAnisotropy_extraInitializers), new Property("coat_roughness_anisotropy", 0, "vCoatRoughnessAnisotropy", 1));
                _OpenPBRMaterial_coatRoughnessAnisotropyTexture_accessor_storage.set(this, __runInitializers(this, _coatRoughnessAnisotropyTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._coatRoughnessAnisotropyTexture = (__runInitializers(this, _coatRoughnessAnisotropyTexture_extraInitializers), new Sampler("coat_roughness_anisotropy", "coatRoughnessAnisotropy", "COAT_ROUGHNESS_ANISOTROPY"));
                _OpenPBRMaterial_coatIor_accessor_storage.set(this, __runInitializers(this, _coatIor_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._coatIor = (__runInitializers(this, _coatIor_extraInitializers), new Property("coat_ior", 1.5, "vCoatIor", 1, 0));
                _OpenPBRMaterial_coatDarkening_accessor_storage.set(this, __runInitializers(this, _coatDarkening_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._coatDarkening = (__runInitializers(this, _coatDarkening_extraInitializers), new Property("coat_darkening", 1.0, "vCoatDarkening", 1, 0));
                _OpenPBRMaterial_coatDarkeningTexture_accessor_storage.set(this, __runInitializers(this, _coatDarkeningTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._coatDarkeningTexture = (__runInitializers(this, _coatDarkeningTexture_extraInitializers), new Sampler("coat_darkening", "coatDarkening", "COAT_DARKENING"));
                /**
                 * Specifies whether the coat roughness is taken from the
                 * same texture as the coat_weight.
                 */
                this.useCoatRoughnessFromWeightTexture = false;
                _OpenPBRMaterial_fuzzWeight_accessor_storage.set(this, __runInitializers(this, _fuzzWeight_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._fuzzWeight = (__runInitializers(this, _fuzzWeight_extraInitializers), new Property("fuzz_weight", 0.0, "vFuzzWeight", 1, 0));
                _OpenPBRMaterial_fuzzWeightTexture_accessor_storage.set(this, __runInitializers(this, _fuzzWeightTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._fuzzWeightTexture = (__runInitializers(this, _fuzzWeightTexture_extraInitializers), new Sampler("fuzz_weight", "fuzzWeight", "FUZZ_WEIGHT"));
                _OpenPBRMaterial_fuzzColor_accessor_storage.set(this, __runInitializers(this, _fuzzColor_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._fuzzColor = (__runInitializers(this, _fuzzColor_extraInitializers), new Property("fuzz_color", Color3.White(), "vFuzzColor", 3, 0));
                _OpenPBRMaterial_fuzzColorTexture_accessor_storage.set(this, __runInitializers(this, _fuzzColorTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._fuzzColorTexture = (__runInitializers(this, _fuzzColorTexture_extraInitializers), new Sampler("fuzz_color", "fuzzColor", "FUZZ_COLOR"));
                _OpenPBRMaterial_fuzzRoughness_accessor_storage.set(this, __runInitializers(this, _fuzzRoughness_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._fuzzRoughness = (__runInitializers(this, _fuzzRoughness_extraInitializers), new Property("fuzz_roughness", 0.5, "vFuzzRoughness", 1, 0));
                _OpenPBRMaterial_fuzzRoughnessTexture_accessor_storage.set(this, __runInitializers(this, _fuzzRoughnessTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._fuzzRoughnessTexture = (__runInitializers(this, _fuzzRoughnessTexture_extraInitializers), new Sampler("fuzz_roughness", "fuzzRoughness", "FUZZ_ROUGHNESS"));
                _OpenPBRMaterial_geometryThinWalled_accessor_storage.set(this, __runInitializers(this, _geometryThinWalled_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._geometryThinWalled = (__runInitializers(this, _geometryThinWalled_extraInitializers), new Property("geometry_thin_walled", 0, "vGeometryThinWalled", 1, 0));
                _OpenPBRMaterial_geometryNormalTexture_accessor_storage.set(this, __runInitializers(this, _geometryNormalTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._geometryNormalTexture = (__runInitializers(this, _geometryNormalTexture_extraInitializers), new Sampler("geometry_normal", "geometryNormal", "GEOMETRY_NORMAL"));
                _OpenPBRMaterial_geometryTangent_accessor_storage.set(this, __runInitializers(this, _geometryTangent_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._geometryTangent = (__runInitializers(this, _geometryTangent_extraInitializers), new Property("geometry_tangent", new Vector2(1, 0), "vSpecularAnisotropy", 3, 0));
                _OpenPBRMaterial_geometryTangentTexture_accessor_storage.set(this, __runInitializers(this, _geometryTangentTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._geometryTangentTexture = (__runInitializers(this, _geometryTangentTexture_extraInitializers), new Sampler("geometry_tangent", "geometryTangent", "GEOMETRY_TANGENT"));
                _OpenPBRMaterial_geometryCoatNormalTexture_accessor_storage.set(this, __runInitializers(this, _geometryCoatNormalTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._geometryCoatNormalTexture = (__runInitializers(this, _geometryCoatNormalTexture_extraInitializers), new Sampler("geometry_coat_normal", "geometryCoatNormal", "GEOMETRY_COAT_NORMAL"));
                _OpenPBRMaterial_geometryCoatTangent_accessor_storage.set(this, __runInitializers(this, _geometryCoatTangent_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._geometryCoatTangent = (__runInitializers(this, _geometryCoatTangent_extraInitializers), new Property("geometry_coat_tangent", new Vector2(1, 0), "vGeometryCoatTangent", 2, 0));
                _OpenPBRMaterial_geometryCoatTangentTexture_accessor_storage.set(this, __runInitializers(this, _geometryCoatTangentTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._geometryCoatTangentTexture = (__runInitializers(this, _geometryCoatTangentTexture_extraInitializers), new Sampler("geometry_coat_tangent", "geometryCoatTangent", "GEOMETRY_COAT_TANGENT"));
                _OpenPBRMaterial_geometryOpacity_accessor_storage.set(this, __runInitializers(this, _geometryOpacity_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._geometryOpacity = (__runInitializers(this, _geometryOpacity_extraInitializers), new Property("geometry_opacity", 1.0, "vBaseColor", 4, 3));
                _OpenPBRMaterial_geometryOpacityTexture_accessor_storage.set(this, __runInitializers(this, _geometryOpacityTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._geometryOpacityTexture = (__runInitializers(this, _geometryOpacityTexture_extraInitializers), new Sampler("geometry_opacity", "geometryOpacity", "GEOMETRY_OPACITY"));
                _OpenPBRMaterial_geometryThickness_accessor_storage.set(this, __runInitializers(this, _geometryThickness_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._geometryThickness = (__runInitializers(this, _geometryThickness_extraInitializers), new Property("geometry_thickness", 0.0, "vGeometryThickness", 1, 0));
                _OpenPBRMaterial_geometryThicknessTexture_accessor_storage.set(this, __runInitializers(this, _geometryThicknessTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._geometryThicknessTexture = (__runInitializers(this, _geometryThicknessTexture_extraInitializers), new Sampler("geometry_thickness", "geometryThickness", "GEOMETRY_THICKNESS"));
                _OpenPBRMaterial_emissionLuminance_accessor_storage.set(this, __runInitializers(this, _emissionLuminance_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._emissionLuminance = (__runInitializers(this, _emissionLuminance_extraInitializers), new Property("emission_luminance", 1.0, "vLightingIntensity", 4, 1));
                _OpenPBRMaterial_emissionColor_accessor_storage.set(this, __runInitializers(this, _emissionColor_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._emissionColor = (__runInitializers(this, _emissionColor_extraInitializers), new Property("emission_color", Color3.Black(), "vEmissionColor", 3));
                _OpenPBRMaterial_emissionColorTexture_accessor_storage.set(this, __runInitializers(this, _emissionColorTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._emissionColorTexture = (__runInitializers(this, _emissionColorTexture_extraInitializers), new Sampler("emission_color", "emissionColor", "EMISSION_COLOR"));
                _OpenPBRMaterial_thinFilmWeight_accessor_storage.set(this, __runInitializers(this, _thinFilmWeight_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._thinFilmWeight = (__runInitializers(this, _thinFilmWeight_extraInitializers), new Property("thin_film_weight", 0.0, "vThinFilmWeight", 1, 0));
                _OpenPBRMaterial_thinFilmWeightTexture_accessor_storage.set(this, __runInitializers(this, _thinFilmWeightTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._thinFilmWeightTexture = (__runInitializers(this, _thinFilmWeightTexture_extraInitializers), new Sampler("thin_film_weight", "thinFilmWeight", "THIN_FILM_WEIGHT"));
                _OpenPBRMaterial_thinFilmThickness_accessor_storage.set(this, __runInitializers(this, _thinFilmThickness_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._thinFilmThickness = (__runInitializers(this, _thinFilmThickness_extraInitializers), new Property("thin_film_thickness", 0.5, "vThinFilmThickness", 2, 0));
                _OpenPBRMaterial_thinFilmThicknessMin_accessor_storage.set(this, __runInitializers(this, _thinFilmThicknessMin_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._thinFilmThicknessMin = (__runInitializers(this, _thinFilmThicknessMin_extraInitializers), new Property("thin_film_thickness_min", 0.0, "vThinFilmThickness", 2, 1));
                _OpenPBRMaterial_thinFilmThicknessTexture_accessor_storage.set(this, __runInitializers(this, _thinFilmThicknessTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._thinFilmThicknessTexture = (__runInitializers(this, _thinFilmThicknessTexture_extraInitializers), new Sampler("thin_film_thickness", "thinFilmThickness", "THIN_FILM_THICKNESS"));
                _OpenPBRMaterial_thinFilmIor_accessor_storage.set(this, __runInitializers(this, _thinFilmIor_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._thinFilmIor = (__runInitializers(this, _thinFilmIor_extraInitializers), new Property("thin_film_ior", 1.4, "vThinFilmIor", 1, 0));
                _OpenPBRMaterial_ambientOcclusionTexture_accessor_storage.set(this, __runInitializers(this, _ambientOcclusionTexture_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._ambientOcclusionTexture = (__runInitializers(this, _ambientOcclusionTexture_extraInitializers), new Sampler("ambient_occlusion", "ambientOcclusion", "AMBIENT_OCCLUSION"));
                this._sssQuality = _a.SSS_QUALITY_MEDIUM;
                this._sssIrradianceTexture = null;
                this._sssDepthTexture = null;
                this._uniformsList = {};
                /**
                 * Flat array view of `_uniformsList`, populated once at construction. Used
                 * by the per-frame bind loop to avoid `Object.values()` allocation and
                 * closure creation on every submesh binding.
                 */
                this._uniformsArray = [];
                this._samplersList = {};
                this._samplerDefines = {};
                _OpenPBRMaterial_directIntensity_accessor_storage.set(this, __runInitializers(this, _directIntensity_initializers, 1.0));
                _OpenPBRMaterial_environmentIntensity_accessor_storage.set(this, (__runInitializers(this, _directIntensity_extraInitializers), __runInitializers(this, _environmentIntensity_initializers, 1.0)));
                _OpenPBRMaterial_useSpecularWeightFromTextureAlpha_accessor_storage.set(this, (__runInitializers(this, _environmentIntensity_extraInitializers), __runInitializers(this, _useSpecularWeightFromTextureAlpha_initializers, false)));
                _OpenPBRMaterial_forceAlphaTest_accessor_storage.set(this, (__runInitializers(this, _useSpecularWeightFromTextureAlpha_extraInitializers), __runInitializers(this, _forceAlphaTest_initializers, false)));
                _OpenPBRMaterial_alphaCutOff_accessor_storage.set(this, (__runInitializers(this, _forceAlphaTest_extraInitializers), __runInitializers(this, _alphaCutOff_initializers, 0.4)));
                _OpenPBRMaterial_useAmbientOcclusionFromMetallicTextureRed_accessor_storage.set(this, (__runInitializers(this, _alphaCutOff_extraInitializers), __runInitializers(this, _useAmbientOcclusionFromMetallicTextureRed_initializers, false)));
                _OpenPBRMaterial_useAmbientInGrayScale_accessor_storage.set(this, (__runInitializers(this, _useAmbientOcclusionFromMetallicTextureRed_extraInitializers), __runInitializers(this, _useAmbientInGrayScale_initializers, false)));
                _OpenPBRMaterial_useObjectSpaceNormalMap_accessor_storage.set(this, (__runInitializers(this, _useAmbientInGrayScale_extraInitializers), __runInitializers(this, _useObjectSpaceNormalMap_initializers, false)));
                _OpenPBRMaterial_useParallax_accessor_storage.set(this, (__runInitializers(this, _useObjectSpaceNormalMap_extraInitializers), __runInitializers(this, _useParallax_initializers, false)));
                _OpenPBRMaterial_useParallaxOcclusion_accessor_storage.set(this, (__runInitializers(this, _useParallax_extraInitializers), __runInitializers(this, _useParallaxOcclusion_initializers, false)));
                _OpenPBRMaterial_parallaxScaleBias_accessor_storage.set(this, (__runInitializers(this, _useParallaxOcclusion_extraInitializers), __runInitializers(this, _parallaxScaleBias_initializers, 0.05)));
                _OpenPBRMaterial_disableLighting_accessor_storage.set(this, (__runInitializers(this, _parallaxScaleBias_extraInitializers), __runInitializers(this, _disableLighting_initializers, false)));
                _OpenPBRMaterial_forceIrradianceInFragment_accessor_storage.set(this, (__runInitializers(this, _disableLighting_extraInitializers), __runInitializers(this, _forceIrradianceInFragment_initializers, false)));
                _OpenPBRMaterial_maxSimultaneousLights_accessor_storage.set(this, (__runInitializers(this, _forceIrradianceInFragment_extraInitializers), __runInitializers(this, _maxSimultaneousLights_initializers, 4)));
                _OpenPBRMaterial_invertNormalMapX_accessor_storage.set(this, (__runInitializers(this, _maxSimultaneousLights_extraInitializers), __runInitializers(this, _invertNormalMapX_initializers, false)));
                _OpenPBRMaterial_invertNormalMapY_accessor_storage.set(this, (__runInitializers(this, _invertNormalMapX_extraInitializers), __runInitializers(this, _invertNormalMapY_initializers, false)));
                _OpenPBRMaterial_twoSidedLighting_accessor_storage.set(this, (__runInitializers(this, _invertNormalMapY_extraInitializers), __runInitializers(this, _twoSidedLighting_initializers, false)));
                _OpenPBRMaterial_useAlphaFresnel_accessor_storage.set(this, (__runInitializers(this, _twoSidedLighting_extraInitializers), __runInitializers(this, _useAlphaFresnel_initializers, false)));
                _OpenPBRMaterial_useLinearAlphaFresnel_accessor_storage.set(this, (__runInitializers(this, _useAlphaFresnel_extraInitializers), __runInitializers(this, _useLinearAlphaFresnel_initializers, false)));
                _OpenPBRMaterial_environmentBRDFTexture_accessor_storage.set(this, (__runInitializers(this, _useLinearAlphaFresnel_extraInitializers), __runInitializers(this, _environmentBRDFTexture_initializers, null)));
                _OpenPBRMaterial_forceNormalForward_accessor_storage.set(this, (__runInitializers(this, _environmentBRDFTexture_extraInitializers), __runInitializers(this, _forceNormalForward_initializers, false)));
                _OpenPBRMaterial_enableSpecularAntiAliasing_accessor_storage.set(this, (__runInitializers(this, _forceNormalForward_extraInitializers), __runInitializers(this, _enableSpecularAntiAliasing_initializers, false)));
                _OpenPBRMaterial_useHorizonOcclusion_accessor_storage.set(this, (__runInitializers(this, _enableSpecularAntiAliasing_extraInitializers), __runInitializers(this, _useHorizonOcclusion_initializers, true)));
                _OpenPBRMaterial_useRadianceOcclusion_accessor_storage.set(this, (__runInitializers(this, _useHorizonOcclusion_extraInitializers), __runInitializers(this, _useRadianceOcclusion_initializers, true)));
                _OpenPBRMaterial_unlit_accessor_storage.set(this, (__runInitializers(this, _useRadianceOcclusion_extraInitializers), __runInitializers(this, _unlit_initializers, false)));
                _OpenPBRMaterial_applyDecalMapAfterDetailMap_accessor_storage.set(this, (__runInitializers(this, _unlit_extraInitializers), __runInitializers(this, _applyDecalMapAfterDetailMap_initializers, false)));
                /**
                 * This stores the direct, emissive, environment, and specular light intensities into a Vector4.
                 */
                this._lightingInfos = (__runInitializers(this, _applyDecalMapAfterDetailMap_extraInitializers), new Vector4(this.directIntensity, 1.0, this.environmentIntensity, 1.0));
                /**
                 * Stores the radiance (and, possibly, irradiance) values in a texture.
                 * @internal
                 */
                this._radianceTexture = null;
                /**
                 * Specifies that the specular weight will be read from the alpha channel.
                 * This is for compatibility with glTF's KHR_materials_specular extension.
                 * @internal
                 */
                this._useSpecularWeightFromAlpha = false;
                /**
                 * Specifies that the specular weight will be read from the alpha channel of the specular color texture.
                 * This is for compatibility with glTF's KHR_materials_specular extension.
                 * @internal
                 */
                this._useSpecularWeightFromSpecularColorTexture = false;
                /**
                 * Specifies if the material uses anisotropy weight read from the geometry tangent texture's blue channel.
                 * This is for compatibility with glTF's anisotropy extension.
                 * @internal
                 */
                this._useSpecularRoughnessAnisotropyFromTangentTexture = false;
                /**
                 * Specifies if the material uses coat anisotropy weight read from the coat's geometry tangent texture's blue channel.
                 * This is for compatibility with glTF's clearcoat_anisotropy extension.
                 * @internal
                 */
                this._useCoatRoughnessAnisotropyFromTangentTexture = false;
                /**
                 * Specifies whether the coat roughness is taken from the green channel of the coat texture.
                 * This is for compatibility with glTF's KHR_materials_clearcoat and KHR_materials_coat extensions.
                 * @internal
                 */
                this._useCoatRoughnessFromGreenChannel = false;
                /**
                 * Assume the anisotropy data is stored in the format specified by
                 * KHR_materials_anisotropy.
                 * @internal
                 */
                this._useGltfStyleAnisotropy = false;
                /**
                 * Specifies that the fuzz roughness is stored in the alpha channel of the texture.
                 * This is for compatibility with glTF where the fuzz roughness is often stored in
                 * the alpha channel of the fuzz color texture.
                 */
                this._useFuzzRoughnessFromTextureAlpha = false;
                /**
                 * Specifies that the subsurface weight is stored in the alpha channel of the texture.
                 * This is for compatibility with glTF where the subsurface weight is stored in
                 * the alpha channel of the diffuseTransmissionTexture.
                 */
                this._useSubsurfaceWeightFromTextureAlpha = false;
                /**
                 * This parameters will enable/disable Horizon occlusion to prevent normal maps to look shiny when the normal
                 * makes the reflect vector face the model (under horizon).
                 * @internal
                 */
                this._useHorizonOcclusion = true;
                /**
                 * This parameters will enable/disable radiance occlusion by preventing the radiance to lit
                 * too much the area relying on ambient texture to define their ambient occlusion.
                 * @internal
                 */
                this._useRadianceOcclusion = true;
                /**
                 * Specifies that the alpha is coming from the base color texture's alpha channel.
                 * This is for compatibility with glTF.
                 * @internal
                 */
                this._useAlphaFromBaseColorTexture = false;
                /**
                 * Specifies if the metallic texture contains the ambient occlusion information in its red channel.
                 * This is for compatibility with glTF.
                 * @internal
                 */
                this._useAmbientOcclusionFromMetallicTextureRed = false;
                /**
                 * Specifies if the metallic texture contains the roughness information in its green channel.
                 * This is for compatibility with glTF.
                 * @internal
                 */
                this._useRoughnessFromMetallicTextureGreen = false;
                /**
                 * Specifies if the metallic texture contains the metallic information in its blue channel.
                 * This is for compatibility with glTF.
                 * @internal
                 */
                this._useMetallicFromMetallicTextureBlue = false;
                /**
                 * Specifies if the thin film thickness is stored in the green channel of the thin film thickness texture.
                 * This is for compatibility with glTF.
                 * @internal
                 */
                this._useThinFilmThicknessFromTextureGreen = false;
                /**
                 * Specifies if the geometry thickness is stored in the green channel of the geometry thickness texture.
                 * This is for compatibility with glTF.
                 * @internal
                 */
                this._useGeometryThicknessFromGreenChannel = false;
                /**
                 * Defines the  falloff type used in this material.
                 * It by default is Physical.
                 * @internal
                 */
                this._lightFalloff = Material.LIGHTFALLOFF_PHYSICAL;
                /**
                 * Allows using an object space normal map (instead of tangent space).
                 * @internal
                 */
                this._useObjectSpaceNormalMap = false;
                /**
                 * Allows using the normal map in parallax mode.
                 * @internal
                 */
                this._useParallax = false;
                /**
                 * Allows using the normal map in parallax occlusion mode.
                 * @internal
                 */
                this._useParallaxOcclusion = false;
                /**
                 * Controls the scale bias of the parallax mode.
                 * @internal
                 */
                this._parallaxScaleBias = 0.05;
                /**
                 * If sets to true, disables all the lights affecting the material.
                 * @internal
                 */
                this._disableLighting = false;
                /**
                 * Number of Simultaneous lights allowed on the material.
                 * @internal
                 */
                this._maxSimultaneousLights = 4;
                /**
                 * If sets to true, x component of normal map value will be inverted (x = 1.0 - x).
                 * @internal
                 */
                this._invertNormalMapX = false;
                /**
                 * If sets to true, y component of normal map value will be inverted (y = 1.0 - y).
                 * @internal
                 */
                this._invertNormalMapY = false;
                /**
                 * If sets to true and backfaceCulling is false, normals will be flipped on the backside.
                 * @internal
                 */
                this._twoSidedLighting = false;
                /**
                 * Defines the alpha limits in alpha test mode.
                 * @internal
                 */
                this._alphaCutOff = 0.4;
                /**
                 * A fresnel is applied to the alpha of the model to ensure grazing angles edges are not alpha tested.
                 * And/Or occlude the blended part. (alpha is converted to gamma to compute the fresnel)
                 * @internal
                 */
                this._useAlphaFresnel = false;
                /**
                 * A fresnel is applied to the alpha of the model to ensure grazing angles edges are not alpha tested.
                 * And/Or occlude the blended part. (alpha stays linear to compute the fresnel)
                 * @internal
                 */
                this._useLinearAlphaFresnel = false;
                /**
                 * Specifies the environment BRDF texture used to compute the scale and offset roughness values
                 * from cos theta and roughness:
                 * http://blog.selfshadow.com/publications/s2013-shading-course/karis/s2013_pbs_epic_notes_v2.pdf
                 * @internal
                 */
                this._environmentBRDFTexture = null;
                /**
                 * Specifies the environment BRDF texture used to compute the scale and offset roughness values
                 * from cos theta and roughness for the fuzz layer:
                 * https://github.com/tizian/ltc-sheen?tab=readme-ov-file
                 * @internal
                 */
                this._environmentFuzzBRDFTexture = null;
                this._backgroundRefractionTexture = null;
                this._refractionHighQualityBlur = true;
                /**
                 * Force the shader to compute irradiance in the fragment shader in order to take normal mapping into account.
                 * @internal
                 */
                this._forceIrradianceInFragment = false;
                this._realTimeFiltering = false;
                this._realTimeFilteringQuality = 8;
                this._fuzzSampleNumber = 4;
                /**
                 * Force normal to face away from face.
                 * @internal
                 */
                this._forceNormalForward = false;
                /**
                 * Enables specular anti aliasing in the PBR shader.
                 * It will both interacts on the Geometry for analytical and IBL lighting.
                 * It also prefilter the roughness map based on the normalmap values.
                 * @internal
                 */
                this._enableSpecularAntiAliasing = false;
                /**
                 * Stores the available render targets.
                 */
                this._renderTargets = new SmartArray(16);
                /**
                 * If set to true, no lighting calculations will be applied.
                 */
                this._unlit = false;
                /**
                 * If sets to true, the decal map will be applied after the detail map. Else, it is applied before (default: false)
                 */
                this._applyDecalMapAfterDetailMap = false;
                this._debugMode = 0;
                this._breakShaderLoadedCheck = false;
                this._vertexPullingMetadata = null;
                _OpenPBRMaterial_debugMode_accessor_storage.set(this, __runInitializers(this, _debugMode_initializers, 0));
                /**
                 * @internal
                 * This is reserved for the inspector.
                 * Specify from where on screen the debug mode should start.
                 * The value goes from -1 (full screen) to 1 (not visible)
                 * It helps with side by side comparison against the final render
                 * This defaults to -1
                 */
                this.debugLimit = (__runInitializers(this, _debugMode_extraInitializers), -1);
                /**
                 * @internal
                 * This is reserved for the inspector.
                 * As the default viewing range might not be enough (if the ambient is really small for instance)
                 * You can use the factor to better multiply the final value.
                 */
                this.debugFactor = 1;
                this._cacheHasRenderTargetTextures = false;
                this._transparencyMode = Material.MATERIAL_OPAQUE;
                // TODO: Check if we're running WebGL 2.0 or above
                if (this.getScene() && !this.getScene()?.getEngine().isWebGPU && this.getScene().getEngine().webGLVersion < 2) {
                    Logger.Error("OpenPBRMaterial: WebGL 2.0 or above is required for this material.");
                }
                if (!_a._noiseTextures[this.getScene().uniqueId]) {
                    _a._noiseTextures[this.getScene().uniqueId] = new Texture(Tools.GetAssetUrl("https://assets.babylonjs.com/core/blue_noise/blue_noise_rgb.png"), this.getScene(), false, true, 1);
                    this.getScene().onDisposeObservable.addOnce(() => {
                        _a._noiseTextures[this.getScene().uniqueId]?.dispose();
                        delete _a._noiseTextures[this.getScene().uniqueId];
                    });
                }
                // Setup the default processing configuration to the scene.
                this._attachImageProcessingConfiguration(null);
                this.getRenderTargetTextures = () => {
                    this._renderTargets.reset();
                    if (MaterialFlags.ReflectionTextureEnabled && this._radianceTexture && this._radianceTexture.isRenderTarget) {
                        this._renderTargets.push(this._radianceTexture);
                    }
                    if (MaterialFlags.RefractionTextureEnabled && this._backgroundRefractionTexture && this._backgroundRefractionTexture.isRenderTarget) {
                        this._renderTargets.push(this._backgroundRefractionTexture);
                    }
                    this._eventInfo.renderTargets = this._renderTargets;
                    this._callbackPluginEventFillRenderTargetTextures(this._eventInfo);
                    return this._renderTargets;
                };
                this._environmentBRDFTexture = GetOpenPBREnvironmentBRDFTexture(this.getScene());
                this._environmentFuzzBRDFTexture = GetEnvironmentFuzzBRDFTexture(this.getScene());
                this.prePassConfiguration = new PrePassConfiguration();
                // Build the internal property list that can be used to generate and update the uniform buffer
                this._propertyList = {};
                for (const key of Object.getOwnPropertyNames(this)) {
                    const value = this[key];
                    if (value instanceof Property) {
                        this._propertyList[key] = value;
                    }
                }
                // Build the internal uniforms list that is used for combining and updating
                // property values in the uniform buffer
                const propertyKeys = Object.keys(this._propertyList);
                propertyKeys.forEach((key) => {
                    const prop = this._propertyList[key];
                    let uniform = this._uniformsList[prop.targetUniformName];
                    if (!uniform) {
                        uniform = new Uniform(prop.targetUniformName, prop.targetUniformComponentNum);
                        uniform.requiredDefine = prop.requiredDefine;
                        this._uniformsList[prop.targetUniformName] = uniform;
                    }
                    else if (uniform.numComponents !== prop.targetUniformComponentNum) {
                        Logger.Error(`Uniform ${prop.targetUniformName} already exists of size ${uniform.numComponents}, but trying to set it to ${prop.targetUniformComponentNum}.`);
                    }
                    else if (uniform.requiredDefine !== prop.requiredDefine) {
                        // Properties packed into the same uniform must share the same gating
                        // define, otherwise we cannot safely skip the per-frame UBO update.
                        uniform.requiredDefine = undefined;
                    }
                    if (uniform.firstLinkedKey === "") {
                        uniform.firstLinkedKey = prop.name;
                    }
                    uniform.linkedProperties[prop.name] = prop;
                });
                this._uniformsArray = Object.values(this._uniformsList);
                // Build the internal list of samplers
                this._samplersList = {};
                for (const key of Object.getOwnPropertyNames(this)) {
                    const value = this[key];
                    if (value instanceof Sampler) {
                        this._samplersList[key] = value;
                    }
                }
                // For each sampler in _samplersList, add defines to be added to OpenPBRMaterialDefines
                for (const samplerKey in this._samplersList) {
                    const sampler = this._samplersList[samplerKey];
                    const defineName = sampler.textureDefine;
                    this._samplerDefines[defineName] = { type: "boolean", default: false };
                    this._samplerDefines[defineName + "DIRECTUV"] = { type: "number", default: 0 };
                    this._samplerDefines[defineName + "_GAMMA"] = { type: "boolean", default: false };
                }
                // Arg. Why do I have to add these references to get rid of the linting errors?
                this._baseWeight;
                this._baseWeightTexture;
                this._baseColor;
                this._baseColorTexture;
                this._baseDiffuseRoughness;
                this._baseDiffuseRoughnessTexture;
                this._baseMetalness;
                this._baseMetalnessTexture;
                this._specularWeight;
                this._specularWeightTexture;
                this._specularColor;
                this._specularColorTexture;
                this._specularRoughness;
                this._specularIor;
                this._specularRoughnessTexture;
                this._specularRoughnessAnisotropy;
                this._specularRoughnessAnisotropyTexture;
                this._transmissionWeight;
                this._transmissionWeightTexture;
                this._transmissionColor;
                this._transmissionColorTexture;
                this._transmissionDepth;
                this._transmissionDepthTexture;
                this._transmissionScatter;
                this._transmissionScatterTexture;
                this._transmissionScatterAnisotropy;
                this._transmissionDispersionScale;
                this._transmissionDispersionScaleTexture;
                this._transmissionDispersionAbbeNumber;
                this._subsurfaceWeight;
                this._subsurfaceWeightTexture;
                this._subsurfaceColor;
                this._subsurfaceColorTexture;
                this._subsurfaceRadius;
                this._subsurfaceRadiusScale;
                this._subsurfaceRadiusScaleTexture;
                this._subsurfaceScatterAnisotropy;
                this._coatWeight;
                this._coatWeightTexture;
                this._coatColor;
                this._coatColorTexture;
                this._coatRoughness;
                this._coatRoughnessTexture;
                this._coatRoughnessAnisotropy;
                this._coatRoughnessAnisotropyTexture;
                this._coatIor;
                this._coatDarkening;
                this._coatDarkeningTexture;
                this._fuzzWeight;
                this._fuzzWeightTexture;
                this._fuzzColor;
                this._fuzzColorTexture;
                this._fuzzRoughness;
                this._fuzzRoughnessTexture;
                this._geometryThinWalled;
                this._geometryNormalTexture;
                this._geometryTangent;
                this._geometryTangentTexture;
                this._geometryCoatNormalTexture;
                this._geometryCoatTangent;
                this._geometryCoatTangentTexture;
                this._geometryOpacity;
                this._geometryOpacityTexture;
                this._geometryThickness;
                this._geometryThicknessTexture;
                this._thinFilmWeight;
                this._thinFilmWeightTexture;
                this._thinFilmThickness;
                this._thinFilmThicknessMin;
                this._thinFilmThicknessTexture;
                this._thinFilmIor;
                this._emissionLuminance;
                this._emissionColor;
                this._emissionColorTexture;
                this._ambientOcclusionTexture;
            }
            /**
             * Gets a boolean indicating that current material needs to register RTT
             */
            get hasRenderTargetTextures() {
                if (MaterialFlags.ReflectionTextureEnabled && this._radianceTexture && this._radianceTexture.isRenderTarget) {
                    return true;
                }
                if (MaterialFlags.RefractionTextureEnabled && this._backgroundRefractionTexture && this._backgroundRefractionTexture.isRenderTarget) {
                    return true;
                }
                return this._cacheHasRenderTargetTextures;
            }
            /**
             * Can this material render to prepass
             */
            get isPrePassCapable() {
                return !this.disableDepthWrite;
            }
            /**
             * @returns the name of the material class.
             */
            getClassName() {
                return "OpenPBRMaterial";
            }
            get transparencyMode() {
                return this._transparencyMode;
            }
            set transparencyMode(value) {
                if (this._transparencyMode === value) {
                    return;
                }
                this._transparencyMode = value;
                this._markAllSubMeshesAsTexturesAndMiscDirty();
            }
            /**
             * @returns whether or not the alpha value of the albedo texture should be used for alpha blending.
             */
            _shouldUseAlphaFromBaseColorTexture() {
                return this._hasAlphaChannel() && this._transparencyMode !== Material.MATERIAL_OPAQUE && !this.geometryOpacityTexture;
            }
            /**
             * @returns whether or not there is a usable alpha channel for transparency.
             */
            _hasAlphaChannel() {
                return (this.baseColorTexture != null && this.baseColorTexture.hasAlpha && this._useAlphaFromBaseColorTexture) || this.geometryOpacityTexture != null;
            }
            /**
             * @returns true when the material needs alpha blending — i.e. when geometry_opacity < 1
             * or a geometry opacity texture is present.
             */
            needAlphaBlending() {
                return this.geometryOpacity < 1.0 || this.geometryOpacityTexture != null;
            }
            /**
             * Specifies if the mesh will require alpha blending.
             * Overridden to check geometry_opacity before the _hasTransparencyMode short-circuit in the
             * base class, which would otherwise always return false when _transparencyMode is MATERIAL_OPAQUE.
             * @param mesh The mesh to check
             * @returns true if alpha blending is needed for the mesh
             */
            needAlphaBlendingForMesh(mesh) {
                return this.geometryOpacity < 1.0 || this.geometryOpacityTexture != null || super.needAlphaBlendingForMesh(mesh);
            }
            /**
             * Makes a duplicate of the current material.
             * @param name - name to use for the new material.
             * @param cloneTexturesOnlyOnce - if a texture is used in more than one channel (e.g baseColor and opacity), only clone it once and reuse it on the other channels. Default false.
             * @param rootUrl defines the root URL to use to load textures
             * @returns cloned material instance
             */
            clone(name, cloneTexturesOnlyOnce = true, rootUrl = "") {
                const clone = SerializationHelper.Clone(() => new _a(name, this.getScene()), this, { cloneTexturesOnlyOnce });
                clone.id = name;
                clone.name = name;
                this.stencil.copyTo(clone.stencil);
                this._clonePlugins(clone, rootUrl);
                return clone;
            }
            /**
             * Serializes this PBR Material.
             * @returns - An object with the serialized material.
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.customType = "BABYLON.OpenPBRMaterial";
                return serializationObject;
            }
            // Statics
            /**
             * Parses a PBR Material from a serialized object.
             * @param source - Serialized object.
             * @param scene - BJS scene instance.
             * @param rootUrl - url for the scene object
             * @returns - OpenPBRMaterial
             */
            static Parse(source, scene, rootUrl) {
                const material = SerializationHelper.Parse(() => new _a(source.name, scene), source, scene, rootUrl);
                if (source.stencil) {
                    material.stencil.parse(source.stencil, scene, rootUrl);
                }
                Material._ParsePlugins(source, material, scene, rootUrl);
                return material;
            }
            /**
             * Force shader compilation
             * @param mesh - Define the mesh we want to force the compilation for
             * @param onCompiled - Define a callback triggered when the compilation completes
             * @param options - Define the options used to create the compilation
             */
            forceCompilation(mesh, onCompiled, options) {
                const localOptions = {
                    clipPlane: false,
                    useInstances: false,
                    ...options,
                };
                if (!this._uniformBufferLayoutBuilt) {
                    this.buildUniformLayout();
                }
                this._callbackPluginEventGeneric(4 /* MaterialPluginEvent.GetDefineNames */, this._eventInfo);
                const checkReady = () => {
                    if (this._breakShaderLoadedCheck) {
                        return;
                    }
                    const defines = new OpenPBRMaterialDefines({
                        ...(this._eventInfo.defineNames || {}),
                        ...(this._samplerDefines || {}),
                    });
                    const effect = this._prepareEffect(mesh, mesh, defines, undefined, undefined, localOptions.useInstances, localOptions.clipPlane);
                    if (this._onEffectCreatedObservable) {
                        onCreatedEffectParameters.effect = effect;
                        onCreatedEffectParameters.subMesh = null;
                        this._onEffectCreatedObservable.notifyObservers(onCreatedEffectParameters);
                    }
                    if (effect.isReady()) {
                        if (onCompiled) {
                            onCompiled(this);
                        }
                    }
                    else {
                        effect.onCompileObservable.add(() => {
                            if (onCompiled) {
                                onCompiled(this);
                            }
                        });
                    }
                };
                checkReady();
            }
            /**
             * Specifies that the submesh is ready to be used.
             * @param mesh - BJS mesh.
             * @param subMesh - A submesh of the BJS mesh.  Used to check if it is ready.
             * @param useInstances - Specifies that instances should be used.
             * @returns - boolean indicating that the submesh is ready or not.
             */
            isReadyForSubMesh(mesh, subMesh, useInstances) {
                if (!this._uniformBufferLayoutBuilt) {
                    this.buildUniformLayout();
                }
                const drawWrapper = subMesh._drawWrapper;
                if (drawWrapper.effect && this.isFrozen) {
                    if (drawWrapper._wasPreviouslyReady && drawWrapper._wasPreviouslyUsingInstances === useInstances) {
                        return true;
                    }
                }
                if (!subMesh.materialDefines) {
                    this._callbackPluginEventGeneric(4 /* MaterialPluginEvent.GetDefineNames */, this._eventInfo);
                    subMesh.materialDefines = new OpenPBRMaterialDefines({
                        ...(this._eventInfo.defineNames || {}),
                        ...(this._samplerDefines || {}),
                    });
                }
                const defines = subMesh.materialDefines;
                if (this._isReadyForSubMesh(subMesh)) {
                    return true;
                }
                const scene = this.getScene();
                const engine = scene.getEngine();
                if (defines._areTexturesDirty) {
                    this._eventInfo.hasRenderTargetTextures = false;
                    this._callbackPluginEventHasRenderTargetTextures(this._eventInfo);
                    this._cacheHasRenderTargetTextures = this._eventInfo.hasRenderTargetTextures;
                    if (scene.texturesEnabled) {
                        // Loop through samplers, check MaterialFlag and whether the texture is ready or not.
                        for (const key in this._samplersList) {
                            const sampler = this._samplersList[key];
                            if (sampler.value) {
                                if (!sampler.value.isReadyOrNotBlocking()) {
                                    return false;
                                }
                            }
                        }
                        const radianceTexture = this._getRadianceTexture();
                        if (radianceTexture && MaterialFlags.ReflectionTextureEnabled) {
                            if (!radianceTexture.isReadyOrNotBlocking()) {
                                return false;
                            }
                            if (radianceTexture.irradianceTexture) {
                                if (!radianceTexture.irradianceTexture.isReadyOrNotBlocking()) {
                                    return false;
                                }
                            }
                            else {
                                // Not ready until spherical are ready too.
                                if (!radianceTexture.sphericalPolynomial && radianceTexture.getInternalTexture()?._sphericalPolynomialPromise) {
                                    return false;
                                }
                            }
                        }
                        if (this._environmentBRDFTexture && MaterialFlags.ReflectionTextureEnabled) {
                            // This is blocking.
                            if (!this._environmentBRDFTexture.isReady()) {
                                return false;
                            }
                        }
                        if (this._environmentFuzzBRDFTexture && MaterialFlags.ReflectionTextureEnabled) {
                            // This is blocking.
                            if (!this._environmentFuzzBRDFTexture.isReady()) {
                                return false;
                            }
                        }
                        if (this._backgroundRefractionTexture && MaterialFlags.RefractionTextureEnabled) {
                            if (!this._backgroundRefractionTexture.isReadyOrNotBlocking()) {
                                return false;
                            }
                        }
                        if (_a._noiseTextures[scene.uniqueId]) {
                            if (!_a._noiseTextures[scene.uniqueId].isReady()) {
                                return false;
                            }
                        }
                        // When both SSS textures are assigned they will be used for screen-space subsurface
                        // scattering. Block readiness until both underlying textures are loaded so that
                        // scene.onReadyObservable never fires with missing SSS data.
                        if (this._sssIrradianceTexture && this._sssDepthTexture) {
                            if (!this._sssIrradianceTexture.isReady()) {
                                return false;
                            }
                            if (!this._sssDepthTexture.isReady()) {
                                return false;
                            }
                        }
                    }
                }
                this._eventInfo.isReadyForSubMesh = true;
                this._eventInfo.defines = defines;
                this._eventInfo.subMesh = subMesh;
                this._callbackPluginEventIsReadyForSubMesh(this._eventInfo);
                if (!this._eventInfo.isReadyForSubMesh) {
                    return false;
                }
                if (defines._areImageProcessingDirty && this._imageProcessingConfiguration) {
                    if (!this._imageProcessingConfiguration.isReady()) {
                        return false;
                    }
                }
                // Check if Area Lights have LTC texture.
                if (defines["AREALIGHTUSED"]) {
                    for (let index = 0; index < mesh.lightSources.length; index++) {
                        if (!mesh.lightSources[index]._isReady()) {
                            return false;
                        }
                    }
                }
                if (!engine.getCaps().standardDerivatives && !mesh.isVerticesDataPresent(VertexBuffer.NormalKind)) {
                    mesh.createNormals(true);
                    Logger.Warn("OpenPBRMaterial: Normals have been created for the mesh: " + mesh.name);
                }
                if (!AreLightsTexturesReady(scene, mesh, this._maxSimultaneousLights, this._disableLighting)) {
                    return false;
                }
                const previousEffect = subMesh.effect;
                const lightDisposed = defines._areLightsDisposed;
                const effect = this._prepareEffect(mesh, subMesh.getRenderingMesh(), defines, this.onCompiled, this.onError, useInstances, null);
                let forceWasNotReadyPreviously = false;
                if (effect) {
                    if (this._onEffectCreatedObservable) {
                        onCreatedEffectParameters.effect = effect;
                        onCreatedEffectParameters.subMesh = subMesh;
                        this._onEffectCreatedObservable.notifyObservers(onCreatedEffectParameters);
                    }
                    // Use previous effect while new one is compiling
                    if (this.allowShaderHotSwapping && previousEffect && !effect.isReady()) {
                        defines.markAsUnprocessed();
                        forceWasNotReadyPreviously = this.isFrozen;
                        if (lightDisposed) {
                            // re register in case it takes more than one frame.
                            defines._areLightsDisposed = true;
                            return false;
                        }
                    }
                    else {
                        scene.resetCachedMaterial();
                        subMesh.setEffect(effect, defines, this._materialContext);
                    }
                }
                if (!subMesh.effect || !subMesh.effect.isReady()) {
                    return false;
                }
                defines._renderId = scene.getRenderId();
                drawWrapper._wasPreviouslyReady = forceWasNotReadyPreviously ? false : true;
                drawWrapper._wasPreviouslyUsingInstances = !!useInstances;
                this._checkScenePerformancePriority();
                return true;
            }
            /**
             * Initializes the uniform buffer layout for the shader.
             */
            buildUniformLayout() {
                // Order is important !
                const ubo = this._uniformBuffer;
                ubo.addUniform("vTangentSpaceParams", 2);
                ubo.addUniform("vLightingIntensity", 4);
                ubo.addUniform("pointSize", 1);
                ubo.addUniform("vDebugMode", 2);
                ubo.addUniform("renderTargetSize", 2);
                ubo.addUniform("cameraInfo", 4);
                ubo.addUniform("vTextureRepetitionHexTilingParams", 4);
                ubo.addUniform("backgroundRefractionMatrix", 16);
                ubo.addUniform("vBackgroundRefractionInfos", 3);
                PrepareUniformLayoutForIBL(ubo, true, true, true, true, true);
                Object.values(this._uniformsList).forEach((uniform) => {
                    ubo.addUniform(uniform.name, uniform.numComponents);
                });
                Object.values(this._samplersList).forEach((sampler) => {
                    ubo.addUniform(sampler.samplerInfoName, 2);
                    ubo.addUniform(sampler.samplerMatrixName, 16);
                });
                super.buildUniformLayout();
            }
            /**
             * Binds the material data (this function is called even if mustRebind() returns false)
             * @param uniformBuffer defines the Uniform buffer to fill in.
             * @param scene defines the scene the material belongs to.
             * @param engine defines the engine the material belongs to.
             * @param subMesh the submesh to bind data for
             */
            bindPropertiesForSubMesh(uniformBuffer, scene, engine, subMesh) {
                // If min/max thickness is 0, avoid decomposing to determine the scaled thickness (it's always zero).
                if (this.geometryThickness === 0.0) {
                    uniformBuffer.updateFloat("vGeometryThickness", 0);
                }
                else {
                    subMesh.getRenderingMesh().getWorldMatrix().decompose(TmpVectors.Vector3[0]);
                    const thicknessScale = Math.max(Math.abs(TmpVectors.Vector3[0].x), Math.abs(TmpVectors.Vector3[0].y), Math.abs(TmpVectors.Vector3[0].z));
                    uniformBuffer.updateFloat("vGeometryThickness", this.geometryThickness * thicknessScale);
                }
            }
            /**
             * Binds the submesh data.
             * @param world - The world matrix.
             * @param mesh - The BJS mesh.
             * @param subMesh - A submesh of the BJS mesh.
             */
            bindForSubMesh(world, mesh, subMesh) {
                const scene = this.getScene();
                const defines = subMesh.materialDefines;
                if (!defines) {
                    return;
                }
                const effect = subMesh.effect;
                if (!effect) {
                    return;
                }
                this._activeEffect = effect;
                // Matrices Mesh.
                mesh.getMeshUniformBuffer().bindToEffect(effect, "Mesh");
                mesh.transferToEffect(world);
                const engine = scene.getEngine();
                // Binding unconditionally
                this._uniformBuffer.bindToEffect(effect, "Material");
                this.prePassConfiguration.bindForSubMesh(this._activeEffect, scene, mesh, world, this.isFrozen);
                MaterialHelperGeometryRendering.Bind(engine.currentRenderPassId, this._activeEffect, mesh, world, this);
                const camera = scene.activeCamera;
                if (camera) {
                    this._uniformBuffer.updateFloat4("cameraInfo", camera.minZ, camera.maxZ, 0, 0);
                }
                else {
                    this._uniformBuffer.updateFloat4("cameraInfo", 0, 0, 0, 0);
                }
                const hexParams = this.textureRepetitionHexTilingParams;
                this._uniformBuffer.updateFloat4("vTextureRepetitionHexTilingParams", hexParams[0], hexParams[1], hexParams[2], hexParams[3]);
                this._eventInfo.subMesh = subMesh;
                this._callbackPluginEventHardBindForSubMesh(this._eventInfo);
                // Normal Matrix
                if (defines.OBJECTSPACE_NORMALMAP) {
                    world.toNormalMatrix(this._normalMatrix);
                    this.bindOnlyNormalMatrix(this._normalMatrix);
                }
                const mustRebind = this._mustRebind(scene, effect, subMesh, mesh.visibility);
                const needToAlwaysBindUniformBuffers = engine._features.needToAlwaysBindUniformBuffers;
                // Bones
                BindBonesParameters(mesh, this._activeEffect, this.prePassConfiguration);
                // Vertex pulling
                if (this._vertexPullingMetadata) {
                    BindVertexPullingUniforms(this._activeEffect, this._vertexPullingMetadata);
                }
                const ubo = this._uniformBuffer;
                if (mustRebind) {
                    this.bindViewProjection(effect);
                    const radianceTexture = this._getRadianceTexture();
                    if (!ubo.useUbo || !this.isFrozen || !ubo.isSync || subMesh._drawWrapper._forceRebindOnNextCall) {
                        // Texture uniforms
                        if (scene.texturesEnabled) {
                            // Loop through samplers and bind info and matrix for each texture.
                            for (const key in this._samplersList) {
                                const sampler = this._samplersList[key];
                                if (sampler.value) {
                                    ubo.updateFloat2(sampler.samplerInfoName, sampler.value.coordinatesIndex, sampler.value.level);
                                    BindTextureMatrix(sampler.value, ubo, sampler.samplerPrefix);
                                }
                            }
                            if (this.geometryNormalTexture || this.geometryCoatNormalTexture) {
                                if (scene._mirroredCameraPosition) {
                                    ubo.updateFloat2("vTangentSpaceParams", this._invertNormalMapX ? 1.0 : -1.0, this._invertNormalMapY ? 1.0 : -1.0);
                                }
                                else {
                                    ubo.updateFloat2("vTangentSpaceParams", this._invertNormalMapX ? -1.0 : 1.0, this._invertNormalMapY ? -1.0 : 1.0);
                                }
                            }
                            BindIBLParameters(scene, defines, ubo, Color3.White(), radianceTexture, this.realTimeFiltering, true, true, true, true, true);
                        }
                        // Point size
                        if (this.pointsCloud) {
                            ubo.updateFloat("pointSize", this.pointSize);
                        }
                        const uniformsArray = this._uniformsArray;
                        for (let i = 0, len = uniformsArray.length; i < len; i++) {
                            const uniform = uniformsArray[i];
                            // Skip uniforms whose define is currently inactive. The shader only
                            // reads them inside the same #ifdef block, so the UBO bytes can stay
                            // stale. The full update will happen on the next bind once the
                            // define becomes active again.
                            if (uniform.requiredDefine !== undefined && !defines[uniform.requiredDefine]) {
                                continue;
                            }
                            // If the property actually defines a uniform, update it.
                            if (uniform.numComponents === 4) {
                                uniform.populateVectorFromLinkedProperties(TmpVectors.Vector4[0]);
                                ubo.updateVector4(uniform.name, TmpVectors.Vector4[0]);
                            }
                            else if (uniform.numComponents === 3) {
                                uniform.populateVectorFromLinkedProperties(TmpVectors.Vector3[0]);
                                ubo.updateVector3(uniform.name, TmpVectors.Vector3[0]);
                            }
                            else if (uniform.numComponents === 2) {
                                uniform.populateVectorFromLinkedProperties(TmpVectors.Vector2[0]);
                                ubo.updateFloat2(uniform.name, TmpVectors.Vector2[0].x, TmpVectors.Vector2[0].y);
                            }
                            else if (uniform.numComponents === 1) {
                                ubo.updateFloat(uniform.name, uniform.linkedProperties[uniform.firstLinkedKey].value);
                            }
                        }
                        // Misc
                        this._lightingInfos.x = this.directIntensity;
                        this._lightingInfos.y = this.emissionLuminance;
                        this._lightingInfos.z = this.environmentIntensity * scene.environmentIntensity;
                        this._lightingInfos.w = 1.0; // This is used to be _specularIntensity.
                        ubo.updateVector4("vLightingIntensity", this._lightingInfos);
                        ubo.updateFloat2("vDebugMode", this.debugLimit, this.debugFactor);
                    }
                    // Textures
                    if (scene.texturesEnabled) {
                        // Loop through samplers and set textures
                        for (const key in this._samplersList) {
                            const sampler = this._samplersList[key];
                            if (sampler.value) {
                                ubo.setTexture(sampler.samplerName, sampler.value);
                            }
                        }
                        BindIBLSamplers(scene, defines, ubo, radianceTexture, this.realTimeFiltering);
                        if (defines.ENVIRONMENTBRDF) {
                            ubo.setTexture("environmentBrdfSampler", this._environmentBRDFTexture);
                        }
                        if (defines.FUZZENVIRONMENTBRDF) {
                            ubo.setTexture("environmentFuzzBrdfSampler", this._environmentFuzzBRDFTexture);
                        }
                        if (defines.REFRACTED_BACKGROUND) {
                            ubo.setTexture("backgroundRefractionSampler", this._backgroundRefractionTexture);
                            ubo.updateMatrix("backgroundRefractionMatrix", this._backgroundRefractionTexture.getReflectionTextureMatrix());
                            TmpVectors.Vector3[1].set(Math.log2(this._backgroundRefractionTexture.getSize().width), 0, 0);
                            ubo.updateVector3("vBackgroundRefractionInfos", TmpVectors.Vector3[1]);
                        }
                        if (defines.ANISOTROPIC || defines.FUZZ || defines.REFRACTED_BACKGROUND || defines.USE_IRRADIANCE_TEXTURE_FOR_SCATTERING) {
                            ubo.setTexture("blueNoiseSampler", _a._noiseTextures[this.getScene().uniqueId]);
                        }
                        if (defines.USE_IRRADIANCE_TEXTURE_FOR_SCATTERING) {
                            if (this.sssIrradianceTexture && this.sssDepthTexture) {
                                const renderTargetWidth = this.sssIrradianceTexture.getSize().width;
                                const renderTargetHeight = this.sssIrradianceTexture.getSize().height;
                                ubo.setTexture("sceneIrradianceSampler", this.sssIrradianceTexture);
                                ubo.setTexture("sceneDepthSampler", this.sssDepthTexture);
                                ubo.updateFloat2("renderTargetSize", renderTargetWidth, renderTargetHeight);
                            }
                        }
                    }
                    // OIT with depth peeling
                    if (this.getScene().useOrderIndependentTransparency && this.needAlphaBlendingForMesh(mesh)) {
                        this.getScene().depthPeelingRenderer.bind(effect);
                    }
                    this._eventInfo.subMesh = subMesh;
                    this._callbackPluginEventBindForSubMesh(this._eventInfo);
                    // Clip plane
                    BindClipPlane(this._activeEffect, this, scene);
                    this.bindEyePosition(effect);
                }
                else if (needToAlwaysBindUniformBuffers) {
                    this._needToBindSceneUbo = true;
                }
                this.bindPropertiesForSubMesh(this._uniformBuffer, scene, scene.getEngine(), subMesh);
                // Lights
                if ((mustRebind || !this.isFrozen || needToAlwaysBindUniformBuffers) && scene.lightsEnabled && !this._disableLighting) {
                    BindLights(scene, mesh, this._activeEffect, defines, this._maxSimultaneousLights);
                }
                if (mustRebind || !this.isFrozen) {
                    // View
                    this.bindView(effect);
                    // Fog
                    BindFogParameters(scene, mesh, this._activeEffect, true);
                    // Morph targets
                    if (defines.NUM_MORPH_INFLUENCERS) {
                        BindMorphTargetParameters(mesh, this._activeEffect);
                    }
                    if (defines.BAKED_VERTEX_ANIMATION_TEXTURE) {
                        mesh.bakedVertexAnimationManager?.bind(effect, defines.INSTANCES);
                    }
                    // image processing
                    this._imageProcessingConfiguration.bind(this._activeEffect);
                    // Log. depth
                    BindLogDepth(defines, this._activeEffect, scene);
                }
                this._afterBind(mesh, this._activeEffect, subMesh);
                ubo.update();
            }
            /**
             * Returns the animatable textures.
             * If material have animatable metallic texture, then reflectivity texture will not be returned, even if it has animations.
             * @returns - Array of animatable textures.
             */
            getAnimatables() {
                const results = super.getAnimatables();
                // Loop through samplers and push animated textures to list.
                for (const key in this._samplersList) {
                    const sampler = this._samplersList[key];
                    if (sampler.value && sampler.value.animations && sampler.value.animations.length > 0) {
                        results.push(sampler.value);
                    }
                }
                if (this._radianceTexture && this._radianceTexture.animations && this._radianceTexture.animations.length > 0) {
                    results.push(this._radianceTexture);
                }
                return results;
            }
            /**
             * Returns an array of the actively used textures.
             * @returns - Array of BaseTextures
             */
            getActiveTextures() {
                const activeTextures = super.getActiveTextures();
                // Loop through samplers and push active textures
                for (const key in this._samplersList) {
                    const sampler = this._samplersList[key];
                    if (sampler.value) {
                        activeTextures.push(sampler.value);
                    }
                }
                if (this._radianceTexture) {
                    activeTextures.push(this._radianceTexture);
                }
                return activeTextures;
            }
            /**
             * Checks to see if a texture is used in the material.
             * @param texture - Base texture to use.
             * @returns - Boolean specifying if a texture is used in the material.
             */
            hasTexture(texture) {
                if (super.hasTexture(texture)) {
                    return true;
                }
                // Loop through samplers and check each texture for equality
                for (const key in this._samplersList) {
                    const sampler = this._samplersList[key];
                    if (sampler.value === texture) {
                        return true;
                    }
                }
                if (this._radianceTexture === texture) {
                    return true;
                }
                return false;
            }
            /**
             * Sets the required values to the prepass renderer.
             * It can't be sets when subsurface scattering of this material is disabled.
             * When scene have ability to enable subsurface prepass effect, it will enable.
             * @returns - If prepass is enabled or not.
             */
            setPrePassRenderer() {
                return false;
            }
            /**
             * Disposes the resources of the material.
             * @param forceDisposeEffect - Forces the disposal of effects.
             * @param forceDisposeTextures - Forces the disposal of all textures.
             */
            dispose(forceDisposeEffect, forceDisposeTextures) {
                this._breakShaderLoadedCheck = true;
                if (forceDisposeTextures) {
                    if (this._environmentBRDFTexture && this.getScene().openPBREnvironmentBRDFTexture !== this._environmentBRDFTexture) {
                        this._environmentBRDFTexture.dispose();
                    }
                    if (this._environmentFuzzBRDFTexture && this.getScene().environmentFuzzBRDFTexture !== this._environmentFuzzBRDFTexture) {
                        this._environmentFuzzBRDFTexture.dispose();
                    }
                    // The refraction texture will be cleaned up by the transmission helper.
                    this._backgroundRefractionTexture = null;
                    // Loop through samplers and dispose the textures
                    for (const key in this._samplersList) {
                        const sampler = this._samplersList[key];
                        sampler.value?.dispose();
                    }
                    this._radianceTexture?.dispose();
                }
                this._renderTargets.dispose();
                if (this._imageProcessingConfiguration && this._imageProcessingObserver) {
                    this._imageProcessingConfiguration.onUpdateParameters.remove(this._imageProcessingObserver);
                }
                super.dispose(forceDisposeEffect, forceDisposeTextures);
            }
            /**
             * Returns the texture used for reflections.
             * @returns - Reflection texture if present.  Otherwise, returns the environment texture.
             */
            _getRadianceTexture() {
                if (this._radianceTexture) {
                    return this._radianceTexture;
                }
                return this.getScene().environmentTexture;
            }
            _prepareEffect(mesh, renderingMesh, defines, onCompiled = null, onError = null, useInstances = null, useClipPlane = null) {
                this._prepareDefines(mesh, renderingMesh, defines, useInstances, useClipPlane);
                if (!defines.isDirty) {
                    return null;
                }
                defines.markAsProcessed();
                const scene = this.getScene();
                const engine = scene.getEngine();
                // Fallbacks
                const fallbacks = new EffectFallbacks();
                let fallbackRank = 0;
                if (defines.USESPHERICALINVERTEX) {
                    fallbacks.addFallback(fallbackRank++, "USESPHERICALINVERTEX");
                }
                if (defines.FOG) {
                    fallbacks.addFallback(fallbackRank, "FOG");
                }
                if (defines.SPECULARAA) {
                    fallbacks.addFallback(fallbackRank, "SPECULARAA");
                }
                if (defines.POINTSIZE) {
                    fallbacks.addFallback(fallbackRank, "POINTSIZE");
                }
                if (defines.LOGARITHMICDEPTH) {
                    fallbacks.addFallback(fallbackRank, "LOGARITHMICDEPTH");
                }
                if (defines.PARALLAX) {
                    fallbacks.addFallback(fallbackRank, "PARALLAX");
                }
                if (defines.PARALLAX_RHS) {
                    fallbacks.addFallback(fallbackRank, "PARALLAX_RHS");
                }
                if (defines.PARALLAXOCCLUSION) {
                    fallbacks.addFallback(fallbackRank++, "PARALLAXOCCLUSION");
                }
                if (defines.ENVIRONMENTBRDF) {
                    fallbacks.addFallback(fallbackRank++, "ENVIRONMENTBRDF");
                }
                if (defines.TANGENT) {
                    fallbacks.addFallback(fallbackRank++, "TANGENT");
                }
                fallbackRank = HandleFallbacksForShadows(defines, fallbacks, this._maxSimultaneousLights, fallbackRank);
                if (defines.SPECULARTERM) {
                    fallbacks.addFallback(fallbackRank++, "SPECULARTERM");
                }
                if (defines.USESPHERICALFROMREFLECTIONMAP) {
                    fallbacks.addFallback(fallbackRank++, "USESPHERICALFROMREFLECTIONMAP");
                }
                if (defines.USEIRRADIANCEMAP) {
                    fallbacks.addFallback(fallbackRank++, "USEIRRADIANCEMAP");
                }
                if (defines.NORMAL) {
                    fallbacks.addFallback(fallbackRank++, "NORMAL");
                }
                if (defines.VERTEXCOLOR) {
                    fallbacks.addFallback(fallbackRank++, "VERTEXCOLOR");
                }
                if (defines.MORPHTARGETS) {
                    fallbacks.addFallback(fallbackRank++, "MORPHTARGETS");
                }
                if (defines.MULTIVIEW) {
                    fallbacks.addFallback(0, "MULTIVIEW");
                }
                //Attributes
                const attribs = [VertexBuffer.PositionKind];
                if (defines.NORMAL) {
                    attribs.push(VertexBuffer.NormalKind);
                }
                if (defines.TANGENT) {
                    attribs.push(VertexBuffer.TangentKind);
                }
                for (let i = 1; i <= 6; ++i) {
                    if (defines["UV" + i]) {
                        attribs.push(`uv${i === 1 ? "" : i}`);
                    }
                }
                if (defines.VERTEXCOLOR) {
                    attribs.push(VertexBuffer.ColorKind);
                }
                PrepareAttributesForBones(attribs, mesh, defines, fallbacks);
                PrepareAttributesForInstances(attribs, defines);
                PrepareAttributesForMorphTargets(attribs, mesh, defines);
                PrepareAttributesForBakedVertexAnimation(attribs, mesh, defines);
                let shaderName = "openpbr";
                const uniforms = [
                    "world",
                    "view",
                    "viewProjection",
                    "projection",
                    "vEyePosition",
                    "inverseProjection",
                    "renderTargetSize",
                    "vLightsType",
                    "visibility",
                    "vFogInfos",
                    "vFogColor",
                    "pointSize",
                    "mBones",
                    "normalMatrix",
                    "vLightingIntensity",
                    "logarithmicDepthConstant",
                    "vTangentSpaceParams",
                    "boneTextureInfo",
                    "vDebugMode",
                    "morphTargetTextureInfo",
                    "morphTargetTextureIndices",
                    "cameraInfo",
                    "vTextureRepetitionHexTilingParams",
                    "backgroundRefractionMatrix",
                    "vBackgroundRefractionInfos",
                ];
                for (const uniformName in this._uniformsList) {
                    uniforms.push(uniformName);
                }
                const samplers = ["environmentBrdfSampler", "boneSampler", "morphTargets", "oitDepthSampler", "oitFrontColorSampler", "areaLightsLTC1Sampler", "areaLightsLTC2Sampler"];
                if (defines.FUZZENVIRONMENTBRDF) {
                    samplers.push("environmentFuzzBrdfSampler");
                }
                if (defines.REFRACTED_BACKGROUND) {
                    samplers.push("backgroundRefractionSampler");
                }
                if (defines.ANISOTROPIC || defines.FUZZ || defines.REFRACTED_BACKGROUND || defines.USE_IRRADIANCE_TEXTURE_FOR_SCATTERING) {
                    samplers.push("blueNoiseSampler");
                }
                if (defines.USE_IRRADIANCE_TEXTURE_FOR_SCATTERING) {
                    samplers.push("sceneIrradianceSampler");
                    samplers.push("sceneDepthSampler");
                }
                for (const key in this._samplersList) {
                    const sampler = this._samplersList[key];
                    samplers.push(sampler.samplerName);
                    // Push uniforms for texture infos and matrix
                    uniforms.push(sampler.samplerInfoName);
                    uniforms.push(sampler.samplerMatrixName);
                }
                PrepareUniformsAndSamplersForIBL(uniforms, samplers, true);
                const uniformBuffers = ["Material", "Scene", "Mesh"];
                const indexParameters = { maxSimultaneousLights: this._maxSimultaneousLights, maxSimultaneousMorphTargets: defines.NUM_MORPH_INFLUENCERS };
                this._eventInfo.fallbacks = fallbacks;
                this._eventInfo.fallbackRank = fallbackRank;
                this._eventInfo.defines = defines;
                this._eventInfo.uniforms = uniforms;
                this._eventInfo.attributes = attribs;
                this._eventInfo.samplers = samplers;
                this._eventInfo.uniformBuffersNames = uniformBuffers;
                this._eventInfo.customCode = undefined;
                this._eventInfo.mesh = mesh;
                this._eventInfo.indexParameters = indexParameters;
                this._callbackPluginEventGeneric(128 /* MaterialPluginEvent.PrepareEffect */, this._eventInfo);
                MaterialHelperGeometryRendering.AddUniformsAndSamplers(uniforms, samplers);
                PrePassConfiguration.AddUniforms(uniforms);
                PrePassConfiguration.AddSamplers(samplers);
                AddClipPlaneUniforms(uniforms);
                // Vertex pulling metadata uniforms
                if (this._useVertexPulling) {
                    const geometry = renderingMesh?.geometry;
                    if (geometry) {
                        this._vertexPullingMetadata = PrepareVertexPullingUniforms(geometry);
                        if (this._vertexPullingMetadata) {
                            this._vertexPullingMetadata.forEach((_, attribute) => {
                                uniforms.push(`vp_${attribute}_info`);
                            });
                        }
                    }
                }
                else {
                    this._vertexPullingMetadata = null;
                }
                if (ImageProcessingConfiguration) {
                    ImageProcessingConfiguration.PrepareUniforms(uniforms, defines);
                    ImageProcessingConfiguration.PrepareSamplers(samplers, defines);
                }
                PrepareUniformsAndSamplersList({
                    uniformsNames: uniforms,
                    uniformBuffersNames: uniformBuffers,
                    samplers: samplers,
                    defines: defines,
                    maxSimultaneousLights: this._maxSimultaneousLights,
                    shaderLanguage: this._shaderLanguage,
                });
                const csnrOptions = {};
                if (this.customShaderNameResolve) {
                    shaderName = this.customShaderNameResolve(shaderName, uniforms, uniformBuffers, samplers, defines, attribs, csnrOptions);
                }
                const join = defines.toString();
                const effect = engine.createEffect(shaderName, {
                    attributes: attribs,
                    uniformsNames: uniforms,
                    uniformBuffersNames: uniformBuffers,
                    samplers: samplers,
                    defines: join,
                    fallbacks: fallbacks,
                    onCompiled: onCompiled,
                    onError: onError,
                    indexParameters,
                    processFinalCode: csnrOptions.processFinalCode,
                    processCodeAfterIncludes: this._eventInfo.customCode,
                    multiTarget: defines.PREPASS,
                    shaderLanguage: this._shaderLanguage,
                    extraInitializationsAsync: _a._ShaderLoader.getLoadCallback(this._shaderLanguage),
                }, engine);
                this._eventInfo.customCode = undefined;
                return effect;
            }
            _prepareDefines(mesh, renderingMesh, defines, useInstances = null, useClipPlane = null) {
                const useThinInstances = renderingMesh.hasThinInstances;
                const scene = this.getScene();
                const engine = scene.getEngine();
                // Lights
                PrepareDefinesForLights(scene, mesh, defines, true, this._maxSimultaneousLights, this._disableLighting);
                defines._needNormals = true;
                // Multiview
                PrepareDefinesForMultiview(scene, defines);
                // PrePass
                const oit = this.needAlphaBlendingForMesh(mesh) && this.getScene().useOrderIndependentTransparency;
                PrepareDefinesForPrePass(scene, defines, this.canRenderToMRT && !oit);
                // Order independant transparency
                PrepareDefinesForOIT(scene, defines, oit);
                MaterialHelperGeometryRendering.PrepareDefines(engine.currentRenderPassId, mesh, defines);
                // Textures
                if (defines._areTexturesDirty) {
                    defines._needUVs = false;
                    for (let i = 1; i <= 6; ++i) {
                        defines["MAINUV" + i] = false;
                    }
                    if (scene.texturesEnabled) {
                        // Loop through samplers and prepare defines for each texture
                        for (const key in this._samplersList) {
                            const sampler = this._samplersList[key];
                            if (sampler.value) {
                                PrepareDefinesForMergedUV(sampler.value, defines, sampler.textureDefine);
                                defines[sampler.textureDefine + "_GAMMA"] = sampler.value.gammaSpace;
                            }
                            else {
                                defines[sampler.textureDefine] = false;
                            }
                        }
                        const radianceTexture = this._getRadianceTexture();
                        const useSHInFragment = this._forceIrradianceInFragment ||
                            this.realTimeFiltering ||
                            this._twoSidedLighting ||
                            engine.getCaps().maxVaryingVectors <= 8 ||
                            this._baseDiffuseRoughnessTexture != null;
                        PrepareDefinesForIBL(scene, radianceTexture, defines, this.realTimeFiltering, this.realTimeFilteringQuality, !useSHInFragment);
                        if (this._baseMetalnessTexture) {
                            defines.AOSTOREINMETALMAPRED = this._useAmbientOcclusionFromMetallicTextureRed;
                        }
                        defines.SPECULAR_WEIGHT_IN_ALPHA = this._useSpecularWeightFromAlpha;
                        defines.SPECULAR_WEIGHT_FROM_SPECULAR_COLOR_TEXTURE = this._useSpecularWeightFromSpecularColorTexture;
                        defines.SPECULAR_ROUGHNESS_ANISOTROPY_FROM_TANGENT_TEXTURE = this._useSpecularRoughnessAnisotropyFromTangentTexture;
                        defines.COAT_ROUGHNESS_ANISOTROPY_FROM_TANGENT_TEXTURE = this._useCoatRoughnessAnisotropyFromTangentTexture;
                        defines.COAT_ROUGHNESS_FROM_GREEN_CHANNEL = this._useCoatRoughnessFromGreenChannel;
                        defines.SPECULAR_ROUGHNESS_FROM_METALNESS_TEXTURE_GREEN = this._useRoughnessFromMetallicTextureGreen;
                        defines.FUZZ_ROUGHNESS_FROM_TEXTURE_ALPHA = this._useFuzzRoughnessFromTextureAlpha;
                        defines.SUBSURFACE_WEIGHT_FROM_TEXTURE_ALPHA = this._useSubsurfaceWeightFromTextureAlpha;
                        defines.BASE_METALNESS_FROM_METALNESS_TEXTURE_BLUE = this._useMetallicFromMetallicTextureBlue;
                        defines.THIN_FILM_THICKNESS_FROM_THIN_FILM_TEXTURE = this._useThinFilmThicknessFromTextureGreen;
                        defines.GEOMETRY_THICKNESS_FROM_GREEN_CHANNEL = this._useGeometryThicknessFromGreenChannel;
                        if (this.geometryNormalTexture) {
                            if (this._useParallax && this.baseColorTexture && MaterialFlags.DiffuseTextureEnabled) {
                                defines.PARALLAX = true;
                                defines.PARALLAX_RHS = scene.useRightHandedSystem;
                                defines.PARALLAXOCCLUSION = !!this._useParallaxOcclusion;
                            }
                            else {
                                defines.PARALLAX = false;
                            }
                            defines.OBJECTSPACE_NORMALMAP = this._useObjectSpaceNormalMap;
                        }
                        else {
                            defines.PARALLAX = false;
                            defines.PARALLAX_RHS = false;
                            defines.PARALLAXOCCLUSION = false;
                            defines.OBJECTSPACE_NORMALMAP = false;
                        }
                        if (this._environmentBRDFTexture && MaterialFlags.ReflectionTextureEnabled) {
                            defines.ENVIRONMENTBRDF = true;
                            defines.ENVIRONMENTBRDF_RGBD = this._environmentBRDFTexture.isRGBD;
                        }
                        else {
                            defines.ENVIRONMENTBRDF = false;
                            defines.ENVIRONMENTBRDF_RGBD = false;
                        }
                        if (this._environmentFuzzBRDFTexture) {
                            defines.FUZZENVIRONMENTBRDF = true;
                        }
                        else {
                            defines.FUZZENVIRONMENTBRDF = false;
                        }
                        if (this.hasTransparency) {
                            defines.REFRACTED_BACKGROUND = !!this._backgroundRefractionTexture && MaterialFlags.RefractionTextureEnabled;
                            defines.REFRACTION_HIGH_QUALITY_BLUR = this._refractionHighQualityBlur;
                            defines.REFRACTED_LIGHTS = true;
                            const radianceTexture = this._getRadianceTexture();
                            if (radianceTexture) {
                                defines.REFRACTED_ENVIRONMENT = MaterialFlags.RefractionTextureEnabled;
                                defines.REFRACTED_ENVIRONMENT_OPPOSITEZ = this.getScene().useRightHandedSystem ? !radianceTexture.invertZ : radianceTexture.invertZ;
                                defines.REFRACTED_ENVIRONMENT_LOCAL_CUBE = radianceTexture.isCube && radianceTexture.boundingBoxSize;
                            }
                            else {
                                defines.REFRACTED_ENVIRONMENT = false;
                            }
                        }
                        else {
                            defines.REFRACTED_BACKGROUND = false;
                            defines.REFRACTED_LIGHTS = false;
                            defines.REFRACTED_ENVIRONMENT = false;
                        }
                        if (this._shouldUseAlphaFromBaseColorTexture()) {
                            defines.ALPHA_FROM_BASE_COLOR_TEXTURE = true;
                        }
                        else {
                            defines.ALPHA_FROM_BASE_COLOR_TEXTURE = false;
                        }
                    }
                    if (this._lightFalloff === Material.LIGHTFALLOFF_STANDARD) {
                        defines.USEPHYSICALLIGHTFALLOFF = false;
                        defines.USEGLTFLIGHTFALLOFF = false;
                    }
                    else if (this._lightFalloff === Material.LIGHTFALLOFF_GLTF) {
                        defines.USEPHYSICALLIGHTFALLOFF = false;
                        defines.USEGLTFLIGHTFALLOFF = true;
                    }
                    else {
                        defines.USEPHYSICALLIGHTFALLOFF = true;
                        defines.USEGLTFLIGHTFALLOFF = false;
                    }
                    if (!this.backFaceCulling && this._twoSidedLighting) {
                        defines.TWOSIDEDLIGHTING = true;
                    }
                    else {
                        defines.TWOSIDEDLIGHTING = false;
                    }
                    // We need it to not invert normals in two sided lighting mode (based on the winding of the face)
                    defines.MIRRORED = !!scene._mirroredCameraPosition;
                    defines.SPECULARAA = engine.getCaps().standardDerivatives && this._enableSpecularAntiAliasing;
                }
                if (defines._areTexturesDirty || defines._areMiscDirty) {
                    defines.ALPHATESTVALUE = `${this._alphaCutOff}${this._alphaCutOff % 1 === 0 ? "." : ""}`;
                    defines.PREMULTIPLYALPHA = this.alphaMode === 7 || this.alphaMode === 8;
                    defines.ALPHABLEND = this.needAlphaBlendingForMesh(mesh);
                }
                if (defines._areTexturesDirty) {
                    defines.TEXTURE_REPETITION_MODE = engine.version > 1 || engine.isWebGPU ? this.textureRepetitionMode : 0;
                }
                if (defines._areImageProcessingDirty && this._imageProcessingConfiguration) {
                    this._imageProcessingConfiguration.prepareDefines(defines);
                }
                defines.FORCENORMALFORWARD = this._forceNormalForward;
                defines.RADIANCEOCCLUSION = this._useRadianceOcclusion;
                defines.HORIZONOCCLUSION = this._useHorizonOcclusion;
                if ((this.specularRoughnessAnisotropy > 0.0 || this.coatRoughnessAnisotropy > 0.0) &&
                    _a._noiseTextures[scene.uniqueId] &&
                    MaterialFlags.ReflectionTextureEnabled) {
                    // ANISOTROPIC is used to include common shader functions needed for anisotropy
                    // ANISOTROPIC_BASE is used to process anisotropy for the base layer
                    // ANISOTROPIC_COAT is used to process anisotropy for the coat layer
                    defines.ANISOTROPIC = true;
                    if (!mesh.isVerticesDataPresent(VertexBuffer.TangentKind)) {
                        defines._needUVs = true;
                        defines.MAINUV1 = true;
                    }
                    if (this._useGltfStyleAnisotropy) {
                        defines.USE_GLTF_STYLE_ANISOTROPY = true;
                    }
                    defines.ANISOTROPIC_BASE = this.specularRoughnessAnisotropy > 0.0;
                    defines.ANISOTROPIC_COAT = this.coatRoughnessAnisotropy > 0.0;
                }
                else {
                    defines.ANISOTROPIC = false;
                    defines.USE_GLTF_STYLE_ANISOTROPY = false;
                    defines.ANISOTROPIC_BASE = false;
                    defines.ANISOTROPIC_COAT = false;
                }
                defines.THIN_FILM = this.thinFilmWeight > 0.0;
                defines.IRIDESCENCE = this.thinFilmWeight > 0.0;
                defines.DISPERSION = this.transmissionDispersionScale > 0.0;
                defines.SCATTERING = this.hasScattering;
                const _sssSampleCounts = [8, 16, 32];
                defines.SSS_SAMPLE_COUNT = _sssSampleCounts[this._sssQuality] ?? 16;
                defines.TRANSMISSION_SLAB = this.transmissionWeight > 0;
                defines.TRANSMISSION_SLAB_VOLUME = this.transmissionWeight > 0 && this.transmissionDepth > 0;
                defines.SUBSURFACE_SLAB = this.subsurfaceWeight > 0;
                // Determine whether we should use the prepass irradiance texture for scattering.
                // If this IS a prepass, we don't want to use the irradiance texture as it won't be available yet.
                if (!defines.PREPASS && (defines.SUBSURFACE_SLAB || defines.TRANSMISSION_SLAB_VOLUME)) {
                    let usingGBuffer = false;
                    if (!this.sssIrradianceTexture && scene.geometryBufferRenderer) {
                        const irradianceTextureIndex = scene.geometryBufferRenderer.getTextureIndex(GeometryBufferRenderer.IRRADIANCE_TEXTURE_TYPE);
                        this.sssIrradianceTexture = scene.geometryBufferRenderer.getGBuffer().textures[irradianceTextureIndex];
                        usingGBuffer = true;
                    }
                    if (!this.sssDepthTexture && scene.geometryBufferRenderer) {
                        const depthIndex = scene.geometryBufferRenderer.getTextureIndex(GeometryBufferRenderer.SCREENSPACE_DEPTH_TEXTURE_TYPE);
                        this.sssDepthTexture = scene.geometryBufferRenderer.getGBuffer().textures[depthIndex];
                        usingGBuffer = true;
                    }
                    if (this.sssIrradianceTexture && this.sssDepthTexture) {
                        defines.USE_IRRADIANCE_TEXTURE_FOR_SCATTERING = true;
                        if (usingGBuffer) {
                            defines.USE_IRRADIANCE_TEXTURE_FOR_SCATTERING_GBUFFER = true;
                        }
                    }
                }
                defines.FUZZ = this.fuzzWeight > 0 && MaterialFlags.ReflectionTextureEnabled;
                defines.GEOMETRY_THIN_WALLED = this.geometryThinWalled != 0;
                if (defines.FUZZ) {
                    if (!mesh.isVerticesDataPresent(VertexBuffer.TangentKind)) {
                        defines._needUVs = true;
                        defines.MAINUV1 = true;
                    }
                    this._environmentFuzzBRDFTexture = GetEnvironmentFuzzBRDFTexture(this.getScene());
                    defines.FUZZ_IBL_SAMPLES = this.fuzzSampleNumber;
                }
                else {
                    this._environmentFuzzBRDFTexture = null;
                    defines.FUZZENVIRONMENTBRDF = false;
                    defines.FUZZ_IBL_SAMPLES = 0;
                }
                // Misc.
                if (defines._areMiscDirty) {
                    PrepareDefinesForMisc(mesh, scene, this._useLogarithmicDepth, this.pointsCloud, this.fogEnabled, this.needAlphaTestingForMesh(mesh), defines, this._applyDecalMapAfterDetailMap, this._useVertexPulling, renderingMesh, this._isVertexOutputInvariant);
                    defines.UNLIT = this._unlit || ((this.pointsCloud || this.wireframe) && !mesh.isVerticesDataPresent(VertexBuffer.NormalKind));
                    defines.DEBUGMODE = this._debugMode;
                }
                // Values that need to be evaluated on every frame
                PrepareDefinesForFrameBoundValues(scene, engine, this, defines, useInstances ? true : false, useClipPlane, useThinInstances);
                // External config
                this._eventInfo.defines = defines;
                this._eventInfo.mesh = mesh;
                this._callbackPluginEventPrepareDefinesBeforeAttributes(this._eventInfo);
                // Attribs
                PrepareDefinesForAttributes(mesh, defines, true, true, true, this._transparencyMode !== Material.MATERIAL_OPAQUE);
                // External config
                this._callbackPluginEventPrepareDefines(this._eventInfo);
            }
        },
        _OpenPBRMaterial_baseWeight_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_baseWeightTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_baseColor_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_baseColorTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_baseDiffuseRoughness_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_baseDiffuseRoughnessTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_baseMetalness_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_baseMetalnessTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_specularWeight_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_specularWeightTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_specularColor_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_specularColorTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_specularRoughness_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_specularRoughnessTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_specularRoughnessAnisotropy_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_specularRoughnessAnisotropyTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_specularIor_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_transmissionWeight_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_transmissionWeightTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_transmissionColor_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_transmissionColorTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_transmissionDepth_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_transmissionDepthTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_transmissionScatter_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_transmissionScatterTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_transmissionScatterAnisotropy_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_transmissionDispersionScale_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_transmissionDispersionScaleTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_transmissionDispersionAbbeNumber_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_subsurfaceWeight_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_subsurfaceWeightTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_subsurfaceColor_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_subsurfaceColorTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_subsurfaceRadius_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_subsurfaceRadiusScale_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_subsurfaceRadiusScaleTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_subsurfaceScatterAnisotropy_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_coatWeight_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_coatWeightTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_coatColor_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_coatColorTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_coatRoughness_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_coatRoughnessTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_coatRoughnessAnisotropy_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_coatRoughnessAnisotropyTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_coatIor_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_coatDarkening_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_coatDarkeningTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_fuzzWeight_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_fuzzWeightTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_fuzzColor_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_fuzzColorTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_fuzzRoughness_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_fuzzRoughnessTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_geometryThinWalled_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_geometryNormalTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_geometryTangent_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_geometryTangentTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_geometryCoatNormalTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_geometryCoatTangent_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_geometryCoatTangentTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_geometryOpacity_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_geometryOpacityTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_geometryThickness_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_geometryThicknessTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_emissionLuminance_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_emissionColor_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_emissionColorTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_thinFilmWeight_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_thinFilmWeightTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_thinFilmThickness_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_thinFilmThicknessMin_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_thinFilmThicknessTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_thinFilmIor_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_ambientOcclusionTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_directIntensity_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_environmentIntensity_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_useSpecularWeightFromTextureAlpha_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_forceAlphaTest_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_alphaCutOff_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_useAmbientOcclusionFromMetallicTextureRed_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_useAmbientInGrayScale_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_useObjectSpaceNormalMap_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_useParallax_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_useParallaxOcclusion_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_parallaxScaleBias_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_disableLighting_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_forceIrradianceInFragment_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_maxSimultaneousLights_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_invertNormalMapX_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_invertNormalMapY_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_twoSidedLighting_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_useAlphaFresnel_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_useLinearAlphaFresnel_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_environmentBRDFTexture_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_forceNormalForward_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_enableSpecularAntiAliasing_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_useHorizonOcclusion_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_useRadianceOcclusion_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_unlit_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_applyDecalMapAfterDetailMap_accessor_storage = new WeakMap(),
        _OpenPBRMaterial_debugMode_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _baseWeight_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _baseWeightTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _baseColor_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _baseColorTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _baseDiffuseRoughness_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _baseDiffuseRoughnessTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _baseMetalness_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _baseMetalnessTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _specularWeight_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _specularWeightTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _specularColor_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _specularColorTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _specularRoughness_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _specularRoughnessTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _specularRoughnessAnisotropy_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _specularRoughnessAnisotropyTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _specularIor_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _transmissionWeight_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _transmissionWeightTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _transmissionColor_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _transmissionColorTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _transmissionDepth_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _transmissionDepthTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _transmissionScatter_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _transmissionScatterTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _transmissionScatterAnisotropy_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _transmissionDispersionScale_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _transmissionDispersionScaleTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _transmissionDispersionAbbeNumber_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _subsurfaceWeight_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _subsurfaceWeightTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _subsurfaceColor_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _subsurfaceColorTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _subsurfaceRadius_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _subsurfaceRadiusScale_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _subsurfaceRadiusScaleTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _subsurfaceScatterAnisotropy_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _coatWeight_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _coatWeightTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _coatColor_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _coatColorTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _coatRoughness_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _coatRoughnessTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _coatRoughnessAnisotropy_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _coatRoughnessAnisotropyTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _coatIor_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _coatDarkening_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _coatDarkeningTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _fuzzWeight_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _fuzzWeightTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _fuzzColor_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _fuzzColorTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _fuzzRoughness_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _fuzzRoughnessTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _geometryThinWalled_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _geometryNormalTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _geometryTangent_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _geometryTangentTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _geometryCoatNormalTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _geometryCoatTangent_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _geometryCoatTangentTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _geometryOpacity_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _geometryOpacityTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _geometryThickness_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _geometryThicknessTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _emissionLuminance_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _emissionColor_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _emissionColorTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _thinFilmWeight_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _thinFilmWeightTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _thinFilmThickness_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _thinFilmThicknessMin_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _thinFilmThicknessTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _thinFilmIor_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _ambientOcclusionTexture_decorators = [addAccessorsForMaterialProperty("_markAllSubMeshesAsTexturesDirty")];
            _directIntensity_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _environmentIntensity_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _useSpecularWeightFromTextureAlpha_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _forceAlphaTest_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesAndMiscDirty")];
            _alphaCutOff_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesAndMiscDirty")];
            _useAmbientOcclusionFromMetallicTextureRed_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _useAmbientInGrayScale_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _get_usePhysicalLightFalloff_decorators = [serialize()];
            _get_useGLTFLightFalloff_decorators = [serialize()];
            _useObjectSpaceNormalMap_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _useParallax_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _useParallaxOcclusion_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _parallaxScaleBias_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _disableLighting_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsLightsDirty")];
            _forceIrradianceInFragment_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _maxSimultaneousLights_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsLightsDirty")];
            _invertNormalMapX_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _invertNormalMapY_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _twoSidedLighting_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _useAlphaFresnel_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _useLinearAlphaFresnel_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _environmentBRDFTexture_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _forceNormalForward_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _enableSpecularAntiAliasing_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _useHorizonOcclusion_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _useRadianceOcclusion_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _unlit_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsMiscDirty")];
            _applyDecalMapAfterDetailMap_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsMiscDirty")];
            _debugMode_decorators = [expandToProperty("_markAllSubMeshesAsMiscDirty")];
            _get_transparencyMode_decorators = [serialize()];
            __esDecorate(_a, null, _baseWeight_decorators, { kind: "accessor", name: "baseWeight", static: false, private: false, access: { has: obj => "baseWeight" in obj, get: obj => obj.baseWeight, set: (obj, value) => { obj.baseWeight = value; } }, metadata: _metadata }, _baseWeight_initializers, _baseWeight_extraInitializers);
            __esDecorate(_a, null, _baseWeightTexture_decorators, { kind: "accessor", name: "baseWeightTexture", static: false, private: false, access: { has: obj => "baseWeightTexture" in obj, get: obj => obj.baseWeightTexture, set: (obj, value) => { obj.baseWeightTexture = value; } }, metadata: _metadata }, _baseWeightTexture_initializers, _baseWeightTexture_extraInitializers);
            __esDecorate(_a, null, _baseColor_decorators, { kind: "accessor", name: "baseColor", static: false, private: false, access: { has: obj => "baseColor" in obj, get: obj => obj.baseColor, set: (obj, value) => { obj.baseColor = value; } }, metadata: _metadata }, _baseColor_initializers, _baseColor_extraInitializers);
            __esDecorate(_a, null, _baseColorTexture_decorators, { kind: "accessor", name: "baseColorTexture", static: false, private: false, access: { has: obj => "baseColorTexture" in obj, get: obj => obj.baseColorTexture, set: (obj, value) => { obj.baseColorTexture = value; } }, metadata: _metadata }, _baseColorTexture_initializers, _baseColorTexture_extraInitializers);
            __esDecorate(_a, null, _baseDiffuseRoughness_decorators, { kind: "accessor", name: "baseDiffuseRoughness", static: false, private: false, access: { has: obj => "baseDiffuseRoughness" in obj, get: obj => obj.baseDiffuseRoughness, set: (obj, value) => { obj.baseDiffuseRoughness = value; } }, metadata: _metadata }, _baseDiffuseRoughness_initializers, _baseDiffuseRoughness_extraInitializers);
            __esDecorate(_a, null, _baseDiffuseRoughnessTexture_decorators, { kind: "accessor", name: "baseDiffuseRoughnessTexture", static: false, private: false, access: { has: obj => "baseDiffuseRoughnessTexture" in obj, get: obj => obj.baseDiffuseRoughnessTexture, set: (obj, value) => { obj.baseDiffuseRoughnessTexture = value; } }, metadata: _metadata }, _baseDiffuseRoughnessTexture_initializers, _baseDiffuseRoughnessTexture_extraInitializers);
            __esDecorate(_a, null, _baseMetalness_decorators, { kind: "accessor", name: "baseMetalness", static: false, private: false, access: { has: obj => "baseMetalness" in obj, get: obj => obj.baseMetalness, set: (obj, value) => { obj.baseMetalness = value; } }, metadata: _metadata }, _baseMetalness_initializers, _baseMetalness_extraInitializers);
            __esDecorate(_a, null, _baseMetalnessTexture_decorators, { kind: "accessor", name: "baseMetalnessTexture", static: false, private: false, access: { has: obj => "baseMetalnessTexture" in obj, get: obj => obj.baseMetalnessTexture, set: (obj, value) => { obj.baseMetalnessTexture = value; } }, metadata: _metadata }, _baseMetalnessTexture_initializers, _baseMetalnessTexture_extraInitializers);
            __esDecorate(_a, null, _specularWeight_decorators, { kind: "accessor", name: "specularWeight", static: false, private: false, access: { has: obj => "specularWeight" in obj, get: obj => obj.specularWeight, set: (obj, value) => { obj.specularWeight = value; } }, metadata: _metadata }, _specularWeight_initializers, _specularWeight_extraInitializers);
            __esDecorate(_a, null, _specularWeightTexture_decorators, { kind: "accessor", name: "specularWeightTexture", static: false, private: false, access: { has: obj => "specularWeightTexture" in obj, get: obj => obj.specularWeightTexture, set: (obj, value) => { obj.specularWeightTexture = value; } }, metadata: _metadata }, _specularWeightTexture_initializers, _specularWeightTexture_extraInitializers);
            __esDecorate(_a, null, _specularColor_decorators, { kind: "accessor", name: "specularColor", static: false, private: false, access: { has: obj => "specularColor" in obj, get: obj => obj.specularColor, set: (obj, value) => { obj.specularColor = value; } }, metadata: _metadata }, _specularColor_initializers, _specularColor_extraInitializers);
            __esDecorate(_a, null, _specularColorTexture_decorators, { kind: "accessor", name: "specularColorTexture", static: false, private: false, access: { has: obj => "specularColorTexture" in obj, get: obj => obj.specularColorTexture, set: (obj, value) => { obj.specularColorTexture = value; } }, metadata: _metadata }, _specularColorTexture_initializers, _specularColorTexture_extraInitializers);
            __esDecorate(_a, null, _specularRoughness_decorators, { kind: "accessor", name: "specularRoughness", static: false, private: false, access: { has: obj => "specularRoughness" in obj, get: obj => obj.specularRoughness, set: (obj, value) => { obj.specularRoughness = value; } }, metadata: _metadata }, _specularRoughness_initializers, _specularRoughness_extraInitializers);
            __esDecorate(_a, null, _specularRoughnessTexture_decorators, { kind: "accessor", name: "specularRoughnessTexture", static: false, private: false, access: { has: obj => "specularRoughnessTexture" in obj, get: obj => obj.specularRoughnessTexture, set: (obj, value) => { obj.specularRoughnessTexture = value; } }, metadata: _metadata }, _specularRoughnessTexture_initializers, _specularRoughnessTexture_extraInitializers);
            __esDecorate(_a, null, _specularRoughnessAnisotropy_decorators, { kind: "accessor", name: "specularRoughnessAnisotropy", static: false, private: false, access: { has: obj => "specularRoughnessAnisotropy" in obj, get: obj => obj.specularRoughnessAnisotropy, set: (obj, value) => { obj.specularRoughnessAnisotropy = value; } }, metadata: _metadata }, _specularRoughnessAnisotropy_initializers, _specularRoughnessAnisotropy_extraInitializers);
            __esDecorate(_a, null, _specularRoughnessAnisotropyTexture_decorators, { kind: "accessor", name: "specularRoughnessAnisotropyTexture", static: false, private: false, access: { has: obj => "specularRoughnessAnisotropyTexture" in obj, get: obj => obj.specularRoughnessAnisotropyTexture, set: (obj, value) => { obj.specularRoughnessAnisotropyTexture = value; } }, metadata: _metadata }, _specularRoughnessAnisotropyTexture_initializers, _specularRoughnessAnisotropyTexture_extraInitializers);
            __esDecorate(_a, null, _specularIor_decorators, { kind: "accessor", name: "specularIor", static: false, private: false, access: { has: obj => "specularIor" in obj, get: obj => obj.specularIor, set: (obj, value) => { obj.specularIor = value; } }, metadata: _metadata }, _specularIor_initializers, _specularIor_extraInitializers);
            __esDecorate(_a, null, _transmissionWeight_decorators, { kind: "accessor", name: "transmissionWeight", static: false, private: false, access: { has: obj => "transmissionWeight" in obj, get: obj => obj.transmissionWeight, set: (obj, value) => { obj.transmissionWeight = value; } }, metadata: _metadata }, _transmissionWeight_initializers, _transmissionWeight_extraInitializers);
            __esDecorate(_a, null, _transmissionWeightTexture_decorators, { kind: "accessor", name: "transmissionWeightTexture", static: false, private: false, access: { has: obj => "transmissionWeightTexture" in obj, get: obj => obj.transmissionWeightTexture, set: (obj, value) => { obj.transmissionWeightTexture = value; } }, metadata: _metadata }, _transmissionWeightTexture_initializers, _transmissionWeightTexture_extraInitializers);
            __esDecorate(_a, null, _transmissionColor_decorators, { kind: "accessor", name: "transmissionColor", static: false, private: false, access: { has: obj => "transmissionColor" in obj, get: obj => obj.transmissionColor, set: (obj, value) => { obj.transmissionColor = value; } }, metadata: _metadata }, _transmissionColor_initializers, _transmissionColor_extraInitializers);
            __esDecorate(_a, null, _transmissionColorTexture_decorators, { kind: "accessor", name: "transmissionColorTexture", static: false, private: false, access: { has: obj => "transmissionColorTexture" in obj, get: obj => obj.transmissionColorTexture, set: (obj, value) => { obj.transmissionColorTexture = value; } }, metadata: _metadata }, _transmissionColorTexture_initializers, _transmissionColorTexture_extraInitializers);
            __esDecorate(_a, null, _transmissionDepth_decorators, { kind: "accessor", name: "transmissionDepth", static: false, private: false, access: { has: obj => "transmissionDepth" in obj, get: obj => obj.transmissionDepth, set: (obj, value) => { obj.transmissionDepth = value; } }, metadata: _metadata }, _transmissionDepth_initializers, _transmissionDepth_extraInitializers);
            __esDecorate(_a, null, _transmissionDepthTexture_decorators, { kind: "accessor", name: "transmissionDepthTexture", static: false, private: false, access: { has: obj => "transmissionDepthTexture" in obj, get: obj => obj.transmissionDepthTexture, set: (obj, value) => { obj.transmissionDepthTexture = value; } }, metadata: _metadata }, _transmissionDepthTexture_initializers, _transmissionDepthTexture_extraInitializers);
            __esDecorate(_a, null, _transmissionScatter_decorators, { kind: "accessor", name: "transmissionScatter", static: false, private: false, access: { has: obj => "transmissionScatter" in obj, get: obj => obj.transmissionScatter, set: (obj, value) => { obj.transmissionScatter = value; } }, metadata: _metadata }, _transmissionScatter_initializers, _transmissionScatter_extraInitializers);
            __esDecorate(_a, null, _transmissionScatterTexture_decorators, { kind: "accessor", name: "transmissionScatterTexture", static: false, private: false, access: { has: obj => "transmissionScatterTexture" in obj, get: obj => obj.transmissionScatterTexture, set: (obj, value) => { obj.transmissionScatterTexture = value; } }, metadata: _metadata }, _transmissionScatterTexture_initializers, _transmissionScatterTexture_extraInitializers);
            __esDecorate(_a, null, _transmissionScatterAnisotropy_decorators, { kind: "accessor", name: "transmissionScatterAnisotropy", static: false, private: false, access: { has: obj => "transmissionScatterAnisotropy" in obj, get: obj => obj.transmissionScatterAnisotropy, set: (obj, value) => { obj.transmissionScatterAnisotropy = value; } }, metadata: _metadata }, _transmissionScatterAnisotropy_initializers, _transmissionScatterAnisotropy_extraInitializers);
            __esDecorate(_a, null, _transmissionDispersionScale_decorators, { kind: "accessor", name: "transmissionDispersionScale", static: false, private: false, access: { has: obj => "transmissionDispersionScale" in obj, get: obj => obj.transmissionDispersionScale, set: (obj, value) => { obj.transmissionDispersionScale = value; } }, metadata: _metadata }, _transmissionDispersionScale_initializers, _transmissionDispersionScale_extraInitializers);
            __esDecorate(_a, null, _transmissionDispersionScaleTexture_decorators, { kind: "accessor", name: "transmissionDispersionScaleTexture", static: false, private: false, access: { has: obj => "transmissionDispersionScaleTexture" in obj, get: obj => obj.transmissionDispersionScaleTexture, set: (obj, value) => { obj.transmissionDispersionScaleTexture = value; } }, metadata: _metadata }, _transmissionDispersionScaleTexture_initializers, _transmissionDispersionScaleTexture_extraInitializers);
            __esDecorate(_a, null, _transmissionDispersionAbbeNumber_decorators, { kind: "accessor", name: "transmissionDispersionAbbeNumber", static: false, private: false, access: { has: obj => "transmissionDispersionAbbeNumber" in obj, get: obj => obj.transmissionDispersionAbbeNumber, set: (obj, value) => { obj.transmissionDispersionAbbeNumber = value; } }, metadata: _metadata }, _transmissionDispersionAbbeNumber_initializers, _transmissionDispersionAbbeNumber_extraInitializers);
            __esDecorate(_a, null, _subsurfaceWeight_decorators, { kind: "accessor", name: "subsurfaceWeight", static: false, private: false, access: { has: obj => "subsurfaceWeight" in obj, get: obj => obj.subsurfaceWeight, set: (obj, value) => { obj.subsurfaceWeight = value; } }, metadata: _metadata }, _subsurfaceWeight_initializers, _subsurfaceWeight_extraInitializers);
            __esDecorate(_a, null, _subsurfaceWeightTexture_decorators, { kind: "accessor", name: "subsurfaceWeightTexture", static: false, private: false, access: { has: obj => "subsurfaceWeightTexture" in obj, get: obj => obj.subsurfaceWeightTexture, set: (obj, value) => { obj.subsurfaceWeightTexture = value; } }, metadata: _metadata }, _subsurfaceWeightTexture_initializers, _subsurfaceWeightTexture_extraInitializers);
            __esDecorate(_a, null, _subsurfaceColor_decorators, { kind: "accessor", name: "subsurfaceColor", static: false, private: false, access: { has: obj => "subsurfaceColor" in obj, get: obj => obj.subsurfaceColor, set: (obj, value) => { obj.subsurfaceColor = value; } }, metadata: _metadata }, _subsurfaceColor_initializers, _subsurfaceColor_extraInitializers);
            __esDecorate(_a, null, _subsurfaceColorTexture_decorators, { kind: "accessor", name: "subsurfaceColorTexture", static: false, private: false, access: { has: obj => "subsurfaceColorTexture" in obj, get: obj => obj.subsurfaceColorTexture, set: (obj, value) => { obj.subsurfaceColorTexture = value; } }, metadata: _metadata }, _subsurfaceColorTexture_initializers, _subsurfaceColorTexture_extraInitializers);
            __esDecorate(_a, null, _subsurfaceRadius_decorators, { kind: "accessor", name: "subsurfaceRadius", static: false, private: false, access: { has: obj => "subsurfaceRadius" in obj, get: obj => obj.subsurfaceRadius, set: (obj, value) => { obj.subsurfaceRadius = value; } }, metadata: _metadata }, _subsurfaceRadius_initializers, _subsurfaceRadius_extraInitializers);
            __esDecorate(_a, null, _subsurfaceRadiusScale_decorators, { kind: "accessor", name: "subsurfaceRadiusScale", static: false, private: false, access: { has: obj => "subsurfaceRadiusScale" in obj, get: obj => obj.subsurfaceRadiusScale, set: (obj, value) => { obj.subsurfaceRadiusScale = value; } }, metadata: _metadata }, _subsurfaceRadiusScale_initializers, _subsurfaceRadiusScale_extraInitializers);
            __esDecorate(_a, null, _subsurfaceRadiusScaleTexture_decorators, { kind: "accessor", name: "subsurfaceRadiusScaleTexture", static: false, private: false, access: { has: obj => "subsurfaceRadiusScaleTexture" in obj, get: obj => obj.subsurfaceRadiusScaleTexture, set: (obj, value) => { obj.subsurfaceRadiusScaleTexture = value; } }, metadata: _metadata }, _subsurfaceRadiusScaleTexture_initializers, _subsurfaceRadiusScaleTexture_extraInitializers);
            __esDecorate(_a, null, _subsurfaceScatterAnisotropy_decorators, { kind: "accessor", name: "subsurfaceScatterAnisotropy", static: false, private: false, access: { has: obj => "subsurfaceScatterAnisotropy" in obj, get: obj => obj.subsurfaceScatterAnisotropy, set: (obj, value) => { obj.subsurfaceScatterAnisotropy = value; } }, metadata: _metadata }, _subsurfaceScatterAnisotropy_initializers, _subsurfaceScatterAnisotropy_extraInitializers);
            __esDecorate(_a, null, _coatWeight_decorators, { kind: "accessor", name: "coatWeight", static: false, private: false, access: { has: obj => "coatWeight" in obj, get: obj => obj.coatWeight, set: (obj, value) => { obj.coatWeight = value; } }, metadata: _metadata }, _coatWeight_initializers, _coatWeight_extraInitializers);
            __esDecorate(_a, null, _coatWeightTexture_decorators, { kind: "accessor", name: "coatWeightTexture", static: false, private: false, access: { has: obj => "coatWeightTexture" in obj, get: obj => obj.coatWeightTexture, set: (obj, value) => { obj.coatWeightTexture = value; } }, metadata: _metadata }, _coatWeightTexture_initializers, _coatWeightTexture_extraInitializers);
            __esDecorate(_a, null, _coatColor_decorators, { kind: "accessor", name: "coatColor", static: false, private: false, access: { has: obj => "coatColor" in obj, get: obj => obj.coatColor, set: (obj, value) => { obj.coatColor = value; } }, metadata: _metadata }, _coatColor_initializers, _coatColor_extraInitializers);
            __esDecorate(_a, null, _coatColorTexture_decorators, { kind: "accessor", name: "coatColorTexture", static: false, private: false, access: { has: obj => "coatColorTexture" in obj, get: obj => obj.coatColorTexture, set: (obj, value) => { obj.coatColorTexture = value; } }, metadata: _metadata }, _coatColorTexture_initializers, _coatColorTexture_extraInitializers);
            __esDecorate(_a, null, _coatRoughness_decorators, { kind: "accessor", name: "coatRoughness", static: false, private: false, access: { has: obj => "coatRoughness" in obj, get: obj => obj.coatRoughness, set: (obj, value) => { obj.coatRoughness = value; } }, metadata: _metadata }, _coatRoughness_initializers, _coatRoughness_extraInitializers);
            __esDecorate(_a, null, _coatRoughnessTexture_decorators, { kind: "accessor", name: "coatRoughnessTexture", static: false, private: false, access: { has: obj => "coatRoughnessTexture" in obj, get: obj => obj.coatRoughnessTexture, set: (obj, value) => { obj.coatRoughnessTexture = value; } }, metadata: _metadata }, _coatRoughnessTexture_initializers, _coatRoughnessTexture_extraInitializers);
            __esDecorate(_a, null, _coatRoughnessAnisotropy_decorators, { kind: "accessor", name: "coatRoughnessAnisotropy", static: false, private: false, access: { has: obj => "coatRoughnessAnisotropy" in obj, get: obj => obj.coatRoughnessAnisotropy, set: (obj, value) => { obj.coatRoughnessAnisotropy = value; } }, metadata: _metadata }, _coatRoughnessAnisotropy_initializers, _coatRoughnessAnisotropy_extraInitializers);
            __esDecorate(_a, null, _coatRoughnessAnisotropyTexture_decorators, { kind: "accessor", name: "coatRoughnessAnisotropyTexture", static: false, private: false, access: { has: obj => "coatRoughnessAnisotropyTexture" in obj, get: obj => obj.coatRoughnessAnisotropyTexture, set: (obj, value) => { obj.coatRoughnessAnisotropyTexture = value; } }, metadata: _metadata }, _coatRoughnessAnisotropyTexture_initializers, _coatRoughnessAnisotropyTexture_extraInitializers);
            __esDecorate(_a, null, _coatIor_decorators, { kind: "accessor", name: "coatIor", static: false, private: false, access: { has: obj => "coatIor" in obj, get: obj => obj.coatIor, set: (obj, value) => { obj.coatIor = value; } }, metadata: _metadata }, _coatIor_initializers, _coatIor_extraInitializers);
            __esDecorate(_a, null, _coatDarkening_decorators, { kind: "accessor", name: "coatDarkening", static: false, private: false, access: { has: obj => "coatDarkening" in obj, get: obj => obj.coatDarkening, set: (obj, value) => { obj.coatDarkening = value; } }, metadata: _metadata }, _coatDarkening_initializers, _coatDarkening_extraInitializers);
            __esDecorate(_a, null, _coatDarkeningTexture_decorators, { kind: "accessor", name: "coatDarkeningTexture", static: false, private: false, access: { has: obj => "coatDarkeningTexture" in obj, get: obj => obj.coatDarkeningTexture, set: (obj, value) => { obj.coatDarkeningTexture = value; } }, metadata: _metadata }, _coatDarkeningTexture_initializers, _coatDarkeningTexture_extraInitializers);
            __esDecorate(_a, null, _fuzzWeight_decorators, { kind: "accessor", name: "fuzzWeight", static: false, private: false, access: { has: obj => "fuzzWeight" in obj, get: obj => obj.fuzzWeight, set: (obj, value) => { obj.fuzzWeight = value; } }, metadata: _metadata }, _fuzzWeight_initializers, _fuzzWeight_extraInitializers);
            __esDecorate(_a, null, _fuzzWeightTexture_decorators, { kind: "accessor", name: "fuzzWeightTexture", static: false, private: false, access: { has: obj => "fuzzWeightTexture" in obj, get: obj => obj.fuzzWeightTexture, set: (obj, value) => { obj.fuzzWeightTexture = value; } }, metadata: _metadata }, _fuzzWeightTexture_initializers, _fuzzWeightTexture_extraInitializers);
            __esDecorate(_a, null, _fuzzColor_decorators, { kind: "accessor", name: "fuzzColor", static: false, private: false, access: { has: obj => "fuzzColor" in obj, get: obj => obj.fuzzColor, set: (obj, value) => { obj.fuzzColor = value; } }, metadata: _metadata }, _fuzzColor_initializers, _fuzzColor_extraInitializers);
            __esDecorate(_a, null, _fuzzColorTexture_decorators, { kind: "accessor", name: "fuzzColorTexture", static: false, private: false, access: { has: obj => "fuzzColorTexture" in obj, get: obj => obj.fuzzColorTexture, set: (obj, value) => { obj.fuzzColorTexture = value; } }, metadata: _metadata }, _fuzzColorTexture_initializers, _fuzzColorTexture_extraInitializers);
            __esDecorate(_a, null, _fuzzRoughness_decorators, { kind: "accessor", name: "fuzzRoughness", static: false, private: false, access: { has: obj => "fuzzRoughness" in obj, get: obj => obj.fuzzRoughness, set: (obj, value) => { obj.fuzzRoughness = value; } }, metadata: _metadata }, _fuzzRoughness_initializers, _fuzzRoughness_extraInitializers);
            __esDecorate(_a, null, _fuzzRoughnessTexture_decorators, { kind: "accessor", name: "fuzzRoughnessTexture", static: false, private: false, access: { has: obj => "fuzzRoughnessTexture" in obj, get: obj => obj.fuzzRoughnessTexture, set: (obj, value) => { obj.fuzzRoughnessTexture = value; } }, metadata: _metadata }, _fuzzRoughnessTexture_initializers, _fuzzRoughnessTexture_extraInitializers);
            __esDecorate(_a, null, _geometryThinWalled_decorators, { kind: "accessor", name: "geometryThinWalled", static: false, private: false, access: { has: obj => "geometryThinWalled" in obj, get: obj => obj.geometryThinWalled, set: (obj, value) => { obj.geometryThinWalled = value; } }, metadata: _metadata }, _geometryThinWalled_initializers, _geometryThinWalled_extraInitializers);
            __esDecorate(_a, null, _geometryNormalTexture_decorators, { kind: "accessor", name: "geometryNormalTexture", static: false, private: false, access: { has: obj => "geometryNormalTexture" in obj, get: obj => obj.geometryNormalTexture, set: (obj, value) => { obj.geometryNormalTexture = value; } }, metadata: _metadata }, _geometryNormalTexture_initializers, _geometryNormalTexture_extraInitializers);
            __esDecorate(_a, null, _geometryTangent_decorators, { kind: "accessor", name: "geometryTangent", static: false, private: false, access: { has: obj => "geometryTangent" in obj, get: obj => obj.geometryTangent, set: (obj, value) => { obj.geometryTangent = value; } }, metadata: _metadata }, _geometryTangent_initializers, _geometryTangent_extraInitializers);
            __esDecorate(_a, null, _geometryTangentTexture_decorators, { kind: "accessor", name: "geometryTangentTexture", static: false, private: false, access: { has: obj => "geometryTangentTexture" in obj, get: obj => obj.geometryTangentTexture, set: (obj, value) => { obj.geometryTangentTexture = value; } }, metadata: _metadata }, _geometryTangentTexture_initializers, _geometryTangentTexture_extraInitializers);
            __esDecorate(_a, null, _geometryCoatNormalTexture_decorators, { kind: "accessor", name: "geometryCoatNormalTexture", static: false, private: false, access: { has: obj => "geometryCoatNormalTexture" in obj, get: obj => obj.geometryCoatNormalTexture, set: (obj, value) => { obj.geometryCoatNormalTexture = value; } }, metadata: _metadata }, _geometryCoatNormalTexture_initializers, _geometryCoatNormalTexture_extraInitializers);
            __esDecorate(_a, null, _geometryCoatTangent_decorators, { kind: "accessor", name: "geometryCoatTangent", static: false, private: false, access: { has: obj => "geometryCoatTangent" in obj, get: obj => obj.geometryCoatTangent, set: (obj, value) => { obj.geometryCoatTangent = value; } }, metadata: _metadata }, _geometryCoatTangent_initializers, _geometryCoatTangent_extraInitializers);
            __esDecorate(_a, null, _geometryCoatTangentTexture_decorators, { kind: "accessor", name: "geometryCoatTangentTexture", static: false, private: false, access: { has: obj => "geometryCoatTangentTexture" in obj, get: obj => obj.geometryCoatTangentTexture, set: (obj, value) => { obj.geometryCoatTangentTexture = value; } }, metadata: _metadata }, _geometryCoatTangentTexture_initializers, _geometryCoatTangentTexture_extraInitializers);
            __esDecorate(_a, null, _geometryOpacity_decorators, { kind: "accessor", name: "geometryOpacity", static: false, private: false, access: { has: obj => "geometryOpacity" in obj, get: obj => obj.geometryOpacity, set: (obj, value) => { obj.geometryOpacity = value; } }, metadata: _metadata }, _geometryOpacity_initializers, _geometryOpacity_extraInitializers);
            __esDecorate(_a, null, _geometryOpacityTexture_decorators, { kind: "accessor", name: "geometryOpacityTexture", static: false, private: false, access: { has: obj => "geometryOpacityTexture" in obj, get: obj => obj.geometryOpacityTexture, set: (obj, value) => { obj.geometryOpacityTexture = value; } }, metadata: _metadata }, _geometryOpacityTexture_initializers, _geometryOpacityTexture_extraInitializers);
            __esDecorate(_a, null, _geometryThickness_decorators, { kind: "accessor", name: "geometryThickness", static: false, private: false, access: { has: obj => "geometryThickness" in obj, get: obj => obj.geometryThickness, set: (obj, value) => { obj.geometryThickness = value; } }, metadata: _metadata }, _geometryThickness_initializers, _geometryThickness_extraInitializers);
            __esDecorate(_a, null, _geometryThicknessTexture_decorators, { kind: "accessor", name: "geometryThicknessTexture", static: false, private: false, access: { has: obj => "geometryThicknessTexture" in obj, get: obj => obj.geometryThicknessTexture, set: (obj, value) => { obj.geometryThicknessTexture = value; } }, metadata: _metadata }, _geometryThicknessTexture_initializers, _geometryThicknessTexture_extraInitializers);
            __esDecorate(_a, null, _emissionLuminance_decorators, { kind: "accessor", name: "emissionLuminance", static: false, private: false, access: { has: obj => "emissionLuminance" in obj, get: obj => obj.emissionLuminance, set: (obj, value) => { obj.emissionLuminance = value; } }, metadata: _metadata }, _emissionLuminance_initializers, _emissionLuminance_extraInitializers);
            __esDecorate(_a, null, _emissionColor_decorators, { kind: "accessor", name: "emissionColor", static: false, private: false, access: { has: obj => "emissionColor" in obj, get: obj => obj.emissionColor, set: (obj, value) => { obj.emissionColor = value; } }, metadata: _metadata }, _emissionColor_initializers, _emissionColor_extraInitializers);
            __esDecorate(_a, null, _emissionColorTexture_decorators, { kind: "accessor", name: "emissionColorTexture", static: false, private: false, access: { has: obj => "emissionColorTexture" in obj, get: obj => obj.emissionColorTexture, set: (obj, value) => { obj.emissionColorTexture = value; } }, metadata: _metadata }, _emissionColorTexture_initializers, _emissionColorTexture_extraInitializers);
            __esDecorate(_a, null, _thinFilmWeight_decorators, { kind: "accessor", name: "thinFilmWeight", static: false, private: false, access: { has: obj => "thinFilmWeight" in obj, get: obj => obj.thinFilmWeight, set: (obj, value) => { obj.thinFilmWeight = value; } }, metadata: _metadata }, _thinFilmWeight_initializers, _thinFilmWeight_extraInitializers);
            __esDecorate(_a, null, _thinFilmWeightTexture_decorators, { kind: "accessor", name: "thinFilmWeightTexture", static: false, private: false, access: { has: obj => "thinFilmWeightTexture" in obj, get: obj => obj.thinFilmWeightTexture, set: (obj, value) => { obj.thinFilmWeightTexture = value; } }, metadata: _metadata }, _thinFilmWeightTexture_initializers, _thinFilmWeightTexture_extraInitializers);
            __esDecorate(_a, null, _thinFilmThickness_decorators, { kind: "accessor", name: "thinFilmThickness", static: false, private: false, access: { has: obj => "thinFilmThickness" in obj, get: obj => obj.thinFilmThickness, set: (obj, value) => { obj.thinFilmThickness = value; } }, metadata: _metadata }, _thinFilmThickness_initializers, _thinFilmThickness_extraInitializers);
            __esDecorate(_a, null, _thinFilmThicknessMin_decorators, { kind: "accessor", name: "thinFilmThicknessMin", static: false, private: false, access: { has: obj => "thinFilmThicknessMin" in obj, get: obj => obj.thinFilmThicknessMin, set: (obj, value) => { obj.thinFilmThicknessMin = value; } }, metadata: _metadata }, _thinFilmThicknessMin_initializers, _thinFilmThicknessMin_extraInitializers);
            __esDecorate(_a, null, _thinFilmThicknessTexture_decorators, { kind: "accessor", name: "thinFilmThicknessTexture", static: false, private: false, access: { has: obj => "thinFilmThicknessTexture" in obj, get: obj => obj.thinFilmThicknessTexture, set: (obj, value) => { obj.thinFilmThicknessTexture = value; } }, metadata: _metadata }, _thinFilmThicknessTexture_initializers, _thinFilmThicknessTexture_extraInitializers);
            __esDecorate(_a, null, _thinFilmIor_decorators, { kind: "accessor", name: "thinFilmIor", static: false, private: false, access: { has: obj => "thinFilmIor" in obj, get: obj => obj.thinFilmIor, set: (obj, value) => { obj.thinFilmIor = value; } }, metadata: _metadata }, _thinFilmIor_initializers, _thinFilmIor_extraInitializers);
            __esDecorate(_a, null, _ambientOcclusionTexture_decorators, { kind: "accessor", name: "ambientOcclusionTexture", static: false, private: false, access: { has: obj => "ambientOcclusionTexture" in obj, get: obj => obj.ambientOcclusionTexture, set: (obj, value) => { obj.ambientOcclusionTexture = value; } }, metadata: _metadata }, _ambientOcclusionTexture_initializers, _ambientOcclusionTexture_extraInitializers);
            __esDecorate(_a, null, _directIntensity_decorators, { kind: "accessor", name: "directIntensity", static: false, private: false, access: { has: obj => "directIntensity" in obj, get: obj => obj.directIntensity, set: (obj, value) => { obj.directIntensity = value; } }, metadata: _metadata }, _directIntensity_initializers, _directIntensity_extraInitializers);
            __esDecorate(_a, null, _environmentIntensity_decorators, { kind: "accessor", name: "environmentIntensity", static: false, private: false, access: { has: obj => "environmentIntensity" in obj, get: obj => obj.environmentIntensity, set: (obj, value) => { obj.environmentIntensity = value; } }, metadata: _metadata }, _environmentIntensity_initializers, _environmentIntensity_extraInitializers);
            __esDecorate(_a, null, _useSpecularWeightFromTextureAlpha_decorators, { kind: "accessor", name: "useSpecularWeightFromTextureAlpha", static: false, private: false, access: { has: obj => "useSpecularWeightFromTextureAlpha" in obj, get: obj => obj.useSpecularWeightFromTextureAlpha, set: (obj, value) => { obj.useSpecularWeightFromTextureAlpha = value; } }, metadata: _metadata }, _useSpecularWeightFromTextureAlpha_initializers, _useSpecularWeightFromTextureAlpha_extraInitializers);
            __esDecorate(_a, null, _forceAlphaTest_decorators, { kind: "accessor", name: "forceAlphaTest", static: false, private: false, access: { has: obj => "forceAlphaTest" in obj, get: obj => obj.forceAlphaTest, set: (obj, value) => { obj.forceAlphaTest = value; } }, metadata: _metadata }, _forceAlphaTest_initializers, _forceAlphaTest_extraInitializers);
            __esDecorate(_a, null, _alphaCutOff_decorators, { kind: "accessor", name: "alphaCutOff", static: false, private: false, access: { has: obj => "alphaCutOff" in obj, get: obj => obj.alphaCutOff, set: (obj, value) => { obj.alphaCutOff = value; } }, metadata: _metadata }, _alphaCutOff_initializers, _alphaCutOff_extraInitializers);
            __esDecorate(_a, null, _useAmbientOcclusionFromMetallicTextureRed_decorators, { kind: "accessor", name: "useAmbientOcclusionFromMetallicTextureRed", static: false, private: false, access: { has: obj => "useAmbientOcclusionFromMetallicTextureRed" in obj, get: obj => obj.useAmbientOcclusionFromMetallicTextureRed, set: (obj, value) => { obj.useAmbientOcclusionFromMetallicTextureRed = value; } }, metadata: _metadata }, _useAmbientOcclusionFromMetallicTextureRed_initializers, _useAmbientOcclusionFromMetallicTextureRed_extraInitializers);
            __esDecorate(_a, null, _useAmbientInGrayScale_decorators, { kind: "accessor", name: "useAmbientInGrayScale", static: false, private: false, access: { has: obj => "useAmbientInGrayScale" in obj, get: obj => obj.useAmbientInGrayScale, set: (obj, value) => { obj.useAmbientInGrayScale = value; } }, metadata: _metadata }, _useAmbientInGrayScale_initializers, _useAmbientInGrayScale_extraInitializers);
            __esDecorate(_a, null, _get_usePhysicalLightFalloff_decorators, { kind: "getter", name: "usePhysicalLightFalloff", static: false, private: false, access: { has: obj => "usePhysicalLightFalloff" in obj, get: obj => obj.usePhysicalLightFalloff }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_useGLTFLightFalloff_decorators, { kind: "getter", name: "useGLTFLightFalloff", static: false, private: false, access: { has: obj => "useGLTFLightFalloff" in obj, get: obj => obj.useGLTFLightFalloff }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _useObjectSpaceNormalMap_decorators, { kind: "accessor", name: "useObjectSpaceNormalMap", static: false, private: false, access: { has: obj => "useObjectSpaceNormalMap" in obj, get: obj => obj.useObjectSpaceNormalMap, set: (obj, value) => { obj.useObjectSpaceNormalMap = value; } }, metadata: _metadata }, _useObjectSpaceNormalMap_initializers, _useObjectSpaceNormalMap_extraInitializers);
            __esDecorate(_a, null, _useParallax_decorators, { kind: "accessor", name: "useParallax", static: false, private: false, access: { has: obj => "useParallax" in obj, get: obj => obj.useParallax, set: (obj, value) => { obj.useParallax = value; } }, metadata: _metadata }, _useParallax_initializers, _useParallax_extraInitializers);
            __esDecorate(_a, null, _useParallaxOcclusion_decorators, { kind: "accessor", name: "useParallaxOcclusion", static: false, private: false, access: { has: obj => "useParallaxOcclusion" in obj, get: obj => obj.useParallaxOcclusion, set: (obj, value) => { obj.useParallaxOcclusion = value; } }, metadata: _metadata }, _useParallaxOcclusion_initializers, _useParallaxOcclusion_extraInitializers);
            __esDecorate(_a, null, _parallaxScaleBias_decorators, { kind: "accessor", name: "parallaxScaleBias", static: false, private: false, access: { has: obj => "parallaxScaleBias" in obj, get: obj => obj.parallaxScaleBias, set: (obj, value) => { obj.parallaxScaleBias = value; } }, metadata: _metadata }, _parallaxScaleBias_initializers, _parallaxScaleBias_extraInitializers);
            __esDecorate(_a, null, _disableLighting_decorators, { kind: "accessor", name: "disableLighting", static: false, private: false, access: { has: obj => "disableLighting" in obj, get: obj => obj.disableLighting, set: (obj, value) => { obj.disableLighting = value; } }, metadata: _metadata }, _disableLighting_initializers, _disableLighting_extraInitializers);
            __esDecorate(_a, null, _forceIrradianceInFragment_decorators, { kind: "accessor", name: "forceIrradianceInFragment", static: false, private: false, access: { has: obj => "forceIrradianceInFragment" in obj, get: obj => obj.forceIrradianceInFragment, set: (obj, value) => { obj.forceIrradianceInFragment = value; } }, metadata: _metadata }, _forceIrradianceInFragment_initializers, _forceIrradianceInFragment_extraInitializers);
            __esDecorate(_a, null, _maxSimultaneousLights_decorators, { kind: "accessor", name: "maxSimultaneousLights", static: false, private: false, access: { has: obj => "maxSimultaneousLights" in obj, get: obj => obj.maxSimultaneousLights, set: (obj, value) => { obj.maxSimultaneousLights = value; } }, metadata: _metadata }, _maxSimultaneousLights_initializers, _maxSimultaneousLights_extraInitializers);
            __esDecorate(_a, null, _invertNormalMapX_decorators, { kind: "accessor", name: "invertNormalMapX", static: false, private: false, access: { has: obj => "invertNormalMapX" in obj, get: obj => obj.invertNormalMapX, set: (obj, value) => { obj.invertNormalMapX = value; } }, metadata: _metadata }, _invertNormalMapX_initializers, _invertNormalMapX_extraInitializers);
            __esDecorate(_a, null, _invertNormalMapY_decorators, { kind: "accessor", name: "invertNormalMapY", static: false, private: false, access: { has: obj => "invertNormalMapY" in obj, get: obj => obj.invertNormalMapY, set: (obj, value) => { obj.invertNormalMapY = value; } }, metadata: _metadata }, _invertNormalMapY_initializers, _invertNormalMapY_extraInitializers);
            __esDecorate(_a, null, _twoSidedLighting_decorators, { kind: "accessor", name: "twoSidedLighting", static: false, private: false, access: { has: obj => "twoSidedLighting" in obj, get: obj => obj.twoSidedLighting, set: (obj, value) => { obj.twoSidedLighting = value; } }, metadata: _metadata }, _twoSidedLighting_initializers, _twoSidedLighting_extraInitializers);
            __esDecorate(_a, null, _useAlphaFresnel_decorators, { kind: "accessor", name: "useAlphaFresnel", static: false, private: false, access: { has: obj => "useAlphaFresnel" in obj, get: obj => obj.useAlphaFresnel, set: (obj, value) => { obj.useAlphaFresnel = value; } }, metadata: _metadata }, _useAlphaFresnel_initializers, _useAlphaFresnel_extraInitializers);
            __esDecorate(_a, null, _useLinearAlphaFresnel_decorators, { kind: "accessor", name: "useLinearAlphaFresnel", static: false, private: false, access: { has: obj => "useLinearAlphaFresnel" in obj, get: obj => obj.useLinearAlphaFresnel, set: (obj, value) => { obj.useLinearAlphaFresnel = value; } }, metadata: _metadata }, _useLinearAlphaFresnel_initializers, _useLinearAlphaFresnel_extraInitializers);
            __esDecorate(_a, null, _environmentBRDFTexture_decorators, { kind: "accessor", name: "environmentBRDFTexture", static: false, private: false, access: { has: obj => "environmentBRDFTexture" in obj, get: obj => obj.environmentBRDFTexture, set: (obj, value) => { obj.environmentBRDFTexture = value; } }, metadata: _metadata }, _environmentBRDFTexture_initializers, _environmentBRDFTexture_extraInitializers);
            __esDecorate(_a, null, _forceNormalForward_decorators, { kind: "accessor", name: "forceNormalForward", static: false, private: false, access: { has: obj => "forceNormalForward" in obj, get: obj => obj.forceNormalForward, set: (obj, value) => { obj.forceNormalForward = value; } }, metadata: _metadata }, _forceNormalForward_initializers, _forceNormalForward_extraInitializers);
            __esDecorate(_a, null, _enableSpecularAntiAliasing_decorators, { kind: "accessor", name: "enableSpecularAntiAliasing", static: false, private: false, access: { has: obj => "enableSpecularAntiAliasing" in obj, get: obj => obj.enableSpecularAntiAliasing, set: (obj, value) => { obj.enableSpecularAntiAliasing = value; } }, metadata: _metadata }, _enableSpecularAntiAliasing_initializers, _enableSpecularAntiAliasing_extraInitializers);
            __esDecorate(_a, null, _useHorizonOcclusion_decorators, { kind: "accessor", name: "useHorizonOcclusion", static: false, private: false, access: { has: obj => "useHorizonOcclusion" in obj, get: obj => obj.useHorizonOcclusion, set: (obj, value) => { obj.useHorizonOcclusion = value; } }, metadata: _metadata }, _useHorizonOcclusion_initializers, _useHorizonOcclusion_extraInitializers);
            __esDecorate(_a, null, _useRadianceOcclusion_decorators, { kind: "accessor", name: "useRadianceOcclusion", static: false, private: false, access: { has: obj => "useRadianceOcclusion" in obj, get: obj => obj.useRadianceOcclusion, set: (obj, value) => { obj.useRadianceOcclusion = value; } }, metadata: _metadata }, _useRadianceOcclusion_initializers, _useRadianceOcclusion_extraInitializers);
            __esDecorate(_a, null, _unlit_decorators, { kind: "accessor", name: "unlit", static: false, private: false, access: { has: obj => "unlit" in obj, get: obj => obj.unlit, set: (obj, value) => { obj.unlit = value; } }, metadata: _metadata }, _unlit_initializers, _unlit_extraInitializers);
            __esDecorate(_a, null, _applyDecalMapAfterDetailMap_decorators, { kind: "accessor", name: "applyDecalMapAfterDetailMap", static: false, private: false, access: { has: obj => "applyDecalMapAfterDetailMap" in obj, get: obj => obj.applyDecalMapAfterDetailMap, set: (obj, value) => { obj.applyDecalMapAfterDetailMap = value; } }, metadata: _metadata }, _applyDecalMapAfterDetailMap_initializers, _applyDecalMapAfterDetailMap_extraInitializers);
            __esDecorate(_a, null, _debugMode_decorators, { kind: "accessor", name: "debugMode", static: false, private: false, access: { has: obj => "debugMode" in obj, get: obj => obj.debugMode, set: (obj, value) => { obj.debugMode = value; } }, metadata: _metadata }, _debugMode_initializers, _debugMode_extraInitializers);
            __esDecorate(_a, null, _get_transparencyMode_decorators, { kind: "getter", name: "transparencyMode", static: false, private: false, access: { has: obj => "transparencyMode" in obj, get: obj => obj.transparencyMode }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        /** SSS convolution uses 8 samples. */
        _a.SSS_QUALITY_LOW = 0,
        /** SSS convolution uses 16 samples (default). */
        _a.SSS_QUALITY_MEDIUM = 1,
        /** SSS convolution uses 32 samples. */
        _a.SSS_QUALITY_HIGH = 2,
        _a._noiseTextures = {},
        /**
         * Force all the PBR materials to compile to glsl even on WebGPU engines.
         * False by default. This is mostly meant for backward compatibility.
         */
        _a.ForceGLSL = false,
        _a._ShaderLoader = new _ShaderImportLoader(() => [import("../../Shaders/openpbr.vertex.js"), import("../../Shaders/openpbr.fragment.js")], () => [import("../../ShadersWGSL/openpbr.vertex.js"), import("../../ShadersWGSL/openpbr.fragment.js")]),
        _a;
})();
export { OpenPBRMaterial };
let _Registered = false;
/**
 * Register side effects for openpbrMaterial.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterOpenpbrMaterial() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    // OpenPBRMaterial serializes its image processing configuration, so the parser must be registered for clone/parse to work.
    RegisterImageProcessingConfiguration();
    RegisterClass("BABYLON.OpenPBRMaterial", OpenPBRMaterial);
}
//# sourceMappingURL=openpbrMaterial.pure.js.map