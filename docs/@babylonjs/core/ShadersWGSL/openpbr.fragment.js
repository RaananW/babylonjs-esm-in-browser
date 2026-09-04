// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { prePassDeclarationWGSL } from "./ShadersInclude/prePassDeclaration.js";
import { oitDeclarationWGSL } from "./ShadersInclude/oitDeclaration.js";
import { sceneUboDeclarationWGSL } from "./ShadersInclude/sceneUboDeclaration.js";
import { meshUboDeclarationWGSL } from "./ShadersInclude/meshUboDeclaration.js";
import { openpbrUboDeclarationWGSL } from "./ShadersInclude/openpbrUboDeclaration.js";
import { mainUVVaryingDeclarationWGSL } from "./ShadersInclude/mainUVVaryingDeclaration.js";
import { pbrFragmentExtraDeclarationWGSL } from "./ShadersInclude/pbrFragmentExtraDeclaration.js";
import { lightUboDeclarationWGSL } from "./ShadersInclude/lightUboDeclaration.js";
import { samplerFragmentDeclarationWGSL } from "./ShadersInclude/samplerFragmentDeclaration.js";
import { pbrFragmentReflectionDeclarationWGSL } from "./ShadersInclude/pbrFragmentReflectionDeclaration.js";
import { openpbrFragmentSamplersDeclarationWGSL } from "./ShadersInclude/openpbrFragmentSamplersDeclaration.js";
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
import { openpbrNormalMapFragmentMainFunctionsWGSL } from "./ShadersInclude/openpbrNormalMapFragmentMainFunctions.js";
import { openpbrNormalMapFragmentFunctionsWGSL } from "./ShadersInclude/openpbrNormalMapFragmentFunctions.js";
import { reflectionFunctionWGSL } from "./ShadersInclude/reflectionFunction.js";
import { openpbrDielectricReflectanceWGSL } from "./ShadersInclude/openpbrDielectricReflectance.js";
import { openpbrConductorReflectanceWGSL } from "./ShadersInclude/openpbrConductorReflectance.js";
import { openpbrAmbientOcclusionFunctionsWGSL } from "./ShadersInclude/openpbrAmbientOcclusionFunctions.js";
import { openpbrGeometryInfoWGSL } from "./ShadersInclude/openpbrGeometryInfo.js";
import { openpbrIblFunctionsWGSL } from "./ShadersInclude/openpbrIblFunctions.js";
import { openpbrVolumeFunctionsWGSL } from "./ShadersInclude/openpbrVolumeFunctions.js";
import { clipPlaneFragmentWGSL } from "./ShadersInclude/clipPlaneFragment.js";
import { pbrBlockNormalGeometricWGSL } from "./ShadersInclude/pbrBlockNormalGeometric.js";
import { openpbrNormalMapFragmentWGSL } from "./ShadersInclude/openpbrNormalMapFragment.js";
import { openpbrBlockNormalFinalWGSL } from "./ShadersInclude/openpbrBlockNormalFinal.js";
import { openpbrBaseLayerDataWGSL } from "./ShadersInclude/openpbrBaseLayerData.js";
import { openpbrTransmissionLayerDataWGSL } from "./ShadersInclude/openpbrTransmissionLayerData.js";
import { openpbrSubsurfaceLayerDataWGSL } from "./ShadersInclude/openpbrSubsurfaceLayerData.js";
import { openpbrCoatLayerDataWGSL } from "./ShadersInclude/openpbrCoatLayerData.js";
import { openpbrThinFilmLayerDataWGSL } from "./ShadersInclude/openpbrThinFilmLayerData.js";
import { openpbrFuzzLayerDataWGSL } from "./ShadersInclude/openpbrFuzzLayerData.js";
import { openpbrAmbientOcclusionDataWGSL } from "./ShadersInclude/openpbrAmbientOcclusionData.js";
import { depthPrePassWGSL } from "./ShadersInclude/depthPrePass.js";
import { openpbrBackgroundTransmissionWGSL } from "./ShadersInclude/openpbrBackgroundTransmission.js";
import { openpbrEnvironmentLightingWGSL } from "./ShadersInclude/openpbrEnvironmentLighting.js";
import { openpbrDirectLightingInitWGSL } from "./ShadersInclude/openpbrDirectLightingInit.js";
import { openpbrDirectLightingWGSL } from "./ShadersInclude/openpbrDirectLighting.js";
import { logDepthFragmentWGSL } from "./ShadersInclude/logDepthFragment.js";
import { fogFragmentWGSL } from "./ShadersInclude/fogFragment.js";
import { pbrBlockImageProcessingWGSL } from "./ShadersInclude/pbrBlockImageProcessing.js";
import { openpbrBlockPrePassWGSL } from "./ShadersInclude/openpbrBlockPrePass.js";
import { oitFragmentWGSL } from "./ShadersInclude/oitFragment.js";
import { pbrDebugWGSL } from "./ShadersInclude/pbrDebug.js";
const name = "openpbrPixelShader";
const shader = `#define OPENPBR_FRAGMENT_SHADER
#define CUSTOM_FRAGMENT_BEGIN
#include<prePassDeclaration>[SCENE_MRT_COUNT]
#include<oitDeclaration>
#ifndef FROMLINEARSPACE
#define FROMLINEARSPACE
#endif
#include<openpbrUboDeclaration>
#include<pbrFragmentExtraDeclaration>
#include<lightUboDeclaration>[0..maxSimultaneousLights]
#include<openpbrFragmentSamplersDeclaration>
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
#include<openpbrNormalMapFragmentMainFunctions>
#include<openpbrNormalMapFragmentFunctions>
#ifdef REFLECTION
#include<reflectionFunction>
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
#include<openpbrDielectricReflectance>
#include<openpbrConductorReflectance>
#include<openpbrAmbientOcclusionFunctions>
#include<openpbrGeometryInfo>
#include<openpbrIblFunctions>
#include<openpbrVolumeFunctions>
fn layer(slab_bottom: vec3f,slab_top: vec3f,lerp_factor: f32,bottom_multiplier: vec3f,top_multiplier: vec3f)->vec3f {return mix(slab_bottom*bottom_multiplier,slab_top*top_multiplier,lerp_factor);}
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#ifdef PREPASS_IRRADIANCE
var total_direct_diffuse: vec3f=vec3f(0.0f);
#endif
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#include<pbrBlockNormalGeometric>
var coatNormalW: vec3f=normalW;
#include<openpbrNormalMapFragment>
#include<openpbrBlockNormalFinal>
#include<openpbrBaseLayerData>
#include<openpbrTransmissionLayerData>
#include<openpbrSubsurfaceLayerData>
#include<openpbrCoatLayerData>
#include<openpbrThinFilmLayerData>
#include<openpbrFuzzLayerData>
#include<openpbrAmbientOcclusionData>
#define CUSTOM_FRAGMENT_UPDATE_ALPHA
#define DEPTHPREPASS_SKIP_EARLY_RETURN
#include<depthPrePass>
#ifndef DEPTHPREPASS
#define CUSTOM_FRAGMENT_BEFORE_LIGHTS
#ifdef ANISOTROPIC_COAT
let coatGeoInfo: geometryInfoAnisoOutParams=geometryInfoAniso(
coatNormalW,viewDirectionW.xyz,coat_roughness,geometricNormalW
,vec3f(geometry_coat_tangent.x,geometry_coat_tangent.y,coat_roughness_anisotropy),TBN
);
#else
let coatGeoInfo: geometryInfoOutParams=geometryInfo(
coatNormalW,viewDirectionW.xyz,coat_roughness,geometricNormalW
);
#endif
specular_roughness=mix(specular_roughness,pow(min(1.0f,pow(specular_roughness,4.0f)+2.0f*pow(coat_roughness,4.0f)),0.25f),coat_weight);
#ifdef ANISOTROPIC_BASE
let baseGeoInfo: geometryInfoAnisoOutParams=geometryInfoAniso(
normalW,viewDirectionW.xyz,specular_roughness,geometricNormalW
,vec3f(geometry_tangent.x,geometry_tangent.y,specular_roughness_anisotropy),TBN
);
#else
let baseGeoInfo: geometryInfoOutParams=geometryInfo(
normalW,viewDirectionW.xyz,specular_roughness,geometricNormalW
);
#endif
#ifdef FUZZ
let fuzzNormalW=normalize(mix(normalW,coatNormalW,coat_weight));var fuzzTangent=normalize(TBN[0]);fuzzTangent=normalize(fuzzTangent-dot(fuzzTangent,fuzzNormalW)*fuzzNormalW);let fuzzBitangent=cross(fuzzNormalW,fuzzTangent);let fuzzGeoInfo: geometryInfoOutParams=geometryInfo(
fuzzNormalW,viewDirectionW.xyz,fuzz_roughness,geometricNormalW
);
#endif
let coatReflectance: ReflectanceParams=dielectricReflectance(
coat_ior 
,1.0f 
,vec3f(1.0f)
,coat_weight
);
#ifdef THIN_FILM
let thin_film_outside_ior: f32=mix(1.0f,coat_ior,coat_weight);
#endif
let baseDielectricReflectance: ReflectanceParams=dielectricReflectance(
specular_ior 
,mix(1.0f,coat_ior,coat_weight) 
,specular_color
,specular_weight
);let baseConductorReflectance: ReflectanceParams=conductorReflectance(base_color,specular_color,specular_weight);var volume_absorption: vec3f=vec3f(1.0f);var transmission_tint: vec3f=vec3f(1.0f);var surface_translucency_weight: f32=0.0f;
#if defined(REFRACTED_BACKGROUND) || defined(REFRACTED_ENVIRONMENT) || defined(REFRACTED_LIGHTS)
#if defined(GEOMETRY_THIN_WALLED)
let refractedViewVector: vec3f=-viewDirectionW;
#else
#ifdef DISPERSION
var refractedViewVectors: array<vec3f,3>;let iorDispersionSpread: f32=transmission_dispersion_scale/transmission_dispersion_abbe_number*(specular_ior-1.0f);let dispersion_iors: vec3f=vec3f(specular_ior-iorDispersionSpread,specular_ior,specular_ior+iorDispersionSpread);for (var i: i32=0; i<3; i++) {refractedViewVectors[i]=double_refract(-viewDirectionW,normalW,dispersion_iors[i]); }
#else
let refractedViewVector: vec3f=double_refract(-viewDirectionW,normalW,specular_ior);
#endif
#endif
#ifdef GEOMETRY_THIN_WALLED
var transmission_roughness: f32=specular_roughness;
#else
var transmission_roughness: f32=specular_roughness*clamp(4.0f*(specular_ior-1.0f),0.001f,1.0f);
#endif
#if (defined(TRANSMISSION_SLAB) || defined(SUBSURFACE_SLAB))
var volumeParams: OpenPBRHomogeneousVolume;{
#if defined(TRANSMISSION_SLAB)
let transmissionVolumeParams: OpenPBRHomogeneousVolume=computeOpenPBRTransmissionVolume(
transmission_color.rgb,
transmission_depth,
transmission_scatter.rgb,
transmission_scatter_anisotropy
);
#endif
#if defined(SUBSURFACE_SLAB)
let subsurfaceVolumeParams: OpenPBRHomogeneousVolume=computeOpenPBRSubsurfaceVolume(
subsurface_color.rgb,
subsurface_radius,
subsurface_radius_scale.rgb,
subsurface_scatter_anisotropy
);
#endif
#if !defined(TRANSMISSION_SLAB)
volumeParams=subsurfaceVolumeParams;surface_translucency_weight=subsurface_weight;
#elif !defined(SUBSURFACE_SLAB)
volumeParams=transmissionVolumeParams;
#ifdef TRANSMISSION_SLAB_VOLUME
volumeParams.multi_scatter_color=singleScatterToMultiScatterAlbedo(volumeParams.ss_albedo);
#endif
surface_translucency_weight=transmission_weight;
#else
let subsurface_fraction_of_dielectric: f32=(1.0f-transmission_weight)*subsurface_weight;let subsurface_and_transmission_fraction_of_dielectric: f32=subsurface_fraction_of_dielectric+transmission_weight;let reciprocal_of_subsurface_and_transmission_fraction_of_dielectric: f32 =
1.0f/maxEps(subsurface_and_transmission_fraction_of_dielectric);let trans_weight: f32=transmission_weight*reciprocal_of_subsurface_and_transmission_fraction_of_dielectric;let subsurf_weight: f32=subsurface_fraction_of_dielectric*reciprocal_of_subsurface_and_transmission_fraction_of_dielectric;volumeParams.scatter_coeff=transmissionVolumeParams.scatter_coeff*trans_weight+subsurfaceVolumeParams.scatter_coeff*subsurf_weight;volumeParams.absorption_coeff=transmissionVolumeParams.absorption_coeff*trans_weight+subsurfaceVolumeParams.absorption_coeff*subsurf_weight;volumeParams.anisotropy=(transmissionVolumeParams.anisotropy*trans_weight+subsurfaceVolumeParams.anisotropy*subsurf_weight)/maxEps(trans_weight+subsurf_weight);volumeParams.extinction_coeff=volumeParams.absorption_coeff+volumeParams.scatter_coeff;volumeParams.ss_albedo=volumeParams.scatter_coeff/maxEpsVec3(volumeParams.extinction_coeff);volumeParams.multi_scatter_color=singleScatterToMultiScatterAlbedo(volumeParams.ss_albedo);surface_translucency_weight=subsurface_and_transmission_fraction_of_dielectric;
#endif
}
volume_absorption=exp(-volumeParams.absorption_coeff*geometry_thickness);var backscatter_color: vec3f=vec3f(1.0f);{let reduced_scatter: vec3f=volumeParams.scatter_coeff*vec3f(1.0f-volumeParams.anisotropy);let reduced_albedo: vec3f=reduced_scatter/(volumeParams.absorption_coeff+reduced_scatter);let sqrt_term: vec3f=max(sqrt(vec3f(1.0f)-reduced_albedo),vec3f(0.0001f));backscatter_color=(vec3f(1.0f)-sqrt_term)/(vec3f(1.0f)+sqrt_term);}
#elif defined(TRANSMISSION_SLAB)
surface_translucency_weight=transmission_weight;
#endif
#ifdef SCATTERING
#ifdef GEOMETRY_THIN_WALLED
var iso_scatter_density: vec3f=vec3f(1.0f);
#else
#ifdef USE_IRRADIANCE_TEXTURE_FOR_SCATTERING
let mfp: vec3f=vec3f(100.0f)/volumeParams.extinction_coeff;var scattered_light_from_irradiance_texture: vec3f=sss_convolve(sceneIrradianceSampler,sceneDepthSampler,uniforms.renderTargetSize,mfp,scene.projection,scene.inverseProjection,SSS_SAMPLE_COUNT,noise.xy);var numLights=f32(LIGHTCOUNT);
#ifdef REFLECTION
numLights+=1.0f;
#endif
scattered_light_from_irradiance_texture/=vec3f(numLights);
#else
let scattered_light_from_irradiance_texture: vec3f=vec3f(0.0f);
#endif
let back_to_iso_scattering_blend: f32=min(1.0f+volumeParams.anisotropy,1.0f);let iso_to_forward_scattering_blend: f32=max(volumeParams.anisotropy,0.0f);let iso_scatter_transmittance: vec3f=pow(exp(-volumeParams.scatter_coeff*geometry_thickness),vec3f(0.2f));var iso_scatter_density: vec3f=clamp(vec3f(1.0f)-iso_scatter_transmittance,vec3f(0.0f),vec3f(1.0f));transmission_roughness=min(transmission_roughness+pow((1.0f-abs(volumeParams.anisotropy))*max3(iso_scatter_density*iso_scatter_density),3.0f),1.0f);
#endif
volumeParams.multi_scatter_color=mix(volumeParams.ss_albedo,volumeParams.multi_scatter_color,max3(iso_scatter_density));
#endif
#if defined(TRANSMISSION_SLAB) && (!defined(TRANSMISSION_SLAB_VOLUME) || defined(GEOMETRY_THIN_WALLED))
transmission_tint*=transmission_color.rgb;
#ifdef GEOMETRY_THIN_WALLED
var sin2: f32=1.0f-baseGeoInfo.NdotV*baseGeoInfo.NdotV;sin2=sin2/(specular_ior*specular_ior);let cos_t: f32=sqrt(1.0f-sin2);let pathLength: f32=1.0f/cos_t;transmission_tint=pow(transmission_tint,vec3f(pathLength));
#else
transmission_tint*=transmission_color.rgb;
#endif
#endif
#if defined(SUBSURFACE_SLAB) && defined(GEOMETRY_THIN_WALLED)
let unweighted_translucency: f32=max(mix(subsurface_weight,1.0f,transmission_weight),0.0001f);transmission_tint=mix(vec3f(1.0f),transmission_tint,transmission_weight/unweighted_translucency);transmission_roughness=mix(1.0f,transmission_roughness,transmission_weight/unweighted_translucency);
#endif
let transmission_roughness_alpha: f32=transmission_roughness*transmission_roughness;
#endif
#include<openpbrBackgroundTransmission>
var material_surface_ibl: vec3f=vec3f(0.f,0.f,0.f);
#include<openpbrEnvironmentLighting>
var material_surface_direct: vec3f=vec3f(0.f,0.f,0.f);
#if defined(LIGHT0)
var aggShadow: f32=0.f;
#include<openpbrDirectLightingInit>[0..maxSimultaneousLights]
#include<openpbrDirectLighting>[0..maxSimultaneousLights]
#endif
var material_surface_emission: vec3f=uniforms.vEmissionColor;
#ifdef EMISSION_COLOR
let emissionColorTex: vec3f=textureSample(emissionColorSampler,emissionColorSamplerSampler,fragmentInputs.vEmissionColorUV+uvOffset).rgb;
#ifdef EMISSION_COLOR_GAMMA
material_surface_emission*=toLinearSpaceVec3(emissionColorTex.rgb);
#else
material_surface_emission*=emissionColorTex.rgb;
#endif
material_surface_emission*= uniforms.vEmissionColorInfos.y;
#endif
material_surface_emission*=uniforms.vLightingIntensity.y;
#define CUSTOM_FRAGMENT_BEFORE_FINALCOLORCOMPOSITION
var finalColor: vec4f=vec4f(material_surface_ibl+material_surface_direct+material_surface_emission,alpha);
#define CUSTOM_FRAGMENT_BEFORE_FOG
finalColor=max(finalColor,vec4f(0.0));
#include<logDepthFragment>
#include<fogFragment>(color,finalColor)
#include<pbrBlockImageProcessing>
#define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR
#ifdef PREPASS
#include<openpbrBlockPrePass>
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
const includes = [prePassDeclarationWGSL, oitDeclarationWGSL, sceneUboDeclarationWGSL, meshUboDeclarationWGSL, openpbrUboDeclarationWGSL, mainUVVaryingDeclarationWGSL, pbrFragmentExtraDeclarationWGSL, lightUboDeclarationWGSL, samplerFragmentDeclarationWGSL, pbrFragmentReflectionDeclarationWGSL, openpbrFragmentSamplersDeclarationWGSL, imageProcessingDeclarationWGSL, clipPlaneFragmentDeclarationWGSL, logDepthDeclarationWGSL, fogFragmentDeclarationWGSL, textureRepetitionFunctionsWGSL, helperFunctionsWGSL, subSurfaceScatteringFunctionsWGSL, importanceSamplingWGSL, pbrHelperFunctionsWGSL, imageProcessingFunctionsWGSL, shadowsFragmentFunctionsWGSL, harmonicsFunctionsWGSL, ltcHelperFunctionsWGSL, pbrDirectLightingSetupFunctionsWGSL, pbrDirectLightingFalloffFunctionsWGSL, pbrBRDFFunctionsWGSL, hdrFilteringFunctionsWGSL, clusteredLightingFunctionsWGSL, pbrBlockReflectance0WGSL, pbrClusteredLightingFunctionsWGSL, pbrDirectLightingFunctionsWGSL, pbrIBLFunctionsWGSL, openpbrNormalMapFragmentMainFunctionsWGSL, openpbrNormalMapFragmentFunctionsWGSL, reflectionFunctionWGSL, openpbrDielectricReflectanceWGSL, openpbrConductorReflectanceWGSL, openpbrAmbientOcclusionFunctionsWGSL, openpbrGeometryInfoWGSL, openpbrIblFunctionsWGSL, openpbrVolumeFunctionsWGSL, clipPlaneFragmentWGSL, pbrBlockNormalGeometricWGSL, openpbrNormalMapFragmentWGSL, openpbrBlockNormalFinalWGSL, openpbrBaseLayerDataWGSL, openpbrTransmissionLayerDataWGSL, openpbrSubsurfaceLayerDataWGSL, openpbrCoatLayerDataWGSL, openpbrThinFilmLayerDataWGSL, openpbrFuzzLayerDataWGSL, openpbrAmbientOcclusionDataWGSL, depthPrePassWGSL, openpbrBackgroundTransmissionWGSL, openpbrEnvironmentLightingWGSL, openpbrDirectLightingInitWGSL, openpbrDirectLightingWGSL, logDepthFragmentWGSL, fogFragmentWGSL, pbrBlockImageProcessingWGSL, openpbrBlockPrePassWGSL, oitFragmentWGSL, pbrDebugWGSL];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStoreWGSL[inc.name]) {
        ShaderStore.IncludesShadersStoreWGSL[inc.name] = inc.shader;
    }
}
/** @internal */
export const openpbrPixelShaderWGSL = { name, shader };
//# sourceMappingURL=openpbr.fragment.js.map