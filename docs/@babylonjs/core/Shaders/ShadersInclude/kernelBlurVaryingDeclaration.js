// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "kernelBlurVaryingDeclaration";
const shader = `varying vec2 sampleCoord{X};`;
// Sideeffect
if (!ShaderStore.IncludesShadersStore[name]) {
    ShaderStore.IncludesShadersStore[name] = shader;
}
/** @internal */
export const kernelBlurVaryingDeclaration = { name, shader };
//# sourceMappingURL=kernelBlurVaryingDeclaration.js.map