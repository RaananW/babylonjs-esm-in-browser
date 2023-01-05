// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "uvAttributeDeclaration";
const shader = `#ifdef UV{X}
attribute vec2 uv{X};
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const uvAttributeDeclaration = { name, shader };
//# sourceMappingURL=uvAttributeDeclaration.js.map