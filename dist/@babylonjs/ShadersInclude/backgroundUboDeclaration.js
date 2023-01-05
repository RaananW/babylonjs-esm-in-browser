// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
import "./sceneUboDeclaration.js";
const name = "backgroundUboDeclaration";
const shader = `layout(std140,column_major) uniform;
uniform vec3 vBackgroundCenter;
#ifdef REFLECTIONFRESNEL
uniform vec4 vReflectionControl;
};
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const backgroundUboDeclaration = { name, shader };
//# sourceMappingURL=backgroundUboDeclaration.js.map