// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "diffusionProfile";
const shader = `uniform vec3 diffusionS[5];
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const diffusionProfile = { name, shader };
//# sourceMappingURL=diffusionProfile.js.map