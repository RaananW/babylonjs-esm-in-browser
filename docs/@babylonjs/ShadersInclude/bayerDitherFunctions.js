// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "bayerDitherFunctions";
const shader = `float bayerDither2(vec2 _P) {
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const bayerDitherFunctions = { name, shader };
//# sourceMappingURL=bayerDitherFunctions.js.map