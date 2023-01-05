// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "meshUboDeclaration";
const shader = `#ifdef WEBGL2
uniform mat4 world;
layout(std140,column_major) uniform;
#define WORLD_UBO
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const meshUboDeclaration = { name, shader };
//# sourceMappingURL=meshUboDeclaration.js.map