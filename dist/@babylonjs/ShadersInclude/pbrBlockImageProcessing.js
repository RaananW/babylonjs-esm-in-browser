// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrBlockImageProcessing";
const shader = `#if defined(IMAGEPROCESSINGPOSTPROCESS) || defined(SS_SCATTERING)
#if !defined(SKIPFINALCOLORCLAMP)
finalColor.rgb=clamp(finalColor.rgb,0.,30.0);
#else
finalColor=applyImageProcessing(finalColor);
finalColor.a*=visibility;
finalColor.rgb*=finalColor.a;
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrBlockImageProcessing = { name, shader };
//# sourceMappingURL=pbrBlockImageProcessing.js.map