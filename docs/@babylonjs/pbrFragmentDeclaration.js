// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrFragmentDeclaration";
const shader = `uniform vec4 vEyePosition;
uniform vec2 vAlbedoInfos;
#ifdef AMBIENT
uniform vec4 vAmbientInfos;
#ifdef BUMP
uniform vec3 vBumpInfos;
#ifdef OPACITY
uniform vec2 vOpacityInfos;
#ifdef EMISSIVE
uniform vec2 vEmissiveInfos;
#ifdef LIGHTMAP
uniform vec2 vLightmapInfos;
#ifdef REFLECTIVITY
uniform vec3 vReflectivityInfos;
#ifdef MICROSURFACEMAP
uniform vec2 vMicroSurfaceSamplerInfos;
#if defined(REFLECTIONMAP_SPHERICAL) || defined(REFLECTIONMAP_PROJECTION) || defined(SS_REFRACTION) || defined(PREPASS)
uniform mat4 view;
#ifdef REFLECTION
uniform vec2 vReflectionInfos;
uniform vec2 vReflectionFilteringInfo;
uniform mat4 reflectionMatrix;
uniform vec3 vReflectionPosition;
#endif
#if defined(SS_REFRACTION) && defined(SS_USE_LOCAL_REFRACTIONMAP_CUBIC)
uniform vec3 vRefractionPosition;
#ifdef CLEARCOAT
uniform vec2 vClearCoatParams;
uniform vec4 vClearCoatInfos;
#ifdef CLEARCOAT_TEXTURE
uniform mat4 clearCoatMatrix;
#ifdef CLEARCOAT_TEXTURE_ROUGHNESS
uniform mat4 clearCoatRoughnessMatrix;
#ifdef CLEARCOAT_BUMP
uniform vec2 vClearCoatBumpInfos;
#ifdef CLEARCOAT_TINT
uniform vec4 vClearCoatTintParams;
uniform vec2 vClearCoatTintInfos;
#endif
#endif
#ifdef IRIDESCENCE
uniform vec4 vIridescenceParams;
uniform vec4 vIridescenceInfos;
#ifdef IRIDESCENCE_TEXTURE
uniform mat4 iridescenceMatrix;
#ifdef IRIDESCENCE_THICKNESS_TEXTURE
uniform mat4 iridescenceThicknessMatrix;
#endif
#ifdef ANISOTROPIC
uniform vec3 vAnisotropy;
uniform vec2 vAnisotropyInfos;
#endif
#ifdef SHEEN
uniform vec4 vSheenColor;
uniform float vSheenRoughness;
#if defined(SHEEN_TEXTURE) || defined(SHEEN_TEXTURE_ROUGHNESS)
uniform vec4 vSheenInfos;
#ifdef SHEEN_TEXTURE
uniform mat4 sheenMatrix;
#ifdef SHEEN_TEXTURE_ROUGHNESS
uniform mat4 sheenRoughnessMatrix;
#endif
#ifdef SUBSURFACE
#ifdef SS_REFRACTION
uniform vec4 vRefractionMicrosurfaceInfos;
uniform vec2 vRefractionFilteringInfo;
#endif
#ifdef SS_THICKNESSANDMASK_TEXTURE
uniform vec2 vThicknessInfos;
#ifdef SS_REFRACTIONINTENSITY_TEXTURE
uniform vec2 vRefractionIntensityInfos;
#ifdef SS_TRANSLUCENCYINTENSITY_TEXTURE
uniform vec2 vTranslucencyIntensityInfos;
uniform vec2 vThicknessParam;
#ifdef PREPASS
#ifdef SS_SCATTERING
uniform float scatteringDiffusionProfile;
#endif
#if DEBUGMODE>0
uniform vec2 vDebugMode;
#ifdef DETAIL
uniform vec4 vDetailInfos;
#ifdef USESPHERICALFROMREFLECTIONMAP
#ifdef SPHERICAL_HARMONICS
uniform vec3 vSphericalL00;
uniform vec3 vSphericalX;
#endif
#define ADDITIONAL_FRAGMENT_DECLARATION
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrFragmentDeclaration = { name, shader };
//# sourceMappingURL=pbrFragmentDeclaration.js.map