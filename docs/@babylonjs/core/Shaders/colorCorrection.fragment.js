// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "colorCorrectionPixelShader";
const shader = `uniform sampler2D textureSampler; 
void main(void)
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const colorCorrectionPixelShader = { name, shader };
//# sourceMappingURL=colorCorrection.fragment.js.map