// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { helperFunctionsWGSL } from "./ShadersInclude/helperFunctions.js";
const name = "layerPixelShader";
const shader = `varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform color: vec4f;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
var baseColor: vec4f=textureSample(textureSampler,textureSamplerSampler,input.vUV);
#if defined(CONVERT_TO_GAMMA)
baseColor=toGammaSpace(baseColor);
#elif defined(CONVERT_TO_LINEAR)
baseColor=toLinearSpaceVec4(baseColor);
#endif
#ifdef ALPHATEST
if (baseColor.a<0.4) {discard;}
#endif
fragmentOutputs.color=baseColor*uniforms.color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;
// Sideeffect
if (!ShaderStore.ShadersStoreWGSL[name]) {
    ShaderStore.ShadersStoreWGSL[name] = shader;
}
const includes = [helperFunctionsWGSL];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStoreWGSL[inc.name]) {
        ShaderStore.IncludesShadersStoreWGSL[inc.name] = inc.shader;
    }
}
/** @internal */
export const layerPixelShaderWGSL = { name, shader };
//# sourceMappingURL=layer.fragment.js.map