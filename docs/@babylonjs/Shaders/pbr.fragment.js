// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/prePassDeclaration.js";
import "./ShadersInclude/oitDeclaration.js";
import "./ShadersInclude/pbrFragmentDeclaration.js";
import "./ShadersInclude/pbrUboDeclaration.js";
import "./ShadersInclude/pbrFragmentExtraDeclaration.js";
import "./ShadersInclude/lightFragmentDeclaration.js";
import "./ShadersInclude/lightUboDeclaration.js";
import "./ShadersInclude/pbrFragmentSamplersDeclaration.js";
import "./ShadersInclude/imageProcessingDeclaration.js";
import "./ShadersInclude/clipPlaneFragmentDeclaration.js";
import "./ShadersInclude/logDepthDeclaration.js";
import "./ShadersInclude/fogFragmentDeclaration.js";
import "./ShadersInclude/helperFunctions.js";
import "./ShadersInclude/subSurfaceScatteringFunctions.js";
import "./ShadersInclude/importanceSampling.js";
import "./ShadersInclude/pbrHelperFunctions.js";
import "./ShadersInclude/imageProcessingFunctions.js";
import "./ShadersInclude/shadowsFragmentFunctions.js";
import "./ShadersInclude/harmonicsFunctions.js";
import "./ShadersInclude/pbrDirectLightingSetupFunctions.js";
import "./ShadersInclude/pbrDirectLightingFalloffFunctions.js";
import "./ShadersInclude/pbrBRDFFunctions.js";
import "./ShadersInclude/hdrFilteringFunctions.js";
import "./ShadersInclude/pbrDirectLightingFunctions.js";
import "./ShadersInclude/pbrIBLFunctions.js";
import "./ShadersInclude/bumpFragmentMainFunctions.js";
import "./ShadersInclude/bumpFragmentFunctions.js";
import "./ShadersInclude/reflectionFunction.js";
import "./ShadersInclude/pbrBlockAlbedoOpacity.js";
import "./ShadersInclude/pbrBlockReflectivity.js";
import "./ShadersInclude/pbrBlockAmbientOcclusion.js";
import "./ShadersInclude/pbrBlockAlphaFresnel.js";
import "./ShadersInclude/pbrBlockAnisotropic.js";
import "./ShadersInclude/pbrBlockReflection.js";
import "./ShadersInclude/pbrBlockSheen.js";
import "./ShadersInclude/pbrBlockClearcoat.js";
import "./ShadersInclude/pbrBlockIridescence.js";
import "./ShadersInclude/pbrBlockSubSurface.js";
import "./ShadersInclude/clipPlaneFragment.js";
import "./ShadersInclude/pbrBlockNormalGeometric.js";
import "./ShadersInclude/bumpFragment.js";
import "./ShadersInclude/pbrBlockNormalFinal.js";
import "./ShadersInclude/depthPrePass.js";
import "./ShadersInclude/pbrBlockLightmapInit.js";
import "./ShadersInclude/pbrBlockGeometryInfo.js";
import "./ShadersInclude/pbrBlockReflectance0.js";
import "./ShadersInclude/pbrBlockReflectance.js";
import "./ShadersInclude/pbrBlockDirectLighting.js";
import "./ShadersInclude/lightFragment.js";
import "./ShadersInclude/pbrBlockFinalLitComponents.js";
import "./ShadersInclude/pbrBlockFinalUnlitComponents.js";
import "./ShadersInclude/pbrBlockFinalColorComposition.js";
import "./ShadersInclude/logDepthFragment.js";
import "./ShadersInclude/fogFragment.js";
import "./ShadersInclude/pbrBlockImageProcessing.js";
import "./ShadersInclude/oitFragment.js";
import "./ShadersInclude/pbrDebug.js";
const name = "pbrPixelShader";
const shader = `#if defined(BUMP) || !defined(NORMAL) || defined(FORCENORMALFORWARD) || defined(SPECULARAA) || defined(CLEARCOAT_BUMP) || defined(ANISOTROPIC)
#extension GL_OES_standard_derivatives : enable
#endif
#ifdef LODBASEDMICROSFURACE
#extension GL_EXT_shader_texture_lod : enable
#endif
#define CUSTOM_FRAGMENT_BEGIN
#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
#include<prePassDeclaration>[SCENE_MRT_COUNT]
precision highp float;
#ifndef FROMLINEARSPACE
#define FROMLINEARSPACE
#endif
#include<__decl__pbrFragment>
#include<pbrFragmentExtraDeclaration>
#include<__decl__lightFragment>[0..maxSimultaneousLights]
#include<pbrFragmentSamplersDeclaration>
#include<imageProcessingDeclaration>
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
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
void main(void) {
#include<clipPlaneFragment>
#include<pbrBlockNormalGeometric>
#include<bumpFragment>
#include<pbrBlockNormalFinal>
albedoOpacityOutParams albedoOpacityOut;
vec4 albedoTexture=texture2D(albedoSampler,vAlbedoUV+uvOffset);
#ifdef OPACITY
vec4 opacityMap=texture2D(opacitySampler,vOpacityUV+uvOffset);
albedoOpacityBlock(
albedoTexture,
#ifdef OPACITY
opacityMap,
#ifdef DETAIL
detailColor,
albedoOpacityOut
#include<depthPrePass>
#define CUSTOM_FRAGMENT_BEFORE_LIGHTS
ambientOcclusionOutParams aoOut;
vec3 ambientOcclusionColorMap=texture2D(ambientSampler,vAmbientUV+uvOffset).rgb;
ambientOcclusionBlock(
ambientOcclusionColorMap,
aoOut
#ifdef UNLIT
vec3 diffuseBase=vec3(1.,1.,1.);
vec3 baseColor=surfaceAlbedo;
vec4 surfaceMetallicOrReflectivityColorMap=texture2D(reflectivitySampler,vReflectivityUV+uvOffset);
#ifdef REFLECTIVITY_GAMMA
surfaceMetallicOrReflectivityColorMap=toLinearSpace(surfaceMetallicOrReflectivityColorMap);
surfaceMetallicOrReflectivityColorMap.rgb*=vReflectivityInfos.y;
#endif
#if defined(MICROSURFACEMAP)
vec4 microSurfaceTexel=texture2D(microSurfaceSampler,vMicroSurfaceSamplerUV+uvOffset)*vMicroSurfaceSamplerInfos.y;
#ifdef METALLICWORKFLOW
vec4 metallicReflectanceFactors=vMetallicReflectanceFactors;
vec4 reflectanceFactorsMap=texture2D(reflectanceSampler,vReflectanceUV+uvOffset);
reflectanceFactorsMap=toLinearSpace(reflectanceFactorsMap);
metallicReflectanceFactors.rgb*=reflectanceFactorsMap.rgb;
#ifdef METALLIC_REFLECTANCE
vec4 metallicReflectanceFactorsMap=texture2D(metallicReflectanceSampler,vMetallicReflectanceUV+uvOffset);
metallicReflectanceFactorsMap=toLinearSpace(metallicReflectanceFactorsMap);
#ifndef METALLIC_REFLECTANCE_USE_ALPHA_ONLY
metallicReflectanceFactors.rgb*=metallicReflectanceFactorsMap.rgb;
metallicReflectanceFactors*=metallicReflectanceFactorsMap.a;
#endif
reflectivityBlock(
surfaceAlbedo,
#ifdef REFLECTIVITY
vReflectivityInfos,
#if defined(METALLICWORKFLOW) && defined(REFLECTIVITY) && defined(AOSTOREINMETALMAPRED)
aoOut.ambientOcclusionColor,
#ifdef MICROSURFACEMAP
microSurfaceTexel,
#ifdef DETAIL
detailColor,
reflectivityOut
surfaceAlbedo=reflectivityOut.surfaceAlbedo;
#if defined(METALLICWORKFLOW) && defined(REFLECTIVITY) && defined(AOSTOREINMETALMAPRED)
aoOut.ambientOcclusionColor=reflectivityOut.ambientOcclusionColor;
#ifdef ALPHAFRESNEL
#if defined(ALPHATEST) || defined(ALPHABLEND)
alphaFresnelOutParams alphaFresnelOut;
#endif
#include<pbrBlockGeometryInfo>
#ifdef ANISOTROPIC
anisotropicOutParams anisotropicOut;
vec3 anisotropyMapData=texture2D(anisotropySampler,vAnisotropyUV+uvOffset).rgb*vAnisotropyInfos.y;
anisotropicBlock(
anisotropyMapData,
TBN,
#ifdef REFLECTION
reflectionOutParams reflectionOut;
reflectionBlock(
anisotropicOut,
#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)
NdotVUnclamped,
#ifdef LINEARSPECULARREFLECTION
roughness,
reflectionSampler,
vEnvironmentIrradiance,
#ifdef USESPHERICALFROMREFLECTIONMAP
#if !defined(NORMAL) || !defined(USESPHERICALINVERTEX)
reflectionMatrix,
#endif
#ifdef USEIRRADIANCEMAP
irradianceSampler,
#ifndef LODBASEDMICROSFURACE
reflectionSamplerLow,
#ifdef REALTIME_FILTERING
vReflectionFilteringInfo,
reflectionOut
#define CUSTOM_REFLECTION
#endif
#endif
#include<pbrBlockReflectance0>
#ifdef SHEEN
sheenOutParams sheenOut;
vec4 sheenMapData=texture2D(sheenSampler,vSheenUV+uvOffset);
#if defined(SHEEN_ROUGHNESS) && defined(SHEEN_TEXTURE_ROUGHNESS) && !defined(SHEEN_TEXTURE_ROUGHNESS_IDENTICAL) && !defined(SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE)
vec4 sheenMapRoughnessData=texture2D(sheenRoughnessSampler,vSheenRoughnessUV+uvOffset)*vSheenInfos.w;
sheenBlock(
vSheenRoughness,
sheenMapRoughnessData,
#endif
roughness,
sheenMapData,
reflectance,
baseColor,
#ifdef ENVIRONMENTBRDF
NdotV,
#if defined(REFLECTION) && defined(ENVIRONMENTBRDF)
AARoughnessFactors,
reflectionSamplerLow,
#ifdef REALTIME_FILTERING
vReflectionFilteringInfo,
#if !defined(REFLECTIONMAP_SKYBOX) && defined(RADIANCEOCCLUSION)
seo,
#if !defined(REFLECTIONMAP_SKYBOX) && defined(HORIZONOCCLUSION) && defined(BUMP) && defined(REFLECTIONMAP_3D)
eho,
#endif
sheenOut
surfaceAlbedo=sheenOut.surfaceAlbedo;
#endif
#ifdef CLEARCOAT
#ifdef CLEARCOAT_TEXTURE
vec2 clearCoatMapData=texture2D(clearCoatSampler,vClearCoatUV+uvOffset).rg*vClearCoatInfos.y;
#endif
#ifdef IRIDESCENCE
iridescenceOutParams iridescenceOut;
vec2 iridescenceMapData=texture2D(iridescenceSampler,vIridescenceUV+uvOffset).rg*vIridescenceInfos.y;
#ifdef IRIDESCENCE_THICKNESS_TEXTURE
vec2 iridescenceThicknessMapData=texture2D(iridescenceThicknessSampler,vIridescenceThicknessUV+uvOffset).rg*vIridescenceInfos.w;
iridescenceBlock(
iridescenceMapData,
#ifdef IRIDESCENCE_THICKNESS_TEXTURE
iridescenceThicknessMapData,
#ifdef CLEARCOAT
NdotVUnclamped,
clearCoatMapData,
#endif
iridescenceOut
clearcoatOutParams clearcoatOut;
#if defined(CLEARCOAT_TEXTURE_ROUGHNESS) && !defined(CLEARCOAT_TEXTURE_ROUGHNESS_IDENTICAL) && !defined(CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE)
vec4 clearCoatMapRoughnessData=texture2D(clearCoatRoughnessSampler,vClearCoatRoughnessUV+uvOffset)*vClearCoatInfos.w;
#if defined(CLEARCOAT_TINT) && defined(CLEARCOAT_TINT_TEXTURE)
vec4 clearCoatTintMapData=texture2D(clearCoatTintSampler,vClearCoatTintUV+uvOffset);
#ifdef CLEARCOAT_BUMP
vec4 clearCoatBumpMapData=texture2D(clearCoatBumpSampler,vClearCoatBumpUV+uvOffset);
clearcoatBlock(
clearCoatMapRoughnessData,
specularEnvironmentR0,
clearCoatMapData,
#ifdef CLEARCOAT_TINT
vClearCoatTintParams,
clearCoatTintMapData,
#endif
#ifdef CLEARCOAT_BUMP
vClearCoatBumpInfos,
vTBN,
vClearCoatTangentSpaceParams,
#ifdef OBJECTSPACE_NORMALMAP
normalMatrix,
#endif
#if defined(FORCENORMALFORWARD) && defined(NORMAL)
faceNormal,
#ifdef REFLECTION
vReflectionMicrosurfaceInfos,
reflectionSamplerLow,
#ifdef REALTIME_FILTERING
vReflectionFilteringInfo,
#endif
#if defined(ENVIRONMENTBRDF) && !defined(REFLECTIONMAP_SKYBOX)
#ifdef RADIANCEOCCLUSION
ambientMonochrome,
#endif
#if defined(CLEARCOAT_BUMP) || defined(TWOSIDEDLIGHTING)
(gl_FrontFacing ? 1. : -1.),
clearcoatOut
clearcoatOut.specularEnvironmentR0=specularEnvironmentR0;
#include<pbrBlockReflectance>
subSurfaceOutParams subSurfaceOut;
#ifdef SS_THICKNESSANDMASK_TEXTURE
vec4 thicknessMap=texture2D(thicknessSampler,vThicknessUV+uvOffset);
#ifdef SS_REFRACTIONINTENSITY_TEXTURE
vec4 refractionIntensityMap=texture2D(refractionIntensitySampler,vRefractionIntensityUV+uvOffset);
#ifdef SS_TRANSLUCENCYINTENSITY_TEXTURE
vec4 translucencyIntensityMap=texture2D(translucencyIntensitySampler,vTranslucencyIntensityUV+uvOffset);
subSurfaceBlock(
thicknessMap,
#ifdef SS_REFRACTIONINTENSITY_TEXTURE
refractionIntensityMap,
#ifdef SS_TRANSLUCENCYINTENSITY_TEXTURE
translucencyIntensityMap,
#ifdef REFLECTION
#ifdef SS_TRANSLUCENCY
reflectionMatrix,
#if !defined(NORMAL) || !defined(USESPHERICALINVERTEX)
reflectionOut.irradianceVector,
#if defined(REALTIME_FILTERING)
reflectionSampler,
#endif
#ifdef USEIRRADIANCEMAP
irradianceSampler,
#endif
#endif
#if defined(SS_REFRACTION) || defined(SS_TRANSLUCENCY)
surfaceAlbedo,
#ifdef SS_REFRACTION
vPositionW,
alpha,
#ifdef SS_LODINREFRACTIONALPHA
NdotVUnclamped,
#ifdef SS_LINEARSPECULARREFRACTION
roughness,
alphaG,
refractionSamplerLow,
#ifdef ANISOTROPIC
anisotropicOut,
#ifdef REALTIME_FILTERING
vRefractionFilteringInfo,
#ifdef SS_USE_LOCAL_REFRACTIONMAP_CUBIC
vRefractionPosition,
#endif
#ifdef SS_TRANSLUCENCY
vDiffusionDistance,
subSurfaceOut
surfaceAlbedo=subSurfaceOut.surfaceAlbedo;
alpha=subSurfaceOut.alpha;
#endif
#else
subSurfaceOut.specularEnvironmentReflectance=specularEnvironmentReflectance;
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
float writeGeometryInfo=finalColor.a>0.4 ? 1.0 : 0.0;
gl_FragData[PREPASS_POSITION_INDEX]=vec4(vPositionW,writeGeometryInfo);
#ifdef PREPASS_VELOCITY
vec2 a=(vCurrentPosition.xy/vCurrentPosition.w)*0.5+0.5;
#ifdef PREPASS_ALBEDO_SQRT
vec3 sqAlbedo=sqrt(surfaceAlbedo); 
#ifdef PREPASS_IRRADIANCE
vec3 irradiance=finalDiffuse;
#ifdef REFLECTION
irradiance+=finalIrradiance;
#endif
#ifdef SS_SCATTERING
gl_FragData[0]=vec4(finalColor.rgb-irradiance,finalColor.a); 
gl_FragData[0]=finalColor; 
gl_FragData[PREPASS_IRRADIANCE_INDEX]=vec4(clamp(irradiance,vec3(0.),vec3(1.)),writeGeometryInfo*scatteringDiffusionProfile/255.); 
gl_FragData[0]=vec4(finalColor.rgb,finalColor.a);
#ifdef PREPASS_DEPTH
gl_FragData[PREPASS_DEPTH_INDEX]=vec4(vViewPos.z,0.0,0.0,writeGeometryInfo); 
#ifdef PREPASS_NORMAL
gl_FragData[PREPASS_NORMAL_INDEX]=vec4((view*vec4(normalW,0.0)).rgb,writeGeometryInfo); 
#ifdef PREPASS_ALBEDO_SQRT
gl_FragData[PREPASS_ALBEDO_SQRT_INDEX]=vec4(sqAlbedo,writeGeometryInfo); 
#ifdef PREPASS_REFLECTIVITY
#ifndef UNLIT
gl_FragData[PREPASS_REFLECTIVITY_INDEX]=vec4(toGammaSpace(specularEnvironmentR0),microSurface)*writeGeometryInfo;
gl_FragData[PREPASS_REFLECTIVITY_INDEX]=vec4( 0.0,0.0,0.0,1.0 )*writeGeometryInfo;
#endif
#endif
#if !defined(PREPASS) || defined(WEBGL2)
gl_FragColor=finalColor;
#include<oitFragment>
#if ORDER_INDEPENDENT_TRANSPARENCY
if (fragDepth==nearestDepth) {
#include<pbrDebug>
#define CUSTOM_FRAGMENT_MAIN_END
}
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const pbrPixelShader = { name, shader };
//# sourceMappingURL=pbr.fragment.js.map