// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrBRDFFunctions";
const shader = `#define FRESNEL_MAXIMUM_ON_ROUGH 0.25
#ifdef MS_BRDF_ENERGY_CONSERVATION
vec3 getEnergyConservationFactor(const vec3 specularEnvironmentR0,const vec3 environmentBrdf) {
#ifdef ENVIRONMENTBRDF
vec3 getBRDFLookup(float NdotV,float perceptualRoughness) {
brdfLookup.rgb=fromRGBD(brdfLookup.rgba);
return brdfLookup.rgb;
vec3 reflectance=(specularEnvironmentR90-specularEnvironmentR0)*environmentBrdf.x+specularEnvironmentR0*environmentBrdf.y;
vec3 reflectance=specularEnvironmentR0*environmentBrdf.x+specularEnvironmentR90*environmentBrdf.y;
return reflectance;
vec3 reflectance=mix(environmentBrdf.xxx,environmentBrdf.yyy,specularEnvironmentR0);
vec3 reflectance=specularEnvironmentR0*environmentBrdf.x+environmentBrdf.y;
return reflectance;
/* NOT USED
float getBRDFLookupCharlieSheen(float NdotV,float perceptualRoughness)
*/
vec3 getReflectanceFromAnalyticalBRDFLookup_Jones(float VdotN,vec3 reflectance0,vec3 reflectance90,float smoothness)
#if defined(SHEEN) && defined(ENVIRONMENTBRDF)
/**
vec3 fresnelSchlickGGX(float VdotH,vec3 reflectance0,vec3 reflectance90)
vec3 getR0RemappedForClearCoat(vec3 f0) {
#ifdef MOBILE
return saturate(f0*(f0*0.526868+0.529324)-0.0482256);
return saturate(f0*(f0*(0.941892-0.263008*f0)+0.346479)-0.0285998);
#else
vec3 s=sqrt(f0);
}
#ifdef IRIDESCENCE
const mat3 XYZ_TO_REC709=mat3(
float normalDistributionFunction_TrowbridgeReitzGGX(float NdotH,float alphaG)
float normalDistributionFunction_CharlieSheen(float NdotH,float alphaG)
#ifdef ANISOTROPIC
float normalDistributionFunction_BurleyGGX_Anisotropic(float NdotH,float TdotH,float BdotH,const vec2 alphaTB) {
#ifdef BRDF_V_HEIGHT_CORRELATED
float smithVisibility_GGXCorrelated(float NdotL,float NdotV,float alphaG) {
float GGXV=NdotL*(NdotV*(1.0-alphaG)+alphaG);
float a2=alphaG*alphaG;
}
float smithVisibilityG1_TrowbridgeReitzGGXFast(float dot,float alphaG)
return 1.0/(dot+alphaG+(1.0-alphaG)*dot ));
float alphaSquared=alphaG*alphaG;
}
#ifdef ANISOTROPIC
float smithVisibility_GGXCorrelated_Anisotropic(float NdotL,float NdotV,float TdotV,float BdotV,float TdotL,float BdotL,const vec2 alphaTB) {
#ifdef CLEARCOAT
float visibility_Kelemen(float VdotH) {
#ifdef SHEEN
float visibility_Ashikhmin(float NdotL,float NdotV)
float l(float x,float alphaG)
*/
float diffuseBRDF_Burley(float NdotL,float NdotV,float VdotH,float roughness) {
vec3 transmittanceBRDF_Burley(const vec3 tintColor,const vec3 diffusionDistance,float thickness) {
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrBRDFFunctions = { name, shader };
//# sourceMappingURL=pbrBRDFFunctions.js.map