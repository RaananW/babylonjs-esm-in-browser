// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrBlockLightmapInit";
const shader = `#ifdef LIGHTMAP
vec4 lightmapColor=texture2D(lightmapSampler,vLightmapUV+uvOffset);
lightmapColor.rgb=fromRGBD(lightmapColor);
#ifdef GAMMALIGHTMAP
lightmapColor.rgb=toLinearSpace(lightmapColor.rgb);
lightmapColor.rgb*=vLightmapInfos.y;
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrBlockLightmapInit = { name, shader };
//# sourceMappingURL=pbrBlockLightmapInit.js.map