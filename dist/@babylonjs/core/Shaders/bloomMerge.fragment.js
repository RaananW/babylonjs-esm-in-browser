// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "bloomMergePixelShader";
const shader = `uniform sampler2D textureSampler;
void main(void)
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const bloomMergePixelShader = { name, shader };
//# sourceMappingURL=bloomMerge.fragment.js.map