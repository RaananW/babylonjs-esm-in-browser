// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "openpbrEnvironmentLighting";
const shader = `#if defined(REFLECTION) || defined(REFRACTED_BACKGROUND)
vec3 coatAbsorption=vec3(1.0);float coatIblFresnel=0.0;if (coat_weight>0.0) {coatIblFresnel=computeDielectricIblFresnel(coatReflectance,coatGeoInfo.environmentBrdf);float hemisphere_avg_fresnel=coatReflectance.F0+0.5*(1.0-coatReflectance.F0);float averageReflectance=(coatIblFresnel+hemisphere_avg_fresnel)*0.5;float roughnessFactor=1.0-coat_roughness*0.5;averageReflectance*=roughnessFactor;float darkened_transmission=(1.0-averageReflectance)*(1.0-averageReflectance);darkened_transmission=mix(1.0,darkened_transmission,coat_darkening);float sin2=1.0-coatGeoInfo.NdotV*coatGeoInfo.NdotV;sin2=sin2/(coat_ior*coat_ior)*coat_weight;float cos_t=sqrt(1.0-sin2);float coatPathLength=1.0/cos_t;float effectivePathLength=coatPathLength*coat_weight;vec3 colored_transmission=pow(coat_color,vec3(effectivePathLength));coatAbsorption=colored_transmission*mix(1.0,darkened_transmission,coat_weight);}
#endif
#ifdef REFLECTION
#if defined(FUZZ) && defined(FUZZENVIRONMENTBRDF)
vec3 environmentFuzzBrdf=getFuzzBRDFLookup(fuzzGeoInfo.NdotV,sqrt(fuzz_roughness));
#endif
vec3 baseDiffuseEnvironmentLight=sampleIrradiance(
normalW
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
,vEnvironmentIrradiance
#endif
#if (defined(USESPHERICALFROMREFLECTIONMAP) && (!defined(NORMAL) || !defined(USESPHERICALINVERTEX))) || (defined(USEIRRADIANCEMAP) && defined(REFLECTIONMAP_3D))
,reflectionMatrix
#endif
#ifdef USEIRRADIANCEMAP
,irradianceSampler
#ifdef USE_IRRADIANCE_DOMINANT_DIRECTION
,vReflectionDominantDirection
#endif
#endif
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#ifdef IBL_CDF_FILTERING
,icdfSampler
#endif
#endif
,vReflectionInfos
,viewDirectionW
,base_diffuse_roughness
,base_color
);
#ifdef REFLECTIONMAP_3D
vec3 reflectionCoords=vec3(0.,0.,0.);
#else
vec2 reflectionCoords=vec2(0.,0.);
#endif
float specularAlphaG=specular_roughness*specular_roughness;
#ifdef ANISOTROPIC_BASE
vec3 baseSpecularEnvironmentLight=sampleRadianceAnisotropic(specularAlphaG,vReflectionMicrosurfaceInfos.rgb,vReflectionInfos
,baseGeoInfo
,normalW
,viewDirectionW
,vPositionW
,noise
,false 
,1.0 
,reflectionSampler
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#endif
);
#else
reflectionCoords=createReflectionCoords(vPositionW,normalW);vec3 baseSpecularEnvironmentLight=sampleRadiance(specularAlphaG,vReflectionMicrosurfaceInfos.rgb,vReflectionInfos
,baseGeoInfo
,reflectionSampler
,reflectionCoords
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#endif
);
#endif
#ifdef ANISOTROPIC_BASE
baseSpecularEnvironmentLight=mix(baseSpecularEnvironmentLight.rgb,baseDiffuseEnvironmentLight,specularAlphaG*specularAlphaG*max(1.0-baseGeoInfo.anisotropy,0.3));
#else
baseSpecularEnvironmentLight=mix(baseSpecularEnvironmentLight.rgb,baseDiffuseEnvironmentLight,specularAlphaG);
#endif
vec3 coatEnvironmentLight=vec3(0.,0.,0.);if (coat_weight>0.0) {
#ifdef REFLECTIONMAP_3D
vec3 reflectionCoords=vec3(0.,0.,0.);
#else
vec2 reflectionCoords=vec2(0.,0.);
#endif
reflectionCoords=createReflectionCoords(vPositionW,coatNormalW);float coatAlphaG=coat_roughness*coat_roughness;
#ifdef ANISOTROPIC_COAT
coatEnvironmentLight=sampleRadianceAnisotropic(coatAlphaG,vReflectionMicrosurfaceInfos.rgb,vReflectionInfos
,coatGeoInfo
,coatNormalW
,viewDirectionW
,vPositionW
,noise
,false 
,1.0 
,reflectionSampler
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#endif
);
#else
coatEnvironmentLight=sampleRadiance(coatAlphaG,vReflectionMicrosurfaceInfos.rgb,vReflectionInfos
,coatGeoInfo
,reflectionSampler
,reflectionCoords
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#endif
);
#endif
}
#if defined(FUZZ) && defined(FUZZENVIRONMENTBRDF)
float modifiedFuzzRoughness=clamp(fuzz_roughness*fuzz_roughness*(1.0+0.5*environmentFuzzBrdf.y),0.0,1.0);vec3 fuzzEnvironmentLight=vec3(0.0);float fuzzIblFresnel=min(environmentFuzzBrdf.z*2.0,1.0);vec2 viewTangent=vec2(dot(viewDirectionW,fuzzTangent),dot(viewDirectionW,fuzzBitangent));float centerAngle=atan(viewTangent.y,viewTangent.x);for (int i=0; i<FUZZ_IBL_SAMPLES; ++i) {float angle=centerAngle+(float(i)/float(FUZZ_IBL_SAMPLES)-0.5+noise.x/float(FUZZ_IBL_SAMPLES))*3.141592;vec3 fiberCylinderNormal=normalize(cos(angle)*fuzzTangent+sin(angle)*fuzzBitangent);vec3 fuzzReflectionCoords=vec3(reflectionMatrix*vec4(fiberCylinderNormal,0));vec3 radianceSample=sampleRadiance(modifiedFuzzRoughness,vReflectionMicrosurfaceInfos.rgb,vReflectionInfos
,fuzzGeoInfo
,reflectionSampler
,fuzzReflectionCoords
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#endif
);fuzzEnvironmentLight+=radianceSample;}
fuzzEnvironmentLight/=float(FUZZ_IBL_SAMPLES);
#if defined(GEOMETRY_NORMAL) || defined(GEOMETRY_COAT_NORMAL)
vec3 fuzzDiffuseEnvironmentLight=sampleIrradiance(
fuzzNormalW
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
,vEnvironmentIrradiance
#endif
#if (defined(USESPHERICALFROMREFLECTIONMAP) && (!defined(NORMAL) || !defined(USESPHERICALINVERTEX))) || (defined(USEIRRADIANCEMAP) && defined(REFLECTIONMAP_3D))
,reflectionMatrix
#endif
#ifdef USEIRRADIANCEMAP
,irradianceSampler
#ifdef USE_IRRADIANCE_DOMINANT_DIRECTION
,vReflectionDominantDirection
#endif
#endif
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#ifdef IBL_CDF_FILTERING
,icdfSampler
#endif
#endif
,vReflectionInfos
,viewDirectionW
,0.0
,vec3(1.0)
);
#else
vec3 fuzzDiffuseEnvironmentLight=baseDiffuseEnvironmentLight;
#endif
fuzzEnvironmentLight=mix(min(fuzzEnvironmentLight,fuzzDiffuseEnvironmentLight),fuzzDiffuseEnvironmentLight,modifiedFuzzRoughness);
#endif
float dielectricIblFresnel=computeDielectricIblFresnel(baseDielectricReflectance,baseGeoInfo.environmentBrdf);vec3 dielectricIblColoredFresnel=dielectricIblFresnel*specular_color;
#ifdef THIN_FILM
float thin_film_cos_theta=max(baseGeoInfo.NdotV,specularAlphaG);float thin_film_desaturation_scale=(thin_film_ior-1.0)*sqrt(thin_film_thickness*0.001*thin_film_cos_theta);float tf_brdf_x=baseGeoInfo.environmentBrdf.x;float tf_E_ss =baseGeoInfo.environmentBrdf.y;vec3 thinFilmDielectricF0=evalIridescence(thin_film_outside_ior,thin_film_ior,1.0,thin_film_thickness,vec3(baseDielectricReflectance.F0));thinFilmDielectricF0=mix(thinFilmDielectricF0,vec3(dot(thinFilmDielectricF0,vec3(0.3333))),thin_film_desaturation_scale);vec3 thinFilmDielectricDir=evalIridescence(thin_film_outside_ior,thin_film_ior,thin_film_cos_theta,thin_film_thickness,vec3(baseDielectricReflectance.F0));thinFilmDielectricDir=mix(thinFilmDielectricDir,vec3(dot(thinFilmDielectricDir,vec3(0.3333))),thin_film_desaturation_scale);float tf_f0d_avg =dot(thinFilmDielectricF0, vec3(0.3333));float tf_dird_avg=dot(thinFilmDielectricDir,vec3(0.3333));vec3 thinFilmDielectricFresnel=thinFilmDielectricDir*(tf_f0d_avg/max(tf_dird_avg,1e-5));vec3 tf_E_dielectric=(vec3(1.0)-thinFilmDielectricFresnel)*vec3(tf_brdf_x)+thinFilmDielectricFresnel*vec3(tf_E_ss);vec3 tf_F_avg_dielectric=thinFilmDielectricFresnel+(vec3(1.0)-thinFilmDielectricFresnel)/21.0;vec3 tf_ECF_dielectric=vec3(1.0)+tf_F_avg_dielectric*(vec3(1.0)/vec3(tf_E_ss)-vec3(1.0));thinFilmDielectricFresnel=clamp(tf_E_dielectric*tf_ECF_dielectric,vec3(0.0),vec3(1.0));dielectricIblColoredFresnel=mix(dielectricIblColoredFresnel,thinFilmDielectricFresnel*specular_color,thin_film_weight*thin_film_ior_scale);dielectricIblFresnel=max(dielectricIblColoredFresnel.r,max(dielectricIblColoredFresnel.g,dielectricIblColoredFresnel.b));
#endif
vec3 conductorIblFresnel=computeConductorIblFresnel(baseConductorReflectance,baseGeoInfo.environmentBrdf);
#ifdef THIN_FILM
vec3 thinFilmConductorF0=evalIridescence(thin_film_outside_ior,thin_film_ior,1.0,thin_film_thickness,baseConductorReflectance.coloredF0);thinFilmConductorF0=mix(thinFilmConductorF0,vec3(dot(thinFilmConductorF0,vec3(0.3333))),thin_film_desaturation_scale);vec3 thinFilmConductorDir=evalIridescence(thin_film_outside_ior,thin_film_ior,thin_film_cos_theta,thin_film_thickness,baseConductorReflectance.coloredF0);thinFilmConductorDir=mix(thinFilmConductorDir,vec3(dot(thinFilmConductorDir,vec3(0.3333))),thin_film_desaturation_scale);float tf_f0c_avg =dot(thinFilmConductorF0, vec3(0.3333));float tf_dirc_avg=dot(thinFilmConductorDir,vec3(0.3333));vec3 thinFilmConductorRaw=thinFilmConductorDir*(tf_f0c_avg/max(tf_dirc_avg,1e-5));
#if (CONDUCTOR_SPECULAR_MODEL==CONDUCTOR_SPECULAR_MODEL_OPENPBR) && defined(ENVIRONMENTBRDF)
vec3 tf_b=getF82B(baseConductorReflectance.coloredF0,baseConductorReflectance.coloredF90);float tf_brdf_z=baseGeoInfo.environmentBrdf.z/BRDF_Z_SCALE;vec3 tf_E_conductor=(vec3(1.0)-thinFilmConductorRaw)*vec3(tf_brdf_x)+thinFilmConductorRaw*vec3(tf_E_ss)-tf_b*vec3(tf_brdf_z);vec3 tf_F_avg_conductor=thinFilmConductorRaw+(vec3(1.0)-thinFilmConductorRaw)/21.0-tf_b/126.0;
#else
vec3 tf_E_conductor=(vec3(1.0)-thinFilmConductorRaw)*vec3(tf_brdf_x)+thinFilmConductorRaw*vec3(tf_E_ss);vec3 tf_F_avg_conductor=thinFilmConductorRaw+(vec3(1.0)-thinFilmConductorRaw)/21.0;
#endif
vec3 tf_ECF_conductor=vec3(1.0)+tf_F_avg_conductor*(vec3(1.0)/vec3(tf_E_ss)-vec3(1.0));vec3 thinFilmConductorFresnel=specular_weight*clamp(tf_E_conductor*tf_ECF_conductor,vec3(0.0),vec3(1.0));conductorIblFresnel=mix(conductorIblFresnel,thinFilmConductorFresnel,thin_film_weight*thin_film_ior_scale);
#endif
vec3 slab_diffuse_ibl=vec3(0.,0.,0.);vec3 slab_glossy_ibl=vec3(0.,0.,0.);vec3 slab_metal_ibl=vec3(0.,0.,0.);vec3 slab_coat_ibl=vec3(0.,0.,0.);slab_diffuse_ibl=baseDiffuseEnvironmentLight*vLightingIntensity.z;
#ifdef AMBIENT_OCCLUSION
specular_ambient_occlusion=compute_specular_occlusion(baseGeoInfo.NdotV,base_metalness,ambient_occlusion.x,specular_roughness);
#endif
slab_glossy_ibl=baseSpecularEnvironmentLight*vLightingIntensity.z;slab_metal_ibl=baseSpecularEnvironmentLight*conductorIblFresnel*vLightingIntensity.z;if (coat_weight>0.0) {slab_coat_ibl=coatEnvironmentLight*vLightingIntensity.z;
#ifdef AMBIENT_OCCLUSION
coat_specular_ambient_occlusion=compute_specular_occlusion(coatGeoInfo.NdotV,0.0,ambient_occlusion.x,coat_roughness);
#endif
}
#if defined(FUZZ) && defined(FUZZENVIRONMENTBRDF)
vec3 slab_fuzz_ibl=fuzzEnvironmentLight*vLightingIntensity.z;
#endif
vec3 slab_translucent_base_ibl=vec3(0.0);vec3 slab_subsurface_ibl=vec3(0.,0.,0.);
#ifdef REFRACTED_ENVIRONMENT
#ifdef ANISOTROPIC_BASE
vec3 forwardScatteredEnvironmentLight=sampleRadianceAnisotropic(transmission_roughness_alpha,vReflectionMicrosurfaceInfos.rgb,vReflectionInfos
,baseGeoInfo
#ifdef GEOMETRY_THIN_WALLED
,viewDirectionW
#else
,normalW
#endif
,viewDirectionW
,vPositionW
,noise
,true 
#ifdef GEOMETRY_THIN_WALLED
,1.05 
#else
,specular_ior 
#endif
,reflectionSampler
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#endif
);
#else
vec3 forwardScatteredEnvironmentLight=vec3(0.,0.,0.);
#ifdef DISPERSION
for (int i=0; i<3; i++) {vec3 iblRefractionCoords=refractedViewVectors[i];
#else
vec3 iblRefractionCoords=refractedViewVector;
#endif
#ifdef REFRACTED_ENVIRONMENT_OPPOSITEZ
iblRefractionCoords.z*=-1.0;
#endif
#ifdef REFRACTED_ENVIRONMENT_LOCAL_CUBE
iblRefractionCoords=parallaxCorrectNormal(vPositionW,refractedViewVector,refractionSize,refractionPosition);
#endif
iblRefractionCoords=vec3(reflectionMatrix*vec4(iblRefractionCoords,0));
#ifdef DISPERSION
forwardScatteredEnvironmentLight[i]=sampleRadiance(transmission_roughness_alpha,vReflectionMicrosurfaceInfos.rgb,vReflectionInfos
,baseGeoInfo
,reflectionSampler
,iblRefractionCoords
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#endif
)[i];
#else
forwardScatteredEnvironmentLight=sampleRadiance(transmission_roughness_alpha,vReflectionMicrosurfaceInfos.rgb,vReflectionInfos
,baseGeoInfo
,reflectionSampler
,iblRefractionCoords
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#endif
);
#endif
#ifdef DISPERSION
}
#endif
#endif
#ifdef REFRACTED_BACKGROUND
#ifdef GEOMETRY_THIN_WALLED
forwardScatteredEnvironmentLight=mix(slab_translucent_background.rgb,forwardScatteredEnvironmentLight.rgb,0.2*transmission_roughness_alpha);
#else
forwardScatteredEnvironmentLight=max(slab_translucent_background.rgb,mix(slab_translucent_background.rgb,forwardScatteredEnvironmentLight,transmission_roughness_alpha));
#endif
#endif
#ifdef SCATTERING
#ifdef GEOMETRY_THIN_WALLED
vec3 scatterVector=normalW;
#else
#if defined(USEIRRADIANCEMAP) && defined(USE_IRRADIANCE_DOMINANT_DIRECTION)
vec3 scatterVector=mix(vReflectionDominantDirection,normalW,max3(iso_scatter_density));
#else
vec3 scatterVector=normalW;
#endif
scatterVector=mix(viewDirectionW,scatterVector,back_to_iso_scattering_blend);
#endif
#if defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING) && !defined(GEOMETRY_THIN_WALLED)
vec3 scatteredEnvironmentLight=scattered_light_from_irradiance_texture;
#else
vec3 scatteredEnvironmentLight=sampleIrradiance(
scatterVector
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
,vEnvironmentIrradiance
#endif
#if (defined(USESPHERICALFROMREFLECTIONMAP) && (!defined(NORMAL) || !defined(USESPHERICALINVERTEX))) || (defined(USEIRRADIANCEMAP) && defined(REFLECTIONMAP_3D))
,reflectionMatrix
#endif
#ifdef USEIRRADIANCEMAP
,irradianceSampler
#ifdef USE_IRRADIANCE_DOMINANT_DIRECTION
,vReflectionDominantDirection
#endif
#endif
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#ifdef IBL_CDF_FILTERING
,icdfSampler
#endif
#endif
,vReflectionInfos
,viewDirectionW
#if defined(GEOMETRY_THIN_WALLED)
,base_diffuse_roughness
,subsurface_color.rgb
#else
,1.0
,volumeParams.multi_scatter_color
#endif
);
#endif
#ifdef GEOMETRY_THIN_WALLED
vec3 forward_scattered_light=forwardScatteredEnvironmentLight*transmission_tint*volumeParams.multi_scatter_color;vec3 back_scattered_light=scatteredEnvironmentLight*volumeParams.multi_scatter_color;slab_translucent_base_ibl=mix(back_scattered_light,forward_scattered_light,0.5+0.5*volumeParams.anisotropy);
#else
vec3 forward_scattered_light=forwardScatteredEnvironmentLight*volume_absorption;vec3 back_scattered_light=mix(forward_scattered_light,scatteredEnvironmentLight*backscatter_color,iso_scatter_density);vec3 iso_scattered_light=mix(forward_scattered_light,scatteredEnvironmentLight*volumeParams.multi_scatter_color,iso_scatter_density);slab_translucent_base_ibl=mix(back_scattered_light,iso_scattered_light,back_to_iso_scattering_blend);slab_translucent_base_ibl=mix(slab_translucent_base_ibl,forward_scattered_light,iso_to_forward_scattering_blend)*transmission_tint;
#endif
#else
slab_translucent_base_ibl+=forwardScatteredEnvironmentLight*transmission_tint*volume_absorption;
#endif
#endif
#define CUSTOM_FRAGMENT_BEFORE_IBLLAYERCOMPOSITION
slab_diffuse_ibl*=ambient_occlusion;slab_metal_ibl*=specular_ambient_occlusion;slab_glossy_ibl*=specular_ambient_occlusion;slab_coat_ibl*=coat_specular_ambient_occlusion;vec3 material_dielectric_base_ibl=mix(slab_diffuse_ibl*base_color.rgb,slab_translucent_base_ibl,surface_translucency_weight);vec3 material_dielectric_gloss_ibl=material_dielectric_base_ibl*(1.0-dielectricIblFresnel)+slab_glossy_ibl*dielectricIblColoredFresnel;vec3 material_base_substrate_ibl=mix(material_dielectric_gloss_ibl,slab_metal_ibl,base_metalness);vec3 material_coated_base_ibl=layer(material_base_substrate_ibl,slab_coat_ibl,coatIblFresnel,coatAbsorption,vec3(1.0));
#if defined(FUZZ) && defined(FUZZENVIRONMENTBRDF)
slab_fuzz_ibl*=min(vec3(specular_ambient_occlusion),ambient_occlusion);material_surface_ibl=layer(material_coated_base_ibl,slab_fuzz_ibl,fuzzIblFresnel*fuzz_weight,vec3(1.0),fuzz_color);
#else
material_surface_ibl=material_coated_base_ibl;
#endif
#elif defined(REFRACTED_BACKGROUND)
vec3 black=vec3(0.0);vec3 slab_translucent_base_ibl=vec3(0.0);
#ifdef GEOMETRY_THIN_WALLED
#ifdef SCATTERING
vec3 forward_scattered_light=slab_translucent_background.rgb*transmission_tint*volumeParams.multi_scatter_color;slab_translucent_base_ibl=mix(black,forward_scattered_light,0.5+0.5*volumeParams.anisotropy);
#else
slab_translucent_base_ibl=slab_translucent_background.rgb*transmission_tint;
#endif
#else
#ifdef SCATTERING
vec3 forward_scattered_light=slab_translucent_background.rgb*volume_absorption;vec3 iso_scattered_light=(1.0-iso_scatter_density)*forward_scattered_light;slab_translucent_base_ibl=mix(black,iso_scattered_light,back_to_iso_scattering_blend);slab_translucent_base_ibl=mix(slab_translucent_base_ibl,forward_scattered_light,iso_to_forward_scattering_blend)*transmission_tint;
#else
slab_translucent_base_ibl=slab_translucent_background.rgb*volume_absorption*transmission_tint;
#endif
#endif
vec3 material_dielectric_base_ibl=mix(black,slab_translucent_base_ibl.rgb,surface_translucency_weight);vec3 material_dielectric_gloss_ibl=material_dielectric_base_ibl*(baseGeoInfo.NdotV);vec3 material_base_substrate_ibl=mix(material_dielectric_gloss_ibl,black,base_metalness);vec3 material_coated_base_ibl=layer(material_base_substrate_ibl,black,coatIblFresnel,coatAbsorption,vec3(1.0));material_surface_ibl=material_coated_base_ibl;
#endif
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStore[name]) {
    ShaderStore.IncludesShadersStore[name] = shader;
}
/** @internal */
export const openpbrEnvironmentLighting = { name, shader };
//# sourceMappingURL=openpbrEnvironmentLighting.js.map