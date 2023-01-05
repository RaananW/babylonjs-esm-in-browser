// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "blackAndWhitePixelShader";
const shader = `varying vec2 vUV;
void main(void) 
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const blackAndWhitePixelShader = { name, shader };
//# sourceMappingURL=blackAndWhite.fragment.js.map