// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { helperFunctions } from "./ShadersInclude/helperFunctions.js";
const name = "extractHighlightsPixelShader";
const shader = `#include<helperFunctions>
varying vec2 vUV;uniform sampler2D textureSampler;uniform float threshold;uniform float exposure;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=texture2D(textureSampler,vUV);float luma=dot(LuminanceEncodeApprox,gl_FragColor.rgb*exposure);gl_FragColor.rgb=step(threshold,luma)*gl_FragColor.rgb;}`;
// Sideeffect
if (!ShaderStore.ShadersStore[name]) {
    ShaderStore.ShadersStore[name] = shader;
}
const includes = [helperFunctions];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStore[inc.name]) {
        ShaderStore.IncludesShadersStore[inc.name] = inc.shader;
    }
}
/** @internal */
export const extractHighlightsPixelShader = { name, shader };
//# sourceMappingURL=extractHighlights.fragment.js.map