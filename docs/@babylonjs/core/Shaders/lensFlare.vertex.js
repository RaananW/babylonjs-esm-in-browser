// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "lensFlareVertexShader";
const shader = `attribute vec2 position;
void main(void) {
vUV=position*madd+madd;
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const lensFlareVertexShader = { name, shader };
//# sourceMappingURL=lensFlare.vertex.js.map