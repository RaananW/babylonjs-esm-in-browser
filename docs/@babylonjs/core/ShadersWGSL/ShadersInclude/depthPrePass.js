// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "depthPrePass";
const shader = `#ifdef DEPTHPREPASS
#if !defined(PREPASS) && !defined(ORDER_INDEPENDENT_TRANSPARENCY)
fragmentOutputs.color= vec4f(0.,0.,0.,1.0);
#endif
#ifndef DEPTHPREPASS_SKIP_EARLY_RETURN
return fragmentOutputs;
#endif
#endif
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStoreWGSL[name]) {
    ShaderStore.IncludesShadersStoreWGSL[name] = shader;
}
/** @internal */
export const depthPrePassWGSL = { name, shader };
//# sourceMappingURL=depthPrePass.js.map