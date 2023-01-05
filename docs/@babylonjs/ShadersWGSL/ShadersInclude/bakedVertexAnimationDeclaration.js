// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "bakedVertexAnimationDeclaration";
const shader = `#ifdef BAKED_VERTEX_ANIMATION_TEXTURE
uniform bakedVertexAnimationTime: f32;
attribute bakedVertexAnimationSettingsInstanced : vec4<f32>;
fn readMatrixFromRawSamplerVAT(smp : texture_2d<f32>,index : f32,frame : f32)->mat4x4<f32>
`;
// Sideeffect
ShaderStore.IncludesShadersStoreWGSL[name] = shader;
/** @internal */
export const bakedVertexAnimationDeclaration = { name, shader };
//# sourceMappingURL=bakedVertexAnimationDeclaration.js.map