// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { clipPlaneFragmentDeclaration2 } from "./ShadersInclude/clipPlaneFragmentDeclaration2.js";
import { imageProcessingDeclaration } from "./ShadersInclude/imageProcessingDeclaration.js";
import { logDepthDeclaration } from "./ShadersInclude/logDepthDeclaration.js";
import { helperFunctions } from "./ShadersInclude/helperFunctions.js";
import { imageProcessingFunctions } from "./ShadersInclude/imageProcessingFunctions.js";
import { fogFragmentDeclaration } from "./ShadersInclude/fogFragmentDeclaration.js";
import { clipPlaneFragment } from "./ShadersInclude/clipPlaneFragment.js";
import { logDepthFragment } from "./ShadersInclude/logDepthFragment.js";
import { fogFragment } from "./ShadersInclude/fogFragment.js";
const name = "gpuRenderParticlesPixelShader";
const shader = `precision highp float;
#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
uniform sampler2D diffuseSampler;varying vec2 vUV;varying vec4 vColor;
#include<clipPlaneFragmentDeclaration2> 
#include<imageProcessingDeclaration>
#include<logDepthDeclaration>
#include<helperFunctions>
#include<imageProcessingFunctions>
#include<fogFragmentDeclaration>
void main() {
#include<clipPlaneFragment> 
vec4 textureColor=texture2D(diffuseSampler,vUV);gl_FragColor=textureColor*vColor;
#ifdef BLENDMULTIPLYMODE
float alpha=vColor.a*textureColor.a;gl_FragColor.rgb=gl_FragColor.rgb*alpha+vec3(1.0)*(1.0-alpha);
#endif 
#include<logDepthFragment>
#include<fogFragment>(color,gl_FragColor)
#ifdef IMAGEPROCESSINGPOSTPROCESS
gl_FragColor.rgb=toLinearSpace(gl_FragColor.rgb);
#else
#ifdef IMAGEPROCESSING
gl_FragColor.rgb=toLinearSpace(gl_FragColor.rgb);gl_FragColor=applyImageProcessing(gl_FragColor);
#endif
#endif
}
`;
// Sideeffect
if (!ShaderStore.ShadersStore[name]) {
    ShaderStore.ShadersStore[name] = shader;
}
const includes = [clipPlaneFragmentDeclaration2, imageProcessingDeclaration, logDepthDeclaration, helperFunctions, imageProcessingFunctions, fogFragmentDeclaration, clipPlaneFragment, logDepthFragment, fogFragment];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStore[inc.name]) {
        ShaderStore.IncludesShadersStore[inc.name] = inc.shader;
    }
}
/** @internal */
export const gpuRenderParticlesPixelShader = { name, shader };
//# sourceMappingURL=gpuRenderParticles.fragment.js.map