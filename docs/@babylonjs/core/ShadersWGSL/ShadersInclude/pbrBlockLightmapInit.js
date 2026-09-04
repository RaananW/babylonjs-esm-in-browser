// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrBlockLightmapInit";
const shader = `#ifdef LIGHTMAP
var lightmapColor: vec4f=TEXRD(lightmapSampler,lightmapSamplerSampler,fragmentInputs.vLightmapUV+uvOffset);
#ifdef RGBDLIGHTMAP
lightmapColor=vec4f(fromRGBD(lightmapColor),lightmapColor.a);
#endif
#ifdef GAMMALIGHTMAP
lightmapColor=vec4f(toLinearSpaceVec3(lightmapColor.rgb),lightmapColor.a);
#endif
lightmapColor=vec4f(lightmapColor.rgb*uniforms.vLightmapInfos.y,lightmapColor.a);
#endif
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStoreWGSL[name]) {
    ShaderStore.IncludesShadersStoreWGSL[name] = shader;
}
/** @internal */
export const pbrBlockLightmapInitWGSL = { name, shader };
//# sourceMappingURL=pbrBlockLightmapInit.js.map