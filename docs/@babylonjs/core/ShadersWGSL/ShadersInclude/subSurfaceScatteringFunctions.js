// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "subSurfaceScatteringFunctions";
const shader = `fn testLightingForSSS(diffusionProfile: f32)->bool
{return diffusionProfile<1.;}`;
// Sideeffect
if (!ShaderStore.IncludesShadersStoreWGSL[name]) {
    ShaderStore.IncludesShadersStoreWGSL[name] = shader;
}
/** @internal */
export const subSurfaceScatteringFunctionsWGSL = { name, shader };
//# sourceMappingURL=subSurfaceScatteringFunctions.js.map