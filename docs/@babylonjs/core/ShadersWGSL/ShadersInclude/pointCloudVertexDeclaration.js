// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pointCloudVertexDeclaration";
const shader = `#ifdef POINTSIZE
uniform pointSize: f32;
#endif
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStoreWGSL[name]) {
    ShaderStore.IncludesShadersStoreWGSL[name] = shader;
}
/** @internal */
export const pointCloudVertexDeclarationWGSL = { name, shader };
//# sourceMappingURL=pointCloudVertexDeclaration.js.map