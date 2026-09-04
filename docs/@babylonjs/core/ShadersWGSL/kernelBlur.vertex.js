// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { kernelBlurVaryingDeclarationWGSL } from "./ShadersInclude/kernelBlurVaryingDeclaration.js";
import { kernelBlurVertexWGSL } from "./ShadersInclude/kernelBlurVertex.js";
const name = "kernelBlurVertexShader";
const shader = `attribute position: vec2f;uniform delta: vec2f;varying sampleCenter: vec2f;
#include<kernelBlurVaryingDeclaration>[0..varyingCount]
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {const madd: vec2f= vec2f(0.5,0.5);
#define CUSTOM_VERTEX_MAIN_BEGIN
vertexOutputs.sampleCenter=(vertexInputs.position*madd+madd);
#include<kernelBlurVertex>[0..varyingCount]
vertexOutputs.position= vec4f(vertexInputs.position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;
// Sideeffect
if (!ShaderStore.ShadersStoreWGSL[name]) {
    ShaderStore.ShadersStoreWGSL[name] = shader;
}
const includes = [kernelBlurVaryingDeclarationWGSL, kernelBlurVertexWGSL];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStoreWGSL[inc.name]) {
        ShaderStore.IncludesShadersStoreWGSL[inc.name] = inc.shader;
    }
}
/** @internal */
export const kernelBlurVertexShaderWGSL = { name, shader };
//# sourceMappingURL=kernelBlur.vertex.js.map