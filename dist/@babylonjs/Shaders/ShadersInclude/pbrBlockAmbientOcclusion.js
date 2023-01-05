// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrBlockAmbientOcclusion";
const shader = `struct ambientOcclusionOutParams
vec3 ambientOcclusionColorMap;
};
void ambientOcclusionBlock(
in vec3 ambientOcclusionColorMap_,
out ambientOcclusionOutParams outParams
vec3 ambientOcclusionColorMap=ambientOcclusionColorMap_*vAmbientInfos.y;
ambientOcclusionColorMap=vec3(ambientOcclusionColorMap.r,ambientOcclusionColorMap.r,ambientOcclusionColorMap.r);
ambientOcclusionColor=mix(ambientOcclusionColor,ambientOcclusionColorMap,vAmbientInfos.z);
outParams.ambientOcclusionColorMap=ambientOcclusionColorMap;
#endif
outParams.ambientOcclusionColor=ambientOcclusionColor;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrBlockAmbientOcclusion = { name, shader };
//# sourceMappingURL=pbrBlockAmbientOcclusion.js.map