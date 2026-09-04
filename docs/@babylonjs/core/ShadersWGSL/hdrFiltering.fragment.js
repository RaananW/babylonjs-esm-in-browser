// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { helperFunctionsWGSL } from "./ShadersInclude/helperFunctions.js";
import { importanceSamplingWGSL } from "./ShadersInclude/importanceSampling.js";
import { pbrBRDFFunctionsWGSL } from "./ShadersInclude/pbrBRDFFunctions.js";
import { hdrFilteringFunctionsWGSL } from "./ShadersInclude/hdrFilteringFunctions.js";
const name = "hdrFilteringPixelShader";
const shader = `#include<helperFunctions>
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
uniform alphaG: f32;var inputTextureSampler: sampler;var inputTexture: texture_cube<f32>;uniform vFilteringInfo: vec2f;uniform hdrScale: f32;varying direction: vec3f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var color: vec3f=radiance(uniforms.alphaG,inputTexture,inputTextureSampler,input.direction,uniforms.vFilteringInfo);fragmentOutputs.color= vec4f(color*uniforms.hdrScale,1.0);}`;
// Sideeffect
if (!ShaderStore.ShadersStoreWGSL[name]) {
    ShaderStore.ShadersStoreWGSL[name] = shader;
}
const includes = [helperFunctionsWGSL, importanceSamplingWGSL, pbrBRDFFunctionsWGSL, hdrFilteringFunctionsWGSL];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStoreWGSL[inc.name]) {
        ShaderStore.IncludesShadersStoreWGSL[inc.name] = inc.shader;
    }
}
/** @internal */
export const hdrFilteringPixelShaderWGSL = { name, shader };
//# sourceMappingURL=hdrFiltering.fragment.js.map