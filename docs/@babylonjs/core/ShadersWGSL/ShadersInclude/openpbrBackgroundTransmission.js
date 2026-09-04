// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "openpbrBackgroundTransmission";
const shader = `var slab_translucent_background: vec4f=vec4f(0.,0.,0.,1.);
#ifdef REFRACTED_BACKGROUND
{let refractionLOD: f32=min(transmission_roughness,0.8)*uniforms.vBackgroundRefractionInfos.x;let lodTexelSize: f32=pow(2.0f,refractionLOD-uniforms.vBackgroundRefractionInfos.x);
#ifdef DISPERSION
{
#ifdef REFRACTION_HIGH_QUALITY_BLUR
{var dispResult: vec3f=vec3f(0.0);var dispWeight: vec3f=vec3f(0.0);let noiseOffset: vec2f=noise.xy*select(0.0f,lodTexelSize,refractionLOD>0.0f);for (var k: i32=0; k<6; k++) {let t: f32=(f32(k)+noise.y)/6.0f;let t_rg: f32=clamp(t*2.0f,0.0f,1.0f);let t_gb: f32=clamp((t-0.5f)*2.0f,0.0f,1.0f);let refVec: vec3f=mix(mix(refractedViewVectors[0],refractedViewVectors[1],t_rg),refractedViewVectors[2],t_gb);let uvw: vec3f=vec3f((uniforms.backgroundRefractionMatrix*(scene.view*vec4f(fragmentInputs.vPositionW+refVec*geometry_thickness,1.0f))).xyz);var coords: vec2f=uvw.xy/uvw.z;coords.y=1.0f-coords.y;let s: vec4f=textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,coords+noiseOffset,refractionLOD);let rw: f32=max(0.0f,1.0f-2.0f*t);let gw: f32=max(0.0f,1.0f-abs(2.0f*t-1.0f));let bw: f32=max(0.0f,2.0f*t-1.0f);let w: vec3f=vec3f(rw,gw,bw);dispResult+=s.rgb*w;dispWeight+=w;}
slab_translucent_background=vec4f(dispResult/max(dispWeight,vec3f(1e-6)),1.0f);}
#else
for (var i: i32=0; i<3; i++) {let refractedViewVector: vec3f=refractedViewVectors[i];let uvw: vec3f=vec3f((uniforms.backgroundRefractionMatrix*(scene.view*vec4f(fragmentInputs.vPositionW+refractedViewVector*geometry_thickness,1.0f))).xyz);var coords: vec2f=uvw.xy/uvw.z;coords.y=1.0f-coords.y;if (refractionLOD>0.0f) {let noiseOffset: vec2f=noise.xy*lodTexelSize;slab_translucent_background[i]=textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,coords+noiseOffset,refractionLOD)[i];} else {slab_translucent_background[i]=textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,coords,0.0f)[i];}}
#endif
}
#else
{let refractionUVW: vec3f=vec3f((uniforms.backgroundRefractionMatrix*(scene.view*vec4f(fragmentInputs.vPositionW+refractedViewVector*geometry_thickness,1.0f))).xyz);var refractionCoords: vec2f=refractionUVW.xy/refractionUVW.z;refractionCoords.y=1.0f-refractionCoords.y;if (refractionLOD>0.0f) {
#ifdef REFRACTION_HIGH_QUALITY_BLUR
let cosA: f32=cos(noise.x*PI);let sinA: f32=sin(noise.x*PI);let u: vec2f=vec2f( cosA,sinA)*(0.5f*lodTexelSize);let v: vec2f=vec2f(-sinA,cosA)*(0.5f*lodTexelSize);slab_translucent_background=0.25f*(
textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,refractionCoords+u+v,refractionLOD) +
textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,refractionCoords-u+v,refractionLOD) +
textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,refractionCoords+u-v,refractionLOD) +
textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,refractionCoords-u-v,refractionLOD)
);
#else
let noiseOffset: vec2f=noise.xy*lodTexelSize;slab_translucent_background=textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,refractionCoords+noiseOffset,refractionLOD);
#endif
} else {slab_translucent_background=textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,refractionCoords,0.0f);}}
#endif
}
#endif
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStoreWGSL[name]) {
    ShaderStore.IncludesShadersStoreWGSL[name] = shader;
}
/** @internal */
export const openpbrBackgroundTransmissionWGSL = { name, shader };
//# sourceMappingURL=openpbrBackgroundTransmission.js.map