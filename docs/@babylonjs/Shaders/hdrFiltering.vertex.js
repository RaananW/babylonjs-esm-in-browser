// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "hdrFilteringVertexShader";
const shader = `attribute vec2 position;
void main(void) {
mat3 view=mat3(up,right,front);
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const hdrFilteringVertexShader = { name, shader };
//# sourceMappingURL=hdrFiltering.vertex.js.map