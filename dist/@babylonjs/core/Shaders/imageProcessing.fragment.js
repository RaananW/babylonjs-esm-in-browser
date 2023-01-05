// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/imageProcessingDeclaration.js";
import "./ShadersInclude/helperFunctions.js";
import "./ShadersInclude/imageProcessingFunctions.js";
const name = "imageProcessingPixelShader";
const shader = `varying vec2 vUV;
#include<helperFunctions>
#include<imageProcessingFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
#ifndef FROMLINEARSPACE
result.rgb=toLinearSpace(result.rgb);
result=applyImageProcessing(result);
#ifdef FROMLINEARSPACE
result=applyImageProcessing(result);
#endif
gl_FragColor=result;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const imageProcessingPixelShader = { name, shader };
//# sourceMappingURL=imageProcessing.fragment.js.map