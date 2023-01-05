// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrBlockReflectivity";
const shader = `struct reflectivityOutParams
vec3 surfaceAlbedo;
#if defined(METALLICWORKFLOW) && defined(REFLECTIVITY) && defined(AOSTOREINMETALMAPRED)
vec3 ambientOcclusionColor;
#if DEBUGMODE>0
vec4 surfaceMetallicColorMap;
};
void reflectivityBlock(
in vec3 surfaceAlbedo,
#ifdef REFLECTIVITY
in vec3 reflectivityInfos,
#if defined(METALLICWORKFLOW) && defined(REFLECTIVITY) && defined(AOSTOREINMETALMAPRED)
in vec3 ambientOcclusionColorIn,
#ifdef MICROSURFACEMAP
in vec4 microSurfaceTexel,
#ifdef DETAIL
in vec4 detailColor,
out reflectivityOutParams outParams
vec2 metallicRoughness=surfaceReflectivityColor.rg;
#if DEBUGMODE>0
outParams.surfaceMetallicColorMap=surfaceMetallicOrReflectivityColorMap;
#ifdef AOSTOREINMETALMAPRED
vec3 aoStoreInMetalMap=vec3(surfaceMetallicOrReflectivityColorMap.r,surfaceMetallicOrReflectivityColorMap.r,surfaceMetallicOrReflectivityColorMap.r);
#ifdef METALLNESSSTOREINMETALMAPBLUE
metallicRoughness.r*=surfaceMetallicOrReflectivityColorMap.b;
metallicRoughness.r*=surfaceMetallicOrReflectivityColorMap.r;
#ifdef ROUGHNESSSTOREINMETALMAPALPHA
metallicRoughness.g*=surfaceMetallicOrReflectivityColorMap.a;
#ifdef ROUGHNESSSTOREINMETALMAPGREEN
metallicRoughness.g*=surfaceMetallicOrReflectivityColorMap.g;
#endif
#endif
#ifdef DETAIL
float detailRoughness=mix(0.5,detailColor.b,vDetailInfos.w);
#ifdef MICROSURFACEMAP
metallicRoughness.g*=microSurfaceTexel.r;
#if DEBUGMODE>0
outParams.metallicRoughness=metallicRoughness;
#define CUSTOM_FRAGMENT_UPDATE_METALLICROUGHNESS
microSurface=1.0-metallicRoughness.g;
outParams.surfaceAlbedo=baseColor.rgb*(1.0-metallicRoughness.r);
vec3 metallicF0=metallicReflectanceFactors.rgb;
outParams.metallicF0=metallicF0;
outParams.surfaceAlbedo=mix(baseColor.rgb*(1.0-metallicF0),vec3(0.,0.,0.),metallicRoughness.r);
#else
#ifdef REFLECTIVITY
surfaceReflectivityColor*=surfaceMetallicOrReflectivityColorMap.rgb;
outParams.surfaceReflectivityColorMap=surfaceMetallicOrReflectivityColorMap;
#ifdef MICROSURFACEFROMREFLECTIVITYMAP
microSurface*=surfaceMetallicOrReflectivityColorMap.a;
#ifdef MICROSURFACEAUTOMATIC
microSurface*=computeDefaultMicroSurface(microSurface,surfaceReflectivityColor);
#ifdef MICROSURFACEMAP
microSurface*=microSurfaceTexel.r;
#define CUSTOM_FRAGMENT_UPDATE_MICROSURFACE
#endif
#endif
#endif
microSurface=saturate(microSurface);
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrBlockReflectivity = { name, shader };
//# sourceMappingURL=pbrBlockReflectivity.js.map