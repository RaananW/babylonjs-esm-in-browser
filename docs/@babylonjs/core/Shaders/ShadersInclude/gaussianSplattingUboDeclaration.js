// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
import "./sceneUboDeclaration.js";
import "./meshUboDeclaration.js";
const name = "gaussianSplattingUboDeclaration";
const shader = `#include<sceneUboDeclaration>
#include<meshUboDeclaration>
attribute vec3 position;attribute vec4 splatIndex0;attribute vec4 splatIndex1;attribute vec4 splatIndex2;attribute vec4 splatIndex3;
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStore[name]) {
    ShaderStore.IncludesShadersStore[name] = shader;
}
/** @internal */
export const gaussianSplattingUboDeclaration = { name, shader };
//# sourceMappingURL=gaussianSplattingUboDeclaration.js.map