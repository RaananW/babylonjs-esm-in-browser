// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { imageProcessingDeclaration } from "./ShadersInclude/imageProcessingDeclaration.js";
import { helperFunctions } from "./ShadersInclude/helperFunctions.js";
import { imageProcessingFunctions } from "./ShadersInclude/imageProcessingFunctions.js";
const name = "imageProcessingPixelShader";
const shader = `varying vec2 vUV;uniform sampler2D textureSampler;
#include<imageProcessingDeclaration>
#include<helperFunctions>
#include<imageProcessingFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{vec4 result=texture2D(textureSampler,vUV);result.rgb=max(result.rgb,vec3(0.));
#ifdef IMAGEPROCESSING
#ifndef FROMLINEARSPACE
result.rgb=toLinearSpace(result.rgb);
#endif
result=applyImageProcessing(result);
#else
#ifdef FROMLINEARSPACE
result=applyImageProcessing(result);
#endif
#endif
gl_FragColor=result;}`;
// Sideeffect
if (!ShaderStore.ShadersStore[name]) {
    ShaderStore.ShadersStore[name] = shader;
}
const includes = [imageProcessingDeclaration, helperFunctions, imageProcessingFunctions];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStore[inc.name]) {
        ShaderStore.IncludesShadersStore[inc.name] = inc.shader;
    }
}
/** @internal */
export const imageProcessingPixelShader = { name, shader };
//# sourceMappingURL=imageProcessing.fragment.js.map