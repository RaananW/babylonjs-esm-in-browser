// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/clipPlaneFragmentDeclaration.js";
import "./ShadersInclude/imageProcessingDeclaration.js";
import "./ShadersInclude/logDepthDeclaration.js";
import "./ShadersInclude/helperFunctions.js";
import "./ShadersInclude/imageProcessingFunctions.js";
import "./ShadersInclude/clipPlaneFragment.js";
import "./ShadersInclude/logDepthFragment.js";
const name = "particlesPixelShader";
const shader = `#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
varying vec2 vUV;
#include<imageProcessingDeclaration>
#include<logDepthDeclaration>
#include<helperFunctions>
#include<imageProcessingFunctions>
#ifdef RAMPGRADIENT
varying vec4 remapRanges;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#include<clipPlaneFragment>
vec4 textureColor=texture2D(diffuseSampler,vUV);
float alpha=baseColor.a;
#ifdef BLENDMULTIPLYMODE
float sourceAlpha=vColor.a*textureColor.a;
#include<logDepthFragment>
#ifdef IMAGEPROCESSINGPOSTPROCESS
baseColor.rgb=toLinearSpace(baseColor.rgb);
#ifdef IMAGEPROCESSING
baseColor.rgb=toLinearSpace(baseColor.rgb);
#endif
gl_FragColor=baseColor;
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const particlesPixelShader = { name, shader };
//# sourceMappingURL=particles.fragment.js.map