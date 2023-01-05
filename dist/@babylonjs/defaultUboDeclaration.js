// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
import "./sceneUboDeclaration.js";
import "./meshUboDeclaration.js";
const name = "defaultUboDeclaration";
const shader = `layout(std140,column_major) uniform;
};
#include<meshUboDeclaration>
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const defaultUboDeclaration = { name, shader };
//# sourceMappingURL=defaultUboDeclaration.js.map