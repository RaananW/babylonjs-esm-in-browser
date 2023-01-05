// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "backgroundVertexDeclaration";
const shader = `uniform mat4 view;
uniform mat4 diffuseMatrix;
#ifdef REFLECTION
uniform vec2 vReflectionInfos;
#ifdef POINTSIZE
uniform float pointSize;
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const backgroundVertexDeclaration = { name, shader };
//# sourceMappingURL=backgroundVertexDeclaration.js.map