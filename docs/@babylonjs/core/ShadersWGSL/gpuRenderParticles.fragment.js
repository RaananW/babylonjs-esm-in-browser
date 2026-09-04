// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { clipPlaneFragmentDeclarationWGSL } from "./ShadersInclude/clipPlaneFragmentDeclaration.js";
import { imageProcessingDeclarationWGSL } from "./ShadersInclude/imageProcessingDeclaration.js";
import { logDepthDeclarationWGSL } from "./ShadersInclude/logDepthDeclaration.js";
import { helperFunctionsWGSL } from "./ShadersInclude/helperFunctions.js";
import { imageProcessingFunctionsWGSL } from "./ShadersInclude/imageProcessingFunctions.js";
import { fogFragmentDeclarationWGSL } from "./ShadersInclude/fogFragmentDeclaration.js";
import { clipPlaneFragmentWGSL } from "./ShadersInclude/clipPlaneFragment.js";
import { logDepthFragmentWGSL } from "./ShadersInclude/logDepthFragment.js";
import { fogFragmentWGSL } from "./ShadersInclude/fogFragment.js";
const name = "gpuRenderParticlesPixelShader";
const shader = `var diffuseSamplerSampler: sampler;var diffuseSampler: texture_2d<f32>;varying vUV: vec2f;varying vColor: vec4f;
#include<clipPlaneFragmentDeclaration>
#include<imageProcessingDeclaration>
#include<logDepthDeclaration>
#include<helperFunctions>
#include<imageProcessingFunctions>
#include<fogFragmentDeclaration>
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#include<clipPlaneFragment>
let textureColor: vec4f=textureSample(diffuseSampler,diffuseSamplerSampler,input.vUV);var baseColor: vec4f=textureColor*input.vColor;
#ifdef BLENDMULTIPLYMODE
let alpha: f32=input.vColor.a*textureColor.a;baseColor=vec4f(baseColor.rgb*alpha+vec3f(1.0)*(1.0-alpha),baseColor.a);
#endif
#include<logDepthFragment>
#include<fogFragment>(color,baseColor)
#ifdef IMAGEPROCESSINGPOSTPROCESS
baseColor=vec4f(toLinearSpaceVec3(baseColor.rgb),baseColor.a);
#else
#ifdef IMAGEPROCESSING
baseColor=vec4f(toLinearSpaceVec3(baseColor.rgb),baseColor.a);baseColor=applyImageProcessing(baseColor);
#endif
#endif
fragmentOutputs.color=baseColor;}
`;
// Sideeffect
if (!ShaderStore.ShadersStoreWGSL[name]) {
    ShaderStore.ShadersStoreWGSL[name] = shader;
}
const includes = [clipPlaneFragmentDeclarationWGSL, imageProcessingDeclarationWGSL, logDepthDeclarationWGSL, helperFunctionsWGSL, imageProcessingFunctionsWGSL, fogFragmentDeclarationWGSL, clipPlaneFragmentWGSL, logDepthFragmentWGSL, fogFragmentWGSL];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStoreWGSL[inc.name]) {
        ShaderStore.IncludesShadersStoreWGSL[inc.name] = inc.shader;
    }
}
/** @internal */
export const gpuRenderParticlesPixelShaderWGSL = { name, shader };
//# sourceMappingURL=gpuRenderParticles.fragment.js.map