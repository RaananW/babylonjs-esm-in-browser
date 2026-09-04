// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
import "./sceneUboDeclaration.js";
const name = "geometryUboDeclaration";
const shader = `#include<sceneUboDeclaration>
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStore[name]) {
    ShaderStore.IncludesShadersStore[name] = shader;
}
/** @internal */
export const geometryUboDeclaration = { name, shader };
//# sourceMappingURL=geometryUboDeclaration.js.map