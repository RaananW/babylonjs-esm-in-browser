// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "openpbrNormalMapVertexDeclaration";
const shader = `#if defined(GEOMETRY_NORMAL) || defined(PARALLAX) || defined(CLEARCOAT_BUMP) || defined(ANISOTROPIC) || defined(FUZZ)
#if defined(TANGENT) && defined(NORMAL) 
varying vTBN0: vec3f;varying vTBN1: vec3f;varying vTBN2: vec3f;
#endif
#endif
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStoreWGSL[name]) {
    ShaderStore.IncludesShadersStoreWGSL[name] = shader;
}
/** @internal */
export const openpbrNormalMapVertexDeclarationWGSL = { name, shader };
//# sourceMappingURL=openpbrNormalMapVertexDeclaration.js.map