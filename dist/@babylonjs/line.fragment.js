// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/clipPlaneFragmentDeclaration.js";
import "./ShadersInclude/clipPlaneFragment.js";
const name = "linePixelShader";
const shader = `#include<clipPlaneFragmentDeclaration>
uniform vec4 color;#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
gl_FragColor=color;#define CUSTOM_FRAGMENT_MAIN_END
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const linePixelShader = { name, shader };
//# sourceMappingURL=line.fragment.js.map