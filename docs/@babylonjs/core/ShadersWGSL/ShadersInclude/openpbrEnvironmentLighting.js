// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "openpbrEnvironmentLighting";
const shader = `#if defined(REFLECTION) || defined(REFRACTED_BACKGROUND)
var coatAbsorption=vec3f(1.0f);var coatIblFresnel: f32=0.0;if (coat_weight>0.0) {coatIblFresnel=computeDielectricIblFresnel(coatReflectance,coatGeoInfo.environmentBrdf);let hemisphere_avg_fresnel: f32=coatReflectance.F0+0.5f*(1.0f-coatReflectance.F0);var averageReflectance: f32=(coatIblFresnel+hemisphere_avg_fresnel)*0.5f;let roughnessFactor=1.0f-coat_roughness*0.5f;averageReflectance*=roughnessFactor;var darkened_transmission: f32=(1.0f-averageReflectance)*(1.0f-averageReflectance);darkened_transmission=mix(1.0,darkened_transmission,coat_darkening);var sin2: f32=1.0f-coatGeoInfo.NdotV*coatGeoInfo.NdotV;sin2=sin2/(coat_ior*coat_ior)*coat_weight;let cos_t: f32=sqrt(1.0f-sin2);let coatPathLength=1.0f/cos_t;let effectivePathLength=coatPathLength*coat_weight;let colored_transmission: vec3f=pow(coat_color,vec3f(effectivePathLength));coatAbsorption=colored_transmission*mix(1.0f,darkened_transmission,coat_weight);}
#endif
#ifdef REFLECTION
#if defined(FUZZ) && defined(FUZZENVIRONMENTBRDF)
let environmentFuzzBrdf: vec3f=getFuzzBRDFLookup(fuzzGeoInfo.NdotV,sqrt(fuzz_roughness));
#endif
var baseDiffuseEnvironmentLight: vec3f=sampleIrradiance(
normalW
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
,vEnvironmentIrradiance 
#endif
#if (defined(USESPHERICALFROMREFLECTIONMAP) && (!defined(NORMAL) || !defined(USESPHERICALINVERTEX))) || (defined(USEIRRADIANCEMAP) && defined(REFLECTIONMAP_3D))
,uniforms.reflectionMatrix
#endif
#ifdef USEIRRADIANCEMAP
,irradianceSampler
,irradianceSamplerSampler
#ifdef USE_IRRADIANCE_DOMINANT_DIRECTION
,uniforms.vReflectionDominantDirection
#endif
#endif
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#ifdef IBL_CDF_FILTERING
,icdfSampler
,icdfSamplerSampler
#endif
#endif
,uniforms.vReflectionInfos
,viewDirectionW
,base_diffuse_roughness
,base_color
);
#ifdef REFLECTIONMAP_3D
var reflectionCoords: vec3f=vec3f(0.f,0.f,0.f);
#else
var reflectionCoords: vec2f=vec2f(0.f,0.f);
#endif
let specularAlphaG: f32=specular_roughness*specular_roughness;
#ifdef ANISOTROPIC_BASE
var baseSpecularEnvironmentLight: vec3f=sampleRadianceAnisotropic(specularAlphaG,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,baseGeoInfo
,normalW
,viewDirectionW
,fragmentInputs.vPositionW
,noise
,false 
,1.0 
,reflectionSampler
,reflectionSamplerSampler
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
);
#else
reflectionCoords=createReflectionCoords(fragmentInputs.vPositionW,normalW);var baseSpecularEnvironmentLight: vec3f=sampleRadiance(specularAlphaG,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,baseGeoInfo
,reflectionSampler
,reflectionSamplerSampler
,reflectionCoords
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
);
#endif
#ifdef ANISOTROPIC_BASE
baseSpecularEnvironmentLight=mix(baseSpecularEnvironmentLight.rgb,baseDiffuseEnvironmentLight,specularAlphaG*specularAlphaG *max(1.0f-baseGeoInfo.anisotropy,0.3f));
#else
baseSpecularEnvironmentLight=mix(baseSpecularEnvironmentLight.rgb,baseDiffuseEnvironmentLight,specularAlphaG);
#endif
var coatEnvironmentLight: vec3f=vec3f(0.f,0.f,0.f);if (coat_weight>0.0) {
#ifdef REFLECTIONMAP_3D
var reflectionCoords: vec3f=vec3f(0.f,0.f,0.f);
#else
var reflectionCoords: vec2f=vec2f(0.f,0.f);
#endif
reflectionCoords=createReflectionCoords(fragmentInputs.vPositionW,coatNormalW);var coatAlphaG: f32=coat_roughness*coat_roughness;
#ifdef ANISOTROPIC_COAT
coatEnvironmentLight=sampleRadianceAnisotropic(coatAlphaG,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,coatGeoInfo
,coatNormalW
,viewDirectionW
,fragmentInputs.vPositionW
,noise
,false 
,1.0 
,reflectionSampler
,reflectionSamplerSampler
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
);
#else
coatEnvironmentLight=sampleRadiance(coatAlphaG,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,coatGeoInfo
,reflectionSampler
,reflectionSamplerSampler
,reflectionCoords
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
);
#endif
}
#if defined(FUZZ) && defined(FUZZENVIRONMENTBRDF)
let modifiedFuzzRoughness: f32=clamp(fuzz_roughness*fuzz_roughness*(1.0f+0.5f*environmentFuzzBrdf.y),0.0f,1.0f);var fuzzEnvironmentLight=vec3f(0.0f,0.0f,0.0f);let fuzzIblFresnel: f32=min(environmentFuzzBrdf.z*2.0f,1.0f);let viewTangent: vec2f=vec2f(dot(viewDirectionW,fuzzTangent),dot(viewDirectionW,fuzzBitangent));let centerAngle: f32=atan2(viewTangent.y,viewTangent.x);for (var i: i32=0; i<i32(FUZZ_IBL_SAMPLES); i++) {let angle: f32=centerAngle+(f32(i)/f32(FUZZ_IBL_SAMPLES)-0.5f+noise.x/f32(FUZZ_IBL_SAMPLES))*3.141592f;let fiberCylinderNormal: vec3f=normalize(cos(angle)*fuzzTangent+sin(angle)*fuzzBitangent);let fuzzReflectionCoords: vec3f=(uniforms.reflectionMatrix*vec4f(fiberCylinderNormal,0.0f)).xyz;let radianceSample: vec3f=sampleRadiance(modifiedFuzzRoughness,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,fuzzGeoInfo
,reflectionSampler
,reflectionSamplerSampler
,fuzzReflectionCoords
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
);fuzzEnvironmentLight+=radianceSample;}
fuzzEnvironmentLight/=f32(FUZZ_IBL_SAMPLES);
#if defined(GEOMETRY_NORMAL) || defined(GEOMETRY_COAT_NORMAL)
var fuzzDiffuseEnvironmentLight: vec3f=sampleIrradiance(
fuzzNormalW
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
,vEnvironmentIrradiance 
#endif
#if (defined(USESPHERICALFROMREFLECTIONMAP) && (!defined(NORMAL) || !defined(USESPHERICALINVERTEX))) || (defined(USEIRRADIANCEMAP) && defined(REFLECTIONMAP_3D))
,uniforms.reflectionMatrix
#endif
#ifdef USEIRRADIANCEMAP
,irradianceSampler
,irradianceSamplerSampler
#ifdef USE_IRRADIANCE_DOMINANT_DIRECTION
,uniforms.vReflectionDominantDirection
#endif
#endif
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#ifdef IBL_CDF_FILTERING
,icdfSampler
,icdfSamplerSampler
#endif
#endif
,uniforms.vReflectionInfos
,viewDirectionW
,0.0f
,vec3f(1.0f)
);
#else
var fuzzDiffuseEnvironmentLight: vec3f=baseDiffuseEnvironmentLight;
#endif
fuzzEnvironmentLight=mix(min(fuzzEnvironmentLight,fuzzDiffuseEnvironmentLight),fuzzDiffuseEnvironmentLight,modifiedFuzzRoughness);
#endif
var dielectricIblFresnel: f32=computeDielectricIblFresnel(baseDielectricReflectance,baseGeoInfo.environmentBrdf);var dielectricIblColoredFresnel: vec3f=dielectricIblFresnel*specular_color;
#ifdef THIN_FILM
let thin_film_cos_theta: f32=max(baseGeoInfo.NdotV,specularAlphaG);let thin_film_desaturation_scale=(thin_film_ior-1.0)*sqrt(thin_film_thickness*0.001f*thin_film_cos_theta);let tf_brdf_x: f32=baseGeoInfo.environmentBrdf.x;let tf_E_ss: f32 =baseGeoInfo.environmentBrdf.y;var thinFilmDielectricF0: vec3f=evalIridescence(thin_film_outside_ior,thin_film_ior,1.0,thin_film_thickness,vec3f(baseDielectricReflectance.F0));thinFilmDielectricF0=mix(thinFilmDielectricF0,vec3(dot(thinFilmDielectricF0,vec3f(0.3333f))),thin_film_desaturation_scale);var thinFilmDielectricDir: vec3f=evalIridescence(thin_film_outside_ior,thin_film_ior,thin_film_cos_theta,thin_film_thickness,vec3f(baseDielectricReflectance.F0));thinFilmDielectricDir=mix(thinFilmDielectricDir,vec3(dot(thinFilmDielectricDir,vec3f(0.3333f))),thin_film_desaturation_scale);let tf_f0d_avg: f32 =dot(thinFilmDielectricF0, vec3f(0.3333f));let tf_dird_avg: f32=dot(thinFilmDielectricDir,vec3f(0.3333f));var thin_film_dielectric: vec3f=thinFilmDielectricDir*(tf_f0d_avg/max(tf_dird_avg,1e-5));let tf_E_dielectric: vec3f=(vec3f(1.0)-thin_film_dielectric)*vec3f(tf_brdf_x)+thin_film_dielectric*vec3f(tf_E_ss);let tf_F_avg_dielectric: vec3f=thin_film_dielectric+(vec3f(1.0)-thin_film_dielectric)/21.0;let tf_ECF_dielectric: vec3f=vec3f(1.0)+tf_F_avg_dielectric*(vec3f(1.0)/vec3f(tf_E_ss)-vec3f(1.0));thin_film_dielectric=clamp(tf_E_dielectric*tf_ECF_dielectric,vec3f(0.0),vec3f(1.0));dielectricIblColoredFresnel=mix(dielectricIblColoredFresnel,thin_film_dielectric*specular_color,thin_film_weight*thin_film_ior_scale);dielectricIblFresnel=max(dielectricIblColoredFresnel.r,max(dielectricIblColoredFresnel.g,dielectricIblColoredFresnel.b));
#endif
var conductorIblFresnel: vec3f=computeConductorIblFresnel(baseConductorReflectance,baseGeoInfo.environmentBrdf);
#ifdef THIN_FILM
var thinFilmConductorF0: vec3f=evalIridescence(thin_film_outside_ior,thin_film_ior,1.0,thin_film_thickness,baseConductorReflectance.coloredF0);thinFilmConductorF0=mix(thinFilmConductorF0,vec3(dot(thinFilmConductorF0,vec3f(0.3333f))),thin_film_desaturation_scale);var thinFilmConductorDir: vec3f=evalIridescence(thin_film_outside_ior,thin_film_ior,thin_film_cos_theta,thin_film_thickness,baseConductorReflectance.coloredF0);thinFilmConductorDir=mix(thinFilmConductorDir,vec3(dot(thinFilmConductorDir,vec3f(0.3333f))),thin_film_desaturation_scale);let tf_f0c_avg: f32 =dot(thinFilmConductorF0, vec3f(0.3333f));let tf_dirc_avg: f32=dot(thinFilmConductorDir,vec3f(0.3333f));var thinFilmConductorRaw: vec3f=thinFilmConductorDir*(tf_f0c_avg/max(tf_dirc_avg,1e-5));
#if (CONDUCTOR_SPECULAR_MODEL==CONDUCTOR_SPECULAR_MODEL_OPENPBR) && defined(ENVIRONMENTBRDF)
let tf_b: vec3f=getF82B(baseConductorReflectance.coloredF0,baseConductorReflectance.coloredF90);let tf_brdf_z: f32=baseGeoInfo.environmentBrdf.z/BRDF_Z_SCALE;let tf_E_conductor: vec3f=(vec3f(1.0)-thinFilmConductorRaw)*vec3f(tf_brdf_x)+thinFilmConductorRaw*vec3f(tf_E_ss)-tf_b*vec3f(tf_brdf_z);let tf_F_avg_conductor: vec3f=thinFilmConductorRaw+(vec3f(1.0)-thinFilmConductorRaw)/21.0-tf_b/126.0;
#else
let tf_E_conductor: vec3f=(vec3f(1.0)-thinFilmConductorRaw)*vec3f(tf_brdf_x)+thinFilmConductorRaw*vec3f(tf_E_ss);let tf_F_avg_conductor: vec3f=thinFilmConductorRaw+(vec3f(1.0)-thinFilmConductorRaw)/21.0;
#endif
let tf_ECF_conductor: vec3f=vec3f(1.0)+tf_F_avg_conductor*(vec3f(1.0)/vec3f(tf_E_ss)-vec3f(1.0));var thinFilmConductorFresnel: vec3f=specular_weight*clamp(tf_E_conductor*tf_ECF_conductor,vec3f(0.0),vec3f(1.0));conductorIblFresnel=mix(conductorIblFresnel,thinFilmConductorFresnel,thin_film_weight*thin_film_ior_scale);
#endif
var slab_diffuse_ibl: vec3f=vec3f(0.,0.,0.);var slab_glossy_ibl: vec3f=vec3f(0.,0.,0.);var slab_metal_ibl: vec3f=vec3f(0.,0.,0.);var slab_coat_ibl: vec3f=vec3f(0.,0.,0.);slab_diffuse_ibl=baseDiffuseEnvironmentLight*uniforms.vLightingIntensity.z;
#ifdef AMBIENT_OCCLUSION
specular_ambient_occlusion=compute_specular_occlusion(baseGeoInfo.NdotV,base_metalness,ambient_occlusion.x,specular_roughness);
#endif
slab_glossy_ibl=baseSpecularEnvironmentLight*uniforms.vLightingIntensity.z;slab_metal_ibl=baseSpecularEnvironmentLight*conductorIblFresnel*uniforms.vLightingIntensity.z;if (coat_weight>0.0) {slab_coat_ibl=coatEnvironmentLight*uniforms.vLightingIntensity.z;
#ifdef AMBIENT_OCCLUSION
coat_specular_ambient_occlusion=compute_specular_occlusion(coatGeoInfo.NdotV,0.0,ambient_occlusion.x,coat_roughness);
#endif
}
#if defined(FUZZ) && defined(FUZZENVIRONMENTBRDF)
var slab_fuzz_ibl=fuzzEnvironmentLight*uniforms.vLightingIntensity.z;
#endif
var slab_translucent_base_ibl: vec3f=vec3f(0.0f,0.0f,0.0f);
#ifdef REFRACTED_ENVIRONMENT
#ifdef ANISOTROPIC_BASE
var forwardScatteredEnvironmentLight: vec3f=sampleRadianceAnisotropic(transmission_roughness_alpha,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,baseGeoInfo
#ifdef GEOMETRY_THIN_WALLED
,viewDirectionW
#else
,normalW
#endif
,viewDirectionW
,fragmentInputs.vPositionW
,noise
,true 
#ifdef GEOMETRY_THIN_WALLED
,1.05f 
#else
,specular_ior 
#endif
,reflectionSampler
,reflectionSamplerSampler
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
);
#else
var forwardScatteredEnvironmentLight: vec3f=vec3f(0.,0.,0.);
#ifdef DISPERSION
for (var i: i32=0; i<3; i++) {var iblRefractionCoords: vec3f=refractedViewVectors[i];
#else
var iblRefractionCoords: vec3f=refractedViewVector;
#endif
#ifdef REFRACTED_ENVIRONMENT_OPPOSITEZ
iblRefractionCoords.z*=-1.0f;
#endif
#ifdef REFRACTED_ENVIRONMENT_LOCAL_CUBE
iblRefractionCoords=parallaxCorrectNormal(fragmentInputs.vPositionW,refractedViewVector,uniforms.refractionSize,uniforms.refractionPosition);
#endif
iblRefractionCoords=(uniforms.reflectionMatrix*vec4f(iblRefractionCoords,0.0f)).xyz;
#ifdef DISPERSION
forwardScatteredEnvironmentLight[i]=sampleRadiance(transmission_roughness_alpha,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,baseGeoInfo
,reflectionSampler
,reflectionSamplerSampler
,iblRefractionCoords
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
)[i];
#else
forwardScatteredEnvironmentLight=sampleRadiance(transmission_roughness_alpha,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,baseGeoInfo
,reflectionSampler
,reflectionSamplerSampler
,iblRefractionCoords
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
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
var scatterVector: vec3f=normalW;
#else
#if defined(USEIRRADIANCEMAP) && defined(USE_IRRADIANCE_DOMINANT_DIRECTION)
var scatterVector: vec3f=mix(uniforms.vReflectionDominantDirection,normalW,max3(iso_scatter_density));
#else
var scatterVector: vec3f=normalW;
#endif
scatterVector=mix(viewDirectionW,scatterVector,back_to_iso_scattering_blend);
#endif
#if defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING) && !defined(GEOMETRY_THIN_WALLED)
var scatteredEnvironmentLight: vec3f=scattered_light_from_irradiance_texture;
#else
var scatteredEnvironmentLight: vec3f=sampleIrradiance(
scatterVector
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
,vEnvironmentIrradiance 
#endif
#if (defined(USESPHERICALFROMREFLECTIONMAP) && (!defined(NORMAL) || !defined(USESPHERICALINVERTEX))) || (defined(USEIRRADIANCEMAP) && defined(REFLECTIONMAP_3D))
,uniforms.reflectionMatrix
#endif
#ifdef USEIRRADIANCEMAP
,irradianceSampler
,irradianceSamplerSampler
#ifdef USE_IRRADIANCE_DOMINANT_DIRECTION
,uniforms.vReflectionDominantDirection
#endif
#endif
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#ifdef IBL_CDF_FILTERING
,icdfSampler
,icdfSamplerSampler
#endif
#endif
,uniforms.vReflectionInfos
,viewDirectionW
#if defined(GEOMETRY_THIN_WALLED)
,base_diffuse_roughness
,subsurface_color.rgb
#else
,1.0f
,volumeParams.multi_scatter_color
#endif
);
#endif
#ifdef GEOMETRY_THIN_WALLED
let forward_scattered_light: vec3f=forwardScatteredEnvironmentLight*transmission_tint*volumeParams.multi_scatter_color;let back_scattered_light: vec3f=scatteredEnvironmentLight*volumeParams.multi_scatter_color;slab_translucent_base_ibl=mix(back_scattered_light,forward_scattered_light,0.5f+0.5f*volumeParams.anisotropy);
#else
let forward_scattered_light: vec3f=forwardScatteredEnvironmentLight*volume_absorption;let back_scattered_light: vec3f=mix(forward_scattered_light,scatteredEnvironmentLight*backscatter_color,iso_scatter_density);let iso_scattered_light: vec3f=mix(forward_scattered_light,scatteredEnvironmentLight*volumeParams.multi_scatter_color,iso_scatter_density);slab_translucent_base_ibl=mix(back_scattered_light,iso_scattered_light,back_to_iso_scattering_blend);slab_translucent_base_ibl=mix(slab_translucent_base_ibl,forward_scattered_light,iso_to_forward_scattering_blend)*transmission_tint;
#endif
#else
slab_translucent_base_ibl+=forwardScatteredEnvironmentLight*transmission_tint*volume_absorption;
#endif
#endif
#define CUSTOM_FRAGMENT_BEFORE_IBLLAYERCOMPOSITION
slab_diffuse_ibl*=ambient_occlusion;slab_metal_ibl*=specular_ambient_occlusion;slab_glossy_ibl*=specular_ambient_occlusion;slab_coat_ibl*=coat_specular_ambient_occlusion;let material_dielectric_base_ibl: vec3f=mix(slab_diffuse_ibl*base_color.rgb,slab_translucent_base_ibl,surface_translucency_weight);let material_dielectric_gloss_ibl: vec3f=material_dielectric_base_ibl*(1.0-dielectricIblFresnel)+slab_glossy_ibl*dielectricIblColoredFresnel;let material_base_substrate_ibl: vec3f=mix(material_dielectric_gloss_ibl,slab_metal_ibl,base_metalness);let material_coated_base_ibl: vec3f=layer(material_base_substrate_ibl,slab_coat_ibl,coatIblFresnel,coatAbsorption,vec3f(1.0f));
#if defined(FUZZ) && defined(FUZZENVIRONMENTBRDF)
slab_fuzz_ibl*=min(vec3(specular_ambient_occlusion),ambient_occlusion);material_surface_ibl=layer(material_coated_base_ibl,slab_fuzz_ibl,fuzzIblFresnel*fuzz_weight,vec3f(1.0f),fuzz_color);
#else
material_surface_ibl=material_coated_base_ibl;
#endif
#elif defined(REFRACTED_BACKGROUND)
let black=vec3f(0.0f);var slab_translucent_base_ibl: vec3f=vec3f(0.0f);
#ifdef GEOMETRY_THIN_WALLED
#ifdef SCATTERING
let forward_scattered_light: vec3f=slab_translucent_background.rgb*transmission_tint*volumeParams.multi_scatter_color;slab_translucent_base_ibl=mix(black,forward_scattered_light,0.5f+0.5f*volumeParams.anisotropy);
#else
slab_translucent_base_ibl=slab_translucent_background.rgb*transmission_tint;
#endif
#else
#ifdef SCATTERING
let forward_scattered_light: vec3f=slab_translucent_background.rgb*volume_absorption;let iso_scattered_light: vec3f=(1.0f-iso_scatter_density)*forward_scattered_light;slab_translucent_base_ibl=mix(black,iso_scattered_light,back_to_iso_scattering_blend);slab_translucent_base_ibl=mix(slab_translucent_base_ibl,forward_scattered_light,iso_to_forward_scattering_blend)*transmission_tint;
#else
slab_translucent_base_ibl=slab_translucent_background.rgb*volume_absorption*transmission_tint;
#endif
#endif
let material_dielectric_base_ibl: vec3f=mix(black,slab_translucent_base_ibl.rgb,surface_translucency_weight);let material_dielectric_gloss_ibl: vec3f=material_dielectric_base_ibl*(baseGeoInfo.NdotV);let material_base_substrate_ibl: vec3f=mix(material_dielectric_gloss_ibl,black,base_metalness);let material_coated_base_ibl: vec3f=layer(material_base_substrate_ibl,black,coatIblFresnel,coatAbsorption,vec3f(1.0f));material_surface_ibl=material_coated_base_ibl;
#endif
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStoreWGSL[name]) {
    ShaderStore.IncludesShadersStoreWGSL[name] = shader;
}
/** @internal */
export const openpbrEnvironmentLightingWGSL = { name, shader };
//# sourceMappingURL=openpbrEnvironmentLighting.js.map