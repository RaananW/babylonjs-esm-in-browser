// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "oitFinalSimpleBlendPixelShader";
const shader = `var uFrontColor: texture_2d<f32>;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var fragCoord: vec2i=vec2i(fragmentInputs.position.xy);var frontColor: vec4f=textureLoad(uFrontColor,fragCoord,0);fragmentOutputs.color=frontColor;}
`;
// Sideeffect
if (!ShaderStore.ShadersStoreWGSL[name]) {
    ShaderStore.ShadersStoreWGSL[name] = shader;
}
/** @internal */
export const oitFinalSimpleBlendPixelShaderWGSL = { name, shader };
//# sourceMappingURL=oitFinalSimpleBlend.fragment.js.map