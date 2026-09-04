// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { clipPlaneFragmentDeclaration } from "./ShadersInclude/clipPlaneFragmentDeclaration.js";
import { logDepthDeclaration } from "./ShadersInclude/logDepthDeclaration.js";
import { clipPlaneFragment } from "./ShadersInclude/clipPlaneFragment.js";
import { logDepthFragment } from "./ShadersInclude/logDepthFragment.js";
const name = "outlinePixelShader";
const shader = `#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
uniform vec4 color;
#ifdef ALPHATEST
varying vec2 vUV;uniform sampler2D diffuseSampler;
#endif
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#ifdef ALPHATEST
if (texture2D(diffuseSampler,vUV).a<0.4)
discard;
#endif
#include<logDepthFragment>
gl_FragColor=color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;
// Sideeffect
if (!ShaderStore.ShadersStore[name]) {
    ShaderStore.ShadersStore[name] = shader;
}
const includes = [clipPlaneFragmentDeclaration, logDepthDeclaration, clipPlaneFragment, logDepthFragment];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStore[inc.name]) {
        ShaderStore.IncludesShadersStore[inc.name] = inc.shader;
    }
}
/** @internal */
export const outlinePixelShader = { name, shader };
//# sourceMappingURL=outline.fragment.js.map