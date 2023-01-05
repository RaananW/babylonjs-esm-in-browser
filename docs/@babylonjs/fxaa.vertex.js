// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "fxaaVertexShader";
const shader = `attribute vec2 position;
void main(void) {
vUV=(position*madd+madd);
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const fxaaVertexShader = { name, shader };
//# sourceMappingURL=fxaa.vertex.js.map