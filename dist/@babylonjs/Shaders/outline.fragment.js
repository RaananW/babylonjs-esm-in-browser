// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/clipPlaneFragmentDeclaration.js";
import "./ShadersInclude/logDepthDeclaration.js";
import "./ShadersInclude/clipPlaneFragment.js";
import "./ShadersInclude/logDepthFragment.js";
const name = "outlinePixelShader";
const shader = `#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
uniform vec4 color;
varying vec2 vUV;
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#include<clipPlaneFragment>
#ifdef ALPHATEST
if (texture2D(diffuseSampler,vUV).a<0.4)
#include<logDepthFragment>
gl_FragColor=color;
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const outlinePixelShader = { name, shader };
//# sourceMappingURL=outline.fragment.js.map