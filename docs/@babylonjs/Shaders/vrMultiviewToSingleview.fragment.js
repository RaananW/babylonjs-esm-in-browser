// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "vrMultiviewToSingleviewPixelShader";
const shader = `precision mediump sampler2DArray;
void main(void)
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const vrMultiviewToSingleviewPixelShader = { name, shader };
//# sourceMappingURL=vrMultiviewToSingleview.fragment.js.map