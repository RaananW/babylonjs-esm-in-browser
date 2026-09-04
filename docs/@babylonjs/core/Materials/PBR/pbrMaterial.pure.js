/** This file must only contain pure code and pure imports */
import { __classPrivateFieldGet, __classPrivateFieldSet, __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { serialize, serializeAsColor3, expandToProperty, serializeAsTexture } from "../../Misc/decorators.js";
import { GetEnvironmentBRDFTexture } from "../../Misc/brdfTextureTools.js";
import { Color3 } from "../../Maths/math.color.pure.js";
import { PBRBaseMaterial } from "./pbrBaseMaterial.pure.js";
import { RegisterImageProcessingConfiguration } from "../imageProcessingConfiguration.pure.js";
import { Material } from "../material.pure.js";
import { SerializationHelper } from "../../Misc/decorators.serialization.js";
import { RegisterClass } from "../../Misc/typeStore.js";
/**
 * The Physically based material of BJS.
 *
 * This offers the main features of a standard PBR material.
 * For more information, please refer to the documentation :
 * https://doc.babylonjs.com/features/featuresDeepDive/materials/using/introToPBR
 */
let PBRMaterial = (() => {
    var _a, _PBRMaterial_directIntensity_accessor_storage, _PBRMaterial_emissiveIntensity_accessor_storage, _PBRMaterial_environmentIntensity_accessor_storage, _PBRMaterial_specularIntensity_accessor_storage, _PBRMaterial_disableBumpMap_accessor_storage, _PBRMaterial_albedoTexture_accessor_storage, _PBRMaterial_baseWeightTexture_accessor_storage, _PBRMaterial_baseDiffuseRoughnessTexture_accessor_storage, _PBRMaterial_ambientTexture_accessor_storage, _PBRMaterial_ambientTextureStrength_accessor_storage, _PBRMaterial_ambientTextureImpactOnAnalyticalLights_accessor_storage, _PBRMaterial_opacityTexture_accessor_storage, _PBRMaterial_reflectionTexture_accessor_storage, _PBRMaterial_emissiveTexture_accessor_storage, _PBRMaterial_reflectivityTexture_accessor_storage, _PBRMaterial_metallicTexture_accessor_storage, _PBRMaterial_metallic_accessor_storage, _PBRMaterial_roughness_accessor_storage, _PBRMaterial_metallicF0Factor_accessor_storage, _PBRMaterial_metallicReflectanceColor_accessor_storage, _PBRMaterial_useOnlyMetallicFromMetallicReflectanceTexture_accessor_storage, _PBRMaterial_metallicReflectanceTexture_accessor_storage, _PBRMaterial_reflectanceTexture_accessor_storage, _PBRMaterial_microSurfaceTexture_accessor_storage, _PBRMaterial_bumpTexture_accessor_storage, _PBRMaterial_lightmapTexture_accessor_storage, _PBRMaterial_ambientColor_accessor_storage, _PBRMaterial_albedoColor_accessor_storage, _PBRMaterial_baseWeight_accessor_storage, _PBRMaterial_baseDiffuseRoughness_accessor_storage, _PBRMaterial_reflectivityColor_accessor_storage, _PBRMaterial_reflectionColor_accessor_storage, _PBRMaterial_emissiveColor_accessor_storage, _PBRMaterial_microSurface_accessor_storage, _PBRMaterial_useLightmapAsShadowmap_accessor_storage, _PBRMaterial_useAlphaFromAlbedoTexture_accessor_storage, _PBRMaterial_forceAlphaTest_accessor_storage, _PBRMaterial_alphaCutOff_accessor_storage, _PBRMaterial_useSpecularOverAlpha_accessor_storage, _PBRMaterial_useMicroSurfaceFromReflectivityMapAlpha_accessor_storage, _PBRMaterial_useRoughnessFromMetallicTextureAlpha_accessor_storage, _PBRMaterial_useRoughnessFromMetallicTextureGreen_accessor_storage, _PBRMaterial_useMetallnessFromMetallicTextureBlue_accessor_storage, _PBRMaterial_useAmbientOcclusionFromMetallicTextureRed_accessor_storage, _PBRMaterial_useAmbientInGrayScale_accessor_storage, _PBRMaterial_useAutoMicroSurfaceFromReflectivityMap_accessor_storage, _PBRMaterial_useRadianceOverAlpha_accessor_storage, _PBRMaterial_useObjectSpaceNormalMap_accessor_storage, _PBRMaterial_useParallax_accessor_storage, _PBRMaterial_useParallaxOcclusion_accessor_storage, _PBRMaterial_parallaxScaleBias_accessor_storage, _PBRMaterial_disableLighting_accessor_storage, _PBRMaterial_forceIrradianceInFragment_accessor_storage, _PBRMaterial_maxSimultaneousLights_accessor_storage, _PBRMaterial_invertNormalMapX_accessor_storage, _PBRMaterial_invertNormalMapY_accessor_storage, _PBRMaterial_twoSidedLighting_accessor_storage, _PBRMaterial_useAlphaFresnel_accessor_storage, _PBRMaterial_useLinearAlphaFresnel_accessor_storage, _PBRMaterial_environmentBRDFTexture_accessor_storage, _PBRMaterial_forceNormalForward_accessor_storage, _PBRMaterial_enableSpecularAntiAliasing_accessor_storage, _PBRMaterial_useHorizonOcclusion_accessor_storage, _PBRMaterial_useRadianceOcclusion_accessor_storage, _PBRMaterial_unlit_accessor_storage, _PBRMaterial_applyDecalMapAfterDetailMap_accessor_storage;
    let _classSuper = PBRBaseMaterial;
    let _instanceExtraInitializers = [];
    let _directIntensity_decorators;
    let _directIntensity_initializers = [];
    let _directIntensity_extraInitializers = [];
    let _emissiveIntensity_decorators;
    let _emissiveIntensity_initializers = [];
    let _emissiveIntensity_extraInitializers = [];
    let _environmentIntensity_decorators;
    let _environmentIntensity_initializers = [];
    let _environmentIntensity_extraInitializers = [];
    let _specularIntensity_decorators;
    let _specularIntensity_initializers = [];
    let _specularIntensity_extraInitializers = [];
    let _disableBumpMap_decorators;
    let _disableBumpMap_initializers = [];
    let _disableBumpMap_extraInitializers = [];
    let _albedoTexture_decorators;
    let _albedoTexture_initializers = [];
    let _albedoTexture_extraInitializers = [];
    let _baseWeightTexture_decorators;
    let _baseWeightTexture_initializers = [];
    let _baseWeightTexture_extraInitializers = [];
    let _baseDiffuseRoughnessTexture_decorators;
    let _baseDiffuseRoughnessTexture_initializers = [];
    let _baseDiffuseRoughnessTexture_extraInitializers = [];
    let _ambientTexture_decorators;
    let _ambientTexture_initializers = [];
    let _ambientTexture_extraInitializers = [];
    let _ambientTextureStrength_decorators;
    let _ambientTextureStrength_initializers = [];
    let _ambientTextureStrength_extraInitializers = [];
    let _ambientTextureImpactOnAnalyticalLights_decorators;
    let _ambientTextureImpactOnAnalyticalLights_initializers = [];
    let _ambientTextureImpactOnAnalyticalLights_extraInitializers = [];
    let _opacityTexture_decorators;
    let _opacityTexture_initializers = [];
    let _opacityTexture_extraInitializers = [];
    let _reflectionTexture_decorators;
    let _reflectionTexture_initializers = [];
    let _reflectionTexture_extraInitializers = [];
    let _emissiveTexture_decorators;
    let _emissiveTexture_initializers = [];
    let _emissiveTexture_extraInitializers = [];
    let _reflectivityTexture_decorators;
    let _reflectivityTexture_initializers = [];
    let _reflectivityTexture_extraInitializers = [];
    let _metallicTexture_decorators;
    let _metallicTexture_initializers = [];
    let _metallicTexture_extraInitializers = [];
    let _metallic_decorators;
    let _metallic_initializers = [];
    let _metallic_extraInitializers = [];
    let _roughness_decorators;
    let _roughness_initializers = [];
    let _roughness_extraInitializers = [];
    let _metallicF0Factor_decorators;
    let _metallicF0Factor_initializers = [];
    let _metallicF0Factor_extraInitializers = [];
    let _metallicReflectanceColor_decorators;
    let _metallicReflectanceColor_initializers = [];
    let _metallicReflectanceColor_extraInitializers = [];
    let _useOnlyMetallicFromMetallicReflectanceTexture_decorators;
    let _useOnlyMetallicFromMetallicReflectanceTexture_initializers = [];
    let _useOnlyMetallicFromMetallicReflectanceTexture_extraInitializers = [];
    let _metallicReflectanceTexture_decorators;
    let _metallicReflectanceTexture_initializers = [];
    let _metallicReflectanceTexture_extraInitializers = [];
    let _reflectanceTexture_decorators;
    let _reflectanceTexture_initializers = [];
    let _reflectanceTexture_extraInitializers = [];
    let _microSurfaceTexture_decorators;
    let _microSurfaceTexture_initializers = [];
    let _microSurfaceTexture_extraInitializers = [];
    let _bumpTexture_decorators;
    let _bumpTexture_initializers = [];
    let _bumpTexture_extraInitializers = [];
    let _lightmapTexture_decorators;
    let _lightmapTexture_initializers = [];
    let _lightmapTexture_extraInitializers = [];
    let _ambientColor_decorators;
    let _ambientColor_initializers = [];
    let _ambientColor_extraInitializers = [];
    let _albedoColor_decorators;
    let _albedoColor_initializers = [];
    let _albedoColor_extraInitializers = [];
    let _baseWeight_decorators;
    let _baseWeight_initializers = [];
    let _baseWeight_extraInitializers = [];
    let _baseDiffuseRoughness_decorators;
    let _baseDiffuseRoughness_initializers = [];
    let _baseDiffuseRoughness_extraInitializers = [];
    let _reflectivityColor_decorators;
    let _reflectivityColor_initializers = [];
    let _reflectivityColor_extraInitializers = [];
    let _reflectionColor_decorators;
    let _reflectionColor_initializers = [];
    let _reflectionColor_extraInitializers = [];
    let _emissiveColor_decorators;
    let _emissiveColor_initializers = [];
    let _emissiveColor_extraInitializers = [];
    let _microSurface_decorators;
    let _microSurface_initializers = [];
    let _microSurface_extraInitializers = [];
    let _useLightmapAsShadowmap_decorators;
    let _useLightmapAsShadowmap_initializers = [];
    let _useLightmapAsShadowmap_extraInitializers = [];
    let _useAlphaFromAlbedoTexture_decorators;
    let _useAlphaFromAlbedoTexture_initializers = [];
    let _useAlphaFromAlbedoTexture_extraInitializers = [];
    let _forceAlphaTest_decorators;
    let _forceAlphaTest_initializers = [];
    let _forceAlphaTest_extraInitializers = [];
    let _alphaCutOff_decorators;
    let _alphaCutOff_initializers = [];
    let _alphaCutOff_extraInitializers = [];
    let _useSpecularOverAlpha_decorators;
    let _useSpecularOverAlpha_initializers = [];
    let _useSpecularOverAlpha_extraInitializers = [];
    let _useMicroSurfaceFromReflectivityMapAlpha_decorators;
    let _useMicroSurfaceFromReflectivityMapAlpha_initializers = [];
    let _useMicroSurfaceFromReflectivityMapAlpha_extraInitializers = [];
    let _useRoughnessFromMetallicTextureAlpha_decorators;
    let _useRoughnessFromMetallicTextureAlpha_initializers = [];
    let _useRoughnessFromMetallicTextureAlpha_extraInitializers = [];
    let _useRoughnessFromMetallicTextureGreen_decorators;
    let _useRoughnessFromMetallicTextureGreen_initializers = [];
    let _useRoughnessFromMetallicTextureGreen_extraInitializers = [];
    let _useMetallnessFromMetallicTextureBlue_decorators;
    let _useMetallnessFromMetallicTextureBlue_initializers = [];
    let _useMetallnessFromMetallicTextureBlue_extraInitializers = [];
    let _useAmbientOcclusionFromMetallicTextureRed_decorators;
    let _useAmbientOcclusionFromMetallicTextureRed_initializers = [];
    let _useAmbientOcclusionFromMetallicTextureRed_extraInitializers = [];
    let _useAmbientInGrayScale_decorators;
    let _useAmbientInGrayScale_initializers = [];
    let _useAmbientInGrayScale_extraInitializers = [];
    let _useAutoMicroSurfaceFromReflectivityMap_decorators;
    let _useAutoMicroSurfaceFromReflectivityMap_initializers = [];
    let _useAutoMicroSurfaceFromReflectivityMap_extraInitializers = [];
    let _get_usePhysicalLightFalloff_decorators;
    let _get_useGLTFLightFalloff_decorators;
    let _useRadianceOverAlpha_decorators;
    let _useRadianceOverAlpha_initializers = [];
    let _useRadianceOverAlpha_extraInitializers = [];
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
    return _a = class PBRMaterial extends _classSuper {
            /**
             * Intensity of the direct lights e.g. the four lights available in your scene.
             * This impacts both the direct diffuse and specular highlights.
             */
            get directIntensity() { return __classPrivateFieldGet(this, _PBRMaterial_directIntensity_accessor_storage, "f"); }
            set directIntensity(value) { __classPrivateFieldSet(this, _PBRMaterial_directIntensity_accessor_storage, value, "f"); }
            /**
             * Intensity of the emissive part of the material.
             * This helps controlling the emissive effect without modifying the emissive color.
             */
            get emissiveIntensity() { return __classPrivateFieldGet(this, _PBRMaterial_emissiveIntensity_accessor_storage, "f"); }
            set emissiveIntensity(value) { __classPrivateFieldSet(this, _PBRMaterial_emissiveIntensity_accessor_storage, value, "f"); }
            /**
             * Intensity of the environment e.g. how much the environment will light the object
             * either through harmonics for rough material or through the reflection for shiny ones.
             */
            get environmentIntensity() { return __classPrivateFieldGet(this, _PBRMaterial_environmentIntensity_accessor_storage, "f"); }
            set environmentIntensity(value) { __classPrivateFieldSet(this, _PBRMaterial_environmentIntensity_accessor_storage, value, "f"); }
            /**
             * This is a special control allowing the reduction of the specular highlights coming from the
             * four lights of the scene. Those highlights may not be needed in full environment lighting.
             */
            get specularIntensity() { return __classPrivateFieldGet(this, _PBRMaterial_specularIntensity_accessor_storage, "f"); }
            set specularIntensity(value) { __classPrivateFieldSet(this, _PBRMaterial_specularIntensity_accessor_storage, value, "f"); }
            /**
             * Debug Control allowing disabling the bump map on this material.
             */
            get disableBumpMap() { return __classPrivateFieldGet(this, _PBRMaterial_disableBumpMap_accessor_storage, "f"); }
            set disableBumpMap(value) { __classPrivateFieldSet(this, _PBRMaterial_disableBumpMap_accessor_storage, value, "f"); }
            /**
             * AKA Diffuse Texture in standard nomenclature.
             */
            get albedoTexture() { return __classPrivateFieldGet(this, _PBRMaterial_albedoTexture_accessor_storage, "f"); }
            set albedoTexture(value) { __classPrivateFieldSet(this, _PBRMaterial_albedoTexture_accessor_storage, value, "f"); }
            /**
             * OpenPBR Base Weight texture (multiplier to the diffuse and metal lobes).
             */
            get baseWeightTexture() { return __classPrivateFieldGet(this, _PBRMaterial_baseWeightTexture_accessor_storage, "f"); }
            set baseWeightTexture(value) { __classPrivateFieldSet(this, _PBRMaterial_baseWeightTexture_accessor_storage, value, "f"); }
            /**
             * OpenPBR Base Diffuse Roughness texture (roughness of the diffuse lobe).
             */
            get baseDiffuseRoughnessTexture() { return __classPrivateFieldGet(this, _PBRMaterial_baseDiffuseRoughnessTexture_accessor_storage, "f"); }
            set baseDiffuseRoughnessTexture(value) { __classPrivateFieldSet(this, _PBRMaterial_baseDiffuseRoughnessTexture_accessor_storage, value, "f"); }
            /**
             * AKA Occlusion Texture in other nomenclature.
             */
            get ambientTexture() { return __classPrivateFieldGet(this, _PBRMaterial_ambientTexture_accessor_storage, "f"); }
            set ambientTexture(value) { __classPrivateFieldSet(this, _PBRMaterial_ambientTexture_accessor_storage, value, "f"); }
            /**
             * AKA Occlusion Texture Intensity in other nomenclature.
             */
            get ambientTextureStrength() { return __classPrivateFieldGet(this, _PBRMaterial_ambientTextureStrength_accessor_storage, "f"); }
            set ambientTextureStrength(value) { __classPrivateFieldSet(this, _PBRMaterial_ambientTextureStrength_accessor_storage, value, "f"); }
            /**
             * Defines how much the AO map is occluding the analytical lights (point spot...).
             * 1 means it completely occludes it
             * 0 mean it has no impact
             */
            get ambientTextureImpactOnAnalyticalLights() { return __classPrivateFieldGet(this, _PBRMaterial_ambientTextureImpactOnAnalyticalLights_accessor_storage, "f"); }
            set ambientTextureImpactOnAnalyticalLights(value) { __classPrivateFieldSet(this, _PBRMaterial_ambientTextureImpactOnAnalyticalLights_accessor_storage, value, "f"); }
            /**
             * Stores the alpha values in a texture. Use luminance if texture.getAlphaFromRGB is true.
             */
            get opacityTexture() { return __classPrivateFieldGet(this, _PBRMaterial_opacityTexture_accessor_storage, "f"); }
            set opacityTexture(value) { __classPrivateFieldSet(this, _PBRMaterial_opacityTexture_accessor_storage, value, "f"); }
            /**
             * Stores the reflection values in a texture.
             */
            get reflectionTexture() { return __classPrivateFieldGet(this, _PBRMaterial_reflectionTexture_accessor_storage, "f"); }
            set reflectionTexture(value) { __classPrivateFieldSet(this, _PBRMaterial_reflectionTexture_accessor_storage, value, "f"); }
            /**
             * Stores the emissive values in a texture.
             */
            get emissiveTexture() { return __classPrivateFieldGet(this, _PBRMaterial_emissiveTexture_accessor_storage, "f"); }
            set emissiveTexture(value) { __classPrivateFieldSet(this, _PBRMaterial_emissiveTexture_accessor_storage, value, "f"); }
            /**
             * AKA Specular texture in other nomenclature.
             */
            get reflectivityTexture() { return __classPrivateFieldGet(this, _PBRMaterial_reflectivityTexture_accessor_storage, "f"); }
            set reflectivityTexture(value) { __classPrivateFieldSet(this, _PBRMaterial_reflectivityTexture_accessor_storage, value, "f"); }
            /**
             * Used to switch from specular/glossiness to metallic/roughness workflow.
             */
            get metallicTexture() { return __classPrivateFieldGet(this, _PBRMaterial_metallicTexture_accessor_storage, "f"); }
            set metallicTexture(value) { __classPrivateFieldSet(this, _PBRMaterial_metallicTexture_accessor_storage, value, "f"); }
            /**
             * Specifies the metallic scalar of the metallic/roughness workflow.
             * Can also be used to scale the metalness values of the metallic texture.
             */
            get metallic() { return __classPrivateFieldGet(this, _PBRMaterial_metallic_accessor_storage, "f"); }
            set metallic(value) { __classPrivateFieldSet(this, _PBRMaterial_metallic_accessor_storage, value, "f"); }
            /**
             * Specifies the roughness scalar of the metallic/roughness workflow.
             * Can also be used to scale the roughness values of the metallic texture.
             */
            get roughness() { return __classPrivateFieldGet(this, _PBRMaterial_roughness_accessor_storage, "f"); }
            set roughness(value) { __classPrivateFieldSet(this, _PBRMaterial_roughness_accessor_storage, value, "f"); }
            /**
             * In metallic workflow, specifies an F0 factor to help configuring the material F0.
             * By default the indexOfrefraction is used to compute F0;
             *
             * This is used as a factor against the default reflectance at normal incidence to tweak it.
             *
             * F0 = defaultF0 * metallicF0Factor * metallicReflectanceColor;
             * F90 = metallicReflectanceColor;
             */
            get metallicF0Factor() { return __classPrivateFieldGet(this, _PBRMaterial_metallicF0Factor_accessor_storage, "f"); }
            set metallicF0Factor(value) { __classPrivateFieldSet(this, _PBRMaterial_metallicF0Factor_accessor_storage, value, "f"); }
            /**
             * In metallic workflow, specifies an F0 color.
             * By default the F90 is always 1;
             *
             * Please note that this factor is also used as a factor against the default reflectance at normal incidence.
             *
             * F0 = defaultF0_from_IOR * metallicF0Factor * metallicReflectanceColor
             * F90 = metallicF0Factor;
             */
            get metallicReflectanceColor() { return __classPrivateFieldGet(this, _PBRMaterial_metallicReflectanceColor_accessor_storage, "f"); }
            set metallicReflectanceColor(value) { __classPrivateFieldSet(this, _PBRMaterial_metallicReflectanceColor_accessor_storage, value, "f"); }
            /**
             * Specifies that only the A channel from metallicReflectanceTexture should be used.
             * If false, both RGB and A channels will be used
             */
            get useOnlyMetallicFromMetallicReflectanceTexture() { return __classPrivateFieldGet(this, _PBRMaterial_useOnlyMetallicFromMetallicReflectanceTexture_accessor_storage, "f"); }
            set useOnlyMetallicFromMetallicReflectanceTexture(value) { __classPrivateFieldSet(this, _PBRMaterial_useOnlyMetallicFromMetallicReflectanceTexture_accessor_storage, value, "f"); }
            /**
             * Defines to store metallicReflectanceColor in RGB and metallicF0Factor in A
             * This is multiplied against the scalar values defined in the material.
             * If useOnlyMetallicFromMetallicReflectanceTexture is true, don't use the RGB channels, only A
             */
            get metallicReflectanceTexture() { return __classPrivateFieldGet(this, _PBRMaterial_metallicReflectanceTexture_accessor_storage, "f"); }
            set metallicReflectanceTexture(value) { __classPrivateFieldSet(this, _PBRMaterial_metallicReflectanceTexture_accessor_storage, value, "f"); }
            /**
             * Defines to store reflectanceColor in RGB
             * This is multiplied against the scalar values defined in the material.
             * If both reflectanceTexture and metallicReflectanceTexture textures are provided and useOnlyMetallicFromMetallicReflectanceTexture
             * is false, metallicReflectanceTexture takes priority and reflectanceTexture is not used
             */
            get reflectanceTexture() { return __classPrivateFieldGet(this, _PBRMaterial_reflectanceTexture_accessor_storage, "f"); }
            set reflectanceTexture(value) { __classPrivateFieldSet(this, _PBRMaterial_reflectanceTexture_accessor_storage, value, "f"); }
            /**
             * Used to enable roughness/glossiness fetch from a separate channel depending on the current mode.
             * Gray Scale represents roughness in metallic mode and glossiness in specular mode.
             */
            get microSurfaceTexture() { return __classPrivateFieldGet(this, _PBRMaterial_microSurfaceTexture_accessor_storage, "f"); }
            set microSurfaceTexture(value) { __classPrivateFieldSet(this, _PBRMaterial_microSurfaceTexture_accessor_storage, value, "f"); }
            /**
             * Stores surface normal data used to displace a mesh in a texture.
             */
            get bumpTexture() { return __classPrivateFieldGet(this, _PBRMaterial_bumpTexture_accessor_storage, "f"); }
            set bumpTexture(value) { __classPrivateFieldSet(this, _PBRMaterial_bumpTexture_accessor_storage, value, "f"); }
            /**
             * Stores the pre-calculated light information of a mesh in a texture.
             */
            get lightmapTexture() { return __classPrivateFieldGet(this, _PBRMaterial_lightmapTexture_accessor_storage, "f"); }
            set lightmapTexture(value) { __classPrivateFieldSet(this, _PBRMaterial_lightmapTexture_accessor_storage, value, "f"); }
            /**
             * Stores the refracted light information in a texture.
             */
            get refractionTexture() {
                return this.subSurface.refractionTexture;
            }
            set refractionTexture(value) {
                this.subSurface.refractionTexture = value;
                if (value) {
                    this.subSurface.isRefractionEnabled = true;
                }
                else if (!this.subSurface.linkRefractionWithTransparency) {
                    this.subSurface.isRefractionEnabled = false;
                }
            }
            /**
             * The color of a material in ambient lighting.
             */
            get ambientColor() { return __classPrivateFieldGet(this, _PBRMaterial_ambientColor_accessor_storage, "f"); }
            set ambientColor(value) { __classPrivateFieldSet(this, _PBRMaterial_ambientColor_accessor_storage, value, "f"); }
            /**
             * AKA Diffuse Color in other nomenclature.
             */
            get albedoColor() { return __classPrivateFieldGet(this, _PBRMaterial_albedoColor_accessor_storage, "f"); }
            set albedoColor(value) { __classPrivateFieldSet(this, _PBRMaterial_albedoColor_accessor_storage, value, "f"); }
            /**
             * OpenPBR Base Weight (multiplier to the diffuse and metal lobes).
             */
            get baseWeight() { return __classPrivateFieldGet(this, _PBRMaterial_baseWeight_accessor_storage, "f"); }
            set baseWeight(value) { __classPrivateFieldSet(this, _PBRMaterial_baseWeight_accessor_storage, value, "f"); }
            /**
             * OpenPBR Base Diffuse Roughness (roughness of the diffuse lobe).
             */
            get baseDiffuseRoughness() { return __classPrivateFieldGet(this, _PBRMaterial_baseDiffuseRoughness_accessor_storage, "f"); }
            set baseDiffuseRoughness(value) { __classPrivateFieldSet(this, _PBRMaterial_baseDiffuseRoughness_accessor_storage, value, "f"); }
            /**
             * AKA Specular Color in other nomenclature.
             */
            get reflectivityColor() { return __classPrivateFieldGet(this, _PBRMaterial_reflectivityColor_accessor_storage, "f"); }
            set reflectivityColor(value) { __classPrivateFieldSet(this, _PBRMaterial_reflectivityColor_accessor_storage, value, "f"); }
            /**
             * The color reflected from the material.
             */
            get reflectionColor() { return __classPrivateFieldGet(this, _PBRMaterial_reflectionColor_accessor_storage, "f"); }
            set reflectionColor(value) { __classPrivateFieldSet(this, _PBRMaterial_reflectionColor_accessor_storage, value, "f"); }
            /**
             * The color emitted from the material.
             */
            get emissiveColor() { return __classPrivateFieldGet(this, _PBRMaterial_emissiveColor_accessor_storage, "f"); }
            set emissiveColor(value) { __classPrivateFieldSet(this, _PBRMaterial_emissiveColor_accessor_storage, value, "f"); }
            /**
             * AKA Glossiness in other nomenclature.
             */
            get microSurface() { return __classPrivateFieldGet(this, _PBRMaterial_microSurface_accessor_storage, "f"); }
            set microSurface(value) { __classPrivateFieldSet(this, _PBRMaterial_microSurface_accessor_storage, value, "f"); }
            /**
             * Index of refraction of the material base layer.
             * https://en.wikipedia.org/wiki/List_of_refractive_indices
             *
             * This does not only impact refraction but also the Base F0 of Dielectric Materials.
             *
             * From dielectric fresnel rules: F0 = square((iorT - iorI) / (iorT + iorI))
             */
            get indexOfRefraction() {
                return this.subSurface.indexOfRefraction;
            }
            set indexOfRefraction(value) {
                this.subSurface.indexOfRefraction = value;
            }
            /**
             * Controls if refraction needs to be inverted on Y. This could be useful for procedural texture.
             */
            get invertRefractionY() {
                return this.subSurface.invertRefractionY;
            }
            set invertRefractionY(value) {
                this.subSurface.invertRefractionY = value;
            }
            /**
             * This parameters will make the material used its opacity to control how much it is refracting against not.
             * Materials half opaque for instance using refraction could benefit from this control.
             */
            get linkRefractionWithTransparency() {
                return this.subSurface.linkRefractionWithTransparency;
            }
            set linkRefractionWithTransparency(value) {
                this.subSurface.linkRefractionWithTransparency = value;
                if (value) {
                    this.subSurface.isRefractionEnabled = true;
                }
            }
            /**
             * If true, the light map contains occlusion information instead of lighting info.
             */
            get useLightmapAsShadowmap() { return __classPrivateFieldGet(this, _PBRMaterial_useLightmapAsShadowmap_accessor_storage, "f"); }
            set useLightmapAsShadowmap(value) { __classPrivateFieldSet(this, _PBRMaterial_useLightmapAsShadowmap_accessor_storage, value, "f"); }
            /**
             * Specifies that the alpha is coming form the albedo channel alpha channel for alpha blending.
             */
            get useAlphaFromAlbedoTexture() { return __classPrivateFieldGet(this, _PBRMaterial_useAlphaFromAlbedoTexture_accessor_storage, "f"); }
            set useAlphaFromAlbedoTexture(value) { __classPrivateFieldSet(this, _PBRMaterial_useAlphaFromAlbedoTexture_accessor_storage, value, "f"); }
            /**
             * Enforces alpha test in opaque or blend mode in order to improve the performances of some situations.
             */
            get forceAlphaTest() { return __classPrivateFieldGet(this, _PBRMaterial_forceAlphaTest_accessor_storage, "f"); }
            set forceAlphaTest(value) { __classPrivateFieldSet(this, _PBRMaterial_forceAlphaTest_accessor_storage, value, "f"); }
            /**
             * Defines the alpha limits in alpha test mode.
             */
            get alphaCutOff() { return __classPrivateFieldGet(this, _PBRMaterial_alphaCutOff_accessor_storage, "f"); }
            set alphaCutOff(value) { __classPrivateFieldSet(this, _PBRMaterial_alphaCutOff_accessor_storage, value, "f"); }
            /**
             * Specifies that the material will keep the specular highlights over a transparent surface (only the most luminous ones).
             * A car glass is a good example of that. When sun reflects on it you can not see what is behind.
             */
            get useSpecularOverAlpha() { return __classPrivateFieldGet(this, _PBRMaterial_useSpecularOverAlpha_accessor_storage, "f"); }
            set useSpecularOverAlpha(value) { __classPrivateFieldSet(this, _PBRMaterial_useSpecularOverAlpha_accessor_storage, value, "f"); }
            /**
             * Specifies if the reflectivity texture contains the glossiness information in its alpha channel.
             */
            get useMicroSurfaceFromReflectivityMapAlpha() { return __classPrivateFieldGet(this, _PBRMaterial_useMicroSurfaceFromReflectivityMapAlpha_accessor_storage, "f"); }
            set useMicroSurfaceFromReflectivityMapAlpha(value) { __classPrivateFieldSet(this, _PBRMaterial_useMicroSurfaceFromReflectivityMapAlpha_accessor_storage, value, "f"); }
            /**
             * Specifies if the metallic texture contains the roughness information in its alpha channel.
             */
            get useRoughnessFromMetallicTextureAlpha() { return __classPrivateFieldGet(this, _PBRMaterial_useRoughnessFromMetallicTextureAlpha_accessor_storage, "f"); }
            set useRoughnessFromMetallicTextureAlpha(value) { __classPrivateFieldSet(this, _PBRMaterial_useRoughnessFromMetallicTextureAlpha_accessor_storage, value, "f"); }
            /**
             * Specifies if the metallic texture contains the roughness information in its green channel.
             * Needs useRoughnessFromMetallicTextureAlpha to be false.
             */
            get useRoughnessFromMetallicTextureGreen() { return __classPrivateFieldGet(this, _PBRMaterial_useRoughnessFromMetallicTextureGreen_accessor_storage, "f"); }
            set useRoughnessFromMetallicTextureGreen(value) { __classPrivateFieldSet(this, _PBRMaterial_useRoughnessFromMetallicTextureGreen_accessor_storage, value, "f"); }
            /**
             * Specifies if the metallic texture contains the metallness information in its blue channel.
             */
            get useMetallnessFromMetallicTextureBlue() { return __classPrivateFieldGet(this, _PBRMaterial_useMetallnessFromMetallicTextureBlue_accessor_storage, "f"); }
            set useMetallnessFromMetallicTextureBlue(value) { __classPrivateFieldSet(this, _PBRMaterial_useMetallnessFromMetallicTextureBlue_accessor_storage, value, "f"); }
            /**
             * Specifies if the metallic texture contains the ambient occlusion information in its red channel.
             */
            get useAmbientOcclusionFromMetallicTextureRed() { return __classPrivateFieldGet(this, _PBRMaterial_useAmbientOcclusionFromMetallicTextureRed_accessor_storage, "f"); }
            set useAmbientOcclusionFromMetallicTextureRed(value) { __classPrivateFieldSet(this, _PBRMaterial_useAmbientOcclusionFromMetallicTextureRed_accessor_storage, value, "f"); }
            /**
             * Specifies if the ambient texture contains the ambient occlusion information in its red channel only.
             */
            get useAmbientInGrayScale() { return __classPrivateFieldGet(this, _PBRMaterial_useAmbientInGrayScale_accessor_storage, "f"); }
            set useAmbientInGrayScale(value) { __classPrivateFieldSet(this, _PBRMaterial_useAmbientInGrayScale_accessor_storage, value, "f"); }
            /**
             * In case the reflectivity map does not contain the microsurface information in its alpha channel,
             * The material will try to infer what glossiness each pixel should be.
             */
            get useAutoMicroSurfaceFromReflectivityMap() { return __classPrivateFieldGet(this, _PBRMaterial_useAutoMicroSurfaceFromReflectivityMap_accessor_storage, "f"); }
            set useAutoMicroSurfaceFromReflectivityMap(value) { __classPrivateFieldSet(this, _PBRMaterial_useAutoMicroSurfaceFromReflectivityMap_accessor_storage, value, "f"); }
            /**
             * BJS is using an hardcoded light falloff based on a manually sets up range.
             * In PBR, one way to represents the falloff is to use the inverse squared root algorithm.
             * This parameter can help you switch back to the BJS mode in order to create scenes using both materials.
             */
            get usePhysicalLightFalloff() {
                return this._lightFalloff === PBRBaseMaterial.LIGHTFALLOFF_PHYSICAL;
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
                        this._lightFalloff = PBRBaseMaterial.LIGHTFALLOFF_PHYSICAL;
                    }
                    else {
                        this._lightFalloff = PBRBaseMaterial.LIGHTFALLOFF_STANDARD;
                    }
                }
            }
            /**
             * In order to support the falloff compatibility with gltf, a special mode has been added
             * to reproduce the gltf light falloff.
             */
            get useGLTFLightFalloff() {
                return this._lightFalloff === PBRBaseMaterial.LIGHTFALLOFF_GLTF;
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
                        this._lightFalloff = PBRBaseMaterial.LIGHTFALLOFF_GLTF;
                    }
                    else {
                        this._lightFalloff = PBRBaseMaterial.LIGHTFALLOFF_STANDARD;
                    }
                }
            }
            /**
             * Specifies that the material will keeps the reflection highlights over a transparent surface (only the most luminous ones).
             * A car glass is a good example of that. When the street lights reflects on it you can not see what is behind.
             */
            get useRadianceOverAlpha() { return __classPrivateFieldGet(this, _PBRMaterial_useRadianceOverAlpha_accessor_storage, "f"); }
            set useRadianceOverAlpha(value) { __classPrivateFieldSet(this, _PBRMaterial_useRadianceOverAlpha_accessor_storage, value, "f"); }
            /**
             * Allows using an object space normal map (instead of tangent space).
             */
            get useObjectSpaceNormalMap() { return __classPrivateFieldGet(this, _PBRMaterial_useObjectSpaceNormalMap_accessor_storage, "f"); }
            set useObjectSpaceNormalMap(value) { __classPrivateFieldSet(this, _PBRMaterial_useObjectSpaceNormalMap_accessor_storage, value, "f"); }
            /**
             * Allows using the bump map in parallax mode.
             */
            get useParallax() { return __classPrivateFieldGet(this, _PBRMaterial_useParallax_accessor_storage, "f"); }
            set useParallax(value) { __classPrivateFieldSet(this, _PBRMaterial_useParallax_accessor_storage, value, "f"); }
            /**
             * Allows using the bump map in parallax occlusion mode.
             */
            get useParallaxOcclusion() { return __classPrivateFieldGet(this, _PBRMaterial_useParallaxOcclusion_accessor_storage, "f"); }
            set useParallaxOcclusion(value) { __classPrivateFieldSet(this, _PBRMaterial_useParallaxOcclusion_accessor_storage, value, "f"); }
            /**
             * Controls the scale bias of the parallax mode.
             */
            get parallaxScaleBias() { return __classPrivateFieldGet(this, _PBRMaterial_parallaxScaleBias_accessor_storage, "f"); }
            set parallaxScaleBias(value) { __classPrivateFieldSet(this, _PBRMaterial_parallaxScaleBias_accessor_storage, value, "f"); }
            /**
             * If sets to true, disables all the lights affecting the material.
             */
            get disableLighting() { return __classPrivateFieldGet(this, _PBRMaterial_disableLighting_accessor_storage, "f"); }
            set disableLighting(value) { __classPrivateFieldSet(this, _PBRMaterial_disableLighting_accessor_storage, value, "f"); }
            /**
             * Force the shader to compute irradiance in the fragment shader in order to take bump in account.
             */
            get forceIrradianceInFragment() { return __classPrivateFieldGet(this, _PBRMaterial_forceIrradianceInFragment_accessor_storage, "f"); }
            set forceIrradianceInFragment(value) { __classPrivateFieldSet(this, _PBRMaterial_forceIrradianceInFragment_accessor_storage, value, "f"); }
            /**
             * Number of Simultaneous lights allowed on the material.
             */
            get maxSimultaneousLights() { return __classPrivateFieldGet(this, _PBRMaterial_maxSimultaneousLights_accessor_storage, "f"); }
            set maxSimultaneousLights(value) { __classPrivateFieldSet(this, _PBRMaterial_maxSimultaneousLights_accessor_storage, value, "f"); }
            /**
             * If sets to true, x component of normal map value will invert (x = 1.0 - x).
             */
            get invertNormalMapX() { return __classPrivateFieldGet(this, _PBRMaterial_invertNormalMapX_accessor_storage, "f"); }
            set invertNormalMapX(value) { __classPrivateFieldSet(this, _PBRMaterial_invertNormalMapX_accessor_storage, value, "f"); }
            /**
             * If sets to true, y component of normal map value will invert (y = 1.0 - y).
             */
            get invertNormalMapY() { return __classPrivateFieldGet(this, _PBRMaterial_invertNormalMapY_accessor_storage, "f"); }
            set invertNormalMapY(value) { __classPrivateFieldSet(this, _PBRMaterial_invertNormalMapY_accessor_storage, value, "f"); }
            /**
             * If sets to true and backfaceCulling is false, normals will be flipped on the backside.
             */
            get twoSidedLighting() { return __classPrivateFieldGet(this, _PBRMaterial_twoSidedLighting_accessor_storage, "f"); }
            set twoSidedLighting(value) { __classPrivateFieldSet(this, _PBRMaterial_twoSidedLighting_accessor_storage, value, "f"); }
            /**
             * A fresnel is applied to the alpha of the model to ensure grazing angles edges are not alpha tested.
             * And/Or occlude the blended part. (alpha is converted to gamma to compute the fresnel)
             */
            get useAlphaFresnel() { return __classPrivateFieldGet(this, _PBRMaterial_useAlphaFresnel_accessor_storage, "f"); }
            set useAlphaFresnel(value) { __classPrivateFieldSet(this, _PBRMaterial_useAlphaFresnel_accessor_storage, value, "f"); }
            /**
             * A fresnel is applied to the alpha of the model to ensure grazing angles edges are not alpha tested.
             * And/Or occlude the blended part. (alpha stays linear to compute the fresnel)
             */
            get useLinearAlphaFresnel() { return __classPrivateFieldGet(this, _PBRMaterial_useLinearAlphaFresnel_accessor_storage, "f"); }
            set useLinearAlphaFresnel(value) { __classPrivateFieldSet(this, _PBRMaterial_useLinearAlphaFresnel_accessor_storage, value, "f"); }
            /**
             * Let user defines the brdf lookup texture used for IBL.
             * A default 8bit version is embedded but you could point at :
             * * Default texture: https://assets.babylonjs.com/environments/correlatedMSBRDF_RGBD.png
             * * Default 16bit pixel depth texture: https://assets.babylonjs.com/environments/correlatedMSBRDF.dds
             * * LEGACY Default None correlated https://assets.babylonjs.com/environments/uncorrelatedBRDF_RGBD.png
             * * LEGACY Default None correlated 16bit pixel depth https://assets.babylonjs.com/environments/uncorrelatedBRDF.dds
             */
            get environmentBRDFTexture() { return __classPrivateFieldGet(this, _PBRMaterial_environmentBRDFTexture_accessor_storage, "f"); }
            set environmentBRDFTexture(value) { __classPrivateFieldSet(this, _PBRMaterial_environmentBRDFTexture_accessor_storage, value, "f"); }
            /**
             * Force normal to face away from face.
             */
            get forceNormalForward() { return __classPrivateFieldGet(this, _PBRMaterial_forceNormalForward_accessor_storage, "f"); }
            set forceNormalForward(value) { __classPrivateFieldSet(this, _PBRMaterial_forceNormalForward_accessor_storage, value, "f"); }
            /**
             * Enables specular anti aliasing in the PBR shader.
             * It will both interacts on the Geometry for analytical and IBL lighting.
             * It also prefilter the roughness map based on the bump values.
             */
            get enableSpecularAntiAliasing() { return __classPrivateFieldGet(this, _PBRMaterial_enableSpecularAntiAliasing_accessor_storage, "f"); }
            set enableSpecularAntiAliasing(value) { __classPrivateFieldSet(this, _PBRMaterial_enableSpecularAntiAliasing_accessor_storage, value, "f"); }
            /**
             * This parameters will enable/disable Horizon occlusion to prevent normal maps to look shiny when the normal
             * makes the reflect vector face the model (under horizon).
             */
            get useHorizonOcclusion() { return __classPrivateFieldGet(this, _PBRMaterial_useHorizonOcclusion_accessor_storage, "f"); }
            set useHorizonOcclusion(value) { __classPrivateFieldSet(this, _PBRMaterial_useHorizonOcclusion_accessor_storage, value, "f"); }
            /**
             * This parameters will enable/disable radiance occlusion by preventing the radiance to lit
             * too much the area relying on ambient texture to define their ambient occlusion.
             */
            get useRadianceOcclusion() { return __classPrivateFieldGet(this, _PBRMaterial_useRadianceOcclusion_accessor_storage, "f"); }
            set useRadianceOcclusion(value) { __classPrivateFieldSet(this, _PBRMaterial_useRadianceOcclusion_accessor_storage, value, "f"); }
            /**
             * If set to true, no lighting calculations will be applied.
             */
            get unlit() { return __classPrivateFieldGet(this, _PBRMaterial_unlit_accessor_storage, "f"); }
            set unlit(value) { __classPrivateFieldSet(this, _PBRMaterial_unlit_accessor_storage, value, "f"); }
            /**
             * If sets to true, the decal map will be applied after the detail map. Else, it is applied before (default: false)
             */
            get applyDecalMapAfterDetailMap() { return __classPrivateFieldGet(this, _PBRMaterial_applyDecalMapAfterDetailMap_accessor_storage, "f"); }
            set applyDecalMapAfterDetailMap(value) { __classPrivateFieldSet(this, _PBRMaterial_applyDecalMapAfterDetailMap_accessor_storage, value, "f"); }
            /**
             * Instantiates a new PBRMaterial instance.
             *
             * @param name The material name
             * @param scene The scene the material will be use in.
             * @param forceGLSL Use the GLSL code generation for the shader (even on WebGPU). Default is false
             */
            constructor(name, scene, forceGLSL = false) {
                super(name, scene, forceGLSL);
                _PBRMaterial_directIntensity_accessor_storage.set(this, (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _directIntensity_initializers, 1.0)));
                _PBRMaterial_emissiveIntensity_accessor_storage.set(this, (__runInitializers(this, _directIntensity_extraInitializers), __runInitializers(this, _emissiveIntensity_initializers, 1.0)));
                _PBRMaterial_environmentIntensity_accessor_storage.set(this, (__runInitializers(this, _emissiveIntensity_extraInitializers), __runInitializers(this, _environmentIntensity_initializers, 1.0)));
                _PBRMaterial_specularIntensity_accessor_storage.set(this, (__runInitializers(this, _environmentIntensity_extraInitializers), __runInitializers(this, _specularIntensity_initializers, 1.0)));
                _PBRMaterial_disableBumpMap_accessor_storage.set(this, (__runInitializers(this, _specularIntensity_extraInitializers), __runInitializers(this, _disableBumpMap_initializers, false)));
                _PBRMaterial_albedoTexture_accessor_storage.set(this, (__runInitializers(this, _disableBumpMap_extraInitializers), __runInitializers(this, _albedoTexture_initializers, void 0)));
                _PBRMaterial_baseWeightTexture_accessor_storage.set(this, (__runInitializers(this, _albedoTexture_extraInitializers), __runInitializers(this, _baseWeightTexture_initializers, void 0)));
                _PBRMaterial_baseDiffuseRoughnessTexture_accessor_storage.set(this, (__runInitializers(this, _baseWeightTexture_extraInitializers), __runInitializers(this, _baseDiffuseRoughnessTexture_initializers, void 0)));
                _PBRMaterial_ambientTexture_accessor_storage.set(this, (__runInitializers(this, _baseDiffuseRoughnessTexture_extraInitializers), __runInitializers(this, _ambientTexture_initializers, void 0)));
                _PBRMaterial_ambientTextureStrength_accessor_storage.set(this, (__runInitializers(this, _ambientTexture_extraInitializers), __runInitializers(this, _ambientTextureStrength_initializers, 1.0)));
                _PBRMaterial_ambientTextureImpactOnAnalyticalLights_accessor_storage.set(this, (__runInitializers(this, _ambientTextureStrength_extraInitializers), __runInitializers(this, _ambientTextureImpactOnAnalyticalLights_initializers, _a.DEFAULT_AO_ON_ANALYTICAL_LIGHTS)));
                _PBRMaterial_opacityTexture_accessor_storage.set(this, (__runInitializers(this, _ambientTextureImpactOnAnalyticalLights_extraInitializers), __runInitializers(this, _opacityTexture_initializers, void 0)));
                _PBRMaterial_reflectionTexture_accessor_storage.set(this, (__runInitializers(this, _opacityTexture_extraInitializers), __runInitializers(this, _reflectionTexture_initializers, void 0)));
                _PBRMaterial_emissiveTexture_accessor_storage.set(this, (__runInitializers(this, _reflectionTexture_extraInitializers), __runInitializers(this, _emissiveTexture_initializers, void 0)));
                _PBRMaterial_reflectivityTexture_accessor_storage.set(this, (__runInitializers(this, _emissiveTexture_extraInitializers), __runInitializers(this, _reflectivityTexture_initializers, void 0)));
                _PBRMaterial_metallicTexture_accessor_storage.set(this, (__runInitializers(this, _reflectivityTexture_extraInitializers), __runInitializers(this, _metallicTexture_initializers, void 0)));
                _PBRMaterial_metallic_accessor_storage.set(this, (__runInitializers(this, _metallicTexture_extraInitializers), __runInitializers(this, _metallic_initializers, void 0)));
                _PBRMaterial_roughness_accessor_storage.set(this, (__runInitializers(this, _metallic_extraInitializers), __runInitializers(this, _roughness_initializers, void 0)));
                _PBRMaterial_metallicF0Factor_accessor_storage.set(this, (__runInitializers(this, _roughness_extraInitializers), __runInitializers(this, _metallicF0Factor_initializers, 1)));
                _PBRMaterial_metallicReflectanceColor_accessor_storage.set(this, (__runInitializers(this, _metallicF0Factor_extraInitializers), __runInitializers(this, _metallicReflectanceColor_initializers, Color3.White())));
                _PBRMaterial_useOnlyMetallicFromMetallicReflectanceTexture_accessor_storage.set(this, (__runInitializers(this, _metallicReflectanceColor_extraInitializers), __runInitializers(this, _useOnlyMetallicFromMetallicReflectanceTexture_initializers, false)));
                _PBRMaterial_metallicReflectanceTexture_accessor_storage.set(this, (__runInitializers(this, _useOnlyMetallicFromMetallicReflectanceTexture_extraInitializers), __runInitializers(this, _metallicReflectanceTexture_initializers, void 0)));
                _PBRMaterial_reflectanceTexture_accessor_storage.set(this, (__runInitializers(this, _metallicReflectanceTexture_extraInitializers), __runInitializers(this, _reflectanceTexture_initializers, void 0)));
                _PBRMaterial_microSurfaceTexture_accessor_storage.set(this, (__runInitializers(this, _reflectanceTexture_extraInitializers), __runInitializers(this, _microSurfaceTexture_initializers, void 0)));
                _PBRMaterial_bumpTexture_accessor_storage.set(this, (__runInitializers(this, _microSurfaceTexture_extraInitializers), __runInitializers(this, _bumpTexture_initializers, void 0)));
                _PBRMaterial_lightmapTexture_accessor_storage.set(this, (__runInitializers(this, _bumpTexture_extraInitializers), __runInitializers(this, _lightmapTexture_initializers, void 0)));
                _PBRMaterial_ambientColor_accessor_storage.set(this, (__runInitializers(this, _lightmapTexture_extraInitializers), __runInitializers(this, _ambientColor_initializers, new Color3(0, 0, 0))));
                _PBRMaterial_albedoColor_accessor_storage.set(this, (__runInitializers(this, _ambientColor_extraInitializers), __runInitializers(this, _albedoColor_initializers, new Color3(1, 1, 1))));
                _PBRMaterial_baseWeight_accessor_storage.set(this, (__runInitializers(this, _albedoColor_extraInitializers), __runInitializers(this, _baseWeight_initializers, 1)));
                _PBRMaterial_baseDiffuseRoughness_accessor_storage.set(this, (__runInitializers(this, _baseWeight_extraInitializers), __runInitializers(this, _baseDiffuseRoughness_initializers, void 0)));
                _PBRMaterial_reflectivityColor_accessor_storage.set(this, (__runInitializers(this, _baseDiffuseRoughness_extraInitializers), __runInitializers(this, _reflectivityColor_initializers, new Color3(1, 1, 1))));
                _PBRMaterial_reflectionColor_accessor_storage.set(this, (__runInitializers(this, _reflectivityColor_extraInitializers), __runInitializers(this, _reflectionColor_initializers, new Color3(1.0, 1.0, 1.0))));
                _PBRMaterial_emissiveColor_accessor_storage.set(this, (__runInitializers(this, _reflectionColor_extraInitializers), __runInitializers(this, _emissiveColor_initializers, new Color3(0, 0, 0))));
                _PBRMaterial_microSurface_accessor_storage.set(this, (__runInitializers(this, _emissiveColor_extraInitializers), __runInitializers(this, _microSurface_initializers, 1.0)));
                _PBRMaterial_useLightmapAsShadowmap_accessor_storage.set(this, (__runInitializers(this, _microSurface_extraInitializers), __runInitializers(this, _useLightmapAsShadowmap_initializers, false)));
                _PBRMaterial_useAlphaFromAlbedoTexture_accessor_storage.set(this, (__runInitializers(this, _useLightmapAsShadowmap_extraInitializers), __runInitializers(this, _useAlphaFromAlbedoTexture_initializers, false)));
                _PBRMaterial_forceAlphaTest_accessor_storage.set(this, (__runInitializers(this, _useAlphaFromAlbedoTexture_extraInitializers), __runInitializers(this, _forceAlphaTest_initializers, false)));
                _PBRMaterial_alphaCutOff_accessor_storage.set(this, (__runInitializers(this, _forceAlphaTest_extraInitializers), __runInitializers(this, _alphaCutOff_initializers, 0.4)));
                _PBRMaterial_useSpecularOverAlpha_accessor_storage.set(this, (__runInitializers(this, _alphaCutOff_extraInitializers), __runInitializers(this, _useSpecularOverAlpha_initializers, true)));
                _PBRMaterial_useMicroSurfaceFromReflectivityMapAlpha_accessor_storage.set(this, (__runInitializers(this, _useSpecularOverAlpha_extraInitializers), __runInitializers(this, _useMicroSurfaceFromReflectivityMapAlpha_initializers, false)));
                _PBRMaterial_useRoughnessFromMetallicTextureAlpha_accessor_storage.set(this, (__runInitializers(this, _useMicroSurfaceFromReflectivityMapAlpha_extraInitializers), __runInitializers(this, _useRoughnessFromMetallicTextureAlpha_initializers, true)));
                _PBRMaterial_useRoughnessFromMetallicTextureGreen_accessor_storage.set(this, (__runInitializers(this, _useRoughnessFromMetallicTextureAlpha_extraInitializers), __runInitializers(this, _useRoughnessFromMetallicTextureGreen_initializers, false)));
                _PBRMaterial_useMetallnessFromMetallicTextureBlue_accessor_storage.set(this, (__runInitializers(this, _useRoughnessFromMetallicTextureGreen_extraInitializers), __runInitializers(this, _useMetallnessFromMetallicTextureBlue_initializers, false)));
                _PBRMaterial_useAmbientOcclusionFromMetallicTextureRed_accessor_storage.set(this, (__runInitializers(this, _useMetallnessFromMetallicTextureBlue_extraInitializers), __runInitializers(this, _useAmbientOcclusionFromMetallicTextureRed_initializers, false)));
                _PBRMaterial_useAmbientInGrayScale_accessor_storage.set(this, (__runInitializers(this, _useAmbientOcclusionFromMetallicTextureRed_extraInitializers), __runInitializers(this, _useAmbientInGrayScale_initializers, false)));
                _PBRMaterial_useAutoMicroSurfaceFromReflectivityMap_accessor_storage.set(this, (__runInitializers(this, _useAmbientInGrayScale_extraInitializers), __runInitializers(this, _useAutoMicroSurfaceFromReflectivityMap_initializers, false)));
                _PBRMaterial_useRadianceOverAlpha_accessor_storage.set(this, (__runInitializers(this, _useAutoMicroSurfaceFromReflectivityMap_extraInitializers), __runInitializers(this, _useRadianceOverAlpha_initializers, true)));
                _PBRMaterial_useObjectSpaceNormalMap_accessor_storage.set(this, (__runInitializers(this, _useRadianceOverAlpha_extraInitializers), __runInitializers(this, _useObjectSpaceNormalMap_initializers, false)));
                _PBRMaterial_useParallax_accessor_storage.set(this, (__runInitializers(this, _useObjectSpaceNormalMap_extraInitializers), __runInitializers(this, _useParallax_initializers, false)));
                _PBRMaterial_useParallaxOcclusion_accessor_storage.set(this, (__runInitializers(this, _useParallax_extraInitializers), __runInitializers(this, _useParallaxOcclusion_initializers, false)));
                _PBRMaterial_parallaxScaleBias_accessor_storage.set(this, (__runInitializers(this, _useParallaxOcclusion_extraInitializers), __runInitializers(this, _parallaxScaleBias_initializers, 0.05)));
                _PBRMaterial_disableLighting_accessor_storage.set(this, (__runInitializers(this, _parallaxScaleBias_extraInitializers), __runInitializers(this, _disableLighting_initializers, false)));
                _PBRMaterial_forceIrradianceInFragment_accessor_storage.set(this, (__runInitializers(this, _disableLighting_extraInitializers), __runInitializers(this, _forceIrradianceInFragment_initializers, false)));
                _PBRMaterial_maxSimultaneousLights_accessor_storage.set(this, (__runInitializers(this, _forceIrradianceInFragment_extraInitializers), __runInitializers(this, _maxSimultaneousLights_initializers, 4)));
                _PBRMaterial_invertNormalMapX_accessor_storage.set(this, (__runInitializers(this, _maxSimultaneousLights_extraInitializers), __runInitializers(this, _invertNormalMapX_initializers, false)));
                _PBRMaterial_invertNormalMapY_accessor_storage.set(this, (__runInitializers(this, _invertNormalMapX_extraInitializers), __runInitializers(this, _invertNormalMapY_initializers, false)));
                _PBRMaterial_twoSidedLighting_accessor_storage.set(this, (__runInitializers(this, _invertNormalMapY_extraInitializers), __runInitializers(this, _twoSidedLighting_initializers, false)));
                _PBRMaterial_useAlphaFresnel_accessor_storage.set(this, (__runInitializers(this, _twoSidedLighting_extraInitializers), __runInitializers(this, _useAlphaFresnel_initializers, false)));
                _PBRMaterial_useLinearAlphaFresnel_accessor_storage.set(this, (__runInitializers(this, _useAlphaFresnel_extraInitializers), __runInitializers(this, _useLinearAlphaFresnel_initializers, false)));
                _PBRMaterial_environmentBRDFTexture_accessor_storage.set(this, (__runInitializers(this, _useLinearAlphaFresnel_extraInitializers), __runInitializers(this, _environmentBRDFTexture_initializers, null)));
                _PBRMaterial_forceNormalForward_accessor_storage.set(this, (__runInitializers(this, _environmentBRDFTexture_extraInitializers), __runInitializers(this, _forceNormalForward_initializers, false)));
                _PBRMaterial_enableSpecularAntiAliasing_accessor_storage.set(this, (__runInitializers(this, _forceNormalForward_extraInitializers), __runInitializers(this, _enableSpecularAntiAliasing_initializers, false)));
                _PBRMaterial_useHorizonOcclusion_accessor_storage.set(this, (__runInitializers(this, _enableSpecularAntiAliasing_extraInitializers), __runInitializers(this, _useHorizonOcclusion_initializers, true)));
                _PBRMaterial_useRadianceOcclusion_accessor_storage.set(this, (__runInitializers(this, _useHorizonOcclusion_extraInitializers), __runInitializers(this, _useRadianceOcclusion_initializers, true)));
                _PBRMaterial_unlit_accessor_storage.set(this, (__runInitializers(this, _useRadianceOcclusion_extraInitializers), __runInitializers(this, _unlit_initializers, false)));
                _PBRMaterial_applyDecalMapAfterDetailMap_accessor_storage.set(this, (__runInitializers(this, _unlit_extraInitializers), __runInitializers(this, _applyDecalMapAfterDetailMap_initializers, false)));
                __runInitializers(this, _applyDecalMapAfterDetailMap_extraInitializers);
                this._environmentBRDFTexture = GetEnvironmentBRDFTexture(this.getScene());
            }
            /**
             * @returns the name of this material class.
             */
            getClassName() {
                return "PBRMaterial";
            }
            /**
             * Makes a duplicate of the current material.
             * @param name - name to use for the new material.
             * @param cloneTexturesOnlyOnce - if a texture is used in more than one channel (e.g diffuse and opacity), only clone it once and reuse it on the other channels. Default false.
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
                serializationObject.customType = "BABYLON.PBRMaterial";
                return serializationObject;
            }
            // Statics
            /**
             * Parses a PBR Material from a serialized object.
             * @param source - Serialized object.
             * @param scene - BJS scene instance.
             * @param rootUrl - url for the scene object
             * @returns - PBRMaterial
             */
            static Parse(source, scene, rootUrl) {
                const material = SerializationHelper.Parse(() => new _a(source.name, scene), source, scene, rootUrl);
                if (source.stencil) {
                    material.stencil.parse(source.stencil, scene, rootUrl);
                }
                Material._ParsePlugins(source, material, scene, rootUrl);
                // The code block below ensures backward compatibility with serialized materials before plugins are automatically serialized.
                if (source.clearCoat) {
                    material.clearCoat.parse(source.clearCoat, scene, rootUrl);
                }
                if (source.anisotropy) {
                    material.anisotropy.parse(source.anisotropy, scene, rootUrl);
                }
                if (source.brdf) {
                    material.brdf.parse(source.brdf, scene, rootUrl);
                }
                if (source.sheen) {
                    material.sheen.parse(source.sheen, scene, rootUrl);
                }
                if (source.subSurface) {
                    material.subSurface.parse(source.subSurface, scene, rootUrl);
                }
                if (source.iridescence) {
                    material.iridescence.parse(source.iridescence, scene, rootUrl);
                }
                return material;
            }
        },
        _PBRMaterial_directIntensity_accessor_storage = new WeakMap(),
        _PBRMaterial_emissiveIntensity_accessor_storage = new WeakMap(),
        _PBRMaterial_environmentIntensity_accessor_storage = new WeakMap(),
        _PBRMaterial_specularIntensity_accessor_storage = new WeakMap(),
        _PBRMaterial_disableBumpMap_accessor_storage = new WeakMap(),
        _PBRMaterial_albedoTexture_accessor_storage = new WeakMap(),
        _PBRMaterial_baseWeightTexture_accessor_storage = new WeakMap(),
        _PBRMaterial_baseDiffuseRoughnessTexture_accessor_storage = new WeakMap(),
        _PBRMaterial_ambientTexture_accessor_storage = new WeakMap(),
        _PBRMaterial_ambientTextureStrength_accessor_storage = new WeakMap(),
        _PBRMaterial_ambientTextureImpactOnAnalyticalLights_accessor_storage = new WeakMap(),
        _PBRMaterial_opacityTexture_accessor_storage = new WeakMap(),
        _PBRMaterial_reflectionTexture_accessor_storage = new WeakMap(),
        _PBRMaterial_emissiveTexture_accessor_storage = new WeakMap(),
        _PBRMaterial_reflectivityTexture_accessor_storage = new WeakMap(),
        _PBRMaterial_metallicTexture_accessor_storage = new WeakMap(),
        _PBRMaterial_metallic_accessor_storage = new WeakMap(),
        _PBRMaterial_roughness_accessor_storage = new WeakMap(),
        _PBRMaterial_metallicF0Factor_accessor_storage = new WeakMap(),
        _PBRMaterial_metallicReflectanceColor_accessor_storage = new WeakMap(),
        _PBRMaterial_useOnlyMetallicFromMetallicReflectanceTexture_accessor_storage = new WeakMap(),
        _PBRMaterial_metallicReflectanceTexture_accessor_storage = new WeakMap(),
        _PBRMaterial_reflectanceTexture_accessor_storage = new WeakMap(),
        _PBRMaterial_microSurfaceTexture_accessor_storage = new WeakMap(),
        _PBRMaterial_bumpTexture_accessor_storage = new WeakMap(),
        _PBRMaterial_lightmapTexture_accessor_storage = new WeakMap(),
        _PBRMaterial_ambientColor_accessor_storage = new WeakMap(),
        _PBRMaterial_albedoColor_accessor_storage = new WeakMap(),
        _PBRMaterial_baseWeight_accessor_storage = new WeakMap(),
        _PBRMaterial_baseDiffuseRoughness_accessor_storage = new WeakMap(),
        _PBRMaterial_reflectivityColor_accessor_storage = new WeakMap(),
        _PBRMaterial_reflectionColor_accessor_storage = new WeakMap(),
        _PBRMaterial_emissiveColor_accessor_storage = new WeakMap(),
        _PBRMaterial_microSurface_accessor_storage = new WeakMap(),
        _PBRMaterial_useLightmapAsShadowmap_accessor_storage = new WeakMap(),
        _PBRMaterial_useAlphaFromAlbedoTexture_accessor_storage = new WeakMap(),
        _PBRMaterial_forceAlphaTest_accessor_storage = new WeakMap(),
        _PBRMaterial_alphaCutOff_accessor_storage = new WeakMap(),
        _PBRMaterial_useSpecularOverAlpha_accessor_storage = new WeakMap(),
        _PBRMaterial_useMicroSurfaceFromReflectivityMapAlpha_accessor_storage = new WeakMap(),
        _PBRMaterial_useRoughnessFromMetallicTextureAlpha_accessor_storage = new WeakMap(),
        _PBRMaterial_useRoughnessFromMetallicTextureGreen_accessor_storage = new WeakMap(),
        _PBRMaterial_useMetallnessFromMetallicTextureBlue_accessor_storage = new WeakMap(),
        _PBRMaterial_useAmbientOcclusionFromMetallicTextureRed_accessor_storage = new WeakMap(),
        _PBRMaterial_useAmbientInGrayScale_accessor_storage = new WeakMap(),
        _PBRMaterial_useAutoMicroSurfaceFromReflectivityMap_accessor_storage = new WeakMap(),
        _PBRMaterial_useRadianceOverAlpha_accessor_storage = new WeakMap(),
        _PBRMaterial_useObjectSpaceNormalMap_accessor_storage = new WeakMap(),
        _PBRMaterial_useParallax_accessor_storage = new WeakMap(),
        _PBRMaterial_useParallaxOcclusion_accessor_storage = new WeakMap(),
        _PBRMaterial_parallaxScaleBias_accessor_storage = new WeakMap(),
        _PBRMaterial_disableLighting_accessor_storage = new WeakMap(),
        _PBRMaterial_forceIrradianceInFragment_accessor_storage = new WeakMap(),
        _PBRMaterial_maxSimultaneousLights_accessor_storage = new WeakMap(),
        _PBRMaterial_invertNormalMapX_accessor_storage = new WeakMap(),
        _PBRMaterial_invertNormalMapY_accessor_storage = new WeakMap(),
        _PBRMaterial_twoSidedLighting_accessor_storage = new WeakMap(),
        _PBRMaterial_useAlphaFresnel_accessor_storage = new WeakMap(),
        _PBRMaterial_useLinearAlphaFresnel_accessor_storage = new WeakMap(),
        _PBRMaterial_environmentBRDFTexture_accessor_storage = new WeakMap(),
        _PBRMaterial_forceNormalForward_accessor_storage = new WeakMap(),
        _PBRMaterial_enableSpecularAntiAliasing_accessor_storage = new WeakMap(),
        _PBRMaterial_useHorizonOcclusion_accessor_storage = new WeakMap(),
        _PBRMaterial_useRadianceOcclusion_accessor_storage = new WeakMap(),
        _PBRMaterial_unlit_accessor_storage = new WeakMap(),
        _PBRMaterial_applyDecalMapAfterDetailMap_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _directIntensity_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _emissiveIntensity_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _environmentIntensity_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _specularIntensity_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _disableBumpMap_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _albedoTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _baseWeightTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _baseDiffuseRoughnessTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _ambientTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _ambientTextureStrength_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _ambientTextureImpactOnAnalyticalLights_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _opacityTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesAndMiscDirty")];
            _reflectionTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _emissiveTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _reflectivityTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _metallicTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _metallic_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _roughness_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _metallicF0Factor_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _metallicReflectanceColor_decorators = [serializeAsColor3(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _useOnlyMetallicFromMetallicReflectanceTexture_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _metallicReflectanceTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _reflectanceTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _microSurfaceTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _bumpTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _lightmapTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty", null)];
            _ambientColor_decorators = [serializeAsColor3("ambient"), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _albedoColor_decorators = [serializeAsColor3("albedo"), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _baseWeight_decorators = [serialize("baseWeight"), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _baseDiffuseRoughness_decorators = [serialize("baseDiffuseRoughness"), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _reflectivityColor_decorators = [serializeAsColor3("reflectivity"), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _reflectionColor_decorators = [serializeAsColor3("reflection"), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _emissiveColor_decorators = [serializeAsColor3("emissive"), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _microSurface_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _useLightmapAsShadowmap_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _useAlphaFromAlbedoTexture_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesAndMiscDirty")];
            _forceAlphaTest_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesAndMiscDirty")];
            _alphaCutOff_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesAndMiscDirty")];
            _useSpecularOverAlpha_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _useMicroSurfaceFromReflectivityMapAlpha_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _useRoughnessFromMetallicTextureAlpha_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _useRoughnessFromMetallicTextureGreen_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _useMetallnessFromMetallicTextureBlue_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _useAmbientOcclusionFromMetallicTextureRed_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _useAmbientInGrayScale_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _useAutoMicroSurfaceFromReflectivityMap_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _get_usePhysicalLightFalloff_decorators = [serialize()];
            _get_useGLTFLightFalloff_decorators = [serialize()];
            _useRadianceOverAlpha_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
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
            __esDecorate(_a, null, _directIntensity_decorators, { kind: "accessor", name: "directIntensity", static: false, private: false, access: { has: obj => "directIntensity" in obj, get: obj => obj.directIntensity, set: (obj, value) => { obj.directIntensity = value; } }, metadata: _metadata }, _directIntensity_initializers, _directIntensity_extraInitializers);
            __esDecorate(_a, null, _emissiveIntensity_decorators, { kind: "accessor", name: "emissiveIntensity", static: false, private: false, access: { has: obj => "emissiveIntensity" in obj, get: obj => obj.emissiveIntensity, set: (obj, value) => { obj.emissiveIntensity = value; } }, metadata: _metadata }, _emissiveIntensity_initializers, _emissiveIntensity_extraInitializers);
            __esDecorate(_a, null, _environmentIntensity_decorators, { kind: "accessor", name: "environmentIntensity", static: false, private: false, access: { has: obj => "environmentIntensity" in obj, get: obj => obj.environmentIntensity, set: (obj, value) => { obj.environmentIntensity = value; } }, metadata: _metadata }, _environmentIntensity_initializers, _environmentIntensity_extraInitializers);
            __esDecorate(_a, null, _specularIntensity_decorators, { kind: "accessor", name: "specularIntensity", static: false, private: false, access: { has: obj => "specularIntensity" in obj, get: obj => obj.specularIntensity, set: (obj, value) => { obj.specularIntensity = value; } }, metadata: _metadata }, _specularIntensity_initializers, _specularIntensity_extraInitializers);
            __esDecorate(_a, null, _disableBumpMap_decorators, { kind: "accessor", name: "disableBumpMap", static: false, private: false, access: { has: obj => "disableBumpMap" in obj, get: obj => obj.disableBumpMap, set: (obj, value) => { obj.disableBumpMap = value; } }, metadata: _metadata }, _disableBumpMap_initializers, _disableBumpMap_extraInitializers);
            __esDecorate(_a, null, _albedoTexture_decorators, { kind: "accessor", name: "albedoTexture", static: false, private: false, access: { has: obj => "albedoTexture" in obj, get: obj => obj.albedoTexture, set: (obj, value) => { obj.albedoTexture = value; } }, metadata: _metadata }, _albedoTexture_initializers, _albedoTexture_extraInitializers);
            __esDecorate(_a, null, _baseWeightTexture_decorators, { kind: "accessor", name: "baseWeightTexture", static: false, private: false, access: { has: obj => "baseWeightTexture" in obj, get: obj => obj.baseWeightTexture, set: (obj, value) => { obj.baseWeightTexture = value; } }, metadata: _metadata }, _baseWeightTexture_initializers, _baseWeightTexture_extraInitializers);
            __esDecorate(_a, null, _baseDiffuseRoughnessTexture_decorators, { kind: "accessor", name: "baseDiffuseRoughnessTexture", static: false, private: false, access: { has: obj => "baseDiffuseRoughnessTexture" in obj, get: obj => obj.baseDiffuseRoughnessTexture, set: (obj, value) => { obj.baseDiffuseRoughnessTexture = value; } }, metadata: _metadata }, _baseDiffuseRoughnessTexture_initializers, _baseDiffuseRoughnessTexture_extraInitializers);
            __esDecorate(_a, null, _ambientTexture_decorators, { kind: "accessor", name: "ambientTexture", static: false, private: false, access: { has: obj => "ambientTexture" in obj, get: obj => obj.ambientTexture, set: (obj, value) => { obj.ambientTexture = value; } }, metadata: _metadata }, _ambientTexture_initializers, _ambientTexture_extraInitializers);
            __esDecorate(_a, null, _ambientTextureStrength_decorators, { kind: "accessor", name: "ambientTextureStrength", static: false, private: false, access: { has: obj => "ambientTextureStrength" in obj, get: obj => obj.ambientTextureStrength, set: (obj, value) => { obj.ambientTextureStrength = value; } }, metadata: _metadata }, _ambientTextureStrength_initializers, _ambientTextureStrength_extraInitializers);
            __esDecorate(_a, null, _ambientTextureImpactOnAnalyticalLights_decorators, { kind: "accessor", name: "ambientTextureImpactOnAnalyticalLights", static: false, private: false, access: { has: obj => "ambientTextureImpactOnAnalyticalLights" in obj, get: obj => obj.ambientTextureImpactOnAnalyticalLights, set: (obj, value) => { obj.ambientTextureImpactOnAnalyticalLights = value; } }, metadata: _metadata }, _ambientTextureImpactOnAnalyticalLights_initializers, _ambientTextureImpactOnAnalyticalLights_extraInitializers);
            __esDecorate(_a, null, _opacityTexture_decorators, { kind: "accessor", name: "opacityTexture", static: false, private: false, access: { has: obj => "opacityTexture" in obj, get: obj => obj.opacityTexture, set: (obj, value) => { obj.opacityTexture = value; } }, metadata: _metadata }, _opacityTexture_initializers, _opacityTexture_extraInitializers);
            __esDecorate(_a, null, _reflectionTexture_decorators, { kind: "accessor", name: "reflectionTexture", static: false, private: false, access: { has: obj => "reflectionTexture" in obj, get: obj => obj.reflectionTexture, set: (obj, value) => { obj.reflectionTexture = value; } }, metadata: _metadata }, _reflectionTexture_initializers, _reflectionTexture_extraInitializers);
            __esDecorate(_a, null, _emissiveTexture_decorators, { kind: "accessor", name: "emissiveTexture", static: false, private: false, access: { has: obj => "emissiveTexture" in obj, get: obj => obj.emissiveTexture, set: (obj, value) => { obj.emissiveTexture = value; } }, metadata: _metadata }, _emissiveTexture_initializers, _emissiveTexture_extraInitializers);
            __esDecorate(_a, null, _reflectivityTexture_decorators, { kind: "accessor", name: "reflectivityTexture", static: false, private: false, access: { has: obj => "reflectivityTexture" in obj, get: obj => obj.reflectivityTexture, set: (obj, value) => { obj.reflectivityTexture = value; } }, metadata: _metadata }, _reflectivityTexture_initializers, _reflectivityTexture_extraInitializers);
            __esDecorate(_a, null, _metallicTexture_decorators, { kind: "accessor", name: "metallicTexture", static: false, private: false, access: { has: obj => "metallicTexture" in obj, get: obj => obj.metallicTexture, set: (obj, value) => { obj.metallicTexture = value; } }, metadata: _metadata }, _metallicTexture_initializers, _metallicTexture_extraInitializers);
            __esDecorate(_a, null, _metallic_decorators, { kind: "accessor", name: "metallic", static: false, private: false, access: { has: obj => "metallic" in obj, get: obj => obj.metallic, set: (obj, value) => { obj.metallic = value; } }, metadata: _metadata }, _metallic_initializers, _metallic_extraInitializers);
            __esDecorate(_a, null, _roughness_decorators, { kind: "accessor", name: "roughness", static: false, private: false, access: { has: obj => "roughness" in obj, get: obj => obj.roughness, set: (obj, value) => { obj.roughness = value; } }, metadata: _metadata }, _roughness_initializers, _roughness_extraInitializers);
            __esDecorate(_a, null, _metallicF0Factor_decorators, { kind: "accessor", name: "metallicF0Factor", static: false, private: false, access: { has: obj => "metallicF0Factor" in obj, get: obj => obj.metallicF0Factor, set: (obj, value) => { obj.metallicF0Factor = value; } }, metadata: _metadata }, _metallicF0Factor_initializers, _metallicF0Factor_extraInitializers);
            __esDecorate(_a, null, _metallicReflectanceColor_decorators, { kind: "accessor", name: "metallicReflectanceColor", static: false, private: false, access: { has: obj => "metallicReflectanceColor" in obj, get: obj => obj.metallicReflectanceColor, set: (obj, value) => { obj.metallicReflectanceColor = value; } }, metadata: _metadata }, _metallicReflectanceColor_initializers, _metallicReflectanceColor_extraInitializers);
            __esDecorate(_a, null, _useOnlyMetallicFromMetallicReflectanceTexture_decorators, { kind: "accessor", name: "useOnlyMetallicFromMetallicReflectanceTexture", static: false, private: false, access: { has: obj => "useOnlyMetallicFromMetallicReflectanceTexture" in obj, get: obj => obj.useOnlyMetallicFromMetallicReflectanceTexture, set: (obj, value) => { obj.useOnlyMetallicFromMetallicReflectanceTexture = value; } }, metadata: _metadata }, _useOnlyMetallicFromMetallicReflectanceTexture_initializers, _useOnlyMetallicFromMetallicReflectanceTexture_extraInitializers);
            __esDecorate(_a, null, _metallicReflectanceTexture_decorators, { kind: "accessor", name: "metallicReflectanceTexture", static: false, private: false, access: { has: obj => "metallicReflectanceTexture" in obj, get: obj => obj.metallicReflectanceTexture, set: (obj, value) => { obj.metallicReflectanceTexture = value; } }, metadata: _metadata }, _metallicReflectanceTexture_initializers, _metallicReflectanceTexture_extraInitializers);
            __esDecorate(_a, null, _reflectanceTexture_decorators, { kind: "accessor", name: "reflectanceTexture", static: false, private: false, access: { has: obj => "reflectanceTexture" in obj, get: obj => obj.reflectanceTexture, set: (obj, value) => { obj.reflectanceTexture = value; } }, metadata: _metadata }, _reflectanceTexture_initializers, _reflectanceTexture_extraInitializers);
            __esDecorate(_a, null, _microSurfaceTexture_decorators, { kind: "accessor", name: "microSurfaceTexture", static: false, private: false, access: { has: obj => "microSurfaceTexture" in obj, get: obj => obj.microSurfaceTexture, set: (obj, value) => { obj.microSurfaceTexture = value; } }, metadata: _metadata }, _microSurfaceTexture_initializers, _microSurfaceTexture_extraInitializers);
            __esDecorate(_a, null, _bumpTexture_decorators, { kind: "accessor", name: "bumpTexture", static: false, private: false, access: { has: obj => "bumpTexture" in obj, get: obj => obj.bumpTexture, set: (obj, value) => { obj.bumpTexture = value; } }, metadata: _metadata }, _bumpTexture_initializers, _bumpTexture_extraInitializers);
            __esDecorate(_a, null, _lightmapTexture_decorators, { kind: "accessor", name: "lightmapTexture", static: false, private: false, access: { has: obj => "lightmapTexture" in obj, get: obj => obj.lightmapTexture, set: (obj, value) => { obj.lightmapTexture = value; } }, metadata: _metadata }, _lightmapTexture_initializers, _lightmapTexture_extraInitializers);
            __esDecorate(_a, null, _ambientColor_decorators, { kind: "accessor", name: "ambientColor", static: false, private: false, access: { has: obj => "ambientColor" in obj, get: obj => obj.ambientColor, set: (obj, value) => { obj.ambientColor = value; } }, metadata: _metadata }, _ambientColor_initializers, _ambientColor_extraInitializers);
            __esDecorate(_a, null, _albedoColor_decorators, { kind: "accessor", name: "albedoColor", static: false, private: false, access: { has: obj => "albedoColor" in obj, get: obj => obj.albedoColor, set: (obj, value) => { obj.albedoColor = value; } }, metadata: _metadata }, _albedoColor_initializers, _albedoColor_extraInitializers);
            __esDecorate(_a, null, _baseWeight_decorators, { kind: "accessor", name: "baseWeight", static: false, private: false, access: { has: obj => "baseWeight" in obj, get: obj => obj.baseWeight, set: (obj, value) => { obj.baseWeight = value; } }, metadata: _metadata }, _baseWeight_initializers, _baseWeight_extraInitializers);
            __esDecorate(_a, null, _baseDiffuseRoughness_decorators, { kind: "accessor", name: "baseDiffuseRoughness", static: false, private: false, access: { has: obj => "baseDiffuseRoughness" in obj, get: obj => obj.baseDiffuseRoughness, set: (obj, value) => { obj.baseDiffuseRoughness = value; } }, metadata: _metadata }, _baseDiffuseRoughness_initializers, _baseDiffuseRoughness_extraInitializers);
            __esDecorate(_a, null, _reflectivityColor_decorators, { kind: "accessor", name: "reflectivityColor", static: false, private: false, access: { has: obj => "reflectivityColor" in obj, get: obj => obj.reflectivityColor, set: (obj, value) => { obj.reflectivityColor = value; } }, metadata: _metadata }, _reflectivityColor_initializers, _reflectivityColor_extraInitializers);
            __esDecorate(_a, null, _reflectionColor_decorators, { kind: "accessor", name: "reflectionColor", static: false, private: false, access: { has: obj => "reflectionColor" in obj, get: obj => obj.reflectionColor, set: (obj, value) => { obj.reflectionColor = value; } }, metadata: _metadata }, _reflectionColor_initializers, _reflectionColor_extraInitializers);
            __esDecorate(_a, null, _emissiveColor_decorators, { kind: "accessor", name: "emissiveColor", static: false, private: false, access: { has: obj => "emissiveColor" in obj, get: obj => obj.emissiveColor, set: (obj, value) => { obj.emissiveColor = value; } }, metadata: _metadata }, _emissiveColor_initializers, _emissiveColor_extraInitializers);
            __esDecorate(_a, null, _microSurface_decorators, { kind: "accessor", name: "microSurface", static: false, private: false, access: { has: obj => "microSurface" in obj, get: obj => obj.microSurface, set: (obj, value) => { obj.microSurface = value; } }, metadata: _metadata }, _microSurface_initializers, _microSurface_extraInitializers);
            __esDecorate(_a, null, _useLightmapAsShadowmap_decorators, { kind: "accessor", name: "useLightmapAsShadowmap", static: false, private: false, access: { has: obj => "useLightmapAsShadowmap" in obj, get: obj => obj.useLightmapAsShadowmap, set: (obj, value) => { obj.useLightmapAsShadowmap = value; } }, metadata: _metadata }, _useLightmapAsShadowmap_initializers, _useLightmapAsShadowmap_extraInitializers);
            __esDecorate(_a, null, _useAlphaFromAlbedoTexture_decorators, { kind: "accessor", name: "useAlphaFromAlbedoTexture", static: false, private: false, access: { has: obj => "useAlphaFromAlbedoTexture" in obj, get: obj => obj.useAlphaFromAlbedoTexture, set: (obj, value) => { obj.useAlphaFromAlbedoTexture = value; } }, metadata: _metadata }, _useAlphaFromAlbedoTexture_initializers, _useAlphaFromAlbedoTexture_extraInitializers);
            __esDecorate(_a, null, _forceAlphaTest_decorators, { kind: "accessor", name: "forceAlphaTest", static: false, private: false, access: { has: obj => "forceAlphaTest" in obj, get: obj => obj.forceAlphaTest, set: (obj, value) => { obj.forceAlphaTest = value; } }, metadata: _metadata }, _forceAlphaTest_initializers, _forceAlphaTest_extraInitializers);
            __esDecorate(_a, null, _alphaCutOff_decorators, { kind: "accessor", name: "alphaCutOff", static: false, private: false, access: { has: obj => "alphaCutOff" in obj, get: obj => obj.alphaCutOff, set: (obj, value) => { obj.alphaCutOff = value; } }, metadata: _metadata }, _alphaCutOff_initializers, _alphaCutOff_extraInitializers);
            __esDecorate(_a, null, _useSpecularOverAlpha_decorators, { kind: "accessor", name: "useSpecularOverAlpha", static: false, private: false, access: { has: obj => "useSpecularOverAlpha" in obj, get: obj => obj.useSpecularOverAlpha, set: (obj, value) => { obj.useSpecularOverAlpha = value; } }, metadata: _metadata }, _useSpecularOverAlpha_initializers, _useSpecularOverAlpha_extraInitializers);
            __esDecorate(_a, null, _useMicroSurfaceFromReflectivityMapAlpha_decorators, { kind: "accessor", name: "useMicroSurfaceFromReflectivityMapAlpha", static: false, private: false, access: { has: obj => "useMicroSurfaceFromReflectivityMapAlpha" in obj, get: obj => obj.useMicroSurfaceFromReflectivityMapAlpha, set: (obj, value) => { obj.useMicroSurfaceFromReflectivityMapAlpha = value; } }, metadata: _metadata }, _useMicroSurfaceFromReflectivityMapAlpha_initializers, _useMicroSurfaceFromReflectivityMapAlpha_extraInitializers);
            __esDecorate(_a, null, _useRoughnessFromMetallicTextureAlpha_decorators, { kind: "accessor", name: "useRoughnessFromMetallicTextureAlpha", static: false, private: false, access: { has: obj => "useRoughnessFromMetallicTextureAlpha" in obj, get: obj => obj.useRoughnessFromMetallicTextureAlpha, set: (obj, value) => { obj.useRoughnessFromMetallicTextureAlpha = value; } }, metadata: _metadata }, _useRoughnessFromMetallicTextureAlpha_initializers, _useRoughnessFromMetallicTextureAlpha_extraInitializers);
            __esDecorate(_a, null, _useRoughnessFromMetallicTextureGreen_decorators, { kind: "accessor", name: "useRoughnessFromMetallicTextureGreen", static: false, private: false, access: { has: obj => "useRoughnessFromMetallicTextureGreen" in obj, get: obj => obj.useRoughnessFromMetallicTextureGreen, set: (obj, value) => { obj.useRoughnessFromMetallicTextureGreen = value; } }, metadata: _metadata }, _useRoughnessFromMetallicTextureGreen_initializers, _useRoughnessFromMetallicTextureGreen_extraInitializers);
            __esDecorate(_a, null, _useMetallnessFromMetallicTextureBlue_decorators, { kind: "accessor", name: "useMetallnessFromMetallicTextureBlue", static: false, private: false, access: { has: obj => "useMetallnessFromMetallicTextureBlue" in obj, get: obj => obj.useMetallnessFromMetallicTextureBlue, set: (obj, value) => { obj.useMetallnessFromMetallicTextureBlue = value; } }, metadata: _metadata }, _useMetallnessFromMetallicTextureBlue_initializers, _useMetallnessFromMetallicTextureBlue_extraInitializers);
            __esDecorate(_a, null, _useAmbientOcclusionFromMetallicTextureRed_decorators, { kind: "accessor", name: "useAmbientOcclusionFromMetallicTextureRed", static: false, private: false, access: { has: obj => "useAmbientOcclusionFromMetallicTextureRed" in obj, get: obj => obj.useAmbientOcclusionFromMetallicTextureRed, set: (obj, value) => { obj.useAmbientOcclusionFromMetallicTextureRed = value; } }, metadata: _metadata }, _useAmbientOcclusionFromMetallicTextureRed_initializers, _useAmbientOcclusionFromMetallicTextureRed_extraInitializers);
            __esDecorate(_a, null, _useAmbientInGrayScale_decorators, { kind: "accessor", name: "useAmbientInGrayScale", static: false, private: false, access: { has: obj => "useAmbientInGrayScale" in obj, get: obj => obj.useAmbientInGrayScale, set: (obj, value) => { obj.useAmbientInGrayScale = value; } }, metadata: _metadata }, _useAmbientInGrayScale_initializers, _useAmbientInGrayScale_extraInitializers);
            __esDecorate(_a, null, _useAutoMicroSurfaceFromReflectivityMap_decorators, { kind: "accessor", name: "useAutoMicroSurfaceFromReflectivityMap", static: false, private: false, access: { has: obj => "useAutoMicroSurfaceFromReflectivityMap" in obj, get: obj => obj.useAutoMicroSurfaceFromReflectivityMap, set: (obj, value) => { obj.useAutoMicroSurfaceFromReflectivityMap = value; } }, metadata: _metadata }, _useAutoMicroSurfaceFromReflectivityMap_initializers, _useAutoMicroSurfaceFromReflectivityMap_extraInitializers);
            __esDecorate(_a, null, _get_usePhysicalLightFalloff_decorators, { kind: "getter", name: "usePhysicalLightFalloff", static: false, private: false, access: { has: obj => "usePhysicalLightFalloff" in obj, get: obj => obj.usePhysicalLightFalloff }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_useGLTFLightFalloff_decorators, { kind: "getter", name: "useGLTFLightFalloff", static: false, private: false, access: { has: obj => "useGLTFLightFalloff" in obj, get: obj => obj.useGLTFLightFalloff }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _useRadianceOverAlpha_decorators, { kind: "accessor", name: "useRadianceOverAlpha", static: false, private: false, access: { has: obj => "useRadianceOverAlpha" in obj, get: obj => obj.useRadianceOverAlpha, set: (obj, value) => { obj.useRadianceOverAlpha = value; } }, metadata: _metadata }, _useRadianceOverAlpha_initializers, _useRadianceOverAlpha_extraInitializers);
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
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        /**
         * PBRMaterialTransparencyMode: No transparency mode, Alpha channel is not use.
         */
        _a.PBRMATERIAL_OPAQUE = PBRBaseMaterial.PBRMATERIAL_OPAQUE,
        /**
         * PBRMaterialTransparencyMode: Alpha Test mode, pixel are discarded below a certain threshold defined by the alpha cutoff value.
         */
        _a.PBRMATERIAL_ALPHATEST = PBRBaseMaterial.PBRMATERIAL_ALPHATEST,
        /**
         * PBRMaterialTransparencyMode: Pixels are blended (according to the alpha mode) with the already drawn pixels in the current frame buffer.
         */
        _a.PBRMATERIAL_ALPHABLEND = PBRBaseMaterial.PBRMATERIAL_ALPHABLEND,
        /**
         * PBRMaterialTransparencyMode: Pixels are blended (according to the alpha mode) with the already drawn pixels in the current frame buffer.
         * They are also discarded below the alpha cutoff threshold to improve performances.
         */
        _a.PBRMATERIAL_ALPHATESTANDBLEND = PBRBaseMaterial.PBRMATERIAL_ALPHATESTANDBLEND,
        /**
         * Defines the default value of how much AO map is occluding the analytical lights
         * (point spot...).
         */
        _a.DEFAULT_AO_ON_ANALYTICAL_LIGHTS = PBRBaseMaterial.DEFAULT_AO_ON_ANALYTICAL_LIGHTS,
        _a;
})();
export { PBRMaterial };
let _Registered = false;
/**
 * Register side effects for pbrMaterial.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterPbrMaterial() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    // PBRMaterial serializes its image processing configuration, so the parser must be registered for clone/parse to work.
    RegisterImageProcessingConfiguration();
    RegisterClass("BABYLON.PBRMaterial", PBRMaterial);
}
/**
 * Register side effects for PBRMaterial.
 * Safe to call multiple times; only the first call has an effect.
 * Alias for {@link RegisterPbrMaterial}.
 */
export function RegisterPBRMaterial() {
    RegisterPbrMaterial();
}
//# sourceMappingURL=pbrMaterial.pure.js.map