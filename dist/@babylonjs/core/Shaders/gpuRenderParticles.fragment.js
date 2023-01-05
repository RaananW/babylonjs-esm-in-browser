// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/clipPlaneFragmentDeclaration2.js";
import "./ShadersInclude/imageProcessingDeclaration.js";
import "./ShadersInclude/logDepthDeclaration.js";
import "./ShadersInclude/helperFunctions.js";
import "./ShadersInclude/imageProcessingFunctions.js";
import "./ShadersInclude/clipPlaneFragment.js";
import "./ShadersInclude/logDepthFragment.js";
const name = "gpuRenderParticlesPixelShader";
const shader = `precision highp float;
#extension GL_EXT_frag_depth : enable
#endif
uniform sampler2D diffuseSampler;
#include<imageProcessingDeclaration>
#include<logDepthDeclaration>
#include<helperFunctions>
#include<imageProcessingFunctions>
void main() {
vec4 textureColor=texture2D(diffuseSampler,vUV);
float alpha=vColor.a*textureColor.a;
#include<logDepthFragment>
#ifdef IMAGEPROCESSINGPOSTPROCESS
gl_FragColor.rgb=toLinearSpace(gl_FragColor.rgb);
#ifdef IMAGEPROCESSING
gl_FragColor.rgb=toLinearSpace(gl_FragColor.rgb);
#endif
}
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const gpuRenderParticlesPixelShader = { name, shader };
//# sourceMappingURL=gpuRenderParticles.fragment.js.map