// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "boundingBoxRendererUboDeclaration";
const shader = `#ifdef WEBGL2
uniform vec4 color;
uniform mat4 viewProjectionR;
#else
layout(std140,column_major) uniform;
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const boundingBoxRendererUboDeclaration = { name, shader };
//# sourceMappingURL=boundingBoxRendererUboDeclaration.js.map