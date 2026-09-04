// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "clearQuadPixelShader";
const shader = `uniform color: vec4f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=uniforms.color;}
`;
// Sideeffect
if (!ShaderStore.ShadersStoreWGSL[name]) {
    ShaderStore.ShadersStoreWGSL[name] = shader;
}
/** @internal */
export const clearQuadPixelShaderWGSL = { name, shader };
//# sourceMappingURL=clearQuad.fragment.js.map