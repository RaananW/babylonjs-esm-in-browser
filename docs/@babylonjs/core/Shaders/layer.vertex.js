// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "layerVertexShader";
const shader = `attribute vec2 position;
void main(void) {
vec2 shiftedPosition=position*scale+offset;
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const layerVertexShader = { name, shader };
//# sourceMappingURL=layer.vertex.js.map