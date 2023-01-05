// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "boundingBoxRendererVertexDeclaration";
const shader = `uniform mat4 world;
uniform mat4 viewProjectionR;
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const boundingBoxRendererVertexDeclaration = { name, shader };
//# sourceMappingURL=boundingBoxRendererVertexDeclaration.js.map