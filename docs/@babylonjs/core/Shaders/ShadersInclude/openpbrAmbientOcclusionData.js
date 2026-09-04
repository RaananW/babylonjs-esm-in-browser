// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "openpbrAmbientOcclusionData";
const shader = `vec3 ambient_occlusion=vec3(1.0);float specular_ambient_occlusion=1.0;float coat_specular_ambient_occlusion=1.0;
#ifdef AMBIENT_OCCLUSION
vec3 ambientOcclusionFromTexture=TEXRD(ambientOcclusionSampler,vAmbientOcclusionUV+uvOffset).rgb;ambient_occlusion=vec3(ambientOcclusionFromTexture.r*vAmbientOcclusionInfos.y+(1.0-vAmbientOcclusionInfos.y));
#endif
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStore[name]) {
    ShaderStore.IncludesShadersStore[name] = shader;
}
/** @internal */
export const openpbrAmbientOcclusionData = { name, shader };
//# sourceMappingURL=openpbrAmbientOcclusionData.js.map