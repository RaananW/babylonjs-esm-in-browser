// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "openpbrTransmissionLayerData";
const shader = `var transmission_weight: f32=uniforms.vTransmissionWeight;var transmission_color: vec3f=uniforms.vTransmissionColor.rgb;var transmission_depth: f32=uniforms.vTransmissionDepth;var transmission_scatter: vec3f=uniforms.vTransmissionScatter.rgb;var transmission_scatter_anisotropy: f32=clamp(uniforms.vTransmissionScatterAnisotropy,-0.9999f,0.9999f);var transmission_dispersion_scale: f32=uniforms.vTransmissionDispersionScale;var transmission_dispersion_abbe_number: f32=uniforms.vTransmissionDispersionAbbeNumber;
#ifdef TRANSMISSION_WEIGHT
let transmissionWeightFromTexture: vec4f=TEXRD(transmissionWeightSampler,transmissionWeightSamplerSampler,fragmentInputs.vTransmissionWeightUV+uvOffset);
#endif
#ifdef TRANSMISSION_COLOR
let transmissionColorFromTexture: vec4f=TEXRD(transmissionColorSampler,transmissionColorSamplerSampler,fragmentInputs.vTransmissionColorUV+uvOffset);
#endif
#ifdef TRANSMISSION_DEPTH
let transmissionDepthFromTexture: vec4f=TEXRD(transmissionDepthSampler,transmissionDepthSamplerSampler,fragmentInputs.vTransmissionDepthUV+uvOffset);
#endif
#ifdef TRANSMISSION_SCATTER
let transmissionScatterFromTexture: vec4f=TEXRD(transmissionScatterSampler,transmissionScatterSamplerSampler,fragmentInputs.vTransmissionScatterUV+uvOffset);
#endif
#ifdef TRANSMISSION_DISPERSION_SCALE
let transmissionDispersionScaleFromTexture: vec4f=TEXRD(transmissionDispersionScaleSampler,transmissionDispersionScaleSamplerSampler,fragmentInputs.vTransmissionDispersionScaleUV+uvOffset);
#endif
#ifdef TRANSMISSION_WEIGHT
transmission_weight*=transmissionWeightFromTexture.r;
#endif
#ifdef TRANSMISSION_COLOR
#ifdef TRANSMISSION_COLOR_GAMMA
transmission_color*=toLinearSpaceVec3(transmissionColorFromTexture.rgb);
#else
transmission_color*=transmissionColorFromTexture.rgb;
#endif
transmission_color*=uniforms.vTransmissionColorInfos.y;
#endif
#ifdef TRANSMISSION_DEPTH
transmission_depth*=transmissionDepthFromTexture.r;
#endif
#ifdef TRANSMISSION_SCATTER
transmission_scatter*=transmissionScatterFromTexture.rgb;
#endif
#ifdef TRANSMISSION_DISPERSION_SCALE
transmission_dispersion_scale*=transmissionDispersionScaleFromTexture.r;
#endif
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStoreWGSL[name]) {
    ShaderStore.IncludesShadersStoreWGSL[name] = shader;
}
/** @internal */
export const openpbrTransmissionLayerDataWGSL = { name, shader };
//# sourceMappingURL=openpbrTransmissionLayerData.js.map