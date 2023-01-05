// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "volumetricLightScatteringPixelShader";
const shader = `uniform sampler2D textureSampler;
void main(void) {
vec2 tc=vUV;
}
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const volumetricLightScatteringPixelShader = { name, shader };
//# sourceMappingURL=volumetricLightScattering.fragment.js.map