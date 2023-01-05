// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "fluidRenderingBilateralBlurPixelShader";
const shader = `uniform sampler2D textureSampler;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const fluidRenderingBilateralBlurPixelShader = { name, shader };
//# sourceMappingURL=fluidRenderingBilateralBlur.fragment.js.map