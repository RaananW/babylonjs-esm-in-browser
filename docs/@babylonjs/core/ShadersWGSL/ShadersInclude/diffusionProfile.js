// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "diffusionProfile";
const shader = `uniform diffusionS: array<vec3f,5>;uniform diffusionD: array<f32,5>;uniform filterRadii: array<f32,5>;
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStoreWGSL[name]) {
    ShaderStore.IncludesShadersStoreWGSL[name] = shader;
}
/** @internal */
export const diffusionProfileWGSL = { name, shader };
//# sourceMappingURL=diffusionProfile.js.map