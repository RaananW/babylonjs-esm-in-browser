// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "morphTargetsVertexGlobalDeclaration";
const shader = `#ifdef MORPHTARGETS
uniform morphTargetInfluences : array<f32,NUM_MORPH_INFLUENCERS>;
uniform morphTargetTextureIndices : array<f32,NUM_MORPH_INFLUENCERS>;
#endif
`;
// Sideeffect
ShaderStore.IncludesShadersStoreWGSL[name] = shader;
/** @internal */
export const morphTargetsVertexGlobalDeclaration = { name, shader };
//# sourceMappingURL=morphTargetsVertexGlobalDeclaration.js.map