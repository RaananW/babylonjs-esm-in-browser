// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/helperFunctions.js";
const name = "rgbdEncodePixelShader";
const shader = `varying vec2 vUV;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const rgbdEncodePixelShader = { name, shader };
//# sourceMappingURL=rgbdEncode.fragment.js.map