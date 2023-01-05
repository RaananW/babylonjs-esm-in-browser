// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "lensFlarePixelShader";
const shader = `varying vec2 vUV;
void main(void) {
vec4 baseColor=texture2D(textureSampler,vUV);
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const lensFlarePixelShader = { name, shader };
//# sourceMappingURL=lensFlare.fragment.js.map