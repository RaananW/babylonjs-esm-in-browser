// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "openpbrTransmissionLayerData";
const shader = `float transmission_weight=vTransmissionWeight;vec3 transmission_color=vTransmissionColor.rgb;float transmission_depth=vTransmissionDepth;vec3 transmission_scatter=vTransmissionScatter.rgb;float transmission_scatter_anisotropy=clamp(vTransmissionScatterAnisotropy,-0.9999,0.9999);float transmission_dispersion_scale=vTransmissionDispersionScale;float transmission_dispersion_abbe_number=vTransmissionDispersionAbbeNumber;
#ifdef TRANSMISSION_WEIGHT
vec4 transmissionWeightFromTexture=TEXRD(transmissionWeightSampler,vTransmissionWeightUV+uvOffset);
#endif
#ifdef TRANSMISSION_COLOR
vec4 transmissionColorFromTexture=TEXRD(transmissionColorSampler,vTransmissionColorUV+uvOffset);
#endif
#ifdef TRANSMISSION_DEPTH
vec4 transmissionDepthFromTexture=TEXRD(transmissionDepthSampler,vTransmissionDepthUV+uvOffset);
#endif
#ifdef TRANSMISSION_SCATTER
vec4 transmissionScatterFromTexture=TEXRD(transmissionScatterSampler,vTransmissionScatterUV+uvOffset);
#endif
#ifdef TRANSMISSION_DISPERSION_SCALE
vec4 transmissionDispersionScaleFromTexture=TEXRD(transmissionDispersionScaleSampler,vTransmissionDispersionScaleUV+uvOffset);
#endif
#ifdef TRANSMISSION_WEIGHT
transmission_weight*=transmissionWeightFromTexture.r;
#endif
#ifdef TRANSMISSION_COLOR
#ifdef TRANSMISSION_COLOR_GAMMA
transmission_color*=toLinearSpace(transmissionColorFromTexture.rgb);
#else
transmission_color*=transmissionColorFromTexture.rgb;
#endif
transmission_color*=vTransmissionColorInfos.y;
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
if (!ShaderStore.IncludesShadersStore[name]) {
    ShaderStore.IncludesShadersStore[name] = shader;
}
/** @internal */
export const openpbrTransmissionLayerData = { name, shader };
//# sourceMappingURL=openpbrTransmissionLayerData.js.map