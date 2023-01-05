// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/kernelBlurVaryingDeclaration.js";
import "./ShadersInclude/kernelBlurVertex.js";
const name = "kernelBlurVertexShader";
const shader = `attribute vec2 position;
const vec2 madd=vec2(0.5,0.5);
void main(void) {
sampleCenter=(position*madd+madd);
gl_Position=vec4(position,0.0,1.0);
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const kernelBlurVertexShader = { name, shader };
//# sourceMappingURL=kernelBlur.vertex.js.map