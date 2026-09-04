// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { helperFunctions } from "./ShadersInclude/helperFunctions.js";
const name = "rgbdDecodePixelShader";
const shader = `varying vec2 vUV;uniform sampler2D textureSampler;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=vec4(fromRGBD(texture2D(textureSampler,vUV)),1.0);}`;
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
export const rgbdDecodePixelShader = { name, shader };
//# sourceMappingURL=rgbdDecode.fragment.js.map