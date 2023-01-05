// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/helperFunctions.js";
const name = "rgbdDecodePixelShader";
const shader = `varying vec2 vUV;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const rgbdDecodePixelShader = { name, shader };
//# sourceMappingURL=rgbdDecode.fragment.js.map