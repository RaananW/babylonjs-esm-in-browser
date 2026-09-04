// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "openpbrDirectLighting";
const shader = `#ifdef LIGHT{X}
{vec3 slab_diffuse=vec3(0.,0.,0.);vec3 slab_translucent=vec3(0.,0.,0.);vec3 slab_glossy=vec3(0.,0.,0.);float specularFresnel=0.0;vec3 specularColoredFresnel=vec3(0.,0.,0.);vec3 slab_metal=vec3(0.,0.,0.);vec3 slab_coat=vec3(0.,0.,0.);float coatFresnel=0.0;vec3 slab_fuzz=vec3(0.,0.,0.);float fuzzFresnel=0.0;
#ifdef HEMILIGHT{X}
slab_diffuse=computeHemisphericDiffuseLighting(preInfo{X},lightColor{X}.rgb,light{X}.vLightGround);
#elif defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
slab_diffuse=computeAreaDiffuseLighting(preInfo{X},lightColor{X}.rgb);
#else
slab_diffuse=computeDiffuseLighting(preInfo{X},lightColor{X}.rgb);
#endif
#ifdef PROJECTEDLIGHTTEXTURE{X}
slab_diffuse*=computeProjectionTextureDiffuseLighting(projectionLightTexture{X},textureProjectionMatrix{X},vPositionW);
#endif
#ifdef FUZZ
float fuzzNdotH=max(dot(fuzzNormalW,preInfo{X}.H),0.0);vec3 fuzzBrdf=getFuzzBRDFLookup(fuzzNdotH,sqrt(fuzz_roughness));
#endif
#ifdef THIN_FILM
float thin_film_desaturation_scale=(thin_film_ior-1.0)*sqrt(thin_film_thickness*0.001);
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
0.0,lightColor{X}.rgb);
#else
slab_glossy=computeSpecularLighting(preInfo{X},normalW,vec3(1.0),vec3(1.0),specular_roughness,lightColor{X}.rgb);
#endif
specularFresnel=fresnelSchlickGGX(preInfo{X}.VdotH,baseDielectricReflectance.F0,baseDielectricReflectance.F90);specularColoredFresnel=specularFresnel*specular_color;
#ifdef THIN_FILM
vec3 thinFilmDielectricFresnel=evalIridescence(thin_film_outside_ior,thin_film_ior,preInfo{X}.VdotH,thin_film_thickness,vec3(baseDielectricReflectance.F0));thinFilmDielectricFresnel=mix(thinFilmDielectricFresnel,vec3(dot(thinFilmDielectricFresnel,vec3(0.3333))),thin_film_desaturation_scale);specularColoredFresnel=mix(specularColoredFresnel,thinFilmDielectricFresnel*specular_color,thin_film_weight*thin_film_ior_scale);
#endif
}
#endif
#ifdef REFRACTED_LIGHTS
vec3 forwardScatteredLight=vec3(0.0);
#if AREALIGHT{X}
#else
{preLightingInfo preInfoTrans=preInfo{X};
#ifdef SCATTERING
preInfoTrans.roughness=sqrt(sqrt(max(transmission_roughness_alpha,0.05)));
#else
preInfoTrans.roughness=transmission_roughness;
#endif
if (preInfoTrans.NdotLUnclamped<=0.0) {specularFresnel=0.0;specularColoredFresnel=specularFresnel*specular_color;}
#ifdef GEOMETRY_THIN_WALLED
vec3 refractNormalW=viewDirectionW;
#else
vec3 refractNormalW=normalW;
#endif
preInfoTrans.NdotL=0.5*max(dot(-refractNormalW,preInfoTrans.L),0.0)+0.5;
#if defined(DISPERSION) && !defined(GEOMETRY_THIN_WALLED)
float diff=min(dispersion_iors[2]-dispersion_iors[0],max(dispersion_iors[0]-1.0,1.0));dispersion_iors[2]+=diff;dispersion_iors[0]-=diff;for (int i=0; i<3; i++) {float eta=1.0/dispersion_iors[i];
#elif defined(GEOMETRY_THIN_WALLED)
float eta=1.0;
#else
float eta=1.0/specular_ior;
#endif
preInfoTrans.H=preInfoTrans.L+min(eta,0.95)*viewDirectionW;float len2=dot(preInfoTrans.H,preInfoTrans.H);if (len2<1e-6) {preInfoTrans.H=preInfoTrans.L;} else {preInfoTrans.H=preInfoTrans.H*inversesqrt(len2);}
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
computeSpecularLighting(preInfoTrans,-refractNormalW,vec3(1.0),vec3(1.0),transmission_roughness_alpha,lightColor{X}.rgb
#endif
#if defined(DISPERSION) && !defined(GEOMETRY_THIN_WALLED)
)[i];}
#else
);
#endif
#if !defined(GEOMETRY_THIN_WALLED)
forwardScatteredLight=mix(forwardScatteredLight,0.25*preInfoTrans.attenuation*lightColor{X}.rgb,clamp(1.0-pow(baseGeoInfo.NdotV,transmission_roughness_alpha),0.0,1.0));
#endif
#ifdef REFRACTED_BACKGROUND
#ifdef GEOMETRY_THIN_WALLED
forwardScatteredLight=mix(vec3(0.0),forwardScatteredLight.rgb,0.2*transmission_roughness_alpha);
#else
forwardScatteredLight=max(vec3(0.0),mix(vec3(0.0),forwardScatteredLight,transmission_roughness_alpha));
#endif
#endif
#ifdef SCATTERING
#if !defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING) || defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING_GBUFFER)
preInfoTrans.roughness=1.0;vec3 diffused_forward_scattered_light=computeSpecularLighting(preInfoTrans,normalW,vec3(1.0),vec3(1.0),1.0,lightColor{X}.rgb)*volume_absorption;
#endif
#ifdef GEOMETRY_THIN_WALLED
vec3 forward_scattered_light=forwardScatteredLight*transmission_tint*volumeParams.multi_scatter_color;vec3 back_scattered_light=slab_diffuse*volumeParams.multi_scatter_color;slab_translucent=mix(back_scattered_light,forward_scattered_light,0.5+0.5*volumeParams.anisotropy);
#else
vec3 back_scattered_normal=normalize(normalW+viewDirectionW);preInfoTrans.NdotL=max(dot(back_scattered_normal,preInfoTrans.L),0.0);preInfoTrans.NdotV=dot(back_scattered_normal,viewDirectionW);preInfoTrans.H=normalize(viewDirectionW+preInfoTrans.L);preInfoTrans.VdotH=clamp(dot(viewDirectionW,preInfoTrans.H),0.0,1.0);preInfoTrans.roughness=0.2;vec3 back_scattered_light=computeSpecularLighting(preInfoTrans,viewDirectionW,vec3(1.0),vec3(0.08),0.0,lightColor{X}.rgb);vec3 forward_scattered_light=(forwardScatteredLight*volume_absorption);vec3 iso_scattered_light=slab_diffuse;vec3 back_scattering=mix(forward_scattered_light,forward_scattered_light+back_scattered_light*backscatter_color,iso_scatter_density);
#if defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING) && !defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING_GBUFFER)
vec3 iso_scattering=mix(forward_scattered_light,scattered_light_from_irradiance_texture*volumeParams.multi_scatter_color,iso_scatter_density);
#else
vec3 iso_scattering=mix(forward_scattered_light,(diffused_forward_scattered_light+iso_scattered_light)*volumeParams.multi_scatter_color,iso_scatter_density);
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
vec3 coloredFresnel=getF82Specular(preInfo{X}.VdotH,baseConductorReflectance.coloredF0,baseConductorReflectance.coloredF90,specular_roughness);
#else
vec3 coloredFresnel=fresnelSchlickGGX(preInfo{X}.VdotH,baseConductorReflectance.coloredF0,baseConductorReflectance.coloredF90);
#endif
#ifdef THIN_FILM
float thinFilmConductorAngle=max(preInfo{X}.VdotH,specular_roughness);vec3 thinFilmConductorFresnel=evalIridescence(thin_film_outside_ior,thin_film_ior,thinFilmConductorAngle,thin_film_thickness,baseConductorReflectance.coloredF0);thinFilmConductorFresnel=mix(thinFilmConductorFresnel,vec3(dot(thinFilmConductorFresnel,vec3(0.3333))),thin_film_desaturation_scale);coloredFresnel=mix(coloredFresnel,specular_weight*thinFilmConductorFresnel,thin_film_weight*thin_film_ior_scale);
#endif
#ifdef ANISOTROPIC_BASE
slab_metal=computeAnisotropicSpecularLighting(preInfo{X},viewDirectionW,normalW,baseGeoInfo.anisotropicTangent,baseGeoInfo.anisotropicBitangent,baseGeoInfo.anisotropy,0.0,lightColor{X}.rgb);
#else
slab_metal=computeSpecularLighting(preInfo{X},normalW,vec3(1.0),coloredFresnel,specular_roughness,lightColor{X}.rgb);
#endif
}
#endif
#if defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
slab_coat=computeOpenPBRAreaSpecularLighting(
preInfoCoat{X},
light{X}.vLightSpecular.rgb,
vec3(coatReflectance.F0),
vec3(coatReflectance.F90)
);
#else
{
#ifdef ANISOTROPIC_COAT
slab_coat=computeAnisotropicSpecularLighting(preInfoCoat{X},viewDirectionW,coatNormalW,
coatGeoInfo.anisotropicTangent,coatGeoInfo.anisotropicBitangent,coatGeoInfo.anisotropy,
0.0,lightColor{X}.rgb);
#else
slab_coat=computeSpecularLighting(preInfoCoat{X},coatNormalW,vec3(coatReflectance.F0),vec3(1.0),coat_roughness,lightColor{X}.rgb);
#endif
float NdotH=max(dot(coatNormalW,preInfoCoat{X}.H),0.0);coatFresnel=fresnelSchlickGGX(NdotH,coatReflectance.F0,coatReflectance.F90);}
#endif
vec3 coatAbsorption=vec3(1.0);if (coat_weight>0.0) {float cosTheta_view=max(preInfoCoat{X}.NdotV,0.001);float cosTheta_light=max(preInfoCoat{X}.NdotL,0.001);float fresnel_view=coatReflectance.F0+(1.0-coatReflectance.F0)*pow(1.0-cosTheta_view,5.0);float fresnel_light=coatReflectance.F0+(1.0-coatReflectance.F0)*pow(1.0-cosTheta_light,5.0);float averageReflectance=(fresnel_view+fresnel_light)*0.5;float darkened_transmission=(1.0-averageReflectance)/(1.0+averageReflectance);darkened_transmission=mix(1.0,darkened_transmission,coat_darkening);float sin2=1.0-cosTheta_view*cosTheta_view;sin2=sin2/(coat_ior*coat_ior)*coat_weight;float cos_t=sqrt(1.0-sin2);float coatPathLength=1.0/cos_t;float effectivePathLength=coatPathLength*coat_weight;vec3 colored_transmission=pow(coat_color,vec3(effectivePathLength));coatAbsorption=colored_transmission*mix(1.0,darkened_transmission,coat_weight);}
#ifdef FUZZ
fuzzFresnel=fuzzBrdf.z;vec3 fuzzNormalW=mix(normalW,coatNormalW,coat_weight);float fuzzNdotV=max(dot(fuzzNormalW,viewDirectionW.xyz),0.0);float fuzzNdotL=max(dot(fuzzNormalW,preInfo{X}.L),0.0);slab_fuzz=lightColor{X}.rgb*preInfo{X}.attenuation*evalFuzz(preInfo{X}.L,fuzzNdotL,fuzzNdotV,fuzzTangent,fuzzBitangent,fuzzBrdf);
#else
vec3 fuzz_color=vec3(0.0);
#endif
#ifdef PREPASS_IRRADIANCE
total_direct_diffuse+=slab_diffuse;
#endif
vec3 material_dielectric_base=mix(slab_diffuse*base_color.rgb,slab_translucent,surface_translucency_weight);
#if defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
vec3 material_dielectric_gloss=material_dielectric_base*(1.0-specularFresnel)+slab_glossy;
#else
vec3 material_dielectric_gloss=material_dielectric_base*(1.0-specularFresnel)+slab_glossy*specularColoredFresnel;
#endif
vec3 material_base_substrate=mix(material_dielectric_gloss,slab_metal,base_metalness);vec3 material_coated_base=layer(material_base_substrate,slab_coat,coatFresnel,coatAbsorption,vec3(1.0));material_surface_direct+=layer(material_coated_base,slab_fuzz,fuzzFresnel*fuzz_weight,vec3(1.0),fuzz_color);}
#endif
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStore[name]) {
    ShaderStore.IncludesShadersStore[name] = shader;
}
/** @internal */
export const openpbrDirectLighting = { name, shader };
//# sourceMappingURL=openpbrDirectLighting.js.map