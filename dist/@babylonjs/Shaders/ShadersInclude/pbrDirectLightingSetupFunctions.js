// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrDirectLightingSetupFunctions";
const shader = `struct preLightingInfo
float iridescenceIntensity;
};
result.L=normalize(lightData.xyz);
return result;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrDirectLightingSetupFunctions = { name, shader };
//# sourceMappingURL=pbrDirectLightingSetupFunctions.js.map