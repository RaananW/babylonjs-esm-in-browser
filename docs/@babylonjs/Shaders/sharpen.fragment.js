// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "sharpenPixelShader";
const shader = `varying vec2 vUV;
void main(void)
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const sharpenPixelShader = { name, shader };
//# sourceMappingURL=sharpen.fragment.js.map