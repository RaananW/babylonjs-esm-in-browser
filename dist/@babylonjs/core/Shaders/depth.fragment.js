// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/clipPlaneFragmentDeclaration.js";
import "./ShadersInclude/packingFunctions.js";
import "./ShadersInclude/clipPlaneFragment.js";
const name = "depthPixelShader";
const shader = `#ifdef ALPHATEST
varying vec2 vUV;
#include<clipPlaneFragmentDeclaration>
varying float vDepthMetric;
#include<packingFunctions>
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
#ifdef ALPHATEST
if (texture2D(diffuseSampler,vUV).a<0.4)
#ifdef NONLINEARDEPTH
#ifdef PACKED
gl_FragColor=pack(gl_FragCoord.z);
gl_FragColor=vec4(gl_FragCoord.z,0.0,0.0,0.0);
#else
#ifdef PACKED
gl_FragColor=pack(vDepthMetric);
gl_FragColor=vec4(vDepthMetric,0.0,0.0,1.0);
#endif
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const depthPixelShader = { name, shader };
//# sourceMappingURL=depth.fragment.js.map