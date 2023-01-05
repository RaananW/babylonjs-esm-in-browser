// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "fluidRenderingParticleDepthVertexShader";
const shader = `attribute vec3 position;
attribute vec3 velocity;
void main(void) {
velocityNorm=length(velocity);
}
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const fluidRenderingParticleDepthVertexShader = { name, shader };
//# sourceMappingURL=fluidRenderingParticleDepth.vertex.js.map