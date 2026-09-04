// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "kernelBlurVertex";
const shader = `sampleCoord{X}=sampleCenter+delta*KERNEL_OFFSET{X};`;
// Sideeffect
if (!ShaderStore.IncludesShadersStore[name]) {
    ShaderStore.IncludesShadersStore[name] = shader;
}
/** @internal */
export const kernelBlurVertex = { name, shader };
//# sourceMappingURL=kernelBlurVertex.js.map