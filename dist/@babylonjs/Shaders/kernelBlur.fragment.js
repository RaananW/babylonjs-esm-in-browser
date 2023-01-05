// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/kernelBlurVaryingDeclaration.js";
import "./ShadersInclude/packingFunctions.js";
import "./ShadersInclude/kernelBlurFragment.js";
import "./ShadersInclude/kernelBlurFragment2.js";
const name = "kernelBlurPixelShader";
const shader = `uniform sampler2D textureSampler;
uniform sampler2D circleOfConfusionSampler;
#include<kernelBlurVaryingDeclaration>[0..varyingCount]
#ifdef PACKEDFLOAT
#include<packingFunctions>
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
float blend=0.;
vec4 blend=vec4(0.);
#ifdef DOF
float sumOfWeights=CENTER_WEIGHT; 
blend+=unpack(texture2D(textureSampler,sampleCenter))*CENTER_WEIGHT;
blend+=texture2D(textureSampler,sampleCenter)*CENTER_WEIGHT;
#endif
#include<kernelBlurFragment>[0..varyingCount]
#include<kernelBlurFragment2>[0..depCount]
#ifdef PACKEDFLOAT
gl_FragColor=pack(blend);
gl_FragColor=blend;
#ifdef DOF
gl_FragColor/=sumOfWeights;
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const kernelBlurPixelShader = { name, shader };
//# sourceMappingURL=kernelBlur.fragment.js.map