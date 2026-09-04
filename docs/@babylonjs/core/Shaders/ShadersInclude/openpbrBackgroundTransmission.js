// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "openpbrBackgroundTransmission";
const shader = `vec4 slab_translucent_background=vec4(0.,0.,0.,1.);
#ifdef REFRACTED_BACKGROUND
{float refractionLOD=min(transmission_roughness,0.8)*vBackgroundRefractionInfos.x;float lodTexelSize=pow(2.0,refractionLOD-vBackgroundRefractionInfos.x);
#ifdef DISPERSION
{
#ifdef REFRACTION_HIGH_QUALITY_BLUR
{vec3 dispResult=vec3(0.0);vec3 dispWeight=vec3(0.0);vec2 noiseOffset=noise.xy*(refractionLOD>0.0 ? lodTexelSize : 0.0);for (int k=0; k<6; k++) {float t=(float(k)+noise.y)/6.0;float t_rg=clamp(t*2.0,0.0,1.0);float t_gb=clamp((t-0.5)*2.0,0.0,1.0);vec3 refVec=mix(mix(refractedViewVectors[0],refractedViewVectors[1],t_rg),refractedViewVectors[2],t_gb);vec3 uvw=vec3(backgroundRefractionMatrix*(view*vec4(vPositionW+refVec*geometry_thickness,1.0)));vec2 coords=uvw.xy/uvw.z;coords.y=1.0-coords.y;vec4 s=texture2DLodEXT(backgroundRefractionSampler,coords+noiseOffset,refractionLOD);float rw=max(0.0,1.0-2.0*t);float gw=max(0.0,1.0-abs(2.0*t-1.0));float bw=max(0.0,2.0*t-1.0);vec3 w=vec3(rw,gw,bw);dispResult+=s.rgb*w;dispWeight+=w;}
slab_translucent_background=vec4(dispResult/max(dispWeight,vec3(1e-6)),1.0);}
#else
for (int i=0; i<3; i++) {vec3 refractedViewVector=refractedViewVectors[i];vec3 uvw=vec3(backgroundRefractionMatrix*(view*vec4(vPositionW+refractedViewVector*geometry_thickness,1.0)));vec2 coords=uvw.xy/uvw.z;coords.y=1.0-coords.y;if (refractionLOD>0.0) {vec2 noiseOffset=noise.xy*lodTexelSize;slab_translucent_background[i]=texture2DLodEXT(backgroundRefractionSampler,coords+noiseOffset,refractionLOD)[i];} else {slab_translucent_background[i]=texture2DLodEXT(backgroundRefractionSampler,coords,0.0)[i];}}
#endif
}
#else
{vec3 refractionUVW=vec3(backgroundRefractionMatrix*(view*vec4(vPositionW+refractedViewVector*geometry_thickness,1.0)));vec2 refractionCoords=refractionUVW.xy/refractionUVW.z;refractionCoords.y=1.0-refractionCoords.y;if (refractionLOD>0.0) {
#ifdef REFRACTION_HIGH_QUALITY_BLUR
float cosA=cos(noise.x*PI);float sinA=sin(noise.x*PI);vec2 u=vec2( cosA,sinA)*(0.5*lodTexelSize);vec2 v=vec2(-sinA,cosA)*(0.5*lodTexelSize);slab_translucent_background=0.25*(
texture2DLodEXT(backgroundRefractionSampler,refractionCoords+u+v,refractionLOD) +
texture2DLodEXT(backgroundRefractionSampler,refractionCoords-u+v,refractionLOD) +
texture2DLodEXT(backgroundRefractionSampler,refractionCoords+u-v,refractionLOD) +
texture2DLodEXT(backgroundRefractionSampler,refractionCoords-u-v,refractionLOD)
);
#else
vec2 noiseOffset=noise.xy*lodTexelSize;slab_translucent_background=texture2DLodEXT(backgroundRefractionSampler,refractionCoords+noiseOffset,refractionLOD);
#endif
} else {slab_translucent_background=texture2DLodEXT(backgroundRefractionSampler,refractionCoords,0.0);}}
#endif
}
#endif
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStore[name]) {
    ShaderStore.IncludesShadersStore[name] = shader;
}
/** @internal */
export const openpbrBackgroundTransmission = { name, shader };
//# sourceMappingURL=openpbrBackgroundTransmission.js.map