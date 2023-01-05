// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "ssaoCombinePixelShader";
const shader = `uniform sampler2D textureSampler;
void main(void) {
vec4 ssaoColor=texture2D(textureSampler,viewport.xy+vUV*viewport.zw);
}
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const ssaoCombinePixelShader = { name, shader };
//# sourceMappingURL=ssaoCombine.fragment.js.map