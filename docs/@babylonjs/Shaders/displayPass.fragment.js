// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "displayPassPixelShader";
const shader = `varying vec2 vUV;
void main(void)
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const displayPassPixelShader = { name, shader };
//# sourceMappingURL=displayPass.fragment.js.map