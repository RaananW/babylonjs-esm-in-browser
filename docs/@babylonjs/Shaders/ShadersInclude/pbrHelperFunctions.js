// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrHelperFunctions";
const shader = `#define RECIPROCAL_PI2 0.15915494
#define RECIPROCAL_PI 0.31830988618
#define MINIMUMVARIANCE 0.0005
float convertRoughnessToAverageSlope(float roughness)
vec3 nDfdx=dFdx(normalVector.xyz);
return vec2(0.);
}
vec2 getAnisotropicRoughness(float alphaG,float anisotropy) {
#if defined(CLEARCOAT) || defined(SS_REFRACTION)
vec3 cocaLambert(vec3 alpha,float distance) {
#ifdef MICROSURFACEAUTOMATIC
float computeDefaultMicroSurface(float microSurface,vec3 reflectivityColor)
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrHelperFunctions = { name, shader };
//# sourceMappingURL=pbrHelperFunctions.js.map