// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "openpbrAmbientOcclusionFunctions";
const shader = `float compute_specular_occlusion(const float n_dot_v,const float metallic,const float ambient_occlusion,const float roughness)
{float specular_occlusion=saturate(pow(n_dot_v+ambient_occlusion,exp2(-16.0*roughness-1.0))-1.0+ambient_occlusion);return mix(specular_occlusion,1.0,metallic*square(1.0-roughness));}
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStore[name]) {
    ShaderStore.IncludesShadersStore[name] = shader;
}
/** @internal */
export const openpbrAmbientOcclusionFunctions = { name, shader };
//# sourceMappingURL=openpbrAmbientOcclusionFunctions.js.map