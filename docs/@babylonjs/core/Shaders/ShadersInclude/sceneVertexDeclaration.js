// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "sceneVertexDeclaration";
const shader = `uniform mat4 viewProjection;
uniform mat4 viewProjectionR;
uniform mat4 view;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const sceneVertexDeclaration = { name, shader };
//# sourceMappingURL=sceneVertexDeclaration.js.map