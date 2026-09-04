// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
import "./sceneUboDeclaration.js";
import "./meshUboDeclaration.js";
const name = "lineUboDeclaration";
const shader = `layout(std140,column_major) uniform;
#include<sceneUboDeclaration>
#include<meshUboDeclaration>
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStore[name]) {
    ShaderStore.IncludesShadersStore[name] = shader;
}
/** @internal */
export const lineUboDeclaration = { name, shader };
//# sourceMappingURL=lineUboDeclaration.js.map