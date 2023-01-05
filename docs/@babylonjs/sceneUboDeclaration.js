// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "sceneUboDeclaration";
const shader = `layout(std140,column_major) uniform;
mat4 viewProjectionR;
mat4 view;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const sceneUboDeclaration = { name, shader };
//# sourceMappingURL=sceneUboDeclaration.js.map