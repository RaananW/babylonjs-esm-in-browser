// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "sceneFragmentDeclaration";
const shader = `uniform mat4 viewProjection;
uniform mat4 viewProjectionR;
uniform mat4 view;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const sceneFragmentDeclaration = { name, shader };
//# sourceMappingURL=sceneFragmentDeclaration.js.map