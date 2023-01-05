// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "fogFragmentDeclaration";
const shader = `#ifdef FOG
#define FOGMODE_NONE 0.
#define FOGMODE_EXP 1.
#define FOGMODE_EXP2 2.
#define FOGMODE_LINEAR 3.
#define E 2.71828
uniform vec4 vFogInfos;
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const fogFragmentDeclaration = { name, shader };
//# sourceMappingURL=fogFragmentDeclaration.js.map