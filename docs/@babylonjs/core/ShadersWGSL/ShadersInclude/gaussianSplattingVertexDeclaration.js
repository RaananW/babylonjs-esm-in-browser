// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "gaussianSplattingVertexDeclaration";
const shader = `attribute position: vec3f;attribute splatIndex0: vec4f;attribute splatIndex1: vec4f;attribute splatIndex2: vec4f;attribute splatIndex3: vec4f;`;
// Sideeffect
if (!ShaderStore.IncludesShadersStoreWGSL[name]) {
    ShaderStore.IncludesShadersStoreWGSL[name] = shader;
}
/** @internal */
export const gaussianSplattingVertexDeclarationWGSL = { name, shader };
//# sourceMappingURL=gaussianSplattingVertexDeclaration.js.map