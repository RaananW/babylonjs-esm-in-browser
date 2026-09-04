// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { imageProcessingDeclarationWGSL } from "./ShadersInclude/imageProcessingDeclaration.js";
import { helperFunctionsWGSL } from "./ShadersInclude/helperFunctions.js";
import { imageProcessingFunctionsWGSL } from "./ShadersInclude/imageProcessingFunctions.js";
const name = "imageProcessingPixelShader";
const shader = `varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#include<imageProcessingDeclaration>
#include<helperFunctions>
#include<imageProcessingFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var result: vec4f=textureSample(textureSampler,textureSamplerSampler,input.vUV);result=vec4f(max(result.rgb,vec3f(0.)),result.a);
#ifdef IMAGEPROCESSING
#ifndef FROMLINEARSPACE
result=vec4f(toLinearSpaceVec3(result.rgb),result.a);
#endif
result=applyImageProcessing(result);
#else
#ifdef FROMLINEARSPACE
result=applyImageProcessing(result);
#endif
#endif
fragmentOutputs.color=result;}`;
// Sideeffect
if (!ShaderStore.ShadersStoreWGSL[name]) {
    ShaderStore.ShadersStoreWGSL[name] = shader;
}
const includes = [imageProcessingDeclarationWGSL, helperFunctionsWGSL, imageProcessingFunctionsWGSL];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStoreWGSL[inc.name]) {
        ShaderStore.IncludesShadersStoreWGSL[inc.name] = inc.shader;
    }
}
/** @internal */
export const imageProcessingPixelShaderWGSL = { name, shader };
//# sourceMappingURL=imageProcessing.fragment.js.map