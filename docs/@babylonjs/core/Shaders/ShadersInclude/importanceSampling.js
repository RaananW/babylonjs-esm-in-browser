// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "importanceSampling";
const shader = `vec3 hemisphereCosSample(vec2 u) {
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const importanceSampling = { name, shader };
//# sourceMappingURL=importanceSampling.js.map