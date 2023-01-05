// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "blurPixelShader";
const shader = `varying vec2 vUV;
void main(void)
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const blurPixelShader = { name, shader };
//# sourceMappingURL=blur.fragment.js.map