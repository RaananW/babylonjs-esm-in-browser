// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/clipPlaneFragmentDeclaration.js";
import "./ShadersInclude/clipPlaneFragment.js";
const name = "linePixelShader";
const shader = `#include<clipPlaneFragmentDeclaration>
uniform vec4 color;
void main(void) {
#include<clipPlaneFragment>
gl_FragColor=color;
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const linePixelShader = { name, shader };
//# sourceMappingURL=line.fragment.js.map