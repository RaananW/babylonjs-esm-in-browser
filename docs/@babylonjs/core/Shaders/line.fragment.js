// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { clipPlaneFragmentDeclaration } from "./ShadersInclude/clipPlaneFragmentDeclaration.js";
import { logDepthDeclaration } from "./ShadersInclude/logDepthDeclaration.js";
import { logDepthFragment } from "./ShadersInclude/logDepthFragment.js";
import { clipPlaneFragment } from "./ShadersInclude/clipPlaneFragment.js";
const name = "linePixelShader";
const shader = `#include<clipPlaneFragmentDeclaration>
uniform vec4 color;
#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
#include<logDepthDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<logDepthFragment>
#include<clipPlaneFragment>
gl_FragColor=color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;
// Sideeffect
if (!ShaderStore.ShadersStore[name]) {
    ShaderStore.ShadersStore[name] = shader;
}
const includes = [clipPlaneFragmentDeclaration, logDepthDeclaration, logDepthFragment, clipPlaneFragment];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStore[inc.name]) {
        ShaderStore.IncludesShadersStore[inc.name] = inc.shader;
    }
}
/** @internal */
export const linePixelShader = { name, shader };
//# sourceMappingURL=line.fragment.js.map