// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "filterPixelShader";
const shader = `varying vec2 vUV;
void main(void)
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const filterPixelShader = { name, shader };
//# sourceMappingURL=filter.fragment.js.map