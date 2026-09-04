// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrBlockLightmapInit";
const shader = `#ifdef LIGHTMAP
vec4 lightmapColor=TEXRD(lightmapSampler,vLightmapUV+uvOffset);
#ifdef RGBDLIGHTMAP
lightmapColor.rgb=fromRGBD(lightmapColor);
#endif
#ifdef GAMMALIGHTMAP
lightmapColor.rgb=toLinearSpace(lightmapColor.rgb);
#endif
lightmapColor.rgb*=vLightmapInfos.y;
#endif
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStore[name]) {
    ShaderStore.IncludesShadersStore[name] = shader;
}
/** @internal */
export const pbrBlockLightmapInit = { name, shader };
//# sourceMappingURL=pbrBlockLightmapInit.js.map