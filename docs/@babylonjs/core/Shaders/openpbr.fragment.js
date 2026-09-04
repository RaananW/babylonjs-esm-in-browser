// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { prePassDeclaration } from "./ShadersInclude/prePassDeclaration.js";
import { oitDeclaration } from "./ShadersInclude/oitDeclaration.js";
import { sceneFragmentDeclaration } from "./ShadersInclude/sceneFragmentDeclaration.js";
import { decalFragmentDeclaration } from "./ShadersInclude/decalFragmentDeclaration.js";
import { openpbrFragmentDeclaration } from "./ShadersInclude/openpbrFragmentDeclaration.js";
import { sceneUboDeclaration } from "./ShadersInclude/sceneUboDeclaration.js";
import { meshUboDeclaration } from "./ShadersInclude/meshUboDeclaration.js";
import { openpbrUboDeclaration } from "./ShadersInclude/openpbrUboDeclaration.js";
import { mainUVVaryingDeclaration } from "./ShadersInclude/mainUVVaryingDeclaration.js";
import { pbrFragmentExtraDeclaration } from "./ShadersInclude/pbrFragmentExtraDeclaration.js";
import { lightFragmentDeclaration } from "./ShadersInclude/lightFragmentDeclaration.js";
import { lightUboDeclaration } from "./ShadersInclude/lightUboDeclaration.js";
import { samplerFragmentDeclaration } from "./ShadersInclude/samplerFragmentDeclaration.js";
import { pbrFragmentReflectionDeclaration } from "./ShadersInclude/pbrFragmentReflectionDeclaration.js";
import { openpbrFragmentSamplersDeclaration } from "./ShadersInclude/openpbrFragmentSamplersDeclaration.js";
import { imageProcessingDeclaration } from "./ShadersInclude/imageProcessingDeclaration.js";
import { clipPlaneFragmentDeclaration } from "./ShadersInclude/clipPlaneFragmentDeclaration.js";
import { logDepthDeclaration } from "./ShadersInclude/logDepthDeclaration.js";
import { fogFragmentDeclaration } from "./ShadersInclude/fogFragmentDeclaration.js";
import { textureRepetitionFunctions } from "./ShadersInclude/textureRepetitionFunctions.js";
import { helperFunctions } from "./ShadersInclude/helperFunctions.js";
import { subSurfaceScatteringFunctions } from "./ShadersInclude/subSurfaceScatteringFunctions.js";
import { importanceSampling } from "./ShadersInclude/importanceSampling.js";
import { pbrHelperFunctions } from "./ShadersInclude/pbrHelperFunctions.js";
import { imageProcessingFunctions } from "./ShadersInclude/imageProcessingFunctions.js";
import { shadowsFragmentFunctions } from "./ShadersInclude/shadowsFragmentFunctions.js";
import { harmonicsFunctions } from "./ShadersInclude/harmonicsFunctions.js";
import { ltcHelperFunctions } from "./ShadersInclude/ltcHelperFunctions.js";
import { pbrDirectLightingSetupFunctions } from "./ShadersInclude/pbrDirectLightingSetupFunctions.js";
import { pbrDirectLightingFalloffFunctions } from "./ShadersInclude/pbrDirectLightingFalloffFunctions.js";
import { pbrBRDFFunctions } from "./ShadersInclude/pbrBRDFFunctions.js";
import { hdrFilteringFunctions } from "./ShadersInclude/hdrFilteringFunctions.js";
import { pbrDirectLightingFunctions } from "./ShadersInclude/pbrDirectLightingFunctions.js";
import { pbrIBLFunctions } from "./ShadersInclude/pbrIBLFunctions.js";
import { openpbrNormalMapFragmentMainFunctions } from "./ShadersInclude/openpbrNormalMapFragmentMainFunctions.js";
import { openpbrNormalMapFragmentFunctions } from "./ShadersInclude/openpbrNormalMapFragmentFunctions.js";
import { reflectionFunction } from "./ShadersInclude/reflectionFunction.js";
import { openpbrDielectricReflectance } from "./ShadersInclude/openpbrDielectricReflectance.js";
import { openpbrConductorReflectance } from "./ShadersInclude/openpbrConductorReflectance.js";
import { openpbrAmbientOcclusionFunctions } from "./ShadersInclude/openpbrAmbientOcclusionFunctions.js";
import { openpbrGeometryInfo } from "./ShadersInclude/openpbrGeometryInfo.js";
import { openpbrIblFunctions } from "./ShadersInclude/openpbrIblFunctions.js";
import { openpbrVolumeFunctions } from "./ShadersInclude/openpbrVolumeFunctions.js";
import { clipPlaneFragment } from "./ShadersInclude/clipPlaneFragment.js";
import { pbrBlockNormalGeometric } from "./ShadersInclude/pbrBlockNormalGeometric.js";
import { openpbrNormalMapFragment } from "./ShadersInclude/openpbrNormalMapFragment.js";
import { openpbrBlockNormalFinal } from "./ShadersInclude/openpbrBlockNormalFinal.js";
import { openpbrBaseLayerData } from "./ShadersInclude/openpbrBaseLayerData.js";
import { openpbrTransmissionLayerData } from "./ShadersInclude/openpbrTransmissionLayerData.js";
import { openpbrSubsurfaceLayerData } from "./ShadersInclude/openpbrSubsurfaceLayerData.js";
import { openpbrCoatLayerData } from "./ShadersInclude/openpbrCoatLayerData.js";
import { openpbrThinFilmLayerData } from "./ShadersInclude/openpbrThinFilmLayerData.js";
import { openpbrFuzzLayerData } from "./ShadersInclude/openpbrFuzzLayerData.js";
import { openpbrAmbientOcclusionData } from "./ShadersInclude/openpbrAmbientOcclusionData.js";
import { depthPrePass } from "./ShadersInclude/depthPrePass.js";
import { openpbrBackgroundTransmission } from "./ShadersInclude/openpbrBackgroundTransmission.js";
import { openpbrEnvironmentLighting } from "./ShadersInclude/openpbrEnvironmentLighting.js";
import { openpbrDirectLightingInit } from "./ShadersInclude/openpbrDirectLightingInit.js";
import { openpbrDirectLighting } from "./ShadersInclude/openpbrDirectLighting.js";
import { logDepthFragment } from "./ShadersInclude/logDepthFragment.js";
import { fogFragment } from "./ShadersInclude/fogFragment.js";
import { pbrBlockImageProcessing } from "./ShadersInclude/pbrBlockImageProcessing.js";
import { openpbrBlockPrePass } from "./ShadersInclude/openpbrBlockPrePass.js";
import { oitFragment } from "./ShadersInclude/oitFragment.js";
import { pbrDebug } from "./ShadersInclude/pbrDebug.js";
const name = "openpbrPixelShader";
const shader = `#define OPENPBR_FRAGMENT_SHADER
#define CUSTOM_FRAGMENT_EXTENSION
#if defined(GEOMETRY_NORMAL) || defined(GEOMETRY_COAT_NORMAL) || !defined(NORMAL) || defined(FORCENORMALFORWARD) || defined(SPECULARAA)
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
#include<oitDeclaration>
#ifndef FROMLINEARSPACE
#define FROMLINEARSPACE
#endif
#include<__decl__openpbrFragment>
#include<pbrFragmentExtraDeclaration>
#include<__decl__lightFragment>[0..maxSimultaneousLights]
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
vec3 layer(vec3 slab_bottom,vec3 slab_top,float lerp_factor,vec3 bottom_multiplier,vec3 top_multiplier) {return mix(slab_bottom*bottom_multiplier,slab_top*top_multiplier,lerp_factor);}
void main(void) {
#ifdef PREPASS_IRRADIANCE
vec3 total_direct_diffuse=vec3(0.0);
#endif
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#include<pbrBlockNormalGeometric>
vec3 coatNormalW=normalW;
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
#include<depthPrePass>
#define CUSTOM_FRAGMENT_BEFORE_LIGHTS
#ifdef ANISOTROPIC_COAT
geometryInfoAnisoOutParams coatGeoInfo=geometryInfoAniso(
coatNormalW,viewDirectionW.xyz,coat_roughness,geometricNormalW
,vec3(geometry_coat_tangent.x,geometry_coat_tangent.y,coat_roughness_anisotropy),TBN
);
#else
geometryInfoOutParams coatGeoInfo=geometryInfo(
coatNormalW,viewDirectionW.xyz,coat_roughness,geometricNormalW
);
#endif
specular_roughness=mix(specular_roughness,pow(min(1.0,pow(specular_roughness,4.0)+2.0*pow(coat_roughness,4.0)),0.25),coat_weight);
#ifdef ANISOTROPIC_BASE
geometryInfoAnisoOutParams baseGeoInfo=geometryInfoAniso(
normalW,viewDirectionW.xyz,specular_roughness,geometricNormalW
,vec3(geometry_tangent.x,geometry_tangent.y,specular_roughness_anisotropy),TBN
);
#else
geometryInfoOutParams baseGeoInfo=geometryInfo(
normalW,viewDirectionW.xyz,specular_roughness,geometricNormalW
);
#endif
#ifdef FUZZ
vec3 fuzzNormalW=normalize(mix(normalW,coatNormalW,coat_weight));vec3 fuzzTangent=normalize(TBN[0]);fuzzTangent=normalize(fuzzTangent-dot(fuzzTangent,fuzzNormalW)*fuzzNormalW);vec3 fuzzBitangent=cross(fuzzNormalW,fuzzTangent);geometryInfoOutParams fuzzGeoInfo=geometryInfo(
fuzzNormalW,viewDirectionW.xyz,fuzz_roughness,geometricNormalW
);
#endif
ReflectanceParams coatReflectance;coatReflectance=dielectricReflectance(
coat_ior 
,1.0 
,vec3(1.0)
,coat_weight
);
#ifdef THIN_FILM
float thin_film_outside_ior=mix(1.0,coat_ior,coat_weight);
#endif
ReflectanceParams baseDielectricReflectance;{float effectiveCoatIor=mix(1.0,coat_ior,coat_weight);baseDielectricReflectance=dielectricReflectance(
specular_ior 
,effectiveCoatIor 
,specular_color
,specular_weight
);}
ReflectanceParams baseConductorReflectance;baseConductorReflectance=conductorReflectance(base_color,specular_color,specular_weight);vec3 volume_absorption=vec3(1.0);vec3 transmission_tint=vec3(1.0);float surface_translucency_weight=0.0;
#if defined(REFRACTED_BACKGROUND) || defined(REFRACTED_ENVIRONMENT) || defined(REFRACTED_LIGHTS)
#if defined(GEOMETRY_THIN_WALLED)
vec3 refractedViewVector=-viewDirectionW;
#else
#ifdef DISPERSION
vec3 refractedViewVectors[3];float iorDispersionSpread=transmission_dispersion_scale/transmission_dispersion_abbe_number*(specular_ior-1.0);vec3 dispersion_iors=vec3(specular_ior-iorDispersionSpread,specular_ior,specular_ior+iorDispersionSpread);for (int i=0; i<3; i++) {refractedViewVectors[i]=double_refract(-viewDirectionW,normalW,dispersion_iors[i]); }
#else
vec3 refractedViewVector=double_refract(-viewDirectionW,normalW,specular_ior);
#endif
#endif
#ifdef GEOMETRY_THIN_WALLED
float transmission_roughness=specular_roughness;
#else
float transmission_roughness=specular_roughness*clamp(4.0*(specular_ior-1.0),0.001,1.0);
#endif
#if (defined(TRANSMISSION_SLAB) || defined(SUBSURFACE_SLAB))
OpenPBRHomogeneousVolume volumeParams;{
#if defined(TRANSMISSION_SLAB)
OpenPBRHomogeneousVolume transmissionVolumeParams=computeOpenPBRTransmissionVolume(
transmission_color.rgb,
transmission_depth,
transmission_scatter.rgb,
transmission_scatter_anisotropy
);
#endif
#if defined(SUBSURFACE_SLAB)
OpenPBRHomogeneousVolume subsurfaceVolumeParams=computeOpenPBRSubsurfaceVolume(
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
float subsurface_fraction_of_dielectric=(1.0f-transmission_weight)*subsurface_weight;float subsurface_and_transmission_fraction_of_dielectric=subsurface_fraction_of_dielectric+transmission_weight;float reciprocal_of_subsurface_and_transmission_fraction_of_dielectric =
1.0f/maxEps(subsurface_and_transmission_fraction_of_dielectric);float trans_weight=transmission_weight*reciprocal_of_subsurface_and_transmission_fraction_of_dielectric;float subsurf_weight=subsurface_fraction_of_dielectric*reciprocal_of_subsurface_and_transmission_fraction_of_dielectric;volumeParams.scatter_coeff=transmissionVolumeParams.scatter_coeff*trans_weight+subsurfaceVolumeParams.scatter_coeff*subsurf_weight;volumeParams.absorption_coeff=transmissionVolumeParams.absorption_coeff*trans_weight+subsurfaceVolumeParams.absorption_coeff*subsurf_weight;volumeParams.anisotropy=(transmissionVolumeParams.anisotropy*trans_weight+subsurfaceVolumeParams.anisotropy*subsurf_weight)/maxEps(trans_weight+subsurf_weight);volumeParams.extinction_coeff=volumeParams.absorption_coeff+volumeParams.scatter_coeff;volumeParams.ss_albedo=volumeParams.scatter_coeff/maxEps(volumeParams.extinction_coeff);volumeParams.multi_scatter_color=singleScatterToMultiScatterAlbedo(volumeParams.ss_albedo);surface_translucency_weight=subsurface_and_transmission_fraction_of_dielectric;
#endif
}
volume_absorption=exp(-volumeParams.absorption_coeff*geometry_thickness);vec3 backscatter_color=vec3(1.0);{vec3 reduced_scatter=volumeParams.scatter_coeff*vec3(1.0-volumeParams.anisotropy);vec3 reduced_albedo=reduced_scatter/(volumeParams.absorption_coeff+reduced_scatter);vec3 sqrt_term=max(sqrt(1.0-reduced_albedo),0.0001);backscatter_color=(1.0-sqrt_term)/(1.0+sqrt_term);}
#elif defined(TRANSMISSION_SLAB)
surface_translucency_weight=transmission_weight;
#endif
#ifdef SCATTERING
#ifdef GEOMETRY_THIN_WALLED
vec3 iso_scatter_density=vec3(1.0);
#else
#ifdef USE_IRRADIANCE_TEXTURE_FOR_SCATTERING
vec3 mfp=vec3(100.0)/volumeParams.extinction_coeff;vec3 scattered_light_from_irradiance_texture=sss_convolve(sceneIrradianceSampler,sceneDepthSampler,renderTargetSize,mfp,projection,inverseProjection,SSS_SAMPLE_COUNT,noise.xy);float numLights=float(LIGHTCOUNT);
#ifdef REFLECTION
numLights+=1.0;
#endif
scattered_light_from_irradiance_texture/=numLights;
#else
vec3 scattered_light_from_irradiance_texture=vec3(0.0);
#endif
float back_to_iso_scattering_blend=min(1.0+volumeParams.anisotropy,1.0);float iso_to_forward_scattering_blend=max(volumeParams.anisotropy,0.0);vec3 iso_scatter_transmittance=pow(exp(-volumeParams.scatter_coeff*geometry_thickness),vec3(0.2));vec3 iso_scatter_density=clamp(vec3(1.0)-iso_scatter_transmittance,0.0,1.0);transmission_roughness=min(transmission_roughness+pow((1.0-abs(volumeParams.anisotropy))*max3(iso_scatter_density*iso_scatter_density),3.0),1.0);
#endif
volumeParams.multi_scatter_color=mix(volumeParams.ss_albedo,volumeParams.multi_scatter_color,max3(iso_scatter_density));
#endif
#if defined(TRANSMISSION_SLAB) && (!defined(TRANSMISSION_SLAB_VOLUME) || defined(GEOMETRY_THIN_WALLED))
transmission_tint*=transmission_color.rgb;
#ifdef GEOMETRY_THIN_WALLED
float sin2=1.0-baseGeoInfo.NdotV*baseGeoInfo.NdotV;sin2=sin2/(specular_ior*specular_ior);float cos_t=sqrt(1.0-sin2);float pathLength=1.0/cos_t;transmission_tint=pow(transmission_tint,vec3(pathLength));
#else
transmission_tint*=transmission_color.rgb;
#endif
#endif
#if defined(SUBSURFACE_SLAB) && defined(GEOMETRY_THIN_WALLED)
float unweighted_translucency=max(mix(subsurface_weight,1.0f,transmission_weight),0.0001);transmission_tint=mix(vec3(1.0),transmission_tint,transmission_weight/unweighted_translucency);transmission_roughness=mix(1.0,transmission_roughness,transmission_weight/unweighted_translucency);
#endif
float transmission_roughness_alpha=transmission_roughness*transmission_roughness;
#endif
#include<openpbrBackgroundTransmission>
vec3 material_surface_ibl=vec3(0.,0.,0.);
#include<openpbrEnvironmentLighting>
vec3 material_surface_direct=vec3(0.,0.,0.);
#if defined(LIGHT0)
float aggShadow=0.;
#include<openpbrDirectLightingInit>[0..maxSimultaneousLights]
#include<openpbrDirectLighting>[0..maxSimultaneousLights]
#endif
vec3 material_surface_emission=vEmissionColor;
#ifdef EMISSION_COLOR
vec3 emissionColorTex=TEXRD(emissionColorSampler,vEmissionColorUV+uvOffset).rgb;
#ifdef EMISSION_COLOR_GAMMA
material_surface_emission*=toLinearSpace(emissionColorTex.rgb);
#else
material_surface_emission*=emissionColorTex.rgb;
#endif
material_surface_emission*= vEmissionColorInfos.y;
#endif
material_surface_emission*=vLightingIntensity.y;
#define CUSTOM_FRAGMENT_BEFORE_FINALCOLORCOMPOSITION
vec4 finalColor=vec4(material_surface_ibl+material_surface_direct+material_surface_emission,alpha);
#define CUSTOM_FRAGMENT_BEFORE_FOG
finalColor=max(finalColor,0.0);
#include<logDepthFragment>
#include<fogFragment>(color,finalColor)
#include<pbrBlockImageProcessing>
#define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR
#ifdef PREPASS
#include<openpbrBlockPrePass>
#endif
#if !defined(PREPASS) || defined(WEBGL2)
gl_FragColor=finalColor;
#endif
#include<oitFragment>
#if ORDER_INDEPENDENT_TRANSPARENCY
if (fragDepth==nearestDepth) {frontColor.rgb+=finalColor.rgb*finalColor.a*alphaMultiplier;frontColor.a=1.0-alphaMultiplier*(1.0-finalColor.a);} else {backColor+=finalColor;}
#endif
#include<pbrDebug>
#define CUSTOM_FRAGMENT_MAIN_END
}
`;
// Sideeffect
if (!ShaderStore.ShadersStore[name]) {
    ShaderStore.ShadersStore[name] = shader;
}
const includes = [prePassDeclaration, oitDeclaration, sceneFragmentDeclaration, decalFragmentDeclaration, openpbrFragmentDeclaration, sceneUboDeclaration, meshUboDeclaration, openpbrUboDeclaration, mainUVVaryingDeclaration, pbrFragmentExtraDeclaration, lightFragmentDeclaration, lightUboDeclaration, samplerFragmentDeclaration, pbrFragmentReflectionDeclaration, openpbrFragmentSamplersDeclaration, imageProcessingDeclaration, clipPlaneFragmentDeclaration, logDepthDeclaration, fogFragmentDeclaration, textureRepetitionFunctions, helperFunctions, subSurfaceScatteringFunctions, importanceSampling, pbrHelperFunctions, imageProcessingFunctions, shadowsFragmentFunctions, harmonicsFunctions, ltcHelperFunctions, pbrDirectLightingSetupFunctions, pbrDirectLightingFalloffFunctions, pbrBRDFFunctions, hdrFilteringFunctions, pbrDirectLightingFunctions, pbrIBLFunctions, openpbrNormalMapFragmentMainFunctions, openpbrNormalMapFragmentFunctions, reflectionFunction, openpbrDielectricReflectance, openpbrConductorReflectance, openpbrAmbientOcclusionFunctions, openpbrGeometryInfo, openpbrIblFunctions, openpbrVolumeFunctions, clipPlaneFragment, pbrBlockNormalGeometric, openpbrNormalMapFragment, openpbrBlockNormalFinal, openpbrBaseLayerData, openpbrTransmissionLayerData, openpbrSubsurfaceLayerData, openpbrCoatLayerData, openpbrThinFilmLayerData, openpbrFuzzLayerData, openpbrAmbientOcclusionData, depthPrePass, openpbrBackgroundTransmission, openpbrEnvironmentLighting, openpbrDirectLightingInit, openpbrDirectLighting, logDepthFragment, fogFragment, pbrBlockImageProcessing, openpbrBlockPrePass, oitFragment, pbrDebug];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStore[inc.name]) {
        ShaderStore.IncludesShadersStore[inc.name] = inc.shader;
    }
}
/** @internal */
export const openpbrPixelShader = { name, shader };
//# sourceMappingURL=openpbr.fragment.js.map