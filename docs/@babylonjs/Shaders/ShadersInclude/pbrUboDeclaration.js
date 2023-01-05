// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
import "./sceneUboDeclaration.js";
import "./meshUboDeclaration.js";
const name = "pbrUboDeclaration";
const shader = `layout(std140,column_major) uniform;
};
#include<meshUboDeclaration>
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrUboDeclaration = { name, shader };
//# sourceMappingURL=pbrUboDeclaration.js.map