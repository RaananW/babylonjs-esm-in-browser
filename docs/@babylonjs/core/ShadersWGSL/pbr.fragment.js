// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { prePassDeclarationWGSL } from "./ShadersInclude/prePassDeclaration.js";
import { oitDeclarationWGSL } from "./ShadersInclude/oitDeclaration.js";
import { sceneUboDeclarationWGSL } from "./ShadersInclude/sceneUboDeclaration.js";
import { meshUboDeclarationWGSL } from "./ShadersInclude/meshUboDeclaration.js";
import { pbrUboDeclarationWGSL } from "./ShadersInclude/pbrUboDeclaration.js";
import { mainUVVaryingDeclarationWGSL } from "./ShadersInclude/mainUVVaryingDeclaration.js";
import { pbrFragmentExtraDeclarationWGSL } from "./ShadersInclude/pbrFragmentExtraDeclaration.js";
import { lightUboDeclarationWGSL } from "./ShadersInclude/lightUboDeclaration.js";
import { samplerFragmentDeclarationWGSL } from "./ShadersInclude/samplerFragmentDeclaration.js";
import { samplerFragmentAlternateDeclarationWGSL } from "./ShadersInclude/samplerFragmentAlternateDeclaration.js";
import { pbrFragmentReflectionDeclarationWGSL } from "./ShadersInclude/pbrFragmentReflectionDeclaration.js";
import { pbrFragmentSamplersDeclarationWGSL } from "./ShadersInclude/pbrFragmentSamplersDeclaration.js";
import { imageProcessingDeclarationWGSL } from "./ShadersInclude/imageProcessingDeclaration.js";
import { clipPlaneFragmentDeclarationWGSL } from "./ShadersInclude/clipPlaneFragmentDeclaration.js";
import { logDepthDeclarationWGSL } from "./ShadersInclude/logDepthDeclaration.js";
import { fogFragmentDeclarationWGSL } from "./ShadersInclude/fogFragmentDeclaration.js";
import { textureRepetitionFunctionsWGSL } from "./ShadersInclude/textureRepetitionFunctions.js";
import { helperFunctionsWGSL } from "./ShadersInclude/helperFunctions.js";
import { subSurfaceScatteringFunctionsWGSL } from "./ShadersInclude/subSurfaceScatteringFunctions.js";
import { importanceSamplingWGSL } from "./ShadersInclude/importanceSampling.js";
import { pbrHelperFunctionsWGSL } from "./ShadersInclude/pbrHelperFunctions.js";
import { imageProcessingFunctionsWGSL } from "./ShadersInclude/imageProcessingFunctions.js";
import { shadowsFragmentFunctionsWGSL } from "./ShadersInclude/shadowsFragmentFunctions.js";
import { harmonicsFunctionsWGSL } from "./ShadersInclude/harmonicsFunctions.js";
import { ltcHelperFunctionsWGSL } from "./ShadersInclude/ltcHelperFunctions.js";
import { pbrDirectLightingSetupFunctionsWGSL } from "./ShadersInclude/pbrDirectLightingSetupFunctions.js";
import { pbrDirectLightingFalloffFunctionsWGSL } from "./ShadersInclude/pbrDirectLightingFalloffFunctions.js";
import { pbrBRDFFunctionsWGSL } from "./ShadersInclude/pbrBRDFFunctions.js";
import { hdrFilteringFunctionsWGSL } from "./ShadersInclude/hdrFilteringFunctions.js";
import { clusteredLightingFunctionsWGSL } from "./ShadersInclude/clusteredLightingFunctions.js";
import { pbrBlockReflectance0WGSL } from "./ShadersInclude/pbrBlockReflectance0.js";
import { pbrClusteredLightingFunctionsWGSL } from "./ShadersInclude/pbrClusteredLightingFunctions.js";
import { pbrDirectLightingFunctionsWGSL } from "./ShadersInclude/pbrDirectLightingFunctions.js";
import { pbrIBLFunctionsWGSL } from "./ShadersInclude/pbrIBLFunctions.js";
import { bumpFragmentMainFunctionsWGSL } from "./ShadersInclude/bumpFragmentMainFunctions.js";
import { bumpFragmentFunctionsWGSL } from "./ShadersInclude/bumpFragmentFunctions.js";
import { reflectionFunctionWGSL } from "./ShadersInclude/reflectionFunction.js";
import { decalFragmentWGSL } from "./ShadersInclude/decalFragment.js";
import { pbrBlockAlbedoOpacityWGSL } from "./ShadersInclude/pbrBlockAlbedoOpacity.js";
import { pbrBlockReflectivityWGSL } from "./ShadersInclude/pbrBlockReflectivity.js";
import { pbrBlockAmbientOcclusionWGSL } from "./ShadersInclude/pbrBlockAmbientOcclusion.js";
import { pbrBlockAlphaFresnelWGSL } from "./ShadersInclude/pbrBlockAlphaFresnel.js";
import { pbrBlockAnisotropicWGSL } from "./ShadersInclude/pbrBlockAnisotropic.js";
import { pbrBlockReflectionWGSL } from "./ShadersInclude/pbrBlockReflection.js";
import { pbrBlockSheenWGSL } from "./ShadersInclude/pbrBlockSheen.js";
import { pbrBlockClearcoatWGSL } from "./ShadersInclude/pbrBlockClearcoat.js";
import { pbrBlockIridescenceWGSL } from "./ShadersInclude/pbrBlockIridescence.js";
import { pbrBlockSubSurfaceWGSL } from "./ShadersInclude/pbrBlockSubSurface.js";
import { clipPlaneFragmentWGSL } from "./ShadersInclude/clipPlaneFragment.js";
import { pbrBlockNormalGeometricWGSL } from "./ShadersInclude/pbrBlockNormalGeometric.js";
import { bumpFragmentWGSL } from "./ShadersInclude/bumpFragment.js";
import { pbrBlockNormalFinalWGSL } from "./ShadersInclude/pbrBlockNormalFinal.js";
import { depthPrePassWGSL } from "./ShadersInclude/depthPrePass.js";
import { pbrBlockLightmapInitWGSL } from "./ShadersInclude/pbrBlockLightmapInit.js";
import { pbrBlockGeometryInfoWGSL } from "./ShadersInclude/pbrBlockGeometryInfo.js";
import { pbrBlockReflectanceWGSL } from "./ShadersInclude/pbrBlockReflectance.js";
import { pbrBlockDirectLightingWGSL } from "./ShadersInclude/pbrBlockDirectLighting.js";
import { lightFragmentWGSL } from "./ShadersInclude/lightFragment.js";
import { pbrBlockFinalLitComponentsWGSL } from "./ShadersInclude/pbrBlockFinalLitComponents.js";
import { pbrBlockFinalUnlitComponentsWGSL } from "./ShadersInclude/pbrBlockFinalUnlitComponents.js";
import { pbrBlockFinalColorCompositionWGSL } from "./ShadersInclude/pbrBlockFinalColorComposition.js";
import { logDepthFragmentWGSL } from "./ShadersInclude/logDepthFragment.js";
import { fogFragmentWGSL } from "./ShadersInclude/fogFragment.js";
import { pbrBlockImageProcessingWGSL } from "./ShadersInclude/pbrBlockImageProcessing.js";
import { pbrBlockPrePassWGSL } from "./ShadersInclude/pbrBlockPrePass.js";
import { oitFragmentWGSL } from "./ShadersInclude/oitFragment.js";
import { pbrDebugWGSL } from "./ShadersInclude/pbrDebug.js";
const name = "pbrPixelShader";
const shader = `#define PBR_FRAGMENT_SHADER
#define CUSTOM_FRAGMENT_BEGIN
#include<prePassDeclaration>[SCENE_MRT_COUNT]
#include<oitDeclaration>
#ifndef FROMLINEARSPACE
#define FROMLINEARSPACE
#endif
#include<pbrUboDeclaration>
#include<pbrFragmentExtraDeclaration>
#include<lightUboDeclaration>[0..maxSimultaneousLights]
#include<pbrFragmentSamplersDeclaration>
#include<imageProcessingDeclaration>
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
#include<textureRepetitionFunctions>
#include<helperFunctions>
#include<subSurfaceScatteringFunctions>
#include<importanceSampling>
#include<pbrHelperFunctions>
#include<imageProcessingFunctions>
#include<shadowsFragmentFunctions>
#include<harmonicsFunctions>
#include<pbrDirectLightingSetupFunctions>
#include<pbrDirectLightingFalloffFunctions>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
#include<pbrDirectLightingFunctions>
#include<pbrIBLFunctions>
#include<bumpFragmentMainFunctions>
#include<bumpFragmentFunctions>
#ifdef REFLECTION
#include<reflectionFunction>
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
#include<pbrBlockAlbedoOpacity>
#include<pbrBlockReflectivity>
#include<pbrBlockAmbientOcclusion>
#include<pbrBlockAlphaFresnel>
#include<pbrBlockAnisotropic>
#include<pbrBlockReflection>
#include<pbrBlockSheen>
#include<pbrBlockClearcoat>
#include<pbrBlockIridescence>
#include<pbrBlockSubSurface>
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#include<pbrBlockNormalGeometric>
#include<bumpFragment>
#include<pbrBlockNormalFinal>
var albedoOpacityOut: albedoOpacityOutParams;
#ifdef ALBEDO
var albedoTexture: vec4f=TEXRD(albedoSampler,albedoSamplerSampler,fragmentInputs.vAlbedoUV+uvOffset);
#endif
#ifdef BASE_WEIGHT
var baseWeightTexture: vec4f=TEXRD(baseWeightSampler,baseWeightSamplerSampler,fragmentInputs.vBaseWeightUV+uvOffset);
#endif
#ifdef OPACITY
var opacityMap: vec4f=TEXRD(opacitySampler,opacitySamplerSampler,fragmentInputs.vOpacityUV+uvOffset);
#endif
#ifdef DECAL
var decalColor: vec4f=textureSample(decalSampler,decalSamplerSampler,fragmentInputs.vDecalUV+uvOffset);
#endif
albedoOpacityOut=albedoOpacityBlock(
uniforms.vAlbedoColor
#ifdef ALBEDO
,albedoTexture
,uniforms.vAlbedoInfos
#endif
,uniforms.baseWeight
#ifdef BASE_WEIGHT
,baseWeightTexture
,uniforms.vBaseWeightInfos
#endif
#ifdef OPACITY
,opacityMap
,uniforms.vOpacityInfos
#endif
#ifdef DETAIL
,detailColor
,uniforms.vDetailInfos
#endif
#ifdef DECAL
,decalColor
,uniforms.vDecalInfos
#endif
);var surfaceAlbedo: vec3f=albedoOpacityOut.surfaceAlbedo;var alpha: f32=albedoOpacityOut.alpha;
#define CUSTOM_FRAGMENT_UPDATE_ALPHA
#define DEPTHPREPASS_SKIP_EARLY_RETURN
#include<depthPrePass>
#ifndef DEPTHPREPASS
#define CUSTOM_FRAGMENT_BEFORE_LIGHTS
var aoOut: ambientOcclusionOutParams;
#ifdef AMBIENT
var ambientOcclusionColorMap: vec3f=TEXRD(ambientSampler,ambientSamplerSampler,fragmentInputs.vAmbientUV+uvOffset).rgb;
#endif
aoOut=ambientOcclusionBlock(
#ifdef AMBIENT
ambientOcclusionColorMap,
uniforms.vAmbientInfos
#endif
);
#include<pbrBlockLightmapInit>
#ifdef UNLIT
var diffuseBase: vec3f= vec3f(1.,1.,1.);
#else
var baseColor: vec3f=surfaceAlbedo;var reflectivityOut: reflectivityOutParams;
#if defined(REFLECTIVITY)
var surfaceMetallicOrReflectivityColorMap: vec4f=TEXRD(reflectivitySampler,reflectivitySamplerSampler,fragmentInputs.vReflectivityUV+uvOffset);var baseReflectivity: vec4f=surfaceMetallicOrReflectivityColorMap;
#ifndef METALLICWORKFLOW
#ifdef REFLECTIVITY_GAMMA
surfaceMetallicOrReflectivityColorMap=toLinearSpaceVec4(surfaceMetallicOrReflectivityColorMap);
#endif
surfaceMetallicOrReflectivityColorMap=vec4f(surfaceMetallicOrReflectivityColorMap.rgb*uniforms.vReflectivityInfos.y,surfaceMetallicOrReflectivityColorMap.a);
#endif
#endif
#if defined(MICROSURFACEMAP)
var microSurfaceTexel: vec4f=TEXRD(microSurfaceSampler,microSurfaceSamplerSampler,fragmentInputs.vMicroSurfaceSamplerUV+uvOffset)*uniforms.vMicroSurfaceSamplerInfos.y;
#endif
#ifdef BASE_DIFFUSE_ROUGHNESS
var baseDiffuseRoughnessTexture: f32=TEXRD(baseDiffuseRoughnessSampler,baseDiffuseRoughnessSamplerSampler,fragmentInputs.vBaseDiffuseRoughnessUV+uvOffset).x;
#endif
#ifdef METALLICWORKFLOW
var metallicReflectanceFactors: vec4f=uniforms.vMetallicReflectanceFactors;
#ifdef REFLECTANCE
var reflectanceFactorsMap: vec4f=TEXRD(reflectanceSampler,reflectanceSamplerSampler,fragmentInputs.vReflectanceUV+uvOffset);
#ifdef REFLECTANCE_GAMMA
reflectanceFactorsMap=toLinearSpaceVec4(reflectanceFactorsMap);
#endif
metallicReflectanceFactors=vec4f(metallicReflectanceFactors.rgb*reflectanceFactorsMap.rgb,metallicReflectanceFactors.a);
#endif
#ifdef METALLIC_REFLECTANCE
var metallicReflectanceFactorsMap: vec4f=TEXRD(metallicReflectanceSampler,metallicReflectanceSamplerSampler,fragmentInputs.vMetallicReflectanceUV+uvOffset);
#ifdef METALLIC_REFLECTANCE_GAMMA
metallicReflectanceFactorsMap=toLinearSpaceVec4(metallicReflectanceFactorsMap);
#endif
#ifndef METALLIC_REFLECTANCE_USE_ALPHA_ONLY
metallicReflectanceFactors=vec4f(metallicReflectanceFactors.rgb*metallicReflectanceFactorsMap.rgb,metallicReflectanceFactors.a);
#endif
metallicReflectanceFactors.a*=metallicReflectanceFactorsMap.a;
#endif
#endif
reflectivityOut=reflectivityBlock(
uniforms.vReflectivityColor
#ifdef METALLICWORKFLOW
,surfaceAlbedo
,metallicReflectanceFactors
#endif
,uniforms.baseDiffuseRoughness
#ifdef BASE_DIFFUSE_ROUGHNESS
,baseDiffuseRoughnessTexture
,uniforms.vBaseDiffuseRoughnessInfos
#endif
#ifdef REFLECTIVITY
,uniforms.vReflectivityInfos
,surfaceMetallicOrReflectivityColorMap
#endif
#if defined(METALLICWORKFLOW) && defined(REFLECTIVITY) && defined(AOSTOREINMETALMAPRED)
,aoOut.ambientOcclusionColor
#endif
#ifdef MICROSURFACEMAP
,microSurfaceTexel
#endif
#ifdef DETAIL
,detailColor
,uniforms.vDetailInfos
#endif
);var microSurface: f32=reflectivityOut.microSurface;var roughness: f32=reflectivityOut.roughness;var diffuseRoughness: f32=reflectivityOut.diffuseRoughness;
#ifdef METALLICWORKFLOW
surfaceAlbedo=reflectivityOut.surfaceAlbedo;
#endif
#if defined(METALLICWORKFLOW) && defined(REFLECTIVITY) && defined(AOSTOREINMETALMAPRED)
aoOut.ambientOcclusionColor=reflectivityOut.ambientOcclusionColor;
#endif
#ifdef ALPHAFRESNEL
#if defined(ALPHATEST) || defined(ALPHABLEND)
var alphaFresnelOut: alphaFresnelOutParams;alphaFresnelOut=alphaFresnelBlock(
normalW,
viewDirectionW,
alpha,
microSurface
);alpha=alphaFresnelOut.alpha;
#endif
#endif
#include<pbrBlockGeometryInfo>
#ifdef ANISOTROPIC
var anisotropicOut: anisotropicOutParams;
#ifdef ANISOTROPIC_TEXTURE
var anisotropyMapData: vec3f=TEXRD(anisotropySampler,anisotropySamplerSampler,fragmentInputs.vAnisotropyUV+uvOffset).rgb*uniforms.vAnisotropyInfos.y;
#endif
anisotropicOut=anisotropicBlock(
uniforms.vAnisotropy,
roughness,
#ifdef ANISOTROPIC_TEXTURE
anisotropyMapData,
#endif
TBN,
normalW,
viewDirectionW
);
#endif
#ifdef REFLECTION
var reflectionOut: reflectionOutParams;
#ifndef USE_CUSTOM_REFLECTION
reflectionOut=reflectionBlock(
fragmentInputs.vPositionW
,normalW
,alphaG
,uniforms.vReflectionMicrosurfaceInfos
,uniforms.vReflectionInfos
,uniforms.vReflectionColor
#ifdef ANISOTROPIC
,anisotropicOut
#endif
#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)
,NdotVUnclamped
#endif
#ifdef LINEARSPECULARREFLECTION
,roughness
#endif
,reflectionSampler
,reflectionSamplerSampler
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
,fragmentInputs.vEnvironmentIrradiance
#endif
#if (defined(USESPHERICALFROMREFLECTIONMAP) && (!defined(NORMAL) || !defined(USESPHERICALINVERTEX))) || (defined(USEIRRADIANCEMAP) && defined(REFLECTIONMAP_3D))
,uniforms.reflectionMatrix
#endif
#ifdef USEIRRADIANCEMAP
,irradianceSampler
,irradianceSamplerSampler
#ifdef USE_IRRADIANCE_DOMINANT_DIRECTION
,uniforms.vReflectionDominantDirection
#endif
#endif
#ifndef LODBASEDMICROSFURACE
,reflectionLowSampler
,reflectionLowSamplerSampler
,reflectionHighSampler
,reflectionHighSamplerSampler
#endif
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#ifdef IBL_CDF_FILTERING
,icdfSampler
,icdfSamplerSampler
#endif
#endif
,viewDirectionW
,diffuseRoughness
,surfaceAlbedo
);
#else
#define CUSTOM_REFLECTION
#endif
#endif
#include<pbrBlockReflectance0>
#ifdef SHEEN
var sheenOut: sheenOutParams;
#ifdef SHEEN_TEXTURE
var sheenMapData: vec4f=TEXRD(sheenSampler,sheenSamplerSampler,fragmentInputs.vSheenUV+uvOffset);
#endif
#if defined(SHEEN_ROUGHNESS) && defined(SHEEN_TEXTURE_ROUGHNESS) && !defined(SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE)
var sheenMapRoughnessData: vec4f=TEXRD(sheenRoughnessSampler,sheenRoughnessSamplerSampler,fragmentInputs.vSheenRoughnessUV+uvOffset)*uniforms.vSheenInfos.w;
#endif
sheenOut=sheenBlock(
uniforms.vSheenColor
#ifdef SHEEN_ROUGHNESS
,uniforms.vSheenRoughness
#if defined(SHEEN_TEXTURE_ROUGHNESS) && !defined(SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE)
,sheenMapRoughnessData
#endif
#endif
,roughness
#ifdef SHEEN_TEXTURE
,sheenMapData
,uniforms.vSheenInfos.y
#endif
,reflectanceF0
#ifdef SHEEN_LINKWITHALBEDO
,baseColor
,surfaceAlbedo
#endif
#ifdef ENVIRONMENTBRDF
,NdotV
,environmentBrdf
#endif
#if defined(REFLECTION) && defined(ENVIRONMENTBRDF)
,AARoughnessFactors
,uniforms.vReflectionMicrosurfaceInfos
,uniforms.vReflectionInfos
,uniforms.vReflectionColor
,uniforms.vLightingIntensity
,reflectionSampler
,reflectionSamplerSampler
,reflectionOut.reflectionCoords
,NdotVUnclamped
#ifndef LODBASEDMICROSFURACE
,reflectionLowSampler
,reflectionLowSamplerSampler
,reflectionHighSampler
,reflectionHighSamplerSampler
#endif
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
#if !defined(REFLECTIONMAP_SKYBOX) && defined(RADIANCEOCCLUSION)
,seo
#endif
#if !defined(REFLECTIONMAP_SKYBOX) && defined(HORIZONOCCLUSION) && defined(BUMP) && defined(REFLECTIONMAP_3D)
,eho
#endif
#endif
);
#ifdef SHEEN_LINKWITHALBEDO
surfaceAlbedo=sheenOut.surfaceAlbedo;
#endif
#endif
#ifdef CLEARCOAT
#ifdef CLEARCOAT_TEXTURE
var clearCoatMapData: vec2f=TEXRD(clearCoatSampler,clearCoatSamplerSampler,fragmentInputs.vClearCoatUV+uvOffset).rg*uniforms.vClearCoatInfos.y;
#endif
#endif
#ifdef IRIDESCENCE
var iridescenceOut: iridescenceOutParams;
#ifdef IRIDESCENCE_TEXTURE
var iridescenceMapData: vec2f=TEXRD(iridescenceSampler,iridescenceSamplerSampler,fragmentInputs.vIridescenceUV+uvOffset).rg*uniforms.vIridescenceInfos.y;
#endif
#ifdef IRIDESCENCE_THICKNESS_TEXTURE
var iridescenceThicknessMapData: vec2f=TEXRD(iridescenceThicknessSampler,iridescenceThicknessSamplerSampler,fragmentInputs.vIridescenceThicknessUV+uvOffset).rg*uniforms.vIridescenceInfos.w;
#endif
iridescenceOut=iridescenceBlock(
uniforms.vIridescenceParams
,NdotV
,specularEnvironmentR0
#ifdef IRIDESCENCE_TEXTURE
,iridescenceMapData
#endif
#ifdef IRIDESCENCE_THICKNESS_TEXTURE
,iridescenceThicknessMapData
#endif
#ifdef CLEARCOAT
,NdotVUnclamped
,uniforms.vClearCoatParams
#ifdef CLEARCOAT_TEXTURE
,clearCoatMapData
#endif
#endif
);var iridescenceIntensity: f32=iridescenceOut.iridescenceIntensity;specularEnvironmentR0=iridescenceOut.specularEnvironmentR0;
#endif
var clearcoatOut: clearcoatOutParams;
#ifdef CLEARCOAT
#if defined(CLEARCOAT_TEXTURE_ROUGHNESS) && !defined(CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE)
var clearCoatMapRoughnessData: vec4f=TEXRD(clearCoatRoughnessSampler,clearCoatRoughnessSamplerSampler,fragmentInputs.vClearCoatRoughnessUV+uvOffset)*uniforms.vClearCoatInfos.w;
#endif
#if defined(CLEARCOAT_TINT) && defined(CLEARCOAT_TINT_TEXTURE)
var clearCoatTintMapData: vec4f=TEXRD(clearCoatTintSampler,clearCoatTintSamplerSampler,fragmentInputs.vClearCoatTintUV+uvOffset);
#endif
#ifdef CLEARCOAT_BUMP
var clearCoatBumpMapData: vec4f=TEXRD(clearCoatBumpSampler,clearCoatBumpSamplerSampler,fragmentInputs.vClearCoatBumpUV+uvOffset);
#endif
clearcoatOut=clearcoatBlock(
fragmentInputs.vPositionW
,geometricNormalW
,viewDirectionW
,uniforms.vClearCoatParams
#if defined(CLEARCOAT_TEXTURE_ROUGHNESS) && !defined(CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE)
,clearCoatMapRoughnessData
#endif
,specularEnvironmentR0
#ifdef CLEARCOAT_TEXTURE
,clearCoatMapData
#endif
#ifdef CLEARCOAT_TINT
,uniforms.vClearCoatTintParams
,uniforms.clearCoatColorAtDistance
,uniforms.vClearCoatRefractionParams
#ifdef CLEARCOAT_TINT_TEXTURE
,clearCoatTintMapData
#endif
#endif
#ifdef CLEARCOAT_BUMP
,uniforms.vClearCoatBumpInfos
,clearCoatBumpMapData
,fragmentInputs.vClearCoatBumpUV
#if defined(TANGENT) && defined(NORMAL)
,mat3x3<f32>(input.vTBN0,input.vTBN1,input.vTBN2)
#else
,uniforms.vClearCoatTangentSpaceParams
#endif
#ifdef OBJECTSPACE_NORMALMAP
,uniforms.normalMatrix
#endif
#endif
#if defined(FORCENORMALFORWARD) && defined(NORMAL)
,faceNormal
#endif
#ifdef REFLECTION
,uniforms.vReflectionMicrosurfaceInfos
,uniforms.vReflectionInfos
,uniforms.vReflectionColor
,uniforms.vLightingIntensity
,reflectionSampler
,reflectionSamplerSampler
#ifndef LODBASEDMICROSFURACE
,reflectionLowSampler
,reflectionLowSamplerSampler
,reflectionHighSampler
,reflectionHighSamplerSampler
#endif
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
#endif
#if defined(CLEARCOAT_BUMP) || defined(TWOSIDEDLIGHTING)
,select(-1.,1.,fragmentInputs.frontFacing)
#endif
);
#else
clearcoatOut.specularEnvironmentR0=specularEnvironmentR0;
#endif
#include<pbrBlockReflectance>
var subSurfaceOut: subSurfaceOutParams;
#ifdef SUBSURFACE
#ifdef SS_THICKNESSANDMASK_TEXTURE
var thicknessMap: vec4f=TEXRD(thicknessSampler,thicknessSamplerSampler,fragmentInputs.vThicknessUV+uvOffset);
#endif
#ifdef SS_REFRACTIONINTENSITY_TEXTURE
var refractionIntensityMap: vec4f=TEXRD(refractionIntensitySampler,refractionIntensitySamplerSampler,fragmentInputs.vRefractionIntensityUV+uvOffset);
#endif
#ifdef SS_TRANSLUCENCYINTENSITY_TEXTURE
var translucencyIntensityMap: vec4f=TEXRD(translucencyIntensitySampler,translucencyIntensitySamplerSampler,fragmentInputs.vTranslucencyIntensityUV+uvOffset);
#endif
#ifdef SS_TRANSLUCENCYCOLOR_TEXTURE
var translucencyColorMap: vec4f=TEXRD(translucencyColorSampler,translucencyColorSamplerSampler,fragmentInputs.vTranslucencyColorUV+uvOffset);
#ifdef SS_TRANSLUCENCYCOLOR_TEXTURE_GAMMA
translucencyColorMap=toLinearSpaceVec4(translucencyColorMap);
#endif
#endif
subSurfaceOut=subSurfaceBlock(
uniforms.vSubSurfaceIntensity
,uniforms.vThicknessParam
,uniforms.vTintColor
,normalW
#ifdef LEGACY_SPECULAR_ENERGY_CONSERVATION
,vec3f(max(colorSpecularEnvironmentReflectance.r,max(colorSpecularEnvironmentReflectance.g,colorSpecularEnvironmentReflectance.b)))
#else
,baseSpecularEnvironmentReflectance
#endif
#ifdef SS_THICKNESSANDMASK_TEXTURE
,thicknessMap
#endif
#ifdef SS_REFRACTIONINTENSITY_TEXTURE
,refractionIntensityMap
#endif
#ifdef SS_TRANSLUCENCYINTENSITY_TEXTURE
,translucencyIntensityMap
#endif
#ifdef REFLECTION
#ifdef SS_TRANSLUCENCY
,uniforms.reflectionMatrix
#ifdef USESPHERICALFROMREFLECTIONMAP
#if !defined(NORMAL) || !defined(USESPHERICALINVERTEX)
,reflectionOut.irradianceVector
#endif
#if defined(REALTIME_FILTERING)
,reflectionSampler
,reflectionSamplerSampler
,uniforms.vReflectionFilteringInfo
#ifdef IBL_CDF_FILTERING
,icdfSampler
,icdfSamplerSampler
#endif
#endif
#endif
#ifdef USEIRRADIANCEMAP
,irradianceSampler
,irradianceSamplerSampler
#endif
#endif
#endif
#if defined(SS_REFRACTION) || defined(SS_TRANSLUCENCY)
,surfaceAlbedo
#endif
#ifdef SS_REFRACTION
,fragmentInputs.vPositionW
,viewDirectionW
,scene.view
,uniforms.vRefractionInfos
,uniforms.refractionMatrix
,uniforms.vRefractionMicrosurfaceInfos
,uniforms.vLightingIntensity
#ifdef SS_LINKREFRACTIONTOTRANSPARENCY
,alpha
#endif
#ifdef SS_LODINREFRACTIONALPHA
,NdotVUnclamped
#endif
#ifdef SS_LINEARSPECULARREFRACTION
,roughness
#endif
,alphaG
,refractionSampler
,refractionSamplerSampler
#ifndef LODBASEDMICROSFURACE
,refractionLowSampler
,refractionLowSamplerSampler
,refractionHighSampler
,refractionHighSamplerSampler
#endif
#ifdef ANISOTROPIC
,anisotropicOut
#endif
#ifdef REALTIME_FILTERING
,uniforms.vRefractionFilteringInfo
#endif
#ifdef SS_USE_LOCAL_REFRACTIONMAP_CUBIC
,uniforms.vRefractionPosition
,uniforms.vRefractionSize
#endif
#ifdef SS_DISPERSION
,uniforms.dispersion
#endif
#endif
#ifdef SS_TRANSLUCENCY
,uniforms.vDiffusionDistance
,uniforms.vTranslucencyColor
#ifdef SS_TRANSLUCENCYCOLOR_TEXTURE
,translucencyColorMap
#endif
#endif
);
#ifdef SS_REFRACTION
surfaceAlbedo=subSurfaceOut.surfaceAlbedo;
#ifdef SS_LINKREFRACTIONTOTRANSPARENCY
alpha=subSurfaceOut.alpha;
#endif
#endif
#else
subSurfaceOut.specularEnvironmentReflectance=colorSpecularEnvironmentReflectance;
#endif
#include<pbrBlockDirectLighting>
#include<lightFragment>[0..maxSimultaneousLights]
#include<pbrBlockFinalLitComponents>
#endif 
#include<pbrBlockFinalUnlitComponents>
#define CUSTOM_FRAGMENT_BEFORE_FINALCOLORCOMPOSITION
#include<pbrBlockFinalColorComposition>
#include<logDepthFragment>
#include<fogFragment>(color,finalColor)
#include<pbrBlockImageProcessing>
#define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR
#ifdef PREPASS
#include<pbrBlockPrePass>
#endif
#if !defined(PREPASS) && !defined(ORDER_INDEPENDENT_TRANSPARENCY)
fragmentOutputs.color=finalColor;
#endif
#include<oitFragment>
#if ORDER_INDEPENDENT_TRANSPARENCY
if (fragDepth==nearestDepth) {fragmentOutputs.frontColor=vec4f(fragmentOutputs.frontColor.rgb+finalColor.rgb*finalColor.a*alphaMultiplier,1.0-alphaMultiplier*(1.0-finalColor.a));} else {fragmentOutputs.backColor+=finalColor;}
#endif
#include<pbrDebug>
#define CUSTOM_FRAGMENT_MAIN_END
#endif
}
`;
// Sideeffect
if (!ShaderStore.ShadersStoreWGSL[name]) {
    ShaderStore.ShadersStoreWGSL[name] = shader;
}
const includes = [prePassDeclarationWGSL, oitDeclarationWGSL, sceneUboDeclarationWGSL, meshUboDeclarationWGSL, pbrUboDeclarationWGSL, mainUVVaryingDeclarationWGSL, pbrFragmentExtraDeclarationWGSL, lightUboDeclarationWGSL, samplerFragmentDeclarationWGSL, samplerFragmentAlternateDeclarationWGSL, pbrFragmentReflectionDeclarationWGSL, pbrFragmentSamplersDeclarationWGSL, imageProcessingDeclarationWGSL, clipPlaneFragmentDeclarationWGSL, logDepthDeclarationWGSL, fogFragmentDeclarationWGSL, textureRepetitionFunctionsWGSL, helperFunctionsWGSL, subSurfaceScatteringFunctionsWGSL, importanceSamplingWGSL, pbrHelperFunctionsWGSL, imageProcessingFunctionsWGSL, shadowsFragmentFunctionsWGSL, harmonicsFunctionsWGSL, ltcHelperFunctionsWGSL, pbrDirectLightingSetupFunctionsWGSL, pbrDirectLightingFalloffFunctionsWGSL, pbrBRDFFunctionsWGSL, hdrFilteringFunctionsWGSL, clusteredLightingFunctionsWGSL, pbrBlockReflectance0WGSL, pbrClusteredLightingFunctionsWGSL, pbrDirectLightingFunctionsWGSL, pbrIBLFunctionsWGSL, bumpFragmentMainFunctionsWGSL, bumpFragmentFunctionsWGSL, reflectionFunctionWGSL, decalFragmentWGSL, pbrBlockAlbedoOpacityWGSL, pbrBlockReflectivityWGSL, pbrBlockAmbientOcclusionWGSL, pbrBlockAlphaFresnelWGSL, pbrBlockAnisotropicWGSL, pbrBlockReflectionWGSL, pbrBlockSheenWGSL, pbrBlockClearcoatWGSL, pbrBlockIridescenceWGSL, pbrBlockSubSurfaceWGSL, clipPlaneFragmentWGSL, pbrBlockNormalGeometricWGSL, bumpFragmentWGSL, pbrBlockNormalFinalWGSL, depthPrePassWGSL, pbrBlockLightmapInitWGSL, pbrBlockGeometryInfoWGSL, pbrBlockReflectanceWGSL, pbrBlockDirectLightingWGSL, lightFragmentWGSL, pbrBlockFinalLitComponentsWGSL, pbrBlockFinalUnlitComponentsWGSL, pbrBlockFinalColorCompositionWGSL, logDepthFragmentWGSL, fogFragmentWGSL, pbrBlockImageProcessingWGSL, pbrBlockPrePassWGSL, oitFragmentWGSL, pbrDebugWGSL];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStoreWGSL[inc.name]) {
        ShaderStore.IncludesShadersStoreWGSL[inc.name] = inc.shader;
    }
}
/** @internal */
export const pbrPixelShaderWGSL = { name, shader };
//# sourceMappingURL=pbr.fragment.js.map