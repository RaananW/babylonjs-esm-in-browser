// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "gaussianSplattingVertexDeclaration";
const shader = `attribute vec3 position;attribute vec4 splatIndex0;attribute vec4 splatIndex1;attribute vec4 splatIndex2;attribute vec4 splatIndex3;uniform mat4 view;uniform mat4 projection;uniform mat4 world;uniform vec4 vEyePosition;`;
// Sideeffect
if (!ShaderStore.IncludesShadersStore[name]) {
    ShaderStore.IncludesShadersStore[name] = shader;
}
/** @internal */
export const gaussianSplattingVertexDeclaration = { name, shader };
//# sourceMappingURL=gaussianSplattingVertexDeclaration.js.map