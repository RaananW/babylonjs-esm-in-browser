// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "chromaticAberrationPixelShader";
const shader = `uniform sampler2D textureSampler; 
void main(void)
 centered_screen_pos.y*centered_screen_pos.y;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const chromaticAberrationPixelShader = { name, shader };
//# sourceMappingURL=chromaticAberration.fragment.js.map