// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "fluidRenderingStandardBlurPixelShader";
const shader = `uniform sampler2D textureSampler;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const fluidRenderingStandardBlurPixelShader = { name, shader };
//# sourceMappingURL=fluidRenderingStandardBlur.fragment.js.map