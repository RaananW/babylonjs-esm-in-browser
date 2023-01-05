// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "depthOfFieldPixelShader";
const shader = `uniform sampler2D textureSampler;
#define TWOPI 6.28318530
#define inverse_focal_length 0.1 
vec2 centered_screen_pos;
void main(void)
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const depthOfFieldPixelShader = { name, shader };
//# sourceMappingURL=depthOfField.fragment.js.map