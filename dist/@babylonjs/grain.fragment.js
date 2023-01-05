// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/helperFunctions.js";
const name = "grainPixelShader";
const shader = `#include<helperFunctions>
uniform sampler2D textureSampler; 
void main(void)
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const grainPixelShader = { name, shader };
//# sourceMappingURL=grain.fragment.js.map