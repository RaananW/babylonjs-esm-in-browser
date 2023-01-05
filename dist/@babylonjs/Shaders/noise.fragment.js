// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "noisePixelShader";
const shader = `uniform float brightness;
void main(void)
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const noisePixelShader = { name, shader };
//# sourceMappingURL=noise.fragment.js.map