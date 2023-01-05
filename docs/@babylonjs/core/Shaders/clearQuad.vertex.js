// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "clearQuadVertexShader";
const shader = `uniform float depthValue;
void main(void) {
gl_Position=vec4(pos[gl_VertexID],depthValue,1.0);
}
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const clearQuadVertexShader = { name, shader };
//# sourceMappingURL=clearQuad.vertex.js.map