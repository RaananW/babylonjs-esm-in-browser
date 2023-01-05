// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrBlockSubSurface";
const shader = `struct subSurfaceOutParams
vec3 finalRefraction;
float alpha;
#ifdef REFLECTION
float refractionFactorForIrradiance;
#endif
#ifdef SS_TRANSLUCENCY
vec3 transmittance;
vec3 refractionIrradiance;
#endif
#if DEBUGMODE>0
vec4 thicknessMap;
};
#define pbr_inline
#define inline
void subSurfaceBlock(
in vec4 thicknessMap,
#ifdef SS_REFRACTIONINTENSITY_TEXTURE
in vec4 refractionIntensityMap,
#ifdef SS_TRANSLUCENCYINTENSITY_TEXTURE
in vec4 translucencyIntensityMap,
#ifdef REFLECTION
#ifdef SS_TRANSLUCENCY
in mat4 reflectionMatrix,
#if !defined(NORMAL) || !defined(USESPHERICALINVERTEX)
in vec3 irradianceVector_,
#if defined(REALTIME_FILTERING)
in samplerCube reflectionSampler,
#endif
#ifdef USEIRRADIANCEMAP
#ifdef REFLECTIONMAP_3D
in samplerCube irradianceSampler,
in sampler2D irradianceSampler,
#endif
#endif
#endif
#if defined(SS_REFRACTION) || defined(SS_TRANSLUCENCY)
in vec3 surfaceAlbedo,
#ifdef SS_REFRACTION
in vec3 vPositionW,
in float alpha,
#ifdef SS_LODINREFRACTIONALPHA
in float NdotVUnclamped,
#ifdef SS_LINEARSPECULARREFRACTION
in float roughness,
in float alphaG,
in samplerCube refractionSampler,
in samplerCube refractionSamplerLow,
#else
in sampler2D refractionSampler,
in sampler2D refractionSamplerLow,
#endif
#ifdef ANISOTROPIC
in anisotropicOutParams anisotropicOut,
#ifdef REALTIME_FILTERING
in vec2 vRefractionFilteringInfo,
#ifdef SS_USE_LOCAL_REFRACTIONMAP_CUBIC
in vec3 refractionPosition,
#endif
#ifdef SS_TRANSLUCENCY
in vec3 vDiffusionDistance,
out subSurfaceOutParams outParams
float refractionIntensity=vSubSurfaceIntensity.x;
refractionIntensity*=(1.0-alpha);
#endif
#ifdef SS_TRANSLUCENCY
float translucencyIntensity=vSubSurfaceIntensity.y;
#ifdef SS_THICKNESSANDMASK_TEXTURE
#if defined(SS_USE_GLTF_TEXTURES)
float thickness=thicknessMap.g*vThicknessParam.y+vThicknessParam.x;
float thickness=thicknessMap.r*vThicknessParam.y+vThicknessParam.x;
#if DEBUGMODE>0
outParams.thicknessMap=thicknessMap;
#ifdef SS_MASK_FROM_THICKNESS_TEXTURE
#if defined(SS_REFRACTION) && defined(SS_REFRACTION_USE_INTENSITY_FROM_TEXTURE)
#if defined(SS_USE_GLTF_TEXTURES)
refractionIntensity*=thicknessMap.r;
refractionIntensity*=thicknessMap.g;
#endif
#if defined(SS_TRANSLUCENCY) && defined(SS_TRANSLUCENCY_USE_INTENSITY_FROM_TEXTURE)
translucencyIntensity*=thicknessMap.b;
#endif
#else
float thickness=vThicknessParam.y;
#ifdef SS_REFRACTIONINTENSITY_TEXTURE
#ifdef SS_USE_GLTF_TEXTURES
refractionIntensity*=refractionIntensityMap.r;
refractionIntensity*=refractionIntensityMap.g;
#endif
#ifdef SS_TRANSLUCENCYINTENSITY_TEXTURE
translucencyIntensity*=translucencyIntensityMap.b;
#ifdef SS_TRANSLUCENCY
thickness=maxEps(thickness);
#ifdef SS_REFRACTION
vec4 environmentRefraction=vec4(0.,0.,0.,0.);
vec3 refractionVector=refract(-viewDirectionW,anisotropicOut.anisotropicNormal,vRefractionInfos.y);
vec3 refractionVector=refract(-viewDirectionW,normalW,vRefractionInfos.y);
#ifdef SS_REFRACTIONMAP_OPPOSITEZ
refractionVector.z*=-1.0;
#ifdef SS_REFRACTIONMAP_3D
#ifdef SS_USE_LOCAL_REFRACTIONMAP_CUBIC
refractionVector=parallaxCorrectNormal(vPositionW,refractionVector,refractionSize,refractionPosition);
refractionVector.y=refractionVector.y*vRefractionInfos.w;
#ifdef SS_USE_THICKNESS_AS_DEPTH
vec3 vRefractionUVW=vec3(refractionMatrix*(view*vec4(vPositionW+refractionVector*thickness,1.0)));
vec3 vRefractionUVW=vec3(refractionMatrix*(view*vec4(vPositionW+refractionVector*vRefractionInfos.z,1.0)));
vec2 refractionCoords=vRefractionUVW.xy/vRefractionUVW.z;
#ifdef SS_HAS_THICKNESS
float ior=vRefractionInfos.y;
float ior=vRefractionMicrosurfaceInfos.w;
#ifdef SS_LODINREFRACTIONALPHA
float refractionAlphaG=alphaG;
float refractionRoughness=alphaG;
float refractionAlphaG=alphaG;
#ifdef LODBASEDMICROSFURACE
refractionLOD=refractionLOD*vRefractionMicrosurfaceInfos.y+vRefractionMicrosurfaceInfos.z;
float automaticRefractionLOD=UNPACK_LOD(sampleRefraction(refractionSampler,refractionCoords).a);
float requestedRefractionLOD=refractionLOD;
#ifdef REALTIME_FILTERING
environmentRefraction=vec4(radiance(alphaG,refractionSampler,refractionCoords,vRefractionFilteringInfo),1.0);
environmentRefraction=sampleRefractionLod(refractionSampler,refractionCoords,requestedRefractionLOD);
#else
float lodRefractionNormalized=saturate(refractionLOD/log2(vRefractionMicrosurfaceInfos.x));
#ifdef SS_RGBDREFRACTION
environmentRefraction.rgb=fromRGBD(environmentRefraction);
#ifdef SS_GAMMAREFRACTION
environmentRefraction.rgb=toLinearSpace(environmentRefraction.rgb);
environmentRefraction.rgb*=vRefractionInfos.x;
#ifdef SS_REFRACTION
vec3 refractionTransmittance=vec3(refractionIntensity);
vec3 volumeAlbedo=computeColorAtDistanceInMedia(vTintColor.rgb,vTintColor.w);
float maxChannel=max(max(surfaceAlbedo.r,surfaceAlbedo.g),surfaceAlbedo.b);
vec3 volumeAlbedo=computeColorAtDistanceInMedia(vTintColor.rgb,vTintColor.w);
#ifdef SS_ALBEDOFORREFRACTIONTINT
environmentRefraction.rgb*=surfaceAlbedo.rgb;
outParams.surfaceAlbedo=surfaceAlbedo*(1.-refractionIntensity);
outParams.refractionFactorForIrradiance=(1.-refractionIntensity);
#ifdef UNUSED_MULTIPLEBOUNCES
vec3 bounceSpecularEnvironmentReflectance=(2.0*specularEnvironmentReflectance)/(1.0+specularEnvironmentReflectance);
refractionTransmittance*=1.0-outParams.specularEnvironmentReflectance;
outParams.refractionTransmittance=refractionTransmittance;
outParams.finalRefraction=environmentRefraction.rgb*refractionTransmittance*vLightingIntensity.z;
outParams.environmentRefraction=environmentRefraction;
#endif
#if defined(REFLECTION) && defined(SS_TRANSLUCENCY)
#if defined(NORMAL) && defined(USESPHERICALINVERTEX) || !defined(USESPHERICALFROMREFLECTIONMAP)
vec3 irradianceVector=vec3(reflectionMatrix*vec4(normalW,0)).xyz;
irradianceVector.z*=-1.0;
#ifdef INVERTCUBICMAP
irradianceVector.y*=-1.0;
#else
vec3 irradianceVector=irradianceVector_;
#if defined(USESPHERICALFROMREFLECTIONMAP)
#if defined(REALTIME_FILTERING)
vec3 refractionIrradiance=irradiance(reflectionSampler,-irradianceVector,vReflectionFilteringInfo);
vec3 refractionIrradiance=computeEnvironmentIrradiance(-irradianceVector);
#elif defined(USEIRRADIANCEMAP)
#ifdef REFLECTIONMAP_3D
vec3 irradianceCoords=irradianceVector;
vec2 irradianceCoords=irradianceVector.xy;
irradianceCoords/=irradianceVector.z;
irradianceCoords.y=1.0-irradianceCoords.y;
vec4 refractionIrradiance=sampleReflection(irradianceSampler,-irradianceCoords);
refractionIrradiance.rgb=fromRGBD(refractionIrradiance);
#ifdef GAMMAREFLECTION
refractionIrradiance.rgb=toLinearSpace(refractionIrradiance.rgb);
#else
vec4 refractionIrradiance=vec4(0.);
refractionIrradiance.rgb*=transmittance;
refractionIrradiance.rgb*=surfaceAlbedo.rgb;
outParams.refractionIrradiance=refractionIrradiance.rgb;
}
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrBlockSubSurface = { name, shader };
//# sourceMappingURL=pbrBlockSubSurface.js.map