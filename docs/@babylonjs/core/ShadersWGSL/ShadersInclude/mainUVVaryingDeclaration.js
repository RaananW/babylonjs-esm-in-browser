// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "mainUVVaryingDeclaration";
const shader = `#ifdef MAINUV{X}
varying vMainUV{X}: vec2f;
#endif
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStoreWGSL[name]) {
    ShaderStore.IncludesShadersStoreWGSL[name] = shader;
}
/** @internal */
export const mainUVVaryingDeclarationWGSL = { name, shader };
//# sourceMappingURL=mainUVVaryingDeclaration.js.map