// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { helperFunctionsWGSL } from "./ShadersInclude/helperFunctions.js";
const name = "iblScaledLuminancePixelShader";
const shader = `#include<helperFunctions>
#ifdef IBL_USE_CUBE_MAP
var iblSourceSampler: sampler;var iblSource: texture_cube<f32>;
#else
var iblSourceSampler: sampler;var iblSource: texture_2d<f32>;
#endif
uniform iblHeight: i32;uniform iblWidth: i32;fn fetchLuminance(coords: vec2f)->f32 {
#ifdef IBL_USE_CUBE_MAP
var direction: vec3f=equirectangularToCubemapDirection(coords);var color: vec3f=textureSampleLevel(iblSource,iblSourceSampler,direction,0.0).rgb;
#else
var color: vec3f=textureSampleLevel(iblSource,iblSourceSampler,coords,0.0).rgb;
#endif
return dot(color,LuminanceEncodeApprox);}
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var deform: f32=sin(input.vUV.y*PI);var luminance: f32=fetchLuminance(input.vUV);fragmentOutputs.color=vec4f(vec3f(deform*luminance),1.0);}`;
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
export const iblScaledLuminancePixelShaderWGSL = { name, shader };
//# sourceMappingURL=iblScaledLuminance.fragment.js.map