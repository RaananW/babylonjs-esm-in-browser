// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "anaglyphPixelShader";
const shader = `varying vec2 vUV;
void main(void)
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const anaglyphPixelShader = { name, shader };
//# sourceMappingURL=anaglyph.fragment.js.map