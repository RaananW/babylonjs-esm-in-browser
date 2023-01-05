// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrBlockFinalUnlitComponents";
const shader = `vec3 finalDiffuse=diffuseBase;
vec3 emissiveColorTex=texture2D(emissiveSampler,vEmissiveUV+uvOffset).rgb;
finalEmissive*=toLinearSpace(emissiveColorTex.rgb);
finalEmissive*=emissiveColorTex.rgb;
finalEmissive*= vEmissiveInfos.y;
finalEmissive*=vLightingIntensity.y;
vec3 ambientOcclusionForDirectDiffuse=mix(vec3(1.),aoOut.ambientOcclusionColor,vAmbientInfos.w);
vec3 ambientOcclusionForDirectDiffuse=aoOut.ambientOcclusionColor;
finalAmbient*=aoOut.ambientOcclusionColor;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrBlockFinalUnlitComponents = { name, shader };
//# sourceMappingURL=pbrBlockFinalUnlitComponents.js.map