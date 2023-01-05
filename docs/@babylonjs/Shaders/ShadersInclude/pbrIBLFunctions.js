// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrIBLFunctions";
const shader = `#if defined(REFLECTION) || defined(SS_REFRACTION)
float getLodFromAlphaG(float cubeMapDimensionPixels,float microsurfaceAverageSlope) {
#if defined(ENVIRONMENTBRDF) && defined(RADIANCEOCCLUSION)
float environmentRadianceOcclusion(float ambientOcclusion,float NdotVUnclamped) {
#if defined(ENVIRONMENTBRDF) && defined(HORIZONOCCLUSION)
float environmentHorizonOcclusion(vec3 view,vec3 normal,vec3 geometricNormal) {
#if defined(LODINREFLECTIONALPHA) || defined(SS_LODINREFRACTIONALPHA)
#define UNPACK_LOD(x) (1.0-x)*255.0
float getLodFromAlphaG(float cubeMapDimensionPixels,float alphaG,float NdotV) {
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrIBLFunctions = { name, shader };
//# sourceMappingURL=pbrIBLFunctions.js.map