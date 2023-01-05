// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrBlockReflectance";
const shader = `#if defined(ENVIRONMENTBRDF) && !defined(REFLECTIONMAP_SKYBOX)
vec3 specularEnvironmentReflectance=getReflectanceFromBRDFLookup(clearcoatOut.specularEnvironmentR0,specularEnvironmentR90,environmentBrdf);
specularEnvironmentReflectance*=seo;
#ifdef HORIZONOCCLUSION
#ifdef BUMP
#ifdef REFLECTIONMAP_3D
specularEnvironmentReflectance*=eho;
#endif
#endif
#else
vec3 specularEnvironmentReflectance=getReflectanceFromAnalyticalBRDFLookup_Jones(NdotV,clearcoatOut.specularEnvironmentR0,specularEnvironmentR90,sqrt(microSurface));
#ifdef CLEARCOAT
specularEnvironmentReflectance*=clearcoatOut.conservationFactor;
specularEnvironmentReflectance*=clearcoatOut.absorption;
#endif
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrBlockReflectance = { name, shader };
//# sourceMappingURL=pbrBlockReflectance.js.map