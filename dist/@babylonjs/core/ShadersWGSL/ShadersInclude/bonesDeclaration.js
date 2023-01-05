// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "bonesDeclaration";
const shader = `#if NUM_BONE_INFLUENCERS>0
attribute matricesIndices : vec4<f32>;
attribute matricesIndicesExtra : vec4<f32>;
#ifndef BAKED_VERTEX_ANIMATION_TEXTURE
#ifdef BONETEXTURE
var boneSampler : texture_2d<f32>;
uniform mBones : array<mat4x4,BonesPerMesh>;
uniform mPreviousBones : array<mat4x4,BonesPerMesh>;
#endif
#ifdef BONETEXTURE
fn readMatrixFromRawSampler(smp : texture_2d<f32>,index : f32)->mat4x4<f32>
#endif
#endif
`;
// Sideeffect
ShaderStore.IncludesShadersStoreWGSL[name] = shader;
/** @internal */
export const bonesDeclaration = { name, shader };
//# sourceMappingURL=bonesDeclaration.js.map