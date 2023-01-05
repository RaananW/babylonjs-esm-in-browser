// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrBlockSheen";
const shader = `#ifdef SHEEN
struct sheenOutParams
vec3 surfaceAlbedo;
#if defined(ENVIRONMENTBRDF) && defined(SHEEN_ALBEDOSCALING)
float sheenAlbedoScaling;
#if defined(REFLECTION) && defined(ENVIRONMENTBRDF)
vec3 finalSheenRadianceScaled;
#if DEBUGMODE>0
vec4 sheenMapData;
};
#define inline
void sheenBlock(
in float vSheenRoughness,
in vec4 sheenMapRoughnessData,
#endif
in float roughness,
in vec4 sheenMapData,
in float reflectance,
in vec3 baseColor,
#ifdef ENVIRONMENTBRDF
in float NdotV,
#if defined(REFLECTION) && defined(ENVIRONMENTBRDF)
in vec2 AARoughnessFactors,
in samplerCube reflectionSampler,
in sampler2D reflectionSampler,
in float NdotVUnclamped,
#ifdef REFLECTIONMAP_3D
in samplerCube reflectionSamplerLow,
in sampler2D reflectionSamplerLow,
#endif
#ifdef REALTIME_FILTERING
in vec2 vReflectionFilteringInfo,
#if !defined(REFLECTIONMAP_SKYBOX) && defined(RADIANCEOCCLUSION)
in float seo,
#if !defined(REFLECTIONMAP_SKYBOX) && defined(HORIZONOCCLUSION) && defined(BUMP) && defined(REFLECTIONMAP_3D)
in float eho,
#endif
out sheenOutParams outParams
#if DEBUGMODE>0
outParams.sheenMapData=sheenMapData;
#endif
#ifdef SHEEN_LINKWITHALBEDO
float sheenFactor=pow5(1.0-sheenIntensity);
sheenIntensity*=sheenMapData.a;
#else
vec3 sheenColor=vSheenColor.rgb;
#ifdef SHEEN_GAMMATEXTURE
sheenColor.rgb*=toLinearSpace(sheenMapData.rgb);
sheenColor.rgb*=sheenMapData.rgb;
sheenColor.rgb*=sheenMapLevel;
#ifdef SHEEN_ROUGHNESS
float sheenRoughness=vSheenRoughness;
#if defined(SHEEN_TEXTURE)
sheenRoughness*=sheenMapData.a;
#elif defined(SHEEN_TEXTURE_ROUGHNESS)
#ifdef SHEEN_TEXTURE_ROUGHNESS_IDENTICAL
sheenRoughness*=sheenMapData.a;
sheenRoughness*=sheenMapRoughnessData.a;
#endif
#else
float sheenRoughness=roughness;
sheenIntensity*=sheenMapData.a;
#endif
#if !defined(SHEEN_ALBEDOSCALING)
sheenIntensity*=(1.-reflectance);
sheenColor*=sheenIntensity;
#ifdef ENVIRONMENTBRDF
/*#ifdef SHEEN_SOFTER
#ifdef SHEEN_ROUGHNESS
vec3 environmentSheenBrdf=getBRDFLookup(NdotV,sheenRoughness);
vec3 environmentSheenBrdf=environmentBrdf;
/*#endif*/
#if defined(REFLECTION) && defined(ENVIRONMENTBRDF)
float sheenAlphaG=convertRoughnessToAverageSlope(sheenRoughness);
sheenAlphaG+=AARoughnessFactors.y;
vec4 environmentSheenRadiance=vec4(0.,0.,0.,0.);
NdotVUnclamped,
#ifdef LINEARSPECULARREFLECTION
sheenRoughness,
reflectionSampler,
reflectionSamplerLow,
#ifdef REALTIME_FILTERING
vReflectionFilteringInfo,
environmentSheenRadiance
sheenEnvironmentReflectance*=seo;
#if !defined(REFLECTIONMAP_SKYBOX) && defined(HORIZONOCCLUSION) && defined(BUMP) && defined(REFLECTIONMAP_3D)
sheenEnvironmentReflectance*=eho;
#if DEBUGMODE>0
outParams.sheenEnvironmentReflectance=sheenEnvironmentReflectance;
outParams.finalSheenRadianceScaled=
#if defined(ENVIRONMENTBRDF) && defined(SHEEN_ALBEDOSCALING)
outParams.sheenAlbedoScaling=1.0-sheenIntensity*max(max(sheenColor.r,sheenColor.g),sheenColor.b)*environmentSheenBrdf.b;
outParams.sheenIntensity=sheenIntensity;
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrBlockSheen = { name, shader };
//# sourceMappingURL=pbrBlockSheen.js.map