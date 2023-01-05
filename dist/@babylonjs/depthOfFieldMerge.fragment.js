// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "depthOfFieldMergePixelShader";
const shader = `uniform sampler2D textureSampler;
uniform sampler2D blurStep1;
#if BLUR_LEVEL>1
uniform sampler2D blurStep2;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
vec4 original=texture2D(textureSampler,vUV);
#if BLUR_LEVEL==1
if(coc<0.5){
#if BLUR_LEVEL==2
if(coc<0.33){
}
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const depthOfFieldMergePixelShader = { name, shader };
//# sourceMappingURL=depthOfFieldMerge.fragment.js.map