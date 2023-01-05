// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/helperFunctions.js";
const name = "extractHighlightsPixelShader";
const shader = `#include<helperFunctions>
varying vec2 vUV;
void main(void) 
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const extractHighlightsPixelShader = { name, shader };
//# sourceMappingURL=extractHighlights.fragment.js.map