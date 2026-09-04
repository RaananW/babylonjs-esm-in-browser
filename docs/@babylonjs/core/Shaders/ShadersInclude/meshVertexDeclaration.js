// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "meshVertexDeclaration";
const shader = `uniform mat4 world;uniform float visibility;
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStore[name]) {
    ShaderStore.IncludesShadersStore[name] = shader;
}
/** @internal */
export const meshVertexDeclaration = { name, shader };
//# sourceMappingURL=meshVertexDeclaration.js.map