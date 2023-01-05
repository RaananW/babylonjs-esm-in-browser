// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "packingFunctions";
const shader = `vec4 pack(float depth)
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const packingFunctions = { name, shader };
//# sourceMappingURL=packingFunctions.js.map