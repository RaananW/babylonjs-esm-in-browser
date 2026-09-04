// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "openpbrDirectLighting";
const shader = `#ifdef LIGHT{X}
{var slab_diffuse: vec3f=vec3f(0.f,0.f,0.f);var slab_translucent: vec3f=vec3f(0.f,0.f,0.f);var slab_glossy: vec3f=vec3f(0.f,0.f,0.f);var specularFresnel: f32=0.0f;var specularColoredFresnel: vec3f=vec3f(0.f,0.f,0.f);var slab_metal: vec3f=vec3f(0.f,0.f,0.f);var slab_coat: vec3f=vec3f(0.f,0.f,0.f);var coatFresnel: f32=0.0f;var slab_fuzz: vec3f=vec3f(0.f,0.f,0.f);var fuzzFresnel: f32=0.0f;
#ifdef HEMILIGHT{X}
slab_diffuse=computeHemisphericDiffuseLighting(preInfo{X},lightColor{X}.rgb,light{X}.vLightGround);
#elif defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
slab_diffuse=computeAreaDiffuseLighting(preInfo{X},lightColor{X}.rgb);
#else
slab_diffuse=computeDiffuseLighting(preInfo{X},lightColor{X}.rgb);
#endif
#ifdef PROJECTEDLIGHTTEXTURE{X}
slab_diffuse*=computeProjectionTextureDiffuseLighting(projectionLightTexture{X},textureProjectionMatrix{X},fragmentInputs.vPositionW);
#endif
#ifdef FUZZ
let fuzzNdotH: f32=max(dot(fuzzNormalW,preInfo{X}.H),0.0f);let fuzzBrdf: vec3f=getFuzzBRDFLookup(fuzzNdotH,sqrt(fuzz_roughness));
#endif
#ifdef THIN_FILM
let thin_film_desaturation_scale: f32=(thin_film_ior-1.0f)*sqrt(thin_film_thickness*0.001f);
#endif
#if defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
slab_glossy=computeOpenPBRAreaSpecularLighting(
preInfo{X},
light{X}.vLightSpecular.rgb,
baseDielectricReflectance.coloredF0,
baseDielectricReflectance.coloredF90
);specularFresnel=computeOpenPBRAreaFresnel(preInfo{X},baseDielectricReflectance.F0,baseDielectricReflectance.F90);
#else
{
#ifdef ANISOTROPIC_BASE
slab_glossy=computeAnisotropicSpecularLighting(preInfo{X},viewDirectionW,normalW,
baseGeoInfo.anisotropicTangent,baseGeoInfo.anisotropicBitangent,baseGeoInfo.anisotropy,
0.0f,lightColor{X}.rgb);
#else
slab_glossy=computeSpecularLighting(preInfo{X},normalW,vec3(1.0),vec3(1.0),specular_roughness,lightColor{X}.rgb);
#endif
specularFresnel=fresnelSchlickGGX(preInfo{X}.VdotH,baseDielectricReflectance.F0,baseDielectricReflectance.F90);specularColoredFresnel=specularFresnel*specular_color;
#ifdef THIN_FILM
var thinFilmDielectricFresnel: vec3f=evalIridescence(thin_film_outside_ior,thin_film_ior,preInfo{X}.VdotH,thin_film_thickness,vec3f(baseDielectricReflectance.F0));thinFilmDielectricFresnel=mix(thinFilmDielectricFresnel,vec3f(dot(thinFilmDielectricFresnel,vec3f(0.3333f))),thin_film_desaturation_scale);specularColoredFresnel=mix(specularColoredFresnel,thinFilmDielectricFresnel*specular_color,thin_film_weight*thin_film_ior_scale);
#endif
}
#endif
#ifdef REFRACTED_LIGHTS
var forwardScatteredLight: vec3f=vec3f(0.0f);
#if AREALIGHT{X}
#else
{var preInfoTrans=preInfo{X};
#ifdef SCATTERING
preInfoTrans.roughness=sqrt(sqrt(max(transmission_roughness_alpha,0.05f)));
#else
preInfoTrans.roughness=transmission_roughness;
#endif
if (preInfoTrans.NdotLUnclamped<=0.0) {specularFresnel=0.0;specularColoredFresnel=specularFresnel*specular_color;}
#ifdef GEOMETRY_THIN_WALLED
let refractNormalW: vec3f=viewDirectionW;
#else
let refractNormalW: vec3f=normalW;
#endif
preInfoTrans.NdotL=0.5f*max(dot(-refractNormalW,preInfoTrans.L),0.0f)+0.5f;
#if defined(DISPERSION) && !defined(GEOMETRY_THIN_WALLED)
var dispersion_iors_local: vec3f=dispersion_iors;let diff: f32=min(dispersion_iors_local[2]-dispersion_iors_local[0],max(dispersion_iors_local[0]-1.0f,1.0f));dispersion_iors_local[2]+=diff;dispersion_iors_local[0]-=diff;for (var i: i32=0; i<3; i++) {let eta: f32=1.0f/dispersion_iors_local[i];
#elif defined(GEOMETRY_THIN_WALLED)
let eta: f32=1.0f;
#else
let eta: f32=1.0f/specular_ior;
#endif
preInfoTrans.H=preInfoTrans.L+min(eta,0.95f)*viewDirectionW;let len2: f32=dot(preInfoTrans.H,preInfoTrans.H);if (len2<1e-6f) {preInfoTrans.H=preInfoTrans.L;} else {preInfoTrans.H=preInfoTrans.H*inverseSqrt(len2);}
#ifdef ANISOTROPIC_BASE
preInfoTrans.H=-preInfoTrans.H;
#endif
preInfoTrans.VdotH=dot(viewDirectionW,preInfoTrans.H);
#if defined(DISPERSION) && !defined(GEOMETRY_THIN_WALLED)
forwardScatteredLight[i]+=
#else
forwardScatteredLight+=
#endif
#if defined(ANISOTROPIC_BASE)
computeAnisotropicSpecularLighting(preInfoTrans,viewDirectionW,refractNormalW,
baseGeoInfo.anisotropicTangent,baseGeoInfo.anisotropicBitangent,baseGeoInfo.anisotropy,
transmission_roughness_alpha,lightColor{X}.rgb
#else
computeSpecularLighting(preInfoTrans,-refractNormalW,vec3f(1.0f),vec3f(1.0f),transmission_roughness_alpha,lightColor{X}.rgb
#endif
#if defined(DISPERSION) && !defined(GEOMETRY_THIN_WALLED)
)[i];}
#else
);
#endif
#if !defined(GEOMETRY_THIN_WALLED)
forwardScatteredLight=mix(forwardScatteredLight,0.25f*preInfoTrans.attenuation*lightColor{X}.rgb,clamp(1.0f-pow(baseGeoInfo.NdotV,transmission_roughness_alpha),0.0f,1.0f));
#endif
#ifdef REFRACTED_BACKGROUND
#ifdef GEOMETRY_THIN_WALLED
forwardScatteredLight=mix(vec3f(0.0f),forwardScatteredLight.rgb,0.2*transmission_roughness_alpha);
#else
forwardScatteredLight=max(vec3f(0.0f),mix(vec3f(0.0f),forwardScatteredLight,transmission_roughness_alpha));
#endif
#endif
#ifdef SCATTERING
#if !defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING) || defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING_GBUFFER)
preInfoTrans.roughness=1.0f;let diffused_forward_scattered_light: vec3f=computeSpecularLighting(preInfoTrans,normalW,vec3f(1.0f),vec3f(1.0f),1.0f,lightColor{X}.rgb)*volume_absorption;
#endif
#ifdef GEOMETRY_THIN_WALLED
let forward_scattered_light: vec3f=forwardScatteredLight*transmission_tint*volumeParams.multi_scatter_color;let back_scattered_light: vec3f=slab_diffuse*volumeParams.multi_scatter_color;slab_translucent=mix(back_scattered_light,forward_scattered_light,0.5f+0.5f*volumeParams.anisotropy);
#else
let back_scattered_normal: vec3f=normalize(normalW+viewDirectionW);preInfoTrans.NdotL=max(dot(back_scattered_normal,preInfoTrans.L),0.0f);preInfoTrans.NdotV=dot(back_scattered_normal,viewDirectionW);preInfoTrans.H=normalize(viewDirectionW+preInfoTrans.L);preInfoTrans.VdotH=clamp(dot(viewDirectionW,preInfoTrans.H),0.0f,1.0f);preInfoTrans.roughness=0.2f;let back_scattered_light: vec3f=computeSpecularLighting(preInfoTrans,viewDirectionW,vec3f(1.0f),vec3f(0.08f),0.0f,lightColor{X}.rgb);let forward_scattered_light: vec3f=(forwardScatteredLight*volume_absorption);let iso_scattered_light: vec3f=slab_diffuse;let back_scattering: vec3f=mix(forward_scattered_light,forward_scattered_light+back_scattered_light*backscatter_color,iso_scatter_density);
#if defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING) && !defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING_GBUFFER)
let iso_scattering: vec3f=mix(forward_scattered_light,scattered_light_from_irradiance_texture*volumeParams.multi_scatter_color,iso_scatter_density);
#else
let iso_scattering: vec3f=mix(forward_scattered_light,(diffused_forward_scattered_light+iso_scattered_light)*volumeParams.multi_scatter_color,iso_scatter_density);
#endif
slab_translucent=mix(back_scattering,iso_scattering,back_to_iso_scattering_blend);slab_translucent=mix(slab_translucent,forward_scattered_light,iso_to_forward_scattering_blend)*transmission_tint;
#endif
#else
slab_translucent=forwardScatteredLight*transmission_tint*volume_absorption;
#endif
}
#endif
#endif
#if defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
#if CONDUCTOR_SPECULAR_MODEL==CONDUCTOR_SPECULAR_MODEL_OPENPBR
slab_metal=computeOpenPBRAreaConductorSpecularLighting(
preInfo{X},
light{X}.vLightSpecular.rgb,
baseConductorReflectance.coloredF0,
baseConductorReflectance.coloredF90
);
#else
slab_metal=computeOpenPBRAreaSpecularLighting(
preInfo{X},
light{X}.vLightSpecular.rgb,
baseConductorReflectance.coloredF0,
baseConductorReflectance.coloredF90
);
#endif
#else
{
#if (CONDUCTOR_SPECULAR_MODEL==CONDUCTOR_SPECULAR_MODEL_OPENPBR)
var coloredFresnel: vec3f=getF82Specular(preInfo{X}.VdotH,baseConductorReflectance.coloredF0,baseConductorReflectance.coloredF90,specular_roughness);
#else
var coloredFresnel: vec3f=fresnelSchlickGGX(preInfo{X}.VdotH,baseConductorReflectance.coloredF0,baseConductorReflectance.coloredF90);
#endif
#ifdef THIN_FILM
let thinFilmConductorAngle: f32=max(preInfo{X}.VdotH,specular_roughness);var thinFilmConductorFresnel: vec3f=evalIridescence(thin_film_outside_ior,thin_film_ior,thinFilmConductorAngle,thin_film_thickness,baseConductorReflectance.coloredF0);thinFilmConductorFresnel=mix(thinFilmConductorFresnel,vec3f(dot(thinFilmConductorFresnel,vec3f(0.3333f))),thin_film_desaturation_scale);coloredFresnel=mix(coloredFresnel,specular_weight*thinFilmConductorFresnel,thin_film_weight*thin_film_ior_scale);
#endif
#ifdef ANISOTROPIC_BASE
slab_metal=computeAnisotropicSpecularLighting(preInfo{X},viewDirectionW,normalW,baseGeoInfo.anisotropicTangent,baseGeoInfo.anisotropicBitangent,baseGeoInfo.anisotropy,0.0,lightColor{X}.rgb);
#else
slab_metal=computeSpecularLighting(preInfo{X},normalW,vec3f(1.0f),coloredFresnel,specular_roughness,lightColor{X}.rgb);
#endif
}
#endif
#if defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
slab_coat=computeOpenPBRAreaSpecularLighting(
preInfoCoat{X},
light{X}.vLightSpecular.rgb,
vec3f(coatReflectance.F0),
vec3f(coatReflectance.F90)
);
#else
{
#ifdef ANISOTROPIC_COAT
slab_coat=computeAnisotropicSpecularLighting(preInfoCoat{X},viewDirectionW,coatNormalW,
coatGeoInfo.anisotropicTangent,coatGeoInfo.anisotropicBitangent,coatGeoInfo.anisotropy,0.0,
lightColor{X}.rgb);
#else
slab_coat=computeSpecularLighting(preInfoCoat{X},coatNormalW,vec3f(coatReflectance.F0),vec3f(1.0f),coat_roughness,lightColor{X}.rgb);
#endif
let NdotH: f32=saturateEps(dot(coatNormalW,preInfoCoat{X}.H));coatFresnel=fresnelSchlickGGX(NdotH,coatReflectance.F0,coatReflectance.F90);}
#endif
var coatAbsorption=vec3f(1.0f);if (coat_weight>0.0) {let cosTheta_view: f32=max(preInfoCoat{X}.NdotV,0.001f);let cosTheta_light: f32=max(preInfoCoat{X}.NdotL,0.001f);let fresnel_view: f32=coatReflectance.F0+(1.0f-coatReflectance.F0)*pow(1.0f-cosTheta_view,5.0);let fresnel_light: f32=coatReflectance.F0+(1.0f-coatReflectance.F0)*pow(1.0f-cosTheta_light,5.0);let averageReflectance: f32=(fresnel_view+fresnel_light)*0.5;var darkened_transmission: f32=(1.0f-averageReflectance)/(1.0f+averageReflectance);darkened_transmission=mix(1.0f,darkened_transmission,coat_darkening);var sin2: f32=1.0f-coatGeoInfo.NdotV*coatGeoInfo.NdotV;sin2=sin2/(coat_ior*coat_ior)*coat_weight;let cos_t: f32=sqrt(1.0f-sin2);let coatPathLength=1.0f/cos_t;let effectivePathLength=coatPathLength*coat_weight;let colored_transmission: vec3f=pow(coat_color,vec3f(effectivePathLength));coatAbsorption=colored_transmission*mix(1.0f,darkened_transmission,coat_weight);}
#ifdef FUZZ
fuzzFresnel=fuzzBrdf.z;let fuzzNormalW=mix(normalW,coatNormalW,coat_weight);let fuzzNdotV: f32=max(dot(fuzzNormalW,viewDirectionW.xyz),0.0f);let fuzzNdotL: f32=max(dot(fuzzNormalW,preInfo{X}.L),0.0);slab_fuzz=lightColor{X}.rgb*preInfo{X}.attenuation*evalFuzz(preInfo{X}.L,fuzzNdotL,fuzzNdotV,fuzzTangent,fuzzBitangent,fuzzBrdf);
#else
let fuzz_color=vec3f(0.0);
#endif
#ifdef PREPASS_IRRADIANCE
total_direct_diffuse+=slab_diffuse;
#endif
let material_dielectric_base: vec3f=mix(slab_diffuse*base_color.rgb,slab_translucent,surface_translucency_weight);
#if defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
let material_dielectric_gloss: vec3f=material_dielectric_base*(1.0f-specularFresnel)+slab_glossy;
#else
let material_dielectric_gloss: vec3f=material_dielectric_base*(1.0f-specularFresnel)+slab_glossy*specularColoredFresnel;
#endif
let material_base_substrate: vec3f=mix(material_dielectric_gloss,slab_metal,base_metalness);let material_coated_base: vec3f=layer(material_base_substrate,slab_coat,coatFresnel,coatAbsorption,vec3f(1.0f));material_surface_direct+=layer(material_coated_base,slab_fuzz,fuzzFresnel*fuzz_weight,vec3f(1.0f),fuzz_color);}
#endif
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStoreWGSL[name]) {
    ShaderStore.IncludesShadersStoreWGSL[name] = shader;
}
/** @internal */
export const openpbrDirectLightingWGSL = { name, shader };
//# sourceMappingURL=openpbrDirectLighting.js.map