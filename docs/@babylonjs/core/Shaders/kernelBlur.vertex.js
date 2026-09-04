// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { kernelBlurVaryingDeclaration } from "./ShadersInclude/kernelBlurVaryingDeclaration.js";
import { kernelBlurVertex } from "./ShadersInclude/kernelBlurVertex.js";
const name = "kernelBlurVertexShader";
const shader = `attribute vec2 position;uniform vec2 delta;varying vec2 sampleCenter;
#include<kernelBlurVaryingDeclaration>[0..varyingCount]
const vec2 madd=vec2(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
sampleCenter=(position*madd+madd);
#include<kernelBlurVertex>[0..varyingCount]
gl_Position=vec4(position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;
// Sideeffect
if (!ShaderStore.ShadersStore[name]) {
    ShaderStore.ShadersStore[name] = shader;
}
const includes = [kernelBlurVaryingDeclaration, kernelBlurVertex];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStore[inc.name]) {
        ShaderStore.IncludesShadersStore[inc.name] = inc.shader;
    }
}
/** @internal */
export const kernelBlurVertexShader = { name, shader };
//# sourceMappingURL=kernelBlur.vertex.js.map