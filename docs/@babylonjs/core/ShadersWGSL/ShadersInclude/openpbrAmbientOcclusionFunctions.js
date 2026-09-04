// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "openpbrAmbientOcclusionFunctions";
const shader = `fn compute_specular_occlusion(n_dot_v: f32,metallic: f32,ambient_occlusion: f32,roughness: f32)->f32
{let specular_occlusion: f32=saturate(pow(n_dot_v+ambient_occlusion,exp2(-16.0*roughness-1.0))-1.0+ambient_occlusion);return mix(specular_occlusion,1.0,metallic*square(1.0-roughness));}
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStoreWGSL[name]) {
    ShaderStore.IncludesShadersStoreWGSL[name] = shader;
}
/** @internal */
export const openpbrAmbientOcclusionFunctionsWGSL = { name, shader };
//# sourceMappingURL=openpbrAmbientOcclusionFunctions.js.map