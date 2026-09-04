// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "morphTargetsVertexGlobal";
const shader = `#ifdef MORPHTARGETS
#ifdef MORPHTARGETS_TEXTURE
var vertexID : f32;
#endif
#endif
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStoreWGSL[name]) {
    ShaderStore.IncludesShadersStoreWGSL[name] = shader;
}
/** @internal */
export const morphTargetsVertexGlobalWGSL = { name, shader };
//# sourceMappingURL=morphTargetsVertexGlobal.js.map