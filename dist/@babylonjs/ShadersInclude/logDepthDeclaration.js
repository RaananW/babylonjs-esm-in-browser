// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "logDepthDeclaration";
const shader = `#ifdef LOGARITHMICDEPTH
uniform float logarithmicDepthConstant;
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const logDepthDeclaration = { name, shader };
//# sourceMappingURL=logDepthDeclaration.js.map