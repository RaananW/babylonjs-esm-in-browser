// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "passPixelShader";
const shader = `varying vec2 vUV;
void main(void) 
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const passPixelShader = { name, shader };
//# sourceMappingURL=pass.fragment.js.map