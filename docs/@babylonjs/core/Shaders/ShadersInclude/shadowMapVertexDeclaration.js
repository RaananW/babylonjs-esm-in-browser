// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
import "./sceneVertexDeclaration.js";
import "./meshVertexDeclaration.js";
const name = "shadowMapVertexDeclaration";
const shader = `#include<sceneVertexDeclaration>
#include<meshVertexDeclaration>
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStore[name]) {
    ShaderStore.IncludesShadersStore[name] = shader;
}
/** @internal */
export const shadowMapVertexDeclaration = { name, shader };
//# sourceMappingURL=shadowMapVertexDeclaration.js.map