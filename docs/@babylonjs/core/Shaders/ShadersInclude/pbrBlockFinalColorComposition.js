// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrBlockFinalColorComposition";
const shader = `vec4 finalColor=vec4(
#ifdef REFLECTION
finalIrradiance +
#ifdef SPECULARTERM
finalSpecularScaled +
#ifdef SHEEN
finalSheenScaled +
#ifdef CLEARCOAT
finalClearCoatScaled +
#ifdef REFLECTION
finalRadianceScaled +
sheenOut.finalSheenRadianceScaled +
#ifdef CLEARCOAT
clearcoatOut.finalClearCoatRadianceScaled +
#endif
#ifdef SS_REFRACTION
subSurfaceOut.finalRefraction +
#endif
finalAmbient +
#ifndef LIGHTMAPEXCLUDED
#ifdef USELIGHTMAPASSHADOWMAP
finalColor.rgb*=lightmapColor.rgb;
finalColor.rgb+=lightmapColor.rgb;
#endif
#endif
finalColor.rgb+=finalEmissive;
finalColor=max(finalColor,0.0);
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrBlockFinalColorComposition = { name, shader };
//# sourceMappingURL=pbrBlockFinalColorComposition.js.map