// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "fogFragment";
const shader = `#ifdef FOG
float fog=CalcFogFactor();
fog=toLinearSpace(fog);
color.rgb=mix(vFogColor,color.rgb,fog);
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const fogFragment = { name, shader };
//# sourceMappingURL=fogFragment.js.map