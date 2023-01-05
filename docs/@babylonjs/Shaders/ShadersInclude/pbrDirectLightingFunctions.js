// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrDirectLightingFunctions";
const shader = `#define CLEARCOATREFLECTANCE90 1.0
struct lightingInfo
vec3 specular;
#ifdef CLEARCOAT
vec4 clearCoat;
#ifdef SHEEN
vec3 sheen;
};
float lightRoughness=lightRadius/lightDistance;
return roughness;
}
vec3 computeProjectionTextureDiffuseLighting(sampler2D projectionLightSampler,mat4 textureProjectionMatrix){
vec3 computeDiffuseAndTransmittedLighting(preLightingInfo info,vec3 lightColor,vec3 transmittance) {
#ifdef SPECULARTERM
vec3 computeSpecularLighting(preLightingInfo info,vec3 N,vec3 reflectance0,vec3 reflectance90,float geometricRoughnessFactor,vec3 lightColor) {
fresnel=mix(fresnel,reflectance0,info.iridescenceIntensity);
float distribution=normalDistributionFunction_TrowbridgeReitzGGX(NdotH,alphaG);
float smithVisibility=smithVisibility_GGXCorrelated(info.NdotL,info.NdotV,alphaG);
float smithVisibility=smithVisibility_TrowbridgeReitzGGXFast(info.NdotL,info.NdotV,alphaG);
vec3 specTerm=fresnel*distribution*smithVisibility;
#ifdef ANISOTROPIC
vec3 computeAnisotropicSpecularLighting(preLightingInfo info,vec3 V,vec3 N,vec3 T,vec3 B,float anisotropy,vec3 reflectance0,vec3 reflectance90,float geometricRoughnessFactor,vec3 lightColor) {
fresnel=mix(fresnel,reflectance0,info.iridescenceIntensity);
float distribution=normalDistributionFunction_BurleyGGX_Anisotropic(NdotH,TdotH,BdotH,alphaTB);
#ifdef CLEARCOAT
vec4 computeClearCoatLighting(preLightingInfo info,vec3 Ncc,float geometricRoughnessFactor,float clearCoatIntensity,vec3 lightColor) {
#ifdef SHEEN
vec3 computeSheenLighting(preLightingInfo info,vec3 N,vec3 reflectance0,vec3 reflectance90,float geometricRoughnessFactor,vec3 lightColor) {
float visibility=visibility_Ashikhmin(info.NdotL,info.NdotV);
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrDirectLightingFunctions = { name, shader };
//# sourceMappingURL=pbrDirectLightingFunctions.js.map