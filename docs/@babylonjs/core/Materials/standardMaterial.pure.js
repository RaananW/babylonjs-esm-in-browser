/** This file must only contain pure code and pure imports */
import { __classPrivateFieldGet, __classPrivateFieldSet, __esDecorate, __runInitializers } from "../tslib.es6.js";
import { serialize, serializeAsColor3, expandToProperty, serializeAsFresnelParameters, serializeAsTexture } from "../Misc/decorators.js";
import { SmartArray } from "../Misc/smartArray.js";
import { Scene } from "../scene.pure.js";
import { Color3, TmpColors } from "../Maths/math.color.pure.js";
import { VertexBuffer } from "../Buffers/buffer.pure.js";
import { PrePassConfiguration } from "./prePassConfiguration.js";
import { ImageProcessingDefinesMixin } from "./imageProcessingConfiguration.defines.js";
import { ImageProcessingConfiguration, RegisterImageProcessingConfiguration } from "./imageProcessingConfiguration.pure.js";
import { Material } from "../Materials/material.pure.js";
import { MaterialDefines } from "../Materials/materialDefines.js";
import { PushMaterial } from "./pushMaterial.js";
import { MaterialFlags } from "./materialFlags.js";

import { EffectFallbacks } from "./effectFallbacks.js";
import { DetailMapConfiguration } from "./material.detailMapConfiguration.js";
import { AddClipPlaneUniforms, BindClipPlane } from "./clipPlaneMaterialHelper.js";
import { PrepareVertexPullingUniforms, BindVertexPullingUniforms } from "./vertexPullingHelper.functions.js";
import { BindBonesParameters, BindFogParameters, BindLights, BindLogDepth, BindMorphTargetParameters, BindTextureMatrix, BindIBLParameters, HandleFallbacksForShadows, PrepareAttributesForBakedVertexAnimation, PrepareAttributesForBones, PrepareAttributesForInstances, PrepareAttributesForMorphTargets, PrepareDefinesForAttributes, PrepareDefinesForFrameBoundValues, PrepareDefinesForLights, PrepareDefinesForIBL, PrepareDefinesForMergedUV, PrepareDefinesForMisc, PrepareDefinesForMultiview, PrepareDefinesForOIT, PrepareDefinesForPrePass, PrepareUniformsAndSamplersForIBL, PrepareUniformsAndSamplersList, PrepareUniformLayoutForIBL, AreLightsTexturesReady, } from "./materialHelper.functions.js";
import { SerializationHelper } from "../Misc/decorators.serialization.js";
import { _ShaderImportLoader } from "../Misc/shaderImportLoader.js";
import { MaterialHelperGeometryRendering } from "./materialHelper.geometryrendering.js";
import { UVDefinesMixin } from "./uv.defines.js";
import { PrepassDefinesMixin } from "./prepass.defines.js";
import { ImageProcessingMixin } from "./imageProcessing.js";
import { RegisterClass } from "../Misc/typeStore.js";
/* eslint-disable @typescript-eslint/naming-convention */
const onCreatedEffectParameters = { effect: null, subMesh: null };
class StandardMaterialDefinesBase extends PrepassDefinesMixin(UVDefinesMixin(MaterialDefines)) {
}
/** @internal */
export class StandardMaterialDefines extends ImageProcessingDefinesMixin(StandardMaterialDefinesBase) {
    /**
     * Initializes the Standard Material defines.
     * @param externalProperties The external properties
     */
    constructor(externalProperties) {
        super(externalProperties);
        this.DIFFUSE = false;
        this.DIFFUSEDIRECTUV = 0;
        this.BAKED_VERTEX_ANIMATION_TEXTURE = false;
        this.AMBIENT = false;
        this.AMBIENTDIRECTUV = 0;
        this.OPACITY = false;
        this.OPACITYDIRECTUV = 0;
        this.OPACITYRGB = false;
        this.REFLECTION = false;
        this.EMISSIVE = false;
        this.EMISSIVEDIRECTUV = 0;
        this.SPECULAR = false;
        this.SPECULARDIRECTUV = 0;
        this.BUMP = false;
        this.BUMPDIRECTUV = 0;
        this.PARALLAX = false;
        this.PARALLAX_RHS = false;
        this.PARALLAXOCCLUSION = false;
        this.SPECULAROVERALPHA = false;
        this.CLIPPLANE = false;
        this.CLIPPLANE2 = false;
        this.CLIPPLANE3 = false;
        this.CLIPPLANE4 = false;
        this.CLIPPLANE5 = false;
        this.CLIPPLANE6 = false;
        this.ALPHATEST = false;
        this.DEPTHPREPASS = false;
        this.ALPHAFROMDIFFUSE = false;
        this.POINTSIZE = false;
        this.FOG = false;
        this.SPECULARTERM = false;
        this.DIFFUSEFRESNEL = false;
        this.OPACITYFRESNEL = false;
        this.REFLECTIONFRESNEL = false;
        this.REFRACTIONFRESNEL = false;
        this.EMISSIVEFRESNEL = false;
        this.FRESNEL = false;
        this.NORMAL = false;
        this.TANGENT = false;
        this.VERTEXCOLOR = false;
        this.VERTEXALPHA = false;
        this.NUM_BONE_INFLUENCERS = 0;
        this.BonesPerMesh = 0;
        this.BONETEXTURE = false;
        this.BONES_VELOCITY_ENABLED = false;
        this.INSTANCES = false;
        this.THIN_INSTANCES = false;
        this.INSTANCESCOLOR = false;
        this.GLOSSINESS = false;
        this.ROUGHNESS = false;
        this.EMISSIVEASILLUMINATION = false;
        this.LINKEMISSIVEWITHDIFFUSE = false;
        this.REFLECTIONFRESNELFROMSPECULAR = false;
        this.LIGHTMAP = false;
        this.LIGHTMAPDIRECTUV = 0;
        this.OBJECTSPACE_NORMALMAP = false;
        this.USELIGHTMAPASSHADOWMAP = false;
        this.REFLECTIONMAP_3D = false;
        this.REFLECTIONMAP_SPHERICAL = false;
        this.REFLECTIONMAP_PLANAR = false;
        this.REFLECTIONMAP_CUBIC = false;
        this.USE_LOCAL_REFLECTIONMAP_CUBIC = false;
        this.USE_LOCAL_REFRACTIONMAP_CUBIC = false;
        this.REFLECTIONMAP_PROJECTION = false;
        this.REFLECTIONMAP_SKYBOX = false;
        this.REFLECTIONMAP_EXPLICIT = false;
        this.REFLECTIONMAP_EQUIRECTANGULAR = false;
        this.REFLECTIONMAP_EQUIRECTANGULAR_FIXED = false;
        this.REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED = false;
        this.REFLECTIONMAP_OPPOSITEZ = false;
        this.INVERTCUBICMAP = false;
        this.LOGARITHMICDEPTH = false;
        this.REFRACTION = false;
        this.REFRACTIONMAP_3D = false;
        this.REFLECTIONOVERALPHA = false;
        this.TWOSIDEDLIGHTING = false;
        this.SHADOWFLOAT = false;
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
        this.NONUNIFORMSCALING = false; // https://playground.babylonjs.com#V6DWIH
        this.PREMULTIPLYALPHA = false; // https://playground.babylonjs.com#LNVJJ7
        this.ALPHATEST_AFTERALLALPHACOMPUTATIONS = false;
        this.ALPHABLEND = true;
        this.RGBDLIGHTMAP = false;
        this.RGBDREFLECTION = false;
        this.RGBDREFRACTION = false;
        this.MULTIVIEW = false;
        this.ORDER_INDEPENDENT_TRANSPARENCY = false;
        this.ORDER_INDEPENDENT_TRANSPARENCY_16BITS = false;
        this.CAMERA_ORTHOGRAPHIC = false;
        this.CAMERA_PERSPECTIVE = false;
        this.AREALIGHTSUPPORTED = true;
        this.USE_VERTEX_PULLING = false;
        this.VERTEX_PULLING_USE_INDEX_BUFFER = false;
        this.VERTEX_PULLING_INDEX_BUFFER_32BITS = false;
        this.RIGHT_HANDED = false;
        this.CLUSTLIGHT_SLICES = 0;
        this.CLUSTLIGHT_BATCH = 0;
        /**
         * If the reflection texture on this material is in linear color space
         * @internal
         */
        this.IS_REFLECTION_LINEAR = false;
        /**
         * If the refraction texture on this material is in linear color space
         * @internal
         */
        this.IS_REFRACTION_LINEAR = false;
        this.DECAL_AFTER_DETAIL = false;
        this.TEXTURE_REPETITION_MODE = 0;
        this.rebuild();
    }
}
class StandardMaterialBase extends ImageProcessingMixin(PushMaterial) {
}
/**
 * This is the default material used in Babylon. It is the best trade off between quality
 * and performances.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/materials_introduction
 */
