// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "glowBlurPostProcessPixelShader";
const shader = `varying vec2 vUV;
void main(void)
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const glowBlurPostProcessPixelShader = { name, shader };
//# sourceMappingURL=glowBlurPostProcess.fragment.js.map