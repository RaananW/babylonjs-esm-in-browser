// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "bakedVertexAnimationDeclaration";
const shader = `#ifdef BAKED_VERTEX_ANIMATION_TEXTURE
uniform float bakedVertexAnimationTime;
attribute vec4 bakedVertexAnimationSettingsInstanced;
#define inline
mat4 readMatrixFromRawSamplerVAT(sampler2D smp,float index,float frame)
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const bakedVertexAnimationDeclaration = { name, shader };
//# sourceMappingURL=bakedVertexAnimationDeclaration.js.map