let StandardMaterial = (() => {
    var _a, _StandardMaterial_diffuseTexture_accessor_storage, _StandardMaterial_ambientTexture_accessor_storage, _StandardMaterial_opacityTexture_accessor_storage, _StandardMaterial_reflectionTexture_accessor_storage, _StandardMaterial_emissiveTexture_accessor_storage, _StandardMaterial_specularTexture_accessor_storage, _StandardMaterial_bumpTexture_accessor_storage, _StandardMaterial_lightmapTexture_accessor_storage, _StandardMaterial_refractionTexture_accessor_storage, _StandardMaterial_useAlphaFromDiffuseTexture_accessor_storage, _StandardMaterial_useEmissiveAsIllumination_accessor_storage, _StandardMaterial_linkEmissiveWithDiffuse_accessor_storage, _StandardMaterial_useSpecularOverAlpha_accessor_storage, _StandardMaterial_useReflectionOverAlpha_accessor_storage, _StandardMaterial_disableLighting_accessor_storage, _StandardMaterial_useObjectSpaceNormalMap_accessor_storage, _StandardMaterial_useParallax_accessor_storage, _StandardMaterial_useParallaxOcclusion_accessor_storage, _StandardMaterial_roughness_accessor_storage, _StandardMaterial_useLightmapAsShadowmap_accessor_storage, _StandardMaterial_diffuseFresnelParameters_accessor_storage, _StandardMaterial_opacityFresnelParameters_accessor_storage, _StandardMaterial_reflectionFresnelParameters_accessor_storage, _StandardMaterial_refractionFresnelParameters_accessor_storage, _StandardMaterial_emissiveFresnelParameters_accessor_storage, _StandardMaterial_useReflectionFresnelFromSpecular_accessor_storage, _StandardMaterial_useGlossinessFromSpecularMapAlpha_accessor_storage, _StandardMaterial_maxSimultaneousLights_accessor_storage, _StandardMaterial_invertNormalMapX_accessor_storage, _StandardMaterial_invertNormalMapY_accessor_storage, _StandardMaterial_twoSidedLighting_accessor_storage, _StandardMaterial_applyDecalMapAfterDetailMap_accessor_storage;
    let _classSuper = StandardMaterialBase;
    let __diffuseTexture_decorators;
    let __diffuseTexture_initializers = [];
    let __diffuseTexture_extraInitializers = [];
    let _diffuseTexture_decorators;
    let _diffuseTexture_initializers = [];
    let _diffuseTexture_extraInitializers = [];
    let __ambientTexture_decorators;
    let __ambientTexture_initializers = [];
    let __ambientTexture_extraInitializers = [];
    let _ambientTexture_decorators;
    let _ambientTexture_initializers = [];
    let _ambientTexture_extraInitializers = [];
    let __opacityTexture_decorators;
    let __opacityTexture_initializers = [];
    let __opacityTexture_extraInitializers = [];
    let _opacityTexture_decorators;
    let _opacityTexture_initializers = [];
    let _opacityTexture_extraInitializers = [];
    let __reflectionTexture_decorators;
    let __reflectionTexture_initializers = [];
    let __reflectionTexture_extraInitializers = [];
    let _reflectionTexture_decorators;
    let _reflectionTexture_initializers = [];
    let _reflectionTexture_extraInitializers = [];
    let __emissiveTexture_decorators;
    let __emissiveTexture_initializers = [];
    let __emissiveTexture_extraInitializers = [];
    let _emissiveTexture_decorators;
    let _emissiveTexture_initializers = [];
    let _emissiveTexture_extraInitializers = [];
    let __specularTexture_decorators;
    let __specularTexture_initializers = [];
    let __specularTexture_extraInitializers = [];
    let _specularTexture_decorators;
    let _specularTexture_initializers = [];
    let _specularTexture_extraInitializers = [];
    let __bumpTexture_decorators;
    let __bumpTexture_initializers = [];
    let __bumpTexture_extraInitializers = [];
    let _bumpTexture_decorators;
    let _bumpTexture_initializers = [];
    let _bumpTexture_extraInitializers = [];
    let __lightmapTexture_decorators;
    let __lightmapTexture_initializers = [];
    let __lightmapTexture_extraInitializers = [];
    let _lightmapTexture_decorators;
    let _lightmapTexture_initializers = [];
    let _lightmapTexture_extraInitializers = [];
    let __refractionTexture_decorators;
    let __refractionTexture_initializers = [];
    let __refractionTexture_extraInitializers = [];
    let _refractionTexture_decorators;
    let _refractionTexture_initializers = [];
    let _refractionTexture_extraInitializers = [];
    let _ambientColor_decorators;
    let _ambientColor_initializers = [];
    let _ambientColor_extraInitializers = [];
    let _diffuseColor_decorators;
    let _diffuseColor_initializers = [];
    let _diffuseColor_extraInitializers = [];
    let _specularColor_decorators;
    let _specularColor_initializers = [];
    let _specularColor_extraInitializers = [];
    let _emissiveColor_decorators;
    let _emissiveColor_initializers = [];
    let _emissiveColor_extraInitializers = [];
    let _specularPower_decorators;
    let _specularPower_initializers = [];
    let _specularPower_extraInitializers = [];
    let __useAlphaFromDiffuseTexture_decorators;
    let __useAlphaFromDiffuseTexture_initializers = [];
    let __useAlphaFromDiffuseTexture_extraInitializers = [];
    let _useAlphaFromDiffuseTexture_decorators;
    let _useAlphaFromDiffuseTexture_initializers = [];
    let _useAlphaFromDiffuseTexture_extraInitializers = [];
    let __useEmissiveAsIllumination_decorators;
    let __useEmissiveAsIllumination_initializers = [];
    let __useEmissiveAsIllumination_extraInitializers = [];
    let _useEmissiveAsIllumination_decorators;
    let _useEmissiveAsIllumination_initializers = [];
    let _useEmissiveAsIllumination_extraInitializers = [];
    let __linkEmissiveWithDiffuse_decorators;
    let __linkEmissiveWithDiffuse_initializers = [];
    let __linkEmissiveWithDiffuse_extraInitializers = [];
    let _linkEmissiveWithDiffuse_decorators;
    let _linkEmissiveWithDiffuse_initializers = [];
    let _linkEmissiveWithDiffuse_extraInitializers = [];
    let __useSpecularOverAlpha_decorators;
    let __useSpecularOverAlpha_initializers = [];
    let __useSpecularOverAlpha_extraInitializers = [];
    let _useSpecularOverAlpha_decorators;
    let _useSpecularOverAlpha_initializers = [];
    let _useSpecularOverAlpha_extraInitializers = [];
    let __useReflectionOverAlpha_decorators;
    let __useReflectionOverAlpha_initializers = [];
    let __useReflectionOverAlpha_extraInitializers = [];
    let _useReflectionOverAlpha_decorators;
    let _useReflectionOverAlpha_initializers = [];
    let _useReflectionOverAlpha_extraInitializers = [];
    let __disableLighting_decorators;
    let __disableLighting_initializers = [];
    let __disableLighting_extraInitializers = [];
    let _disableLighting_decorators;
    let _disableLighting_initializers = [];
    let _disableLighting_extraInitializers = [];
    let __useObjectSpaceNormalMap_decorators;
    let __useObjectSpaceNormalMap_initializers = [];
    let __useObjectSpaceNormalMap_extraInitializers = [];
    let _useObjectSpaceNormalMap_decorators;
    let _useObjectSpaceNormalMap_initializers = [];
    let _useObjectSpaceNormalMap_extraInitializers = [];
    let __useParallax_decorators;
    let __useParallax_initializers = [];
    let __useParallax_extraInitializers = [];
    let _useParallax_decorators;
    let _useParallax_initializers = [];
    let _useParallax_extraInitializers = [];
    let __useParallaxOcclusion_decorators;
    let __useParallaxOcclusion_initializers = [];
    let __useParallaxOcclusion_extraInitializers = [];
    let _useParallaxOcclusion_decorators;
    let _useParallaxOcclusion_initializers = [];
    let _useParallaxOcclusion_extraInitializers = [];
    let _parallaxScaleBias_decorators;
    let _parallaxScaleBias_initializers = [];
    let _parallaxScaleBias_extraInitializers = [];
    let __roughness_decorators;
    let __roughness_initializers = [];
    let __roughness_extraInitializers = [];
    let _roughness_decorators;
    let _roughness_initializers = [];
    let _roughness_extraInitializers = [];
    let _indexOfRefraction_decorators;
    let _indexOfRefraction_initializers = [];
    let _indexOfRefraction_extraInitializers = [];
    let _invertRefractionY_decorators;
    let _invertRefractionY_initializers = [];
    let _invertRefractionY_extraInitializers = [];
    let _alphaCutOff_decorators;
    let _alphaCutOff_initializers = [];
    let _alphaCutOff_extraInitializers = [];
    let __useLightmapAsShadowmap_decorators;
    let __useLightmapAsShadowmap_initializers = [];
    let __useLightmapAsShadowmap_extraInitializers = [];
    let _useLightmapAsShadowmap_decorators;
    let _useLightmapAsShadowmap_initializers = [];
    let _useLightmapAsShadowmap_extraInitializers = [];
    let __diffuseFresnelParameters_decorators;
    let __diffuseFresnelParameters_initializers = [];
    let __diffuseFresnelParameters_extraInitializers = [];
    let _diffuseFresnelParameters_decorators;
    let _diffuseFresnelParameters_initializers = [];
    let _diffuseFresnelParameters_extraInitializers = [];
    let __opacityFresnelParameters_decorators;
    let __opacityFresnelParameters_initializers = [];
    let __opacityFresnelParameters_extraInitializers = [];
    let _opacityFresnelParameters_decorators;
    let _opacityFresnelParameters_initializers = [];
    let _opacityFresnelParameters_extraInitializers = [];
    let __reflectionFresnelParameters_decorators;
    let __reflectionFresnelParameters_initializers = [];
    let __reflectionFresnelParameters_extraInitializers = [];
    let _reflectionFresnelParameters_decorators;
    let _reflectionFresnelParameters_initializers = [];
    let _reflectionFresnelParameters_extraInitializers = [];
    let __refractionFresnelParameters_decorators;
    let __refractionFresnelParameters_initializers = [];
    let __refractionFresnelParameters_extraInitializers = [];
    let _refractionFresnelParameters_decorators;
    let _refractionFresnelParameters_initializers = [];
    let _refractionFresnelParameters_extraInitializers = [];
    let __emissiveFresnelParameters_decorators;
    let __emissiveFresnelParameters_initializers = [];
    let __emissiveFresnelParameters_extraInitializers = [];
    let _emissiveFresnelParameters_decorators;
    let _emissiveFresnelParameters_initializers = [];
    let _emissiveFresnelParameters_extraInitializers = [];
    let __useReflectionFresnelFromSpecular_decorators;
    let __useReflectionFresnelFromSpecular_initializers = [];
    let __useReflectionFresnelFromSpecular_extraInitializers = [];
    let _useReflectionFresnelFromSpecular_decorators;
    let _useReflectionFresnelFromSpecular_initializers = [];
    let _useReflectionFresnelFromSpecular_extraInitializers = [];
    let __useGlossinessFromSpecularMapAlpha_decorators;
    let __useGlossinessFromSpecularMapAlpha_initializers = [];
    let __useGlossinessFromSpecularMapAlpha_extraInitializers = [];
    let _useGlossinessFromSpecularMapAlpha_decorators;
    let _useGlossinessFromSpecularMapAlpha_initializers = [];
    let _useGlossinessFromSpecularMapAlpha_extraInitializers = [];
    let __maxSimultaneousLights_decorators;
    let __maxSimultaneousLights_initializers = [];
    let __maxSimultaneousLights_extraInitializers = [];
    let _maxSimultaneousLights_decorators;
    let _maxSimultaneousLights_initializers = [];
    let _maxSimultaneousLights_extraInitializers = [];
    let __invertNormalMapX_decorators;
    let __invertNormalMapX_initializers = [];
    let __invertNormalMapX_extraInitializers = [];
    let _invertNormalMapX_decorators;
    let _invertNormalMapX_initializers = [];
    let _invertNormalMapX_extraInitializers = [];
    let __invertNormalMapY_decorators;
    let __invertNormalMapY_initializers = [];
    let __invertNormalMapY_extraInitializers = [];
    let _invertNormalMapY_decorators;
    let _invertNormalMapY_initializers = [];
    let _invertNormalMapY_extraInitializers = [];
    let __twoSidedLighting_decorators;
    let __twoSidedLighting_initializers = [];
    let __twoSidedLighting_extraInitializers = [];
    let _twoSidedLighting_decorators;
    let _twoSidedLighting_initializers = [];
    let _twoSidedLighting_extraInitializers = [];
    let __applyDecalMapAfterDetailMap_decorators;
    let __applyDecalMapAfterDetailMap_initializers = [];
    let __applyDecalMapAfterDetailMap_extraInitializers = [];
    let _applyDecalMapAfterDetailMap_decorators;
    let _applyDecalMapAfterDetailMap_initializers = [];
    let _applyDecalMapAfterDetailMap_extraInitializers = [];
    return _a = class StandardMaterial extends _classSuper {
            /**
             * The basic texture of the material as viewed under a light.
             */
            get diffuseTexture() { return __classPrivateFieldGet(this, _StandardMaterial_diffuseTexture_accessor_storage, "f"); }
            set diffuseTexture(value) { __classPrivateFieldSet(this, _StandardMaterial_diffuseTexture_accessor_storage, value, "f"); }
            /**
             * AKA Occlusion Texture in other nomenclature, it helps adding baked shadows into your material.
             */
            get ambientTexture() { return __classPrivateFieldGet(this, _StandardMaterial_ambientTexture_accessor_storage, "f"); }
            set ambientTexture(value) { __classPrivateFieldSet(this, _StandardMaterial_ambientTexture_accessor_storage, value, "f"); }
            /**
             * Define the transparency of the material from a texture.
             * The final alpha value can be read either from the red channel (if texture.getAlphaFromRGB is false)
             * or from the luminance or the current texel (if texture.getAlphaFromRGB is true)
             */
            get opacityTexture() { return __classPrivateFieldGet(this, _StandardMaterial_opacityTexture_accessor_storage, "f"); }
            set opacityTexture(value) { __classPrivateFieldSet(this, _StandardMaterial_opacityTexture_accessor_storage, value, "f"); }
            /**
             * Define the texture used to display the reflection.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/reflectionTexture#how-to-obtain-reflections-and-refractions
             */
            get reflectionTexture() { return __classPrivateFieldGet(this, _StandardMaterial_reflectionTexture_accessor_storage, "f"); }
            set reflectionTexture(value) { __classPrivateFieldSet(this, _StandardMaterial_reflectionTexture_accessor_storage, value, "f"); }
            /**
             * Define texture of the material as if self lit.
             * This will be mixed in the final result even in the absence of light.
             */
            get emissiveTexture() { return __classPrivateFieldGet(this, _StandardMaterial_emissiveTexture_accessor_storage, "f"); }
            set emissiveTexture(value) { __classPrivateFieldSet(this, _StandardMaterial_emissiveTexture_accessor_storage, value, "f"); }
            /**
             * Define how the color and intensity of the highlight given by the light in the material.
             */
            get specularTexture() { return __classPrivateFieldGet(this, _StandardMaterial_specularTexture_accessor_storage, "f"); }
            set specularTexture(value) { __classPrivateFieldSet(this, _StandardMaterial_specularTexture_accessor_storage, value, "f"); }
            /**
             * Bump mapping is a technique to simulate bump and dents on a rendered surface.
             * These are made by creating a normal map from an image. The means to do this can be found on the web, a search for 'normal map generator' will bring up free and paid for methods of doing this.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/moreMaterials#bump-map
             */
            get bumpTexture() { return __classPrivateFieldGet(this, _StandardMaterial_bumpTexture_accessor_storage, "f"); }
            set bumpTexture(value) { __classPrivateFieldSet(this, _StandardMaterial_bumpTexture_accessor_storage, value, "f"); }
            /**
             * Complex lighting can be computationally expensive to compute at runtime.
             * To save on computation, lightmaps may be used to store calculated lighting in a texture which will be applied to a given mesh.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/lights/lights_introduction#lightmaps
             */
            get lightmapTexture() { return __classPrivateFieldGet(this, _StandardMaterial_lightmapTexture_accessor_storage, "f"); }
            set lightmapTexture(value) { __classPrivateFieldSet(this, _StandardMaterial_lightmapTexture_accessor_storage, value, "f"); }
            /**
             * Define the texture used to display the refraction.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/reflectionTexture#how-to-obtain-reflections-and-refractions
             */
            get refractionTexture() { return __classPrivateFieldGet(this, _StandardMaterial_refractionTexture_accessor_storage, "f"); }
            set refractionTexture(value) { __classPrivateFieldSet(this, _StandardMaterial_refractionTexture_accessor_storage, value, "f"); }
            /**
             * Does the transparency come from the diffuse texture alpha channel.
             */
            get useAlphaFromDiffuseTexture() { return __classPrivateFieldGet(this, _StandardMaterial_useAlphaFromDiffuseTexture_accessor_storage, "f"); }
            set useAlphaFromDiffuseTexture(value) { __classPrivateFieldSet(this, _StandardMaterial_useAlphaFromDiffuseTexture_accessor_storage, value, "f"); }
            /**
             * If true, the emissive value is added into the end result, otherwise it is multiplied in.
             */
            get useEmissiveAsIllumination() { return __classPrivateFieldGet(this, _StandardMaterial_useEmissiveAsIllumination_accessor_storage, "f"); }
            set useEmissiveAsIllumination(value) { __classPrivateFieldSet(this, _StandardMaterial_useEmissiveAsIllumination_accessor_storage, value, "f"); }
            /**
             * If true, some kind of energy conservation will prevent the end result to be more than 1 by reducing
             * the emissive level when the final color is close to one.
             */
            get linkEmissiveWithDiffuse() { return __classPrivateFieldGet(this, _StandardMaterial_linkEmissiveWithDiffuse_accessor_storage, "f"); }
            set linkEmissiveWithDiffuse(value) { __classPrivateFieldSet(this, _StandardMaterial_linkEmissiveWithDiffuse_accessor_storage, value, "f"); }
            /**
             * Specifies that the material will keep the specular highlights over a transparent surface (only the most luminous ones).
             * A car glass is a good exemple of that. When sun reflects on it you can not see what is behind.
             */
            get useSpecularOverAlpha() { return __classPrivateFieldGet(this, _StandardMaterial_useSpecularOverAlpha_accessor_storage, "f"); }
            set useSpecularOverAlpha(value) { __classPrivateFieldSet(this, _StandardMaterial_useSpecularOverAlpha_accessor_storage, value, "f"); }
            /**
             * Specifies that the material will keeps the reflection highlights over a transparent surface (only the most luminous ones).
             * A car glass is a good exemple of that. When the street lights reflects on it you can not see what is behind.
             */
            get useReflectionOverAlpha() { return __classPrivateFieldGet(this, _StandardMaterial_useReflectionOverAlpha_accessor_storage, "f"); }
            set useReflectionOverAlpha(value) { __classPrivateFieldSet(this, _StandardMaterial_useReflectionOverAlpha_accessor_storage, value, "f"); }
            /**
             * Does lights from the scene impacts this material.
             * It can be a nice trick for performance to disable lighting on a fully emissive material.
             */
            get disableLighting() { return __classPrivateFieldGet(this, _StandardMaterial_disableLighting_accessor_storage, "f"); }
            set disableLighting(value) { __classPrivateFieldSet(this, _StandardMaterial_disableLighting_accessor_storage, value, "f"); }
            /**
             * Allows using an object space normal map (instead of tangent space).
             */
            get useObjectSpaceNormalMap() { return __classPrivateFieldGet(this, _StandardMaterial_useObjectSpaceNormalMap_accessor_storage, "f"); }
            set useObjectSpaceNormalMap(value) { __classPrivateFieldSet(this, _StandardMaterial_useObjectSpaceNormalMap_accessor_storage, value, "f"); }
            /**
             * Is parallax enabled or not.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/parallaxMapping
             */
            get useParallax() { return __classPrivateFieldGet(this, _StandardMaterial_useParallax_accessor_storage, "f"); }
            set useParallax(value) { __classPrivateFieldSet(this, _StandardMaterial_useParallax_accessor_storage, value, "f"); }
            /**
             * Is parallax occlusion enabled or not.
             * If true, the outcome is way more realistic than traditional Parallax but you can expect a performance hit that worthes consideration.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/parallaxMapping
             */
            get useParallaxOcclusion() { return __classPrivateFieldGet(this, _StandardMaterial_useParallaxOcclusion_accessor_storage, "f"); }
            set useParallaxOcclusion(value) { __classPrivateFieldSet(this, _StandardMaterial_useParallaxOcclusion_accessor_storage, value, "f"); }
            /**
             * Helps to define how blurry the reflections should appears in the material.
             */
            get roughness() { return __classPrivateFieldGet(this, _StandardMaterial_roughness_accessor_storage, "f"); }
            set roughness(value) { __classPrivateFieldSet(this, _StandardMaterial_roughness_accessor_storage, value, "f"); }
            /**
             * In case of light mapping, define whether the map contains light or shadow informations.
             */
            get useLightmapAsShadowmap() { return __classPrivateFieldGet(this, _StandardMaterial_useLightmapAsShadowmap_accessor_storage, "f"); }
            set useLightmapAsShadowmap(value) { __classPrivateFieldSet(this, _StandardMaterial_useLightmapAsShadowmap_accessor_storage, value, "f"); }
            /**
             * Define the diffuse fresnel parameters of the material.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/fresnelParameters
             */
            get diffuseFresnelParameters() { return __classPrivateFieldGet(this, _StandardMaterial_diffuseFresnelParameters_accessor_storage, "f"); }
            set diffuseFresnelParameters(value) { __classPrivateFieldSet(this, _StandardMaterial_diffuseFresnelParameters_accessor_storage, value, "f"); }
            /**
             * Define the opacity fresnel parameters of the material.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/fresnelParameters
             */
            get opacityFresnelParameters() { return __classPrivateFieldGet(this, _StandardMaterial_opacityFresnelParameters_accessor_storage, "f"); }
            set opacityFresnelParameters(value) { __classPrivateFieldSet(this, _StandardMaterial_opacityFresnelParameters_accessor_storage, value, "f"); }
            /**
             * Define the reflection fresnel parameters of the material.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/fresnelParameters
             */
            get reflectionFresnelParameters() { return __classPrivateFieldGet(this, _StandardMaterial_reflectionFresnelParameters_accessor_storage, "f"); }
            set reflectionFresnelParameters(value) { __classPrivateFieldSet(this, _StandardMaterial_reflectionFresnelParameters_accessor_storage, value, "f"); }
            /**
             * Define the refraction fresnel parameters of the material.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/fresnelParameters
             */
            get refractionFresnelParameters() { return __classPrivateFieldGet(this, _StandardMaterial_refractionFresnelParameters_accessor_storage, "f"); }
            set refractionFresnelParameters(value) { __classPrivateFieldSet(this, _StandardMaterial_refractionFresnelParameters_accessor_storage, value, "f"); }
            /**
             * Define the emissive fresnel parameters of the material.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/fresnelParameters
             */
            get emissiveFresnelParameters() { return __classPrivateFieldGet(this, _StandardMaterial_emissiveFresnelParameters_accessor_storage, "f"); }
            set emissiveFresnelParameters(value) { __classPrivateFieldSet(this, _StandardMaterial_emissiveFresnelParameters_accessor_storage, value, "f"); }
            /**
             * If true automatically deducts the fresnels values from the material specularity.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/fresnelParameters
             */
            get useReflectionFresnelFromSpecular() { return __classPrivateFieldGet(this, _StandardMaterial_useReflectionFresnelFromSpecular_accessor_storage, "f"); }
            set useReflectionFresnelFromSpecular(value) { __classPrivateFieldSet(this, _StandardMaterial_useReflectionFresnelFromSpecular_accessor_storage, value, "f"); }
            /**
             * Defines if the glossiness/roughness of the material should be read from the specular map alpha channel
             */
            get useGlossinessFromSpecularMapAlpha() { return __classPrivateFieldGet(this, _StandardMaterial_useGlossinessFromSpecularMapAlpha_accessor_storage, "f"); }
            set useGlossinessFromSpecularMapAlpha(value) { __classPrivateFieldSet(this, _StandardMaterial_useGlossinessFromSpecularMapAlpha_accessor_storage, value, "f"); }
            /**
             * Defines the maximum number of lights that can be used in the material
             */
            get maxSimultaneousLights() { return __classPrivateFieldGet(this, _StandardMaterial_maxSimultaneousLights_accessor_storage, "f"); }
            set maxSimultaneousLights(value) { __classPrivateFieldSet(this, _StandardMaterial_maxSimultaneousLights_accessor_storage, value, "f"); }
            /**
             * If sets to true, x component of normal map value will invert (x = 1.0 - x).
             */
            get invertNormalMapX() { return __classPrivateFieldGet(this, _StandardMaterial_invertNormalMapX_accessor_storage, "f"); }
            set invertNormalMapX(value) { __classPrivateFieldSet(this, _StandardMaterial_invertNormalMapX_accessor_storage, value, "f"); }
            /**
             * If sets to true, y component of normal map value will invert (y = 1.0 - y).
             */
            get invertNormalMapY() { return __classPrivateFieldGet(this, _StandardMaterial_invertNormalMapY_accessor_storage, "f"); }
            set invertNormalMapY(value) { __classPrivateFieldSet(this, _StandardMaterial_invertNormalMapY_accessor_storage, value, "f"); }
            /**
             * If sets to true and backfaceCulling is false, normals will be flipped on the backside.
             */
            get twoSidedLighting() { return __classPrivateFieldGet(this, _StandardMaterial_twoSidedLighting_accessor_storage, "f"); }
            set twoSidedLighting(value) { __classPrivateFieldSet(this, _StandardMaterial_twoSidedLighting_accessor_storage, value, "f"); }
            /**
             * If sets to true, the decal map will be applied after the detail map. Else, it is applied before (default: false)
             */
            get applyDecalMapAfterDetailMap() { return __classPrivateFieldGet(this, _StandardMaterial_applyDecalMapAfterDetailMap_accessor_storage, "f"); }
            set applyDecalMapAfterDetailMap(value) { __classPrivateFieldSet(this, _StandardMaterial_applyDecalMapAfterDetailMap_accessor_storage, value, "f"); }
            /**
             * Can this material render to prepass
             */
            get isPrePassCapable() {
                return !this.disableDepthWrite;
            }
            /**
             * Can this material render to several textures at once
             */
            get canRenderToMRT() {
                return true;
            }
            /**
             * Instantiates a new standard material.
             * This is the default material used in Babylon. It is the best trade off between quality
             * and performances.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/materials_introduction
             * @param name Define the name of the material in the scene
             * @param scene Define the scene the material belong to
             * @param forceGLSL Use the GLSL code generation for the shader (even on WebGPU). Default is false
             */
            constructor(name, scene, forceGLSL = false) {
                super(name, scene, undefined, forceGLSL || _a.ForceGLSL);
                this._diffuseTexture = __runInitializers(this, __diffuseTexture_initializers, null);
                _StandardMaterial_diffuseTexture_accessor_storage.set(this, (__runInitializers(this, __diffuseTexture_extraInitializers), __runInitializers(this, _diffuseTexture_initializers, void 0)));
                this._ambientTexture = (__runInitializers(this, _diffuseTexture_extraInitializers), __runInitializers(this, __ambientTexture_initializers, null));
                _StandardMaterial_ambientTexture_accessor_storage.set(this, (__runInitializers(this, __ambientTexture_extraInitializers), __runInitializers(this, _ambientTexture_initializers, void 0)));
                this._opacityTexture = (__runInitializers(this, _ambientTexture_extraInitializers), __runInitializers(this, __opacityTexture_initializers, null));
                _StandardMaterial_opacityTexture_accessor_storage.set(this, (__runInitializers(this, __opacityTexture_extraInitializers), __runInitializers(this, _opacityTexture_initializers, void 0)));
                this._reflectionTexture = (__runInitializers(this, _opacityTexture_extraInitializers), __runInitializers(this, __reflectionTexture_initializers, null));
                _StandardMaterial_reflectionTexture_accessor_storage.set(this, (__runInitializers(this, __reflectionTexture_extraInitializers), __runInitializers(this, _reflectionTexture_initializers, void 0)));
                this._emissiveTexture = (__runInitializers(this, _reflectionTexture_extraInitializers), __runInitializers(this, __emissiveTexture_initializers, null));
                _StandardMaterial_emissiveTexture_accessor_storage.set(this, (__runInitializers(this, __emissiveTexture_extraInitializers), __runInitializers(this, _emissiveTexture_initializers, void 0)));
                this._specularTexture = (__runInitializers(this, _emissiveTexture_extraInitializers), __runInitializers(this, __specularTexture_initializers, null));
                _StandardMaterial_specularTexture_accessor_storage.set(this, (__runInitializers(this, __specularTexture_extraInitializers), __runInitializers(this, _specularTexture_initializers, void 0)));
                this._bumpTexture = (__runInitializers(this, _specularTexture_extraInitializers), __runInitializers(this, __bumpTexture_initializers, null));
                _StandardMaterial_bumpTexture_accessor_storage.set(this, (__runInitializers(this, __bumpTexture_extraInitializers), __runInitializers(this, _bumpTexture_initializers, void 0)));
                this._lightmapTexture = (__runInitializers(this, _bumpTexture_extraInitializers), __runInitializers(this, __lightmapTexture_initializers, null));
                _StandardMaterial_lightmapTexture_accessor_storage.set(this, (__runInitializers(this, __lightmapTexture_extraInitializers), __runInitializers(this, _lightmapTexture_initializers, void 0)));
                this._refractionTexture = (__runInitializers(this, _lightmapTexture_extraInitializers), __runInitializers(this, __refractionTexture_initializers, null));
                _StandardMaterial_refractionTexture_accessor_storage.set(this, (__runInitializers(this, __refractionTexture_extraInitializers), __runInitializers(this, _refractionTexture_initializers, void 0)));
                /**
                 * The color of the material lit by the environmental background lighting.
                 * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/materials_introduction#ambient-color-example
                 */
                this.ambientColor = (__runInitializers(this, _refractionTexture_extraInitializers), __runInitializers(this, _ambientColor_initializers, new Color3(0, 0, 0)));
                /**
                 * The basic color of the material as viewed under a light.
                 */
                this.diffuseColor = (__runInitializers(this, _ambientColor_extraInitializers), __runInitializers(this, _diffuseColor_initializers, new Color3(1, 1, 1)));
                /**
                 * Define how the color and intensity of the highlight given by the light in the material.
                 */
                this.specularColor = (__runInitializers(this, _diffuseColor_extraInitializers), __runInitializers(this, _specularColor_initializers, new Color3(1, 1, 1)));
                /**
                 * Define the color of the material as if self lit.
                 * This will be mixed in the final result even in the absence of light.
                 */
                this.emissiveColor = (__runInitializers(this, _specularColor_extraInitializers), __runInitializers(this, _emissiveColor_initializers, new Color3(0, 0, 0)));
                /**
                 * Defines how sharp are the highlights in the material.
                 * The bigger the value the sharper giving a more glossy feeling to the result.
                 * Reversely, the smaller the value the blurrier giving a more rough feeling to the result.
                 */
                this.specularPower = (__runInitializers(this, _emissiveColor_extraInitializers), __runInitializers(this, _specularPower_initializers, 64));
                this._useAlphaFromDiffuseTexture = (__runInitializers(this, _specularPower_extraInitializers), __runInitializers(this, __useAlphaFromDiffuseTexture_initializers, false));
                _StandardMaterial_useAlphaFromDiffuseTexture_accessor_storage.set(this, (__runInitializers(this, __useAlphaFromDiffuseTexture_extraInitializers), __runInitializers(this, _useAlphaFromDiffuseTexture_initializers, void 0)));
                this._useEmissiveAsIllumination = (__runInitializers(this, _useAlphaFromDiffuseTexture_extraInitializers), __runInitializers(this, __useEmissiveAsIllumination_initializers, false));
                _StandardMaterial_useEmissiveAsIllumination_accessor_storage.set(this, (__runInitializers(this, __useEmissiveAsIllumination_extraInitializers), __runInitializers(this, _useEmissiveAsIllumination_initializers, void 0)));
                this._linkEmissiveWithDiffuse = (__runInitializers(this, _useEmissiveAsIllumination_extraInitializers), __runInitializers(this, __linkEmissiveWithDiffuse_initializers, false));
                _StandardMaterial_linkEmissiveWithDiffuse_accessor_storage.set(this, (__runInitializers(this, __linkEmissiveWithDiffuse_extraInitializers), __runInitializers(this, _linkEmissiveWithDiffuse_initializers, void 0)));
                this._useSpecularOverAlpha = (__runInitializers(this, _linkEmissiveWithDiffuse_extraInitializers), __runInitializers(this, __useSpecularOverAlpha_initializers, false));
                _StandardMaterial_useSpecularOverAlpha_accessor_storage.set(this, (__runInitializers(this, __useSpecularOverAlpha_extraInitializers), __runInitializers(this, _useSpecularOverAlpha_initializers, void 0)));
                this._useReflectionOverAlpha = (__runInitializers(this, _useSpecularOverAlpha_extraInitializers), __runInitializers(this, __useReflectionOverAlpha_initializers, false));
                _StandardMaterial_useReflectionOverAlpha_accessor_storage.set(this, (__runInitializers(this, __useReflectionOverAlpha_extraInitializers), __runInitializers(this, _useReflectionOverAlpha_initializers, void 0)));
                this._disableLighting = (__runInitializers(this, _useReflectionOverAlpha_extraInitializers), __runInitializers(this, __disableLighting_initializers, false));
                _StandardMaterial_disableLighting_accessor_storage.set(this, (__runInitializers(this, __disableLighting_extraInitializers), __runInitializers(this, _disableLighting_initializers, void 0)));
                this._useObjectSpaceNormalMap = (__runInitializers(this, _disableLighting_extraInitializers), __runInitializers(this, __useObjectSpaceNormalMap_initializers, false));
                _StandardMaterial_useObjectSpaceNormalMap_accessor_storage.set(this, (__runInitializers(this, __useObjectSpaceNormalMap_extraInitializers), __runInitializers(this, _useObjectSpaceNormalMap_initializers, void 0)));
                this._useParallax = (__runInitializers(this, _useObjectSpaceNormalMap_extraInitializers), __runInitializers(this, __useParallax_initializers, false));
                _StandardMaterial_useParallax_accessor_storage.set(this, (__runInitializers(this, __useParallax_extraInitializers), __runInitializers(this, _useParallax_initializers, void 0)));
                this._useParallaxOcclusion = (__runInitializers(this, _useParallax_extraInitializers), __runInitializers(this, __useParallaxOcclusion_initializers, false));
                _StandardMaterial_useParallaxOcclusion_accessor_storage.set(this, (__runInitializers(this, __useParallaxOcclusion_extraInitializers), __runInitializers(this, _useParallaxOcclusion_initializers, void 0)));
                /**
                 * Apply a scaling factor that determine which "depth" the height map should reprensent. A value between 0.05 and 0.1 is reasonnable in Parallax, you can reach 0.2 using Parallax Occlusion.
                 */
                this.parallaxScaleBias = (__runInitializers(this, _useParallaxOcclusion_extraInitializers), __runInitializers(this, _parallaxScaleBias_initializers, 0.05));
                this._roughness = (__runInitializers(this, _parallaxScaleBias_extraInitializers), __runInitializers(this, __roughness_initializers, 0));
                _StandardMaterial_roughness_accessor_storage.set(this, (__runInitializers(this, __roughness_extraInitializers), __runInitializers(this, _roughness_initializers, void 0)));
                /**
                 * In case of refraction, define the value of the index of refraction.
                 * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/reflectionTexture#how-to-obtain-reflections-and-refractions
                 */
                this.indexOfRefraction = (__runInitializers(this, _roughness_extraInitializers), __runInitializers(this, _indexOfRefraction_initializers, 0.98));
                /**
                 * Invert the refraction texture alongside the y axis.
                 * It can be useful with procedural textures or probe for instance.
                 * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/reflectionTexture#how-to-obtain-reflections-and-refractions
                 */
                this.invertRefractionY = (__runInitializers(this, _indexOfRefraction_extraInitializers), __runInitializers(this, _invertRefractionY_initializers, true));
                /**
                 * Defines the alpha limits in alpha test mode.
                 */
                this.alphaCutOff = (__runInitializers(this, _invertRefractionY_extraInitializers), __runInitializers(this, _alphaCutOff_initializers, 0.4));
                this._useLightmapAsShadowmap = (__runInitializers(this, _alphaCutOff_extraInitializers), __runInitializers(this, __useLightmapAsShadowmap_initializers, false));
                _StandardMaterial_useLightmapAsShadowmap_accessor_storage.set(this, (__runInitializers(this, __useLightmapAsShadowmap_extraInitializers), __runInitializers(this, _useLightmapAsShadowmap_initializers, void 0)));
                // Fresnel
                this._diffuseFresnelParameters = (__runInitializers(this, _useLightmapAsShadowmap_extraInitializers), __runInitializers(this, __diffuseFresnelParameters_initializers, void 0));
                _StandardMaterial_diffuseFresnelParameters_accessor_storage.set(this, (__runInitializers(this, __diffuseFresnelParameters_extraInitializers), __runInitializers(this, _diffuseFresnelParameters_initializers, void 0)));
                this._opacityFresnelParameters = (__runInitializers(this, _diffuseFresnelParameters_extraInitializers), __runInitializers(this, __opacityFresnelParameters_initializers, void 0));
                _StandardMaterial_opacityFresnelParameters_accessor_storage.set(this, (__runInitializers(this, __opacityFresnelParameters_extraInitializers), __runInitializers(this, _opacityFresnelParameters_initializers, void 0)));
                this._reflectionFresnelParameters = (__runInitializers(this, _opacityFresnelParameters_extraInitializers), __runInitializers(this, __reflectionFresnelParameters_initializers, void 0));
                _StandardMaterial_reflectionFresnelParameters_accessor_storage.set(this, (__runInitializers(this, __reflectionFresnelParameters_extraInitializers), __runInitializers(this, _reflectionFresnelParameters_initializers, void 0)));
                this._refractionFresnelParameters = (__runInitializers(this, _reflectionFresnelParameters_extraInitializers), __runInitializers(this, __refractionFresnelParameters_initializers, void 0));
                _StandardMaterial_refractionFresnelParameters_accessor_storage.set(this, (__runInitializers(this, __refractionFresnelParameters_extraInitializers), __runInitializers(this, _refractionFresnelParameters_initializers, void 0)));
                this._emissiveFresnelParameters = (__runInitializers(this, _refractionFresnelParameters_extraInitializers), __runInitializers(this, __emissiveFresnelParameters_initializers, void 0));
                _StandardMaterial_emissiveFresnelParameters_accessor_storage.set(this, (__runInitializers(this, __emissiveFresnelParameters_extraInitializers), __runInitializers(this, _emissiveFresnelParameters_initializers, void 0)));
                this._useReflectionFresnelFromSpecular = (__runInitializers(this, _emissiveFresnelParameters_extraInitializers), __runInitializers(this, __useReflectionFresnelFromSpecular_initializers, false));
                _StandardMaterial_useReflectionFresnelFromSpecular_accessor_storage.set(this, (__runInitializers(this, __useReflectionFresnelFromSpecular_extraInitializers), __runInitializers(this, _useReflectionFresnelFromSpecular_initializers, void 0)));
                this._useGlossinessFromSpecularMapAlpha = (__runInitializers(this, _useReflectionFresnelFromSpecular_extraInitializers), __runInitializers(this, __useGlossinessFromSpecularMapAlpha_initializers, false));
                _StandardMaterial_useGlossinessFromSpecularMapAlpha_accessor_storage.set(this, (__runInitializers(this, __useGlossinessFromSpecularMapAlpha_extraInitializers), __runInitializers(this, _useGlossinessFromSpecularMapAlpha_initializers, void 0)));
                this._maxSimultaneousLights = (__runInitializers(this, _useGlossinessFromSpecularMapAlpha_extraInitializers), __runInitializers(this, __maxSimultaneousLights_initializers, 4));
                _StandardMaterial_maxSimultaneousLights_accessor_storage.set(this, (__runInitializers(this, __maxSimultaneousLights_extraInitializers), __runInitializers(this, _maxSimultaneousLights_initializers, void 0)));
                this._invertNormalMapX = (__runInitializers(this, _maxSimultaneousLights_extraInitializers), __runInitializers(this, __invertNormalMapX_initializers, false));
                _StandardMaterial_invertNormalMapX_accessor_storage.set(this, (__runInitializers(this, __invertNormalMapX_extraInitializers), __runInitializers(this, _invertNormalMapX_initializers, void 0)));
                this._invertNormalMapY = (__runInitializers(this, _invertNormalMapX_extraInitializers), __runInitializers(this, __invertNormalMapY_initializers, false));
                _StandardMaterial_invertNormalMapY_accessor_storage.set(this, (__runInitializers(this, __invertNormalMapY_extraInitializers), __runInitializers(this, _invertNormalMapY_initializers, void 0)));
                this._twoSidedLighting = (__runInitializers(this, _invertNormalMapY_extraInitializers), __runInitializers(this, __twoSidedLighting_initializers, false));
                _StandardMaterial_twoSidedLighting_accessor_storage.set(this, (__runInitializers(this, __twoSidedLighting_extraInitializers), __runInitializers(this, _twoSidedLighting_initializers, void 0)));
                this._applyDecalMapAfterDetailMap = (__runInitializers(this, _twoSidedLighting_extraInitializers), __runInitializers(this, __applyDecalMapAfterDetailMap_initializers, false));
                _StandardMaterial_applyDecalMapAfterDetailMap_accessor_storage.set(this, (__runInitializers(this, __applyDecalMapAfterDetailMap_extraInitializers), __runInitializers(this, _applyDecalMapAfterDetailMap_initializers, void 0)));
                this._vertexPullingMetadata = (__runInitializers(this, _applyDecalMapAfterDetailMap_extraInitializers), null);
                this._renderTargets = new SmartArray(16);
                this._globalAmbientColor = new Color3(0, 0, 0);
                this._cacheHasRenderTargetTextures = false;
                this.detailMap = new DetailMapConfiguration(this);
                // Setup the default processing configuration to the scene.
                this._attachImageProcessingConfiguration(null);
                this.prePassConfiguration = new PrePassConfiguration();
                this.getRenderTargetTextures = () => {
                    this._renderTargets.reset();
                    if (_a.ReflectionTextureEnabled && this._reflectionTexture && this._reflectionTexture.isRenderTarget) {
                        this._renderTargets.push(this._reflectionTexture);
                    }
                    if (_a.RefractionTextureEnabled && this._refractionTexture && this._refractionTexture.isRenderTarget) {
                        this._renderTargets.push(this._refractionTexture);
                    }
                    this._eventInfo.renderTargets = this._renderTargets;
                    this._callbackPluginEventFillRenderTargetTextures(this._eventInfo);
                    return this._renderTargets;
                };
            }
            /**
             * Gets a boolean indicating that current material needs to register RTT
             */
            get hasRenderTargetTextures() {
                if (_a.ReflectionTextureEnabled && this._reflectionTexture && this._reflectionTexture.isRenderTarget) {
                    return true;
                }
                if (_a.RefractionTextureEnabled && this._refractionTexture && this._refractionTexture.isRenderTarget) {
                    return true;
                }
                return this._cacheHasRenderTargetTextures;
            }
            /**
             * Gets the current class name of the material e.g. "StandardMaterial"
             * Mainly use in serialization.
             * @returns the class name
             */
            getClassName() {
                return "StandardMaterial";
            }
            /**
             * Specifies if the material will require alpha blending
             * @returns a boolean specifying if alpha blending is needed
             */
            needAlphaBlending() {
                if (this._hasTransparencyMode) {
                    return this._transparencyModeIsBlend;
                }
                if (this._disableAlphaBlending) {
                    return false;
                }
                return (this.alpha < 1.0 ||
                    this._opacityTexture != null ||
                    this._shouldUseAlphaFromDiffuseTexture() ||
                    (this._opacityFresnelParameters && this._opacityFresnelParameters.isEnabled));
            }
            /**
             * Specifies if this material should be rendered in alpha test mode
             * @returns a boolean specifying if an alpha test is needed.
             */
            needAlphaTesting() {
                if (this._hasTransparencyMode) {
                    return this._transparencyModeIsTest;
                }
                return this._hasAlphaChannel() && (this._transparencyMode == null || this._transparencyMode === Material.MATERIAL_ALPHATEST);
            }
            /**
             * @returns whether or not the alpha value of the diffuse texture should be used for alpha blending.
             */
            _shouldUseAlphaFromDiffuseTexture() {
                return this._diffuseTexture != null && this._diffuseTexture.hasAlpha && this._useAlphaFromDiffuseTexture && this._transparencyMode !== Material.MATERIAL_OPAQUE;
            }
            /**
             * @returns whether or not there is a usable alpha channel for transparency.
             */
            _hasAlphaChannel() {
                return (this._diffuseTexture != null && this._diffuseTexture.hasAlpha) || this._opacityTexture != null;
            }
            /**
             * Get the texture used for alpha test purpose.
             * @returns the diffuse texture in case of the standard material.
             */
            getAlphaTestTexture() {
                return this._diffuseTexture;
            }
            /**
             * Get if the submesh is ready to be used and all its information available.
             * Child classes can use it to update shaders
             * @param mesh defines the mesh to check
             * @param subMesh defines which submesh to check
             * @param useInstances specifies that instances should be used
             * @returns a boolean indicating that the submesh is ready or not
             */
            isReadyForSubMesh(mesh, subMesh, useInstances = false) {
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
                    subMesh.materialDefines = new StandardMaterialDefines(this._eventInfo.defineNames);
                }
                const scene = this.getScene();
                const defines = subMesh.materialDefines;
                if (this._isReadyForSubMesh(subMesh)) {
                    return true;
                }
                const engine = scene.getEngine();
                // Lights
                defines._needNormals = PrepareDefinesForLights(scene, mesh, defines, true, this._maxSimultaneousLights, this._disableLighting);
                if (!AreLightsTexturesReady(scene, mesh, this._maxSimultaneousLights, this._disableLighting)) {
                    return false;
                }
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
                    this._eventInfo.hasRenderTargetTextures = false;
                    this._callbackPluginEventHasRenderTargetTextures(this._eventInfo);
                    this._cacheHasRenderTargetTextures = this._eventInfo.hasRenderTargetTextures;
                    defines._needUVs = false;
                    for (let i = 1; i <= 6; ++i) {
                        defines["MAINUV" + i] = false;
                    }
                    if (scene.texturesEnabled) {
                        defines.DIFFUSEDIRECTUV = 0;
                        defines.BUMPDIRECTUV = 0;
                        defines.AMBIENTDIRECTUV = 0;
                        defines.OPACITYDIRECTUV = 0;
                        defines.EMISSIVEDIRECTUV = 0;
                        defines.SPECULARDIRECTUV = 0;
                        defines.LIGHTMAPDIRECTUV = 0;
                        if (this._diffuseTexture && _a.DiffuseTextureEnabled) {
                            if (!this._diffuseTexture.isReadyOrNotBlocking()) {
                                return false;
                            }
                            else {
                                PrepareDefinesForMergedUV(this._diffuseTexture, defines, "DIFFUSE");
                            }
                        }
                        else {
                            defines.DIFFUSE = false;
                        }
                        if (this._ambientTexture && _a.AmbientTextureEnabled) {
                            if (!this._ambientTexture.isReadyOrNotBlocking()) {
                                return false;
                            }
                            else {
                                PrepareDefinesForMergedUV(this._ambientTexture, defines, "AMBIENT");
                            }
                        }
                        else {
                            defines.AMBIENT = false;
                        }
                        if (this._opacityTexture && _a.OpacityTextureEnabled) {
                            if (!this._opacityTexture.isReadyOrNotBlocking()) {
                                return false;
                            }
                            else {
                                PrepareDefinesForMergedUV(this._opacityTexture, defines, "OPACITY");
                                defines.OPACITYRGB = this._opacityTexture.getAlphaFromRGB;
                            }
                        }
                        else {
                            defines.OPACITY = false;
                        }
                        if (this._reflectionTexture && _a.ReflectionTextureEnabled) {
                            defines.ROUGHNESS = this._roughness > 0;
                            defines.REFLECTIONOVERALPHA = this._useReflectionOverAlpha;
                        }
                        else {
                            defines.ROUGHNESS = false;
                            defines.REFLECTIONOVERALPHA = false;
                        }
                        if (!PrepareDefinesForIBL(scene, this._reflectionTexture, defines)) {
                            return false;
                        }
                        if (this._emissiveTexture && _a.EmissiveTextureEnabled) {
                            if (!this._emissiveTexture.isReadyOrNotBlocking()) {
                                return false;
                            }
                            else {
                                PrepareDefinesForMergedUV(this._emissiveTexture, defines, "EMISSIVE");
                            }
                        }
                        else {
                            defines.EMISSIVE = false;
                        }
                        if (this._lightmapTexture && _a.LightmapTextureEnabled) {
                            if (!this._lightmapTexture.isReadyOrNotBlocking()) {
                                return false;
                            }
                            else {
                                PrepareDefinesForMergedUV(this._lightmapTexture, defines, "LIGHTMAP");
                                defines.USELIGHTMAPASSHADOWMAP = this._useLightmapAsShadowmap;
                                defines.RGBDLIGHTMAP = this._lightmapTexture.isRGBD;
                            }
                        }
                        else {
                            defines.LIGHTMAP = false;
                        }
                        if (this._specularTexture && _a.SpecularTextureEnabled) {
                            if (!this._specularTexture.isReadyOrNotBlocking()) {
                                return false;
                            }
                            else {
                                PrepareDefinesForMergedUV(this._specularTexture, defines, "SPECULAR");
                                defines.GLOSSINESS = this._useGlossinessFromSpecularMapAlpha;
                            }
                        }
                        else {
                            defines.SPECULAR = false;
                        }
                        if (scene.getEngine().getCaps().standardDerivatives && this._bumpTexture && _a.BumpTextureEnabled) {
                            // Bump texture can not be not blocking.
                            if (!this._bumpTexture.isReady()) {
                                return false;
                            }
                            else {
                                PrepareDefinesForMergedUV(this._bumpTexture, defines, "BUMP");
                                defines.PARALLAX = this._useParallax;
                                defines.PARALLAX_RHS = scene.useRightHandedSystem;
                                defines.PARALLAXOCCLUSION = this._useParallaxOcclusion;
                            }
                            defines.OBJECTSPACE_NORMALMAP = this._useObjectSpaceNormalMap;
                        }
                        else {
                            defines.BUMP = false;
                            defines.PARALLAX = false;
                            defines.PARALLAX_RHS = false;
                            defines.PARALLAXOCCLUSION = false;
                        }
                        if (this._refractionTexture && _a.RefractionTextureEnabled) {
                            if (!this._refractionTexture.isReadyOrNotBlocking()) {
                                return false;
                            }
                            else {
                                defines._needUVs = true;
                                defines.REFRACTION = true;
                                defines.REFRACTIONMAP_3D = this._refractionTexture.isCube;
                                defines.RGBDREFRACTION = this._refractionTexture.isRGBD;
                                defines.USE_LOCAL_REFRACTIONMAP_CUBIC = this._refractionTexture.boundingBoxSize ? true : false;
                            }
                        }
                        else {
                            defines.REFRACTION = false;
                        }
                        defines.TWOSIDEDLIGHTING = !this._backFaceCulling && this._twoSidedLighting;
                    }
                    else {
                        defines.DIFFUSE = false;
                        defines.AMBIENT = false;
                        defines.OPACITY = false;
                        defines.REFLECTION = false;
                        defines.EMISSIVE = false;
                        defines.LIGHTMAP = false;
                        defines.BUMP = false;
                        defines.REFRACTION = false;
                    }
                    defines.ALPHAFROMDIFFUSE = this._shouldUseAlphaFromDiffuseTexture();
                    defines.EMISSIVEASILLUMINATION = this._useEmissiveAsIllumination;
                    defines.LINKEMISSIVEWITHDIFFUSE = this._linkEmissiveWithDiffuse;
                    defines.SPECULAROVERALPHA = this._useSpecularOverAlpha;
                    defines.PREMULTIPLYALPHA = this.alphaMode === 7 || this.alphaMode === 8;
                    defines.ALPHATEST_AFTERALLALPHACOMPUTATIONS = this.transparencyMode !== null;
                    defines.ALPHABLEND = this.transparencyMode === null || this.needAlphaBlendingForMesh(mesh); // check on null for backward compatibility
                    defines.TEXTURE_REPETITION_MODE = engine.version > 1 || engine.isWebGPU ? this.textureRepetitionMode : 0;
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
                    this._imageProcessingConfiguration.prepareDefines(defines);
                    defines.IS_REFLECTION_LINEAR = this.reflectionTexture != null && !this.reflectionTexture.gammaSpace;
                    defines.IS_REFRACTION_LINEAR = this.refractionTexture != null && !this.refractionTexture.gammaSpace;
                }
                if (defines._areFresnelDirty) {
                    if (_a.FresnelEnabled) {
                        // Fresnel
                        if (this._diffuseFresnelParameters ||
                            this._opacityFresnelParameters ||
                            this._emissiveFresnelParameters ||
                            this._refractionFresnelParameters ||
                            this._reflectionFresnelParameters) {
                            defines.DIFFUSEFRESNEL = this._diffuseFresnelParameters && this._diffuseFresnelParameters.isEnabled;
                            defines.OPACITYFRESNEL = this._opacityFresnelParameters && this._opacityFresnelParameters.isEnabled;
                            defines.REFLECTIONFRESNEL = this._reflectionFresnelParameters && this._reflectionFresnelParameters.isEnabled;
                            defines.REFLECTIONFRESNELFROMSPECULAR = this._useReflectionFresnelFromSpecular;
                            defines.REFRACTIONFRESNEL = this._refractionFresnelParameters && this._refractionFresnelParameters.isEnabled;
                            defines.EMISSIVEFRESNEL = this._emissiveFresnelParameters && this._emissiveFresnelParameters.isEnabled;
                            defines._needNormals = true;
                            defines.FRESNEL = true;
                        }
                    }
                    else {
                        defines.FRESNEL = false;
                    }
                }
                // Check if lights are ready
                if (defines["AREALIGHTUSED"] || defines["CLUSTLIGHT_BATCH"]) {
                    for (let index = 0; index < mesh.lightSources.length; index++) {
                        if (!mesh.lightSources[index]._isReady()) {
                            return false;
                        }
                    }
                }
                // Misc.
                PrepareDefinesForMisc(mesh, scene, this._useLogarithmicDepth, this.pointsCloud, this.fogEnabled, this.needAlphaTestingForMesh(mesh), defines, this._applyDecalMapAfterDetailMap, this._useVertexPulling, subMesh.getRenderingMesh(), this._isVertexOutputInvariant);
                // Values that need to be evaluated on every frame
                PrepareDefinesForFrameBoundValues(scene, engine, this, defines, useInstances, null, subMesh.getRenderingMesh().hasThinInstances);
                // External config
                this._eventInfo.defines = defines;
                this._eventInfo.mesh = mesh;
                this._callbackPluginEventPrepareDefinesBeforeAttributes(this._eventInfo);
                // Attribs
                PrepareDefinesForAttributes(mesh, defines, true, true, true);
                // External config
                this._callbackPluginEventPrepareDefines(this._eventInfo);
                // Get correct effect
                let forceWasNotReadyPreviously = false;
                if (defines.isDirty) {
                    const lightDisposed = defines._areLightsDisposed;
                    defines.markAsProcessed();
                    // Fallbacks
                    const fallbacks = new EffectFallbacks();
                    if (defines.REFLECTION) {
                        fallbacks.addFallback(0, "REFLECTION");
                    }
                    if (defines.SPECULAR) {
                        fallbacks.addFallback(0, "SPECULAR");
                    }
                    if (defines.BUMP) {
                        fallbacks.addFallback(0, "BUMP");
                    }
                    if (defines.PARALLAX) {
                        fallbacks.addFallback(1, "PARALLAX");
                    }
                    if (defines.PARALLAX_RHS) {
                        fallbacks.addFallback(1, "PARALLAX_RHS");
                    }
                    if (defines.PARALLAXOCCLUSION) {
                        fallbacks.addFallback(0, "PARALLAXOCCLUSION");
                    }
                    if (defines.SPECULAROVERALPHA) {
                        fallbacks.addFallback(0, "SPECULAROVERALPHA");
                    }
                    if (defines.FOG) {
                        fallbacks.addFallback(1, "FOG");
                    }
                    if (defines.POINTSIZE) {
                        fallbacks.addFallback(0, "POINTSIZE");
                    }
                    if (defines.LOGARITHMICDEPTH) {
                        fallbacks.addFallback(0, "LOGARITHMICDEPTH");
                    }
                    HandleFallbacksForShadows(defines, fallbacks, this._maxSimultaneousLights);
                    if (defines.SPECULARTERM) {
                        fallbacks.addFallback(0, "SPECULARTERM");
                    }
                    if (defines.DIFFUSEFRESNEL) {
                        fallbacks.addFallback(1, "DIFFUSEFRESNEL");
                    }
                    if (defines.OPACITYFRESNEL) {
                        fallbacks.addFallback(2, "OPACITYFRESNEL");
                    }
                    if (defines.REFLECTIONFRESNEL) {
                        fallbacks.addFallback(3, "REFLECTIONFRESNEL");
                    }
                    if (defines.EMISSIVEFRESNEL) {
                        fallbacks.addFallback(4, "EMISSIVEFRESNEL");
                    }
                    if (defines.FRESNEL) {
                        fallbacks.addFallback(4, "FRESNEL");
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
                    let shaderName = "default";
                    const uniforms = [
                        "world",
                        "view",
                        "viewProjection",
                        "vEyePosition",
                        "vLightsType",
                        "vAmbientColor",
                        "vDiffuseColor",
                        "vSpecularColor",
                        "vEmissiveColor",
                        "visibility",
                        "vFogInfos",
                        "vFogColor",
                        "pointSize",
                        "vDiffuseInfos",
                        "vAmbientInfos",
                        "vOpacityInfos",
                        "vEmissiveInfos",
                        "vSpecularInfos",
                        "vBumpInfos",
                        "vLightmapInfos",
                        "vRefractionInfos",
                        "mBones",
                        "diffuseMatrix",
                        "ambientMatrix",
                        "opacityMatrix",
                        "emissiveMatrix",
                        "specularMatrix",
                        "bumpMatrix",
                        "normalMatrix",
                        "lightmapMatrix",
                        "refractionMatrix",
                        "diffuseLeftColor",
                        "diffuseRightColor",
                        "opacityParts",
                        "reflectionLeftColor",
                        "reflectionRightColor",
                        "emissiveLeftColor",
                        "emissiveRightColor",
                        "refractionLeftColor",
                        "refractionRightColor",
                        "vRefractionPosition",
                        "vRefractionSize",
                        "logarithmicDepthConstant",
                        "vTangentSpaceParams",
                        "alphaCutOff",
                        "boneTextureInfo",
                        "morphTargetTextureInfo",
                        "morphTargetTextureIndices",
                        "cameraInfo",
                        "vTextureRepetitionHexTilingParams",
                    ];
                    const samplers = [
                        "diffuseSampler",
                        "ambientSampler",
                        "opacitySampler",
                        "reflectionCubeSampler",
                        "reflection2DSampler",
                        "emissiveSampler",
                        "specularSampler",
                        "bumpSampler",
                        "lightmapSampler",
                        "refractionCubeSampler",
                        "refraction2DSampler",
                        "boneSampler",
                        "morphTargets",
                        "oitDepthSampler",
                        "oitFrontColorSampler",
                        "areaLightsLTC1Sampler",
                        "areaLightsLTC2Sampler",
                    ];
                    PrepareUniformsAndSamplersForIBL(uniforms, samplers, false);
                    const uniformBuffers = ["Material", "Scene", "Mesh"];
                    const indexParameters = { maxSimultaneousLights: this._maxSimultaneousLights, maxSimultaneousMorphTargets: defines.NUM_MORPH_INFLUENCERS };
                    this._eventInfo.fallbacks = fallbacks;
                    this._eventInfo.fallbackRank = 0;
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
                    AddClipPlaneUniforms(uniforms);
                    // Vertex pulling metadata uniforms
                    if (this._useVertexPulling) {
                        const renderingMesh = subMesh.getRenderingMesh();
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
                    const csnrOptions = {};
                    if (this.customShaderNameResolve) {
                        shaderName = this.customShaderNameResolve(shaderName, uniforms, uniformBuffers, samplers, defines, attribs, csnrOptions);
                    }
                    const join = defines.toString();
                    const previousEffect = subMesh.effect;
                    const effect = scene.getEngine().createEffect(shaderName, {
                        attributes: attribs,
                        uniformsNames: uniforms,
                        uniformBuffersNames: uniformBuffers,
                        samplers: samplers,
                        defines: join,
                        fallbacks: fallbacks,
                        onCompiled: this.onCompiled,
                        onError: this.onError,
                        indexParameters,
                        processFinalCode: csnrOptions.processFinalCode,
                        processCodeAfterIncludes: this._eventInfo.customCode,
                        multiTarget: defines.PREPASS,
                        shaderLanguage: this._shaderLanguage,
                        extraInitializationsAsync: _a._ShaderLoader.getLoadCallback(this._shaderLanguage),
                    }, engine);
                    this._eventInfo.customCode = undefined;
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
                }
                if (!subMesh.effect || !subMesh.effect.isReady()) {
                    return false;
                }
                defines._renderId = scene.getRenderId();
                drawWrapper._wasPreviouslyReady = forceWasNotReadyPreviously ? false : true;
                drawWrapper._wasPreviouslyUsingInstances = useInstances;
                this._checkScenePerformancePriority();
                return true;
            }
            /**
             * Builds the material UBO layouts.
             * Used internally during the effect preparation.
             */
            buildUniformLayout() {
                // Order is important !
                const ubo = this._uniformBuffer;
                ubo.addUniform("diffuseLeftColor", 4);
                ubo.addUniform("diffuseRightColor", 4);
                ubo.addUniform("opacityParts", 4);
                ubo.addUniform("reflectionLeftColor", 4);
                ubo.addUniform("reflectionRightColor", 4);
                ubo.addUniform("refractionLeftColor", 4);
                ubo.addUniform("refractionRightColor", 4);
                ubo.addUniform("emissiveLeftColor", 4);
                ubo.addUniform("emissiveRightColor", 4);
                ubo.addUniform("vDiffuseInfos", 2);
                ubo.addUniform("vAmbientInfos", 2);
                ubo.addUniform("vOpacityInfos", 2);
                ubo.addUniform("vEmissiveInfos", 2);
                ubo.addUniform("vLightmapInfos", 2);
                ubo.addUniform("vSpecularInfos", 2);
                ubo.addUniform("vBumpInfos", 3);
                ubo.addUniform("diffuseMatrix", 16);
                ubo.addUniform("ambientMatrix", 16);
                ubo.addUniform("opacityMatrix", 16);
                ubo.addUniform("emissiveMatrix", 16);
                ubo.addUniform("lightmapMatrix", 16);
                ubo.addUniform("specularMatrix", 16);
                ubo.addUniform("bumpMatrix", 16);
                ubo.addUniform("vTangentSpaceParams", 2);
                ubo.addUniform("pointSize", 1);
                ubo.addUniform("alphaCutOff", 1);
                ubo.addUniform("refractionMatrix", 16);
                ubo.addUniform("vRefractionInfos", 4);
                ubo.addUniform("vRefractionPosition", 3);
                ubo.addUniform("vRefractionSize", 3);
                ubo.addUniform("vSpecularColor", 4);
                ubo.addUniform("vEmissiveColor", 3);
                ubo.addUniform("vDiffuseColor", 4);
                ubo.addUniform("vAmbientColor", 3);
                ubo.addUniform("cameraInfo", 4);
                ubo.addUniform("vTextureRepetitionHexTilingParams", 4);
                PrepareUniformLayoutForIBL(ubo, false, true);
                super.buildUniformLayout();
            }
            /**
             * Binds the submesh to this material by preparing the effect and shader to draw
             * @param world defines the world transformation matrix
             * @param mesh defines the mesh containing the submesh
             * @param subMesh defines the submesh to bind the material to
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
                // Binding unconditionally
                this._uniformBuffer.bindToEffect(effect, "Material");
                this.prePassConfiguration.bindForSubMesh(this._activeEffect, scene, mesh, world, this.isFrozen);
                MaterialHelperGeometryRendering.Bind(scene.getEngine().currentRenderPassId, this._activeEffect, mesh, world, this);
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
                const needToAlwaysBindUniformBuffers = scene.getEngine()._features.needToAlwaysBindUniformBuffers;
                // Bones
                BindBonesParameters(mesh, effect);
                // Vertex pulling
                if (this._vertexPullingMetadata) {
                    BindVertexPullingUniforms(effect, this._vertexPullingMetadata);
                }
                const ubo = this._uniformBuffer;
                if (mustRebind) {
                    this.bindViewProjection(effect);
                    if (!ubo.useUbo || !this.isFrozen || !ubo.isSync || subMesh._drawWrapper._forceRebindOnNextCall) {
                        if (_a.FresnelEnabled && defines.FRESNEL) {
                            // Fresnel
                            if (this.diffuseFresnelParameters && this.diffuseFresnelParameters.isEnabled) {
                                ubo.updateColor4("diffuseLeftColor", this.diffuseFresnelParameters.leftColor, this.diffuseFresnelParameters.power);
                                ubo.updateColor4("diffuseRightColor", this.diffuseFresnelParameters.rightColor, this.diffuseFresnelParameters.bias);
                            }
                            if (this.opacityFresnelParameters && this.opacityFresnelParameters.isEnabled) {
                                const opacityParts = TmpColors.Color3[0];
                                opacityParts.set(this.opacityFresnelParameters.leftColor.toLuminance(), this.opacityFresnelParameters.rightColor.toLuminance(), this.opacityFresnelParameters.bias);
                                ubo.updateColor4("opacityParts", opacityParts, this.opacityFresnelParameters.power);
                            }
                            if (this.reflectionFresnelParameters && this.reflectionFresnelParameters.isEnabled) {
                                ubo.updateColor4("reflectionLeftColor", this.reflectionFresnelParameters.leftColor, this.reflectionFresnelParameters.power);
                                ubo.updateColor4("reflectionRightColor", this.reflectionFresnelParameters.rightColor, this.reflectionFresnelParameters.bias);
                            }
                            if (this.refractionFresnelParameters && this.refractionFresnelParameters.isEnabled) {
                                ubo.updateColor4("refractionLeftColor", this.refractionFresnelParameters.leftColor, this.refractionFresnelParameters.power);
                                ubo.updateColor4("refractionRightColor", this.refractionFresnelParameters.rightColor, this.refractionFresnelParameters.bias);
                            }
                            if (this.emissiveFresnelParameters && this.emissiveFresnelParameters.isEnabled) {
                                ubo.updateColor4("emissiveLeftColor", this.emissiveFresnelParameters.leftColor, this.emissiveFresnelParameters.power);
                                ubo.updateColor4("emissiveRightColor", this.emissiveFresnelParameters.rightColor, this.emissiveFresnelParameters.bias);
                            }
                        }
                        // Textures
                        if (scene.texturesEnabled) {
                            if (this._diffuseTexture && _a.DiffuseTextureEnabled) {
                                ubo.updateFloat2("vDiffuseInfos", this._diffuseTexture.coordinatesIndex, this._diffuseTexture.level);
                                BindTextureMatrix(this._diffuseTexture, ubo, "diffuse");
                            }
                            if (this._ambientTexture && _a.AmbientTextureEnabled) {
                                ubo.updateFloat2("vAmbientInfos", this._ambientTexture.coordinatesIndex, this._ambientTexture.level);
                                BindTextureMatrix(this._ambientTexture, ubo, "ambient");
                            }
                            if (this._opacityTexture && _a.OpacityTextureEnabled) {
                                ubo.updateFloat2("vOpacityInfos", this._opacityTexture.coordinatesIndex, this._opacityTexture.level);
                                BindTextureMatrix(this._opacityTexture, ubo, "opacity");
                            }
                            if (this._hasAlphaChannel()) {
                                ubo.updateFloat("alphaCutOff", this.alphaCutOff);
                            }
                            BindIBLParameters(scene, defines, ubo, Color3.White(), this._reflectionTexture, false, false, true, false, false, false, this.roughness);
                            if (!this._reflectionTexture || !_a.ReflectionTextureEnabled) {
                                ubo.updateFloat2("vReflectionInfos", 0.0, this.roughness);
                            }
                            if (this._emissiveTexture && _a.EmissiveTextureEnabled) {
                                ubo.updateFloat2("vEmissiveInfos", this._emissiveTexture.coordinatesIndex, this._emissiveTexture.level);
                                BindTextureMatrix(this._emissiveTexture, ubo, "emissive");
                            }
                            if (this._lightmapTexture && _a.LightmapTextureEnabled) {
                                ubo.updateFloat2("vLightmapInfos", this._lightmapTexture.coordinatesIndex, this._lightmapTexture.level);
                                BindTextureMatrix(this._lightmapTexture, ubo, "lightmap");
                            }
                            if (this._specularTexture && _a.SpecularTextureEnabled) {
                                ubo.updateFloat2("vSpecularInfos", this._specularTexture.coordinatesIndex, this._specularTexture.level);
                                BindTextureMatrix(this._specularTexture, ubo, "specular");
                            }
                            if (this._bumpTexture && scene.getEngine().getCaps().standardDerivatives && _a.BumpTextureEnabled) {
                                ubo.updateFloat3("vBumpInfos", this._bumpTexture.coordinatesIndex, 1.0 / this._bumpTexture.level, this.parallaxScaleBias);
                                BindTextureMatrix(this._bumpTexture, ubo, "bump");
                                if (scene._mirroredCameraPosition) {
                                    ubo.updateFloat2("vTangentSpaceParams", this._invertNormalMapX ? 1.0 : -1.0, this._invertNormalMapY ? 1.0 : -1.0);
                                }
                                else {
                                    ubo.updateFloat2("vTangentSpaceParams", this._invertNormalMapX ? -1.0 : 1.0, this._invertNormalMapY ? -1.0 : 1.0);
                                }
                            }
                            if (this._refractionTexture && _a.RefractionTextureEnabled) {
                                let depth = 1.0;
                                if (!this._refractionTexture.isCube) {
                                    ubo.updateMatrix("refractionMatrix", this._refractionTexture.getReflectionTextureMatrix());
                                    if (this._refractionTexture.depth) {
                                        depth = this._refractionTexture.depth;
                                    }
                                }
                                ubo.updateFloat4("vRefractionInfos", this._refractionTexture.level, this.indexOfRefraction, depth, this.invertRefractionY ? -1 : 1);
                                if (this._refractionTexture.boundingBoxSize) {
                                    const cubeTexture = this._refractionTexture;
                                    ubo.updateVector3("vRefractionPosition", cubeTexture.boundingBoxPosition);
                                    ubo.updateVector3("vRefractionSize", cubeTexture.boundingBoxSize);
                                }
                            }
                        }
                        // Point size
                        if (this.pointsCloud) {
                            ubo.updateFloat("pointSize", this.pointSize);
                        }
                        ubo.updateColor4("vSpecularColor", this.specularColor, this.specularPower);
                        ubo.updateColor3("vEmissiveColor", _a.EmissiveTextureEnabled ? this.emissiveColor : Color3.BlackReadOnly);
                        ubo.updateColor4("vDiffuseColor", this.diffuseColor, this.alpha);
                        scene.ambientColor.multiplyToRef(this.ambientColor, this._globalAmbientColor);
                        ubo.updateColor3("vAmbientColor", this._globalAmbientColor);
                    }
                    // Textures
                    if (scene.texturesEnabled) {
                        if (this._diffuseTexture && _a.DiffuseTextureEnabled) {
                            effect.setTexture("diffuseSampler", this._diffuseTexture);
                        }
                        if (this._ambientTexture && _a.AmbientTextureEnabled) {
                            effect.setTexture("ambientSampler", this._ambientTexture);
                        }
                        if (this._opacityTexture && _a.OpacityTextureEnabled) {
                            effect.setTexture("opacitySampler", this._opacityTexture);
                        }
                        if (this._reflectionTexture && _a.ReflectionTextureEnabled) {
                            if (this._reflectionTexture.isCube) {
                                effect.setTexture("reflectionCubeSampler", this._reflectionTexture);
                            }
                            else {
                                effect.setTexture("reflection2DSampler", this._reflectionTexture);
                            }
                        }
                        if (this._emissiveTexture && _a.EmissiveTextureEnabled) {
                            effect.setTexture("emissiveSampler", this._emissiveTexture);
                        }
                        if (this._lightmapTexture && _a.LightmapTextureEnabled) {
                            effect.setTexture("lightmapSampler", this._lightmapTexture);
                        }
                        if (this._specularTexture && _a.SpecularTextureEnabled) {
                            effect.setTexture("specularSampler", this._specularTexture);
                        }
                        if (this._bumpTexture && scene.getEngine().getCaps().standardDerivatives && _a.BumpTextureEnabled) {
                            effect.setTexture("bumpSampler", this._bumpTexture);
                        }
                        if (this._refractionTexture && _a.RefractionTextureEnabled) {
                            if (this._refractionTexture.isCube) {
                                effect.setTexture("refractionCubeSampler", this._refractionTexture);
                            }
                            else {
                                effect.setTexture("refraction2DSampler", this._refractionTexture);
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
                    BindClipPlane(effect, this, scene);
                    // Colors
                    this.bindEyePosition(effect);
                }
                else if (needToAlwaysBindUniformBuffers) {
                    this._needToBindSceneUbo = true;
                }
                // Lights
                if ((mustRebind || !this.isFrozen || needToAlwaysBindUniformBuffers) && scene.lightsEnabled && !this._disableLighting) {
                    BindLights(scene, mesh, effect, defines, this._maxSimultaneousLights);
                }
                if (mustRebind || !this.isFrozen) {
                    // View
                    if ((scene.fogEnabled && mesh.applyFog && scene.fogMode !== Scene.FOGMODE_NONE) ||
                        this._reflectionTexture ||
                        this._refractionTexture ||
                        mesh.receiveShadows ||
                        defines.PREPASS ||
                        defines["CLUSTLIGHT_BATCH"]) {
                        this.bindView(effect);
                    }
                    // Fog
                    BindFogParameters(scene, mesh, effect);
                    // Morph targets
                    if (defines.NUM_MORPH_INFLUENCERS) {
                        BindMorphTargetParameters(mesh, effect);
                    }
                    if (defines.BAKED_VERTEX_ANIMATION_TEXTURE) {
                        mesh.bakedVertexAnimationManager?.bind(effect, defines.INSTANCES);
                    }
                    // Log. depth
                    if (this.useLogarithmicDepth) {
                        BindLogDepth(defines, effect, scene);
                    }
                    // image processing
                    if (this._imageProcessingConfiguration && !this._imageProcessingConfiguration.applyByPostProcess) {
                        this._imageProcessingConfiguration.bind(this._activeEffect);
                    }
                }
                this._afterBind(mesh, this._activeEffect, subMesh);
                ubo.update();
            }
            /**
             * Get the list of animatables in the material.
             * @returns the list of animatables object used in the material
             */
            getAnimatables() {
                const results = super.getAnimatables();
                if (this._diffuseTexture && this._diffuseTexture.animations && this._diffuseTexture.animations.length > 0) {
                    results.push(this._diffuseTexture);
                }
                if (this._ambientTexture && this._ambientTexture.animations && this._ambientTexture.animations.length > 0) {
                    results.push(this._ambientTexture);
                }
                if (this._opacityTexture && this._opacityTexture.animations && this._opacityTexture.animations.length > 0) {
                    results.push(this._opacityTexture);
                }
                if (this._reflectionTexture && this._reflectionTexture.animations && this._reflectionTexture.animations.length > 0) {
                    results.push(this._reflectionTexture);
                }
                if (this._emissiveTexture && this._emissiveTexture.animations && this._emissiveTexture.animations.length > 0) {
                    results.push(this._emissiveTexture);
                }
                if (this._specularTexture && this._specularTexture.animations && this._specularTexture.animations.length > 0) {
                    results.push(this._specularTexture);
                }
                if (this._bumpTexture && this._bumpTexture.animations && this._bumpTexture.animations.length > 0) {
                    results.push(this._bumpTexture);
                }
                if (this._lightmapTexture && this._lightmapTexture.animations && this._lightmapTexture.animations.length > 0) {
                    results.push(this._lightmapTexture);
                }
                if (this._refractionTexture && this._refractionTexture.animations && this._refractionTexture.animations.length > 0) {
                    results.push(this._refractionTexture);
                }
                return results;
            }
            /**
             * Gets the active textures from the material
             * @returns an array of textures
             */
            getActiveTextures() {
                const activeTextures = super.getActiveTextures();
                if (this._diffuseTexture) {
                    activeTextures.push(this._diffuseTexture);
                }
                if (this._ambientTexture) {
                    activeTextures.push(this._ambientTexture);
                }
                if (this._opacityTexture) {
                    activeTextures.push(this._opacityTexture);
                }
                if (this._reflectionTexture) {
                    activeTextures.push(this._reflectionTexture);
                }
                if (this._emissiveTexture) {
                    activeTextures.push(this._emissiveTexture);
                }
                if (this._specularTexture) {
                    activeTextures.push(this._specularTexture);
                }
                if (this._bumpTexture) {
                    activeTextures.push(this._bumpTexture);
                }
                if (this._lightmapTexture) {
                    activeTextures.push(this._lightmapTexture);
                }
                if (this._refractionTexture) {
                    activeTextures.push(this._refractionTexture);
                }
                return activeTextures;
            }
            /**
             * Specifies if the material uses a texture
             * @param texture defines the texture to check against the material
             * @returns a boolean specifying if the material uses the texture
             */
            hasTexture(texture) {
                if (super.hasTexture(texture)) {
                    return true;
                }
                if (this._diffuseTexture === texture) {
                    return true;
                }
                if (this._ambientTexture === texture) {
                    return true;
                }
                if (this._opacityTexture === texture) {
                    return true;
                }
                if (this._reflectionTexture === texture) {
                    return true;
                }
                if (this._emissiveTexture === texture) {
                    return true;
                }
                if (this._specularTexture === texture) {
                    return true;
                }
                if (this._bumpTexture === texture) {
                    return true;
                }
                if (this._lightmapTexture === texture) {
                    return true;
                }
                if (this._refractionTexture === texture) {
                    return true;
                }
                return false;
            }
            /**
             * Disposes the material
             * @param forceDisposeEffect specifies if effects should be forcefully disposed
             * @param forceDisposeTextures specifies if textures should be forcefully disposed
             */
            dispose(forceDisposeEffect, forceDisposeTextures) {
                if (forceDisposeTextures) {
                    this._diffuseTexture?.dispose();
                    this._ambientTexture?.dispose();
                    this._opacityTexture?.dispose();
                    this._reflectionTexture?.dispose();
                    this._emissiveTexture?.dispose();
                    this._specularTexture?.dispose();
                    this._bumpTexture?.dispose();
                    this._lightmapTexture?.dispose();
                    this._refractionTexture?.dispose();
                }
                if (this._imageProcessingConfiguration && this._imageProcessingObserver) {
                    this._imageProcessingConfiguration.onUpdateParameters.remove(this._imageProcessingObserver);
                }
                super.dispose(forceDisposeEffect, forceDisposeTextures);
            }
            /**
             * Makes a duplicate of the material, and gives it a new name
             * @param name defines the new name for the duplicated material
             * @param cloneTexturesOnlyOnce - if a texture is used in more than one channel (e.g diffuse and opacity), only clone it once and reuse it on the other channels. Default false.
             * @param rootUrl defines the root URL to use to load textures
             * @returns the cloned material
             */
            clone(name, cloneTexturesOnlyOnce = true, rootUrl = "") {
                const result = SerializationHelper.Clone(() => new _a(name, this.getScene()), this, { cloneTexturesOnlyOnce });
                result.name = name;
                result.id = name;
                this.stencil.copyTo(result.stencil);
                this._clonePlugins(result, rootUrl);
                return result;
            }
            /**
             * Creates a standard material from parsed material data
             * @param source defines the JSON representation of the material
             * @param scene defines the hosting scene
             * @param rootUrl defines the root URL to use to load textures and relative dependencies
             * @returns a new standard material
             */
            static Parse(source, scene, rootUrl) {
                const material = SerializationHelper.Parse(() => new _a(source.name, scene), source, scene, rootUrl);
                if (source.stencil) {
                    material.stencil.parse(source.stencil, scene, rootUrl);
                }
                Material._ParsePlugins(source, material, scene, rootUrl);
                return material;
            }
            // Flags used to enable or disable a type of texture for all Standard Materials
            /**
             * Are diffuse textures enabled in the application.
             */
            static get DiffuseTextureEnabled() {
                return MaterialFlags.DiffuseTextureEnabled;
            }
            static set DiffuseTextureEnabled(value) {
                MaterialFlags.DiffuseTextureEnabled = value;
            }
            /**
             * Are detail textures enabled in the application.
             */
            static get DetailTextureEnabled() {
                return MaterialFlags.DetailTextureEnabled;
            }
            static set DetailTextureEnabled(value) {
                MaterialFlags.DetailTextureEnabled = value;
            }
            /**
             * Are ambient textures enabled in the application.
             */
            static get AmbientTextureEnabled() {
                return MaterialFlags.AmbientTextureEnabled;
            }
            static set AmbientTextureEnabled(value) {
                MaterialFlags.AmbientTextureEnabled = value;
            }
            /**
             * Are opacity textures enabled in the application.
             */
            static get OpacityTextureEnabled() {
                return MaterialFlags.OpacityTextureEnabled;
            }
            static set OpacityTextureEnabled(value) {
                MaterialFlags.OpacityTextureEnabled = value;
            }
            /**
             * Are reflection textures enabled in the application.
             */
            static get ReflectionTextureEnabled() {
                return MaterialFlags.ReflectionTextureEnabled;
            }
            static set ReflectionTextureEnabled(value) {
                MaterialFlags.ReflectionTextureEnabled = value;
            }
            /**
             * Are emissive textures enabled in the application.
             */
            static get EmissiveTextureEnabled() {
                return MaterialFlags.EmissiveTextureEnabled;
            }
            static set EmissiveTextureEnabled(value) {
                MaterialFlags.EmissiveTextureEnabled = value;
            }
            /**
             * Are specular textures enabled in the application.
             */
            static get SpecularTextureEnabled() {
                return MaterialFlags.SpecularTextureEnabled;
            }
            static set SpecularTextureEnabled(value) {
                MaterialFlags.SpecularTextureEnabled = value;
            }
            /**
             * Are bump textures enabled in the application.
             */
            static get BumpTextureEnabled() {
                return MaterialFlags.BumpTextureEnabled;
            }
            static set BumpTextureEnabled(value) {
                MaterialFlags.BumpTextureEnabled = value;
            }
            /**
             * Are lightmap textures enabled in the application.
             */
            static get LightmapTextureEnabled() {
                return MaterialFlags.LightmapTextureEnabled;
            }
            static set LightmapTextureEnabled(value) {
                MaterialFlags.LightmapTextureEnabled = value;
            }
            /**
             * Are refraction textures enabled in the application.
             */
            static get RefractionTextureEnabled() {
                return MaterialFlags.RefractionTextureEnabled;
            }
            static set RefractionTextureEnabled(value) {
                MaterialFlags.RefractionTextureEnabled = value;
            }
            /**
             * Are color grading textures enabled in the application.
             */
            static get ColorGradingTextureEnabled() {
                return MaterialFlags.ColorGradingTextureEnabled;
            }
            static set ColorGradingTextureEnabled(value) {
                MaterialFlags.ColorGradingTextureEnabled = value;
            }
            /**
             * Are fresnels enabled in the application.
             */
            static get FresnelEnabled() {
                return MaterialFlags.FresnelEnabled;
            }
            static set FresnelEnabled(value) {
                MaterialFlags.FresnelEnabled = value;
            }
        },
        _StandardMaterial_diffuseTexture_accessor_storage = new WeakMap(),
        _StandardMaterial_ambientTexture_accessor_storage = new WeakMap(),
        _StandardMaterial_opacityTexture_accessor_storage = new WeakMap(),
        _StandardMaterial_reflectionTexture_accessor_storage = new WeakMap(),
        _StandardMaterial_emissiveTexture_accessor_storage = new WeakMap(),
        _StandardMaterial_specularTexture_accessor_storage = new WeakMap(),
        _StandardMaterial_bumpTexture_accessor_storage = new WeakMap(),
        _StandardMaterial_lightmapTexture_accessor_storage = new WeakMap(),
        _StandardMaterial_refractionTexture_accessor_storage = new WeakMap(),
        _StandardMaterial_useAlphaFromDiffuseTexture_accessor_storage = new WeakMap(),
        _StandardMaterial_useEmissiveAsIllumination_accessor_storage = new WeakMap(),
        _StandardMaterial_linkEmissiveWithDiffuse_accessor_storage = new WeakMap(),
        _StandardMaterial_useSpecularOverAlpha_accessor_storage = new WeakMap(),
        _StandardMaterial_useReflectionOverAlpha_accessor_storage = new WeakMap(),
        _StandardMaterial_disableLighting_accessor_storage = new WeakMap(),
        _StandardMaterial_useObjectSpaceNormalMap_accessor_storage = new WeakMap(),
        _StandardMaterial_useParallax_accessor_storage = new WeakMap(),
        _StandardMaterial_useParallaxOcclusion_accessor_storage = new WeakMap(),
        _StandardMaterial_roughness_accessor_storage = new WeakMap(),
        _StandardMaterial_useLightmapAsShadowmap_accessor_storage = new WeakMap(),
        _StandardMaterial_diffuseFresnelParameters_accessor_storage = new WeakMap(),
        _StandardMaterial_opacityFresnelParameters_accessor_storage = new WeakMap(),
        _StandardMaterial_reflectionFresnelParameters_accessor_storage = new WeakMap(),
        _StandardMaterial_refractionFresnelParameters_accessor_storage = new WeakMap(),
        _StandardMaterial_emissiveFresnelParameters_accessor_storage = new WeakMap(),
        _StandardMaterial_useReflectionFresnelFromSpecular_accessor_storage = new WeakMap(),
        _StandardMaterial_useGlossinessFromSpecularMapAlpha_accessor_storage = new WeakMap(),
        _StandardMaterial_maxSimultaneousLights_accessor_storage = new WeakMap(),
        _StandardMaterial_invertNormalMapX_accessor_storage = new WeakMap(),
        _StandardMaterial_invertNormalMapY_accessor_storage = new WeakMap(),
        _StandardMaterial_twoSidedLighting_accessor_storage = new WeakMap(),
        _StandardMaterial_applyDecalMapAfterDetailMap_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __diffuseTexture_decorators = [serializeAsTexture("diffuseTexture")];
            _diffuseTexture_decorators = [expandToProperty("_markAllSubMeshesAsTexturesAndMiscDirty")];
            __ambientTexture_decorators = [serializeAsTexture("ambientTexture")];
            _ambientTexture_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __opacityTexture_decorators = [serializeAsTexture("opacityTexture")];
            _opacityTexture_decorators = [expandToProperty("_markAllSubMeshesAsTexturesAndMiscDirty")];
            __reflectionTexture_decorators = [serializeAsTexture("reflectionTexture")];
            _reflectionTexture_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __emissiveTexture_decorators = [serializeAsTexture("emissiveTexture")];
            _emissiveTexture_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __specularTexture_decorators = [serializeAsTexture("specularTexture")];
            _specularTexture_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __bumpTexture_decorators = [serializeAsTexture("bumpTexture")];
            _bumpTexture_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __lightmapTexture_decorators = [serializeAsTexture("lightmapTexture")];
            _lightmapTexture_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __refractionTexture_decorators = [serializeAsTexture("refractionTexture")];
            _refractionTexture_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _ambientColor_decorators = [serializeAsColor3("ambient")];
            _diffuseColor_decorators = [serializeAsColor3("diffuse")];
            _specularColor_decorators = [serializeAsColor3("specular")];
            _emissiveColor_decorators = [serializeAsColor3("emissive")];
            _specularPower_decorators = [serialize()];
            __useAlphaFromDiffuseTexture_decorators = [serialize("useAlphaFromDiffuseTexture")];
            _useAlphaFromDiffuseTexture_decorators = [expandToProperty("_markAllSubMeshesAsTexturesAndMiscDirty")];
            __useEmissiveAsIllumination_decorators = [serialize("useEmissiveAsIllumination")];
            _useEmissiveAsIllumination_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __linkEmissiveWithDiffuse_decorators = [serialize("linkEmissiveWithDiffuse")];
            _linkEmissiveWithDiffuse_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __useSpecularOverAlpha_decorators = [serialize("useSpecularOverAlpha")];
            _useSpecularOverAlpha_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __useReflectionOverAlpha_decorators = [serialize("useReflectionOverAlpha")];
            _useReflectionOverAlpha_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __disableLighting_decorators = [serialize("disableLighting")];
            _disableLighting_decorators = [expandToProperty("_markAllSubMeshesAsLightsDirty")];
            __useObjectSpaceNormalMap_decorators = [serialize("useObjectSpaceNormalMap")];
            _useObjectSpaceNormalMap_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __useParallax_decorators = [serialize("useParallax")];
            _useParallax_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __useParallaxOcclusion_decorators = [serialize("useParallaxOcclusion")];
            _useParallaxOcclusion_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _parallaxScaleBias_decorators = [serialize()];
            __roughness_decorators = [serialize("roughness")];
            _roughness_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _indexOfRefraction_decorators = [serialize()];
            _invertRefractionY_decorators = [serialize()];
            _alphaCutOff_decorators = [serialize()];
            __useLightmapAsShadowmap_decorators = [serialize("useLightmapAsShadowmap")];
            _useLightmapAsShadowmap_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __diffuseFresnelParameters_decorators = [serializeAsFresnelParameters("diffuseFresnelParameters")];
            _diffuseFresnelParameters_decorators = [expandToProperty("_markAllSubMeshesAsFresnelDirty")];
            __opacityFresnelParameters_decorators = [serializeAsFresnelParameters("opacityFresnelParameters")];
            _opacityFresnelParameters_decorators = [expandToProperty("_markAllSubMeshesAsFresnelAndMiscDirty")];
            __reflectionFresnelParameters_decorators = [serializeAsFresnelParameters("reflectionFresnelParameters")];
            _reflectionFresnelParameters_decorators = [expandToProperty("_markAllSubMeshesAsFresnelDirty")];
            __refractionFresnelParameters_decorators = [serializeAsFresnelParameters("refractionFresnelParameters")];
            _refractionFresnelParameters_decorators = [expandToProperty("_markAllSubMeshesAsFresnelDirty")];
            __emissiveFresnelParameters_decorators = [serializeAsFresnelParameters("emissiveFresnelParameters")];
            _emissiveFresnelParameters_decorators = [expandToProperty("_markAllSubMeshesAsFresnelDirty")];
            __useReflectionFresnelFromSpecular_decorators = [serialize("useReflectionFresnelFromSpecular")];
            _useReflectionFresnelFromSpecular_decorators = [expandToProperty("_markAllSubMeshesAsFresnelDirty")];
            __useGlossinessFromSpecularMapAlpha_decorators = [serialize("useGlossinessFromSpecularMapAlpha")];
            _useGlossinessFromSpecularMapAlpha_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __maxSimultaneousLights_decorators = [serialize("maxSimultaneousLights")];
            _maxSimultaneousLights_decorators = [expandToProperty("_markAllSubMeshesAsLightsDirty")];
            __invertNormalMapX_decorators = [serialize("invertNormalMapX")];
            _invertNormalMapX_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __invertNormalMapY_decorators = [serialize("invertNormalMapY")];
            _invertNormalMapY_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __twoSidedLighting_decorators = [serialize("twoSidedLighting")];
            _twoSidedLighting_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __applyDecalMapAfterDetailMap_decorators = [serialize("applyDecalMapAfterDetailMap")];
            _applyDecalMapAfterDetailMap_decorators = [expandToProperty("_markAllSubMeshesAsMiscDirty")];
            __esDecorate(_a, null, _diffuseTexture_decorators, { kind: "accessor", name: "diffuseTexture", static: false, private: false, access: { has: obj => "diffuseTexture" in obj, get: obj => obj.diffuseTexture, set: (obj, value) => { obj.diffuseTexture = value; } }, metadata: _metadata }, _diffuseTexture_initializers, _diffuseTexture_extraInitializers);
            __esDecorate(_a, null, _ambientTexture_decorators, { kind: "accessor", name: "ambientTexture", static: false, private: false, access: { has: obj => "ambientTexture" in obj, get: obj => obj.ambientTexture, set: (obj, value) => { obj.ambientTexture = value; } }, metadata: _metadata }, _ambientTexture_initializers, _ambientTexture_extraInitializers);
            __esDecorate(_a, null, _opacityTexture_decorators, { kind: "accessor", name: "opacityTexture", static: false, private: false, access: { has: obj => "opacityTexture" in obj, get: obj => obj.opacityTexture, set: (obj, value) => { obj.opacityTexture = value; } }, metadata: _metadata }, _opacityTexture_initializers, _opacityTexture_extraInitializers);
            __esDecorate(_a, null, _reflectionTexture_decorators, { kind: "accessor", name: "reflectionTexture", static: false, private: false, access: { has: obj => "reflectionTexture" in obj, get: obj => obj.reflectionTexture, set: (obj, value) => { obj.reflectionTexture = value; } }, metadata: _metadata }, _reflectionTexture_initializers, _reflectionTexture_extraInitializers);
            __esDecorate(_a, null, _emissiveTexture_decorators, { kind: "accessor", name: "emissiveTexture", static: false, private: false, access: { has: obj => "emissiveTexture" in obj, get: obj => obj.emissiveTexture, set: (obj, value) => { obj.emissiveTexture = value; } }, metadata: _metadata }, _emissiveTexture_initializers, _emissiveTexture_extraInitializers);
            __esDecorate(_a, null, _specularTexture_decorators, { kind: "accessor", name: "specularTexture", static: false, private: false, access: { has: obj => "specularTexture" in obj, get: obj => obj.specularTexture, set: (obj, value) => { obj.specularTexture = value; } }, metadata: _metadata }, _specularTexture_initializers, _specularTexture_extraInitializers);
            __esDecorate(_a, null, _bumpTexture_decorators, { kind: "accessor", name: "bumpTexture", static: false, private: false, access: { has: obj => "bumpTexture" in obj, get: obj => obj.bumpTexture, set: (obj, value) => { obj.bumpTexture = value; } }, metadata: _metadata }, _bumpTexture_initializers, _bumpTexture_extraInitializers);
            __esDecorate(_a, null, _lightmapTexture_decorators, { kind: "accessor", name: "lightmapTexture", static: false, private: false, access: { has: obj => "lightmapTexture" in obj, get: obj => obj.lightmapTexture, set: (obj, value) => { obj.lightmapTexture = value; } }, metadata: _metadata }, _lightmapTexture_initializers, _lightmapTexture_extraInitializers);
            __esDecorate(_a, null, _refractionTexture_decorators, { kind: "accessor", name: "refractionTexture", static: false, private: false, access: { has: obj => "refractionTexture" in obj, get: obj => obj.refractionTexture, set: (obj, value) => { obj.refractionTexture = value; } }, metadata: _metadata }, _refractionTexture_initializers, _refractionTexture_extraInitializers);
            __esDecorate(_a, null, _useAlphaFromDiffuseTexture_decorators, { kind: "accessor", name: "useAlphaFromDiffuseTexture", static: false, private: false, access: { has: obj => "useAlphaFromDiffuseTexture" in obj, get: obj => obj.useAlphaFromDiffuseTexture, set: (obj, value) => { obj.useAlphaFromDiffuseTexture = value; } }, metadata: _metadata }, _useAlphaFromDiffuseTexture_initializers, _useAlphaFromDiffuseTexture_extraInitializers);
            __esDecorate(_a, null, _useEmissiveAsIllumination_decorators, { kind: "accessor", name: "useEmissiveAsIllumination", static: false, private: false, access: { has: obj => "useEmissiveAsIllumination" in obj, get: obj => obj.useEmissiveAsIllumination, set: (obj, value) => { obj.useEmissiveAsIllumination = value; } }, metadata: _metadata }, _useEmissiveAsIllumination_initializers, _useEmissiveAsIllumination_extraInitializers);
            __esDecorate(_a, null, _linkEmissiveWithDiffuse_decorators, { kind: "accessor", name: "linkEmissiveWithDiffuse", static: false, private: false, access: { has: obj => "linkEmissiveWithDiffuse" in obj, get: obj => obj.linkEmissiveWithDiffuse, set: (obj, value) => { obj.linkEmissiveWithDiffuse = value; } }, metadata: _metadata }, _linkEmissiveWithDiffuse_initializers, _linkEmissiveWithDiffuse_extraInitializers);
            __esDecorate(_a, null, _useSpecularOverAlpha_decorators, { kind: "accessor", name: "useSpecularOverAlpha", static: false, private: false, access: { has: obj => "useSpecularOverAlpha" in obj, get: obj => obj.useSpecularOverAlpha, set: (obj, value) => { obj.useSpecularOverAlpha = value; } }, metadata: _metadata }, _useSpecularOverAlpha_initializers, _useSpecularOverAlpha_extraInitializers);
            __esDecorate(_a, null, _useReflectionOverAlpha_decorators, { kind: "accessor", name: "useReflectionOverAlpha", static: false, private: false, access: { has: obj => "useReflectionOverAlpha" in obj, get: obj => obj.useReflectionOverAlpha, set: (obj, value) => { obj.useReflectionOverAlpha = value; } }, metadata: _metadata }, _useReflectionOverAlpha_initializers, _useReflectionOverAlpha_extraInitializers);
            __esDecorate(_a, null, _disableLighting_decorators, { kind: "accessor", name: "disableLighting", static: false, private: false, access: { has: obj => "disableLighting" in obj, get: obj => obj.disableLighting, set: (obj, value) => { obj.disableLighting = value; } }, metadata: _metadata }, _disableLighting_initializers, _disableLighting_extraInitializers);
            __esDecorate(_a, null, _useObjectSpaceNormalMap_decorators, { kind: "accessor", name: "useObjectSpaceNormalMap", static: false, private: false, access: { has: obj => "useObjectSpaceNormalMap" in obj, get: obj => obj.useObjectSpaceNormalMap, set: (obj, value) => { obj.useObjectSpaceNormalMap = value; } }, metadata: _metadata }, _useObjectSpaceNormalMap_initializers, _useObjectSpaceNormalMap_extraInitializers);
            __esDecorate(_a, null, _useParallax_decorators, { kind: "accessor", name: "useParallax", static: false, private: false, access: { has: obj => "useParallax" in obj, get: obj => obj.useParallax, set: (obj, value) => { obj.useParallax = value; } }, metadata: _metadata }, _useParallax_initializers, _useParallax_extraInitializers);
            __esDecorate(_a, null, _useParallaxOcclusion_decorators, { kind: "accessor", name: "useParallaxOcclusion", static: false, private: false, access: { has: obj => "useParallaxOcclusion" in obj, get: obj => obj.useParallaxOcclusion, set: (obj, value) => { obj.useParallaxOcclusion = value; } }, metadata: _metadata }, _useParallaxOcclusion_initializers, _useParallaxOcclusion_extraInitializers);
            __esDecorate(_a, null, _roughness_decorators, { kind: "accessor", name: "roughness", static: false, private: false, access: { has: obj => "roughness" in obj, get: obj => obj.roughness, set: (obj, value) => { obj.roughness = value; } }, metadata: _metadata }, _roughness_initializers, _roughness_extraInitializers);
            __esDecorate(_a, null, _useLightmapAsShadowmap_decorators, { kind: "accessor", name: "useLightmapAsShadowmap", static: false, private: false, access: { has: obj => "useLightmapAsShadowmap" in obj, get: obj => obj.useLightmapAsShadowmap, set: (obj, value) => { obj.useLightmapAsShadowmap = value; } }, metadata: _metadata }, _useLightmapAsShadowmap_initializers, _useLightmapAsShadowmap_extraInitializers);
            __esDecorate(_a, null, _diffuseFresnelParameters_decorators, { kind: "accessor", name: "diffuseFresnelParameters", static: false, private: false, access: { has: obj => "diffuseFresnelParameters" in obj, get: obj => obj.diffuseFresnelParameters, set: (obj, value) => { obj.diffuseFresnelParameters = value; } }, metadata: _metadata }, _diffuseFresnelParameters_initializers, _diffuseFresnelParameters_extraInitializers);
            __esDecorate(_a, null, _opacityFresnelParameters_decorators, { kind: "accessor", name: "opacityFresnelParameters", static: false, private: false, access: { has: obj => "opacityFresnelParameters" in obj, get: obj => obj.opacityFresnelParameters, set: (obj, value) => { obj.opacityFresnelParameters = value; } }, metadata: _metadata }, _opacityFresnelParameters_initializers, _opacityFresnelParameters_extraInitializers);
            __esDecorate(_a, null, _reflectionFresnelParameters_decorators, { kind: "accessor", name: "reflectionFresnelParameters", static: false, private: false, access: { has: obj => "reflectionFresnelParameters" in obj, get: obj => obj.reflectionFresnelParameters, set: (obj, value) => { obj.reflectionFresnelParameters = value; } }, metadata: _metadata }, _reflectionFresnelParameters_initializers, _reflectionFresnelParameters_extraInitializers);
            __esDecorate(_a, null, _refractionFresnelParameters_decorators, { kind: "accessor", name: "refractionFresnelParameters", static: false, private: false, access: { has: obj => "refractionFresnelParameters" in obj, get: obj => obj.refractionFresnelParameters, set: (obj, value) => { obj.refractionFresnelParameters = value; } }, metadata: _metadata }, _refractionFresnelParameters_initializers, _refractionFresnelParameters_extraInitializers);
            __esDecorate(_a, null, _emissiveFresnelParameters_decorators, { kind: "accessor", name: "emissiveFresnelParameters", static: false, private: false, access: { has: obj => "emissiveFresnelParameters" in obj, get: obj => obj.emissiveFresnelParameters, set: (obj, value) => { obj.emissiveFresnelParameters = value; } }, metadata: _metadata }, _emissiveFresnelParameters_initializers, _emissiveFresnelParameters_extraInitializers);
            __esDecorate(_a, null, _useReflectionFresnelFromSpecular_decorators, { kind: "accessor", name: "useReflectionFresnelFromSpecular", static: false, private: false, access: { has: obj => "useReflectionFresnelFromSpecular" in obj, get: obj => obj.useReflectionFresnelFromSpecular, set: (obj, value) => { obj.useReflectionFresnelFromSpecular = value; } }, metadata: _metadata }, _useReflectionFresnelFromSpecular_initializers, _useReflectionFresnelFromSpecular_extraInitializers);
            __esDecorate(_a, null, _useGlossinessFromSpecularMapAlpha_decorators, { kind: "accessor", name: "useGlossinessFromSpecularMapAlpha", static: false, private: false, access: { has: obj => "useGlossinessFromSpecularMapAlpha" in obj, get: obj => obj.useGlossinessFromSpecularMapAlpha, set: (obj, value) => { obj.useGlossinessFromSpecularMapAlpha = value; } }, metadata: _metadata }, _useGlossinessFromSpecularMapAlpha_initializers, _useGlossinessFromSpecularMapAlpha_extraInitializers);
            __esDecorate(_a, null, _maxSimultaneousLights_decorators, { kind: "accessor", name: "maxSimultaneousLights", static: false, private: false, access: { has: obj => "maxSimultaneousLights" in obj, get: obj => obj.maxSimultaneousLights, set: (obj, value) => { obj.maxSimultaneousLights = value; } }, metadata: _metadata }, _maxSimultaneousLights_initializers, _maxSimultaneousLights_extraInitializers);
            __esDecorate(_a, null, _invertNormalMapX_decorators, { kind: "accessor", name: "invertNormalMapX", static: false, private: false, access: { has: obj => "invertNormalMapX" in obj, get: obj => obj.invertNormalMapX, set: (obj, value) => { obj.invertNormalMapX = value; } }, metadata: _metadata }, _invertNormalMapX_initializers, _invertNormalMapX_extraInitializers);
            __esDecorate(_a, null, _invertNormalMapY_decorators, { kind: "accessor", name: "invertNormalMapY", static: false, private: false, access: { has: obj => "invertNormalMapY" in obj, get: obj => obj.invertNormalMapY, set: (obj, value) => { obj.invertNormalMapY = value; } }, metadata: _metadata }, _invertNormalMapY_initializers, _invertNormalMapY_extraInitializers);
            __esDecorate(_a, null, _twoSidedLighting_decorators, { kind: "accessor", name: "twoSidedLighting", static: false, private: false, access: { has: obj => "twoSidedLighting" in obj, get: obj => obj.twoSidedLighting, set: (obj, value) => { obj.twoSidedLighting = value; } }, metadata: _metadata }, _twoSidedLighting_initializers, _twoSidedLighting_extraInitializers);
            __esDecorate(_a, null, _applyDecalMapAfterDetailMap_decorators, { kind: "accessor", name: "applyDecalMapAfterDetailMap", static: false, private: false, access: { has: obj => "applyDecalMapAfterDetailMap" in obj, get: obj => obj.applyDecalMapAfterDetailMap, set: (obj, value) => { obj.applyDecalMapAfterDetailMap = value; } }, metadata: _metadata }, _applyDecalMapAfterDetailMap_initializers, _applyDecalMapAfterDetailMap_extraInitializers);
            __esDecorate(null, null, __diffuseTexture_decorators, { kind: "field", name: "_diffuseTexture", static: false, private: false, access: { has: obj => "_diffuseTexture" in obj, get: obj => obj._diffuseTexture, set: (obj, value) => { obj._diffuseTexture = value; } }, metadata: _metadata }, __diffuseTexture_initializers, __diffuseTexture_extraInitializers);
            __esDecorate(null, null, __ambientTexture_decorators, { kind: "field", name: "_ambientTexture", static: false, private: false, access: { has: obj => "_ambientTexture" in obj, get: obj => obj._ambientTexture, set: (obj, value) => { obj._ambientTexture = value; } }, metadata: _metadata }, __ambientTexture_initializers, __ambientTexture_extraInitializers);
            __esDecorate(null, null, __opacityTexture_decorators, { kind: "field", name: "_opacityTexture", static: false, private: false, access: { has: obj => "_opacityTexture" in obj, get: obj => obj._opacityTexture, set: (obj, value) => { obj._opacityTexture = value; } }, metadata: _metadata }, __opacityTexture_initializers, __opacityTexture_extraInitializers);
            __esDecorate(null, null, __reflectionTexture_decorators, { kind: "field", name: "_reflectionTexture", static: false, private: false, access: { has: obj => "_reflectionTexture" in obj, get: obj => obj._reflectionTexture, set: (obj, value) => { obj._reflectionTexture = value; } }, metadata: _metadata }, __reflectionTexture_initializers, __reflectionTexture_extraInitializers);
            __esDecorate(null, null, __emissiveTexture_decorators, { kind: "field", name: "_emissiveTexture", static: false, private: false, access: { has: obj => "_emissiveTexture" in obj, get: obj => obj._emissiveTexture, set: (obj, value) => { obj._emissiveTexture = value; } }, metadata: _metadata }, __emissiveTexture_initializers, __emissiveTexture_extraInitializers);
            __esDecorate(null, null, __specularTexture_decorators, { kind: "field", name: "_specularTexture", static: false, private: false, access: { has: obj => "_specularTexture" in obj, get: obj => obj._specularTexture, set: (obj, value) => { obj._specularTexture = value; } }, metadata: _metadata }, __specularTexture_initializers, __specularTexture_extraInitializers);
            __esDecorate(null, null, __bumpTexture_decorators, { kind: "field", name: "_bumpTexture", static: false, private: false, access: { has: obj => "_bumpTexture" in obj, get: obj => obj._bumpTexture, set: (obj, value) => { obj._bumpTexture = value; } }, metadata: _metadata }, __bumpTexture_initializers, __bumpTexture_extraInitializers);
            __esDecorate(null, null, __lightmapTexture_decorators, { kind: "field", name: "_lightmapTexture", static: false, private: false, access: { has: obj => "_lightmapTexture" in obj, get: obj => obj._lightmapTexture, set: (obj, value) => { obj._lightmapTexture = value; } }, metadata: _metadata }, __lightmapTexture_initializers, __lightmapTexture_extraInitializers);
            __esDecorate(null, null, __refractionTexture_decorators, { kind: "field", name: "_refractionTexture", static: false, private: false, access: { has: obj => "_refractionTexture" in obj, get: obj => obj._refractionTexture, set: (obj, value) => { obj._refractionTexture = value; } }, metadata: _metadata }, __refractionTexture_initializers, __refractionTexture_extraInitializers);
            __esDecorate(null, null, _ambientColor_decorators, { kind: "field", name: "ambientColor", static: false, private: false, access: { has: obj => "ambientColor" in obj, get: obj => obj.ambientColor, set: (obj, value) => { obj.ambientColor = value; } }, metadata: _metadata }, _ambientColor_initializers, _ambientColor_extraInitializers);
            __esDecorate(null, null, _diffuseColor_decorators, { kind: "field", name: "diffuseColor", static: false, private: false, access: { has: obj => "diffuseColor" in obj, get: obj => obj.diffuseColor, set: (obj, value) => { obj.diffuseColor = value; } }, metadata: _metadata }, _diffuseColor_initializers, _diffuseColor_extraInitializers);
            __esDecorate(null, null, _specularColor_decorators, { kind: "field", name: "specularColor", static: false, private: false, access: { has: obj => "specularColor" in obj, get: obj => obj.specularColor, set: (obj, value) => { obj.specularColor = value; } }, metadata: _metadata }, _specularColor_initializers, _specularColor_extraInitializers);
            __esDecorate(null, null, _emissiveColor_decorators, { kind: "field", name: "emissiveColor", static: false, private: false, access: { has: obj => "emissiveColor" in obj, get: obj => obj.emissiveColor, set: (obj, value) => { obj.emissiveColor = value; } }, metadata: _metadata }, _emissiveColor_initializers, _emissiveColor_extraInitializers);
            __esDecorate(null, null, _specularPower_decorators, { kind: "field", name: "specularPower", static: false, private: false, access: { has: obj => "specularPower" in obj, get: obj => obj.specularPower, set: (obj, value) => { obj.specularPower = value; } }, metadata: _metadata }, _specularPower_initializers, _specularPower_extraInitializers);
            __esDecorate(null, null, __useAlphaFromDiffuseTexture_decorators, { kind: "field", name: "_useAlphaFromDiffuseTexture", static: false, private: false, access: { has: obj => "_useAlphaFromDiffuseTexture" in obj, get: obj => obj._useAlphaFromDiffuseTexture, set: (obj, value) => { obj._useAlphaFromDiffuseTexture = value; } }, metadata: _metadata }, __useAlphaFromDiffuseTexture_initializers, __useAlphaFromDiffuseTexture_extraInitializers);
            __esDecorate(null, null, __useEmissiveAsIllumination_decorators, { kind: "field", name: "_useEmissiveAsIllumination", static: false, private: false, access: { has: obj => "_useEmissiveAsIllumination" in obj, get: obj => obj._useEmissiveAsIllumination, set: (obj, value) => { obj._useEmissiveAsIllumination = value; } }, metadata: _metadata }, __useEmissiveAsIllumination_initializers, __useEmissiveAsIllumination_extraInitializers);
            __esDecorate(null, null, __linkEmissiveWithDiffuse_decorators, { kind: "field", name: "_linkEmissiveWithDiffuse", static: false, private: false, access: { has: obj => "_linkEmissiveWithDiffuse" in obj, get: obj => obj._linkEmissiveWithDiffuse, set: (obj, value) => { obj._linkEmissiveWithDiffuse = value; } }, metadata: _metadata }, __linkEmissiveWithDiffuse_initializers, __linkEmissiveWithDiffuse_extraInitializers);
            __esDecorate(null, null, __useSpecularOverAlpha_decorators, { kind: "field", name: "_useSpecularOverAlpha", static: false, private: false, access: { has: obj => "_useSpecularOverAlpha" in obj, get: obj => obj._useSpecularOverAlpha, set: (obj, value) => { obj._useSpecularOverAlpha = value; } }, metadata: _metadata }, __useSpecularOverAlpha_initializers, __useSpecularOverAlpha_extraInitializers);
            __esDecorate(null, null, __useReflectionOverAlpha_decorators, { kind: "field", name: "_useReflectionOverAlpha", static: false, private: false, access: { has: obj => "_useReflectionOverAlpha" in obj, get: obj => obj._useReflectionOverAlpha, set: (obj, value) => { obj._useReflectionOverAlpha = value; } }, metadata: _metadata }, __useReflectionOverAlpha_initializers, __useReflectionOverAlpha_extraInitializers);
            __esDecorate(null, null, __disableLighting_decorators, { kind: "field", name: "_disableLighting", static: false, private: false, access: { has: obj => "_disableLighting" in obj, get: obj => obj._disableLighting, set: (obj, value) => { obj._disableLighting = value; } }, metadata: _metadata }, __disableLighting_initializers, __disableLighting_extraInitializers);
            __esDecorate(null, null, __useObjectSpaceNormalMap_decorators, { kind: "field", name: "_useObjectSpaceNormalMap", static: false, private: false, access: { has: obj => "_useObjectSpaceNormalMap" in obj, get: obj => obj._useObjectSpaceNormalMap, set: (obj, value) => { obj._useObjectSpaceNormalMap = value; } }, metadata: _metadata }, __useObjectSpaceNormalMap_initializers, __useObjectSpaceNormalMap_extraInitializers);
            __esDecorate(null, null, __useParallax_decorators, { kind: "field", name: "_useParallax", static: false, private: false, access: { has: obj => "_useParallax" in obj, get: obj => obj._useParallax, set: (obj, value) => { obj._useParallax = value; } }, metadata: _metadata }, __useParallax_initializers, __useParallax_extraInitializers);
            __esDecorate(null, null, __useParallaxOcclusion_decorators, { kind: "field", name: "_useParallaxOcclusion", static: false, private: false, access: { has: obj => "_useParallaxOcclusion" in obj, get: obj => obj._useParallaxOcclusion, set: (obj, value) => { obj._useParallaxOcclusion = value; } }, metadata: _metadata }, __useParallaxOcclusion_initializers, __useParallaxOcclusion_extraInitializers);
            __esDecorate(null, null, _parallaxScaleBias_decorators, { kind: "field", name: "parallaxScaleBias", static: false, private: false, access: { has: obj => "parallaxScaleBias" in obj, get: obj => obj.parallaxScaleBias, set: (obj, value) => { obj.parallaxScaleBias = value; } }, metadata: _metadata }, _parallaxScaleBias_initializers, _parallaxScaleBias_extraInitializers);
            __esDecorate(null, null, __roughness_decorators, { kind: "field", name: "_roughness", static: false, private: false, access: { has: obj => "_roughness" in obj, get: obj => obj._roughness, set: (obj, value) => { obj._roughness = value; } }, metadata: _metadata }, __roughness_initializers, __roughness_extraInitializers);
            __esDecorate(null, null, _indexOfRefraction_decorators, { kind: "field", name: "indexOfRefraction", static: false, private: false, access: { has: obj => "indexOfRefraction" in obj, get: obj => obj.indexOfRefraction, set: (obj, value) => { obj.indexOfRefraction = value; } }, metadata: _metadata }, _indexOfRefraction_initializers, _indexOfRefraction_extraInitializers);
            __esDecorate(null, null, _invertRefractionY_decorators, { kind: "field", name: "invertRefractionY", static: false, private: false, access: { has: obj => "invertRefractionY" in obj, get: obj => obj.invertRefractionY, set: (obj, value) => { obj.invertRefractionY = value; } }, metadata: _metadata }, _invertRefractionY_initializers, _invertRefractionY_extraInitializers);
            __esDecorate(null, null, _alphaCutOff_decorators, { kind: "field", name: "alphaCutOff", static: false, private: false, access: { has: obj => "alphaCutOff" in obj, get: obj => obj.alphaCutOff, set: (obj, value) => { obj.alphaCutOff = value; } }, metadata: _metadata }, _alphaCutOff_initializers, _alphaCutOff_extraInitializers);
            __esDecorate(null, null, __useLightmapAsShadowmap_decorators, { kind: "field", name: "_useLightmapAsShadowmap", static: false, private: false, access: { has: obj => "_useLightmapAsShadowmap" in obj, get: obj => obj._useLightmapAsShadowmap, set: (obj, value) => { obj._useLightmapAsShadowmap = value; } }, metadata: _metadata }, __useLightmapAsShadowmap_initializers, __useLightmapAsShadowmap_extraInitializers);
            __esDecorate(null, null, __diffuseFresnelParameters_decorators, { kind: "field", name: "_diffuseFresnelParameters", static: false, private: false, access: { has: obj => "_diffuseFresnelParameters" in obj, get: obj => obj._diffuseFresnelParameters, set: (obj, value) => { obj._diffuseFresnelParameters = value; } }, metadata: _metadata }, __diffuseFresnelParameters_initializers, __diffuseFresnelParameters_extraInitializers);
            __esDecorate(null, null, __opacityFresnelParameters_decorators, { kind: "field", name: "_opacityFresnelParameters", static: false, private: false, access: { has: obj => "_opacityFresnelParameters" in obj, get: obj => obj._opacityFresnelParameters, set: (obj, value) => { obj._opacityFresnelParameters = value; } }, metadata: _metadata }, __opacityFresnelParameters_initializers, __opacityFresnelParameters_extraInitializers);
            __esDecorate(null, null, __reflectionFresnelParameters_decorators, { kind: "field", name: "_reflectionFresnelParameters", static: false, private: false, access: { has: obj => "_reflectionFresnelParameters" in obj, get: obj => obj._reflectionFresnelParameters, set: (obj, value) => { obj._reflectionFresnelParameters = value; } }, metadata: _metadata }, __reflectionFresnelParameters_initializers, __reflectionFresnelParameters_extraInitializers);
            __esDecorate(null, null, __refractionFresnelParameters_decorators, { kind: "field", name: "_refractionFresnelParameters", static: false, private: false, access: { has: obj => "_refractionFresnelParameters" in obj, get: obj => obj._refractionFresnelParameters, set: (obj, value) => { obj._refractionFresnelParameters = value; } }, metadata: _metadata }, __refractionFresnelParameters_initializers, __refractionFresnelParameters_extraInitializers);
            __esDecorate(null, null, __emissiveFresnelParameters_decorators, { kind: "field", name: "_emissiveFresnelParameters", static: false, private: false, access: { has: obj => "_emissiveFresnelParameters" in obj, get: obj => obj._emissiveFresnelParameters, set: (obj, value) => { obj._emissiveFresnelParameters = value; } }, metadata: _metadata }, __emissiveFresnelParameters_initializers, __emissiveFresnelParameters_extraInitializers);
            __esDecorate(null, null, __useReflectionFresnelFromSpecular_decorators, { kind: "field", name: "_useReflectionFresnelFromSpecular", static: false, private: false, access: { has: obj => "_useReflectionFresnelFromSpecular" in obj, get: obj => obj._useReflectionFresnelFromSpecular, set: (obj, value) => { obj._useReflectionFresnelFromSpecular = value; } }, metadata: _metadata }, __useReflectionFresnelFromSpecular_initializers, __useReflectionFresnelFromSpecular_extraInitializers);
            __esDecorate(null, null, __useGlossinessFromSpecularMapAlpha_decorators, { kind: "field", name: "_useGlossinessFromSpecularMapAlpha", static: false, private: false, access: { has: obj => "_useGlossinessFromSpecularMapAlpha" in obj, get: obj => obj._useGlossinessFromSpecularMapAlpha, set: (obj, value) => { obj._useGlossinessFromSpecularMapAlpha = value; } }, metadata: _metadata }, __useGlossinessFromSpecularMapAlpha_initializers, __useGlossinessFromSpecularMapAlpha_extraInitializers);
            __esDecorate(null, null, __maxSimultaneousLights_decorators, { kind: "field", name: "_maxSimultaneousLights", static: false, private: false, access: { has: obj => "_maxSimultaneousLights" in obj, get: obj => obj._maxSimultaneousLights, set: (obj, value) => { obj._maxSimultaneousLights = value; } }, metadata: _metadata }, __maxSimultaneousLights_initializers, __maxSimultaneousLights_extraInitializers);
            __esDecorate(null, null, __invertNormalMapX_decorators, { kind: "field", name: "_invertNormalMapX", static: false, private: false, access: { has: obj => "_invertNormalMapX" in obj, get: obj => obj._invertNormalMapX, set: (obj, value) => { obj._invertNormalMapX = value; } }, metadata: _metadata }, __invertNormalMapX_initializers, __invertNormalMapX_extraInitializers);
            __esDecorate(null, null, __invertNormalMapY_decorators, { kind: "field", name: "_invertNormalMapY", static: false, private: false, access: { has: obj => "_invertNormalMapY" in obj, get: obj => obj._invertNormalMapY, set: (obj, value) => { obj._invertNormalMapY = value; } }, metadata: _metadata }, __invertNormalMapY_initializers, __invertNormalMapY_extraInitializers);
            __esDecorate(null, null, __twoSidedLighting_decorators, { kind: "field", name: "_twoSidedLighting", static: false, private: false, access: { has: obj => "_twoSidedLighting" in obj, get: obj => obj._twoSidedLighting, set: (obj, value) => { obj._twoSidedLighting = value; } }, metadata: _metadata }, __twoSidedLighting_initializers, __twoSidedLighting_extraInitializers);
            __esDecorate(null, null, __applyDecalMapAfterDetailMap_decorators, { kind: "field", name: "_applyDecalMapAfterDetailMap", static: false, private: false, access: { has: obj => "_applyDecalMapAfterDetailMap" in obj, get: obj => obj._applyDecalMapAfterDetailMap, set: (obj, value) => { obj._applyDecalMapAfterDetailMap = value; } }, metadata: _metadata }, __applyDecalMapAfterDetailMap_initializers, __applyDecalMapAfterDetailMap_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        /**
         * Force all the standard materials to compile to glsl even on WebGPU engines.
         * False by default. This is mostly meant for backward compatibility.
         */
        _a.ForceGLSL = false,
        _a._ShaderLoader = new _ShaderImportLoader(() => [import("../Shaders/default.vertex.js"), import("../Shaders/default.fragment.js")], () => [import("../ShadersWGSL/default.vertex.js"), import("../ShadersWGSL/default.fragment.js")]),
        _a;
})();
export { StandardMaterial };
let _Registered = false;
/**
 * Register side effects for standardMaterial.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterStandardMaterial() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    // StandardMaterial serializes its image processing configuration, so the parser must be registered for clone/parse to work.
    RegisterImageProcessingConfiguration();
    RegisterClass("BABYLON.StandardMaterial", StandardMaterial);
    Scene.DefaultMaterialFactory = (scene) => {
        return new StandardMaterial("default material", scene);
    };
}
// #region GENERATED_SIDE_EFFECT_STUBS — do not edit, regenerate with `npm run generate:side-effect-stubs`
import { _MissingSideEffectProperty } from "../Misc/devTools.js";
if (!Object.getOwnPropertyDescriptor(StandardMaterial.prototype, "decalMap")) {
    Object.defineProperty(StandardMaterial.prototype, "decalMap", _MissingSideEffectProperty("StandardMaterial", "decalMap"));
}
// #endregion GENERATED_SIDE_EFFECT_STUBS
//# sourceMappingURL=standardMaterial.pure.js.map