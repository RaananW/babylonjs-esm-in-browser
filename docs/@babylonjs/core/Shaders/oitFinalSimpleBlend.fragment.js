// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "oitFinalSimpleBlendPixelShader";
const shader = `precision highp float;uniform sampler2D uFrontColor;void main() {ivec2 fragCoord=ivec2(gl_FragCoord.xy);vec4 frontColor=texelFetch(uFrontColor,fragCoord,0);glFragColor=frontColor;}
`;
// Sideeffect
if (!ShaderStore.ShadersStore[name]) {
    ShaderStore.ShadersStore[name] = shader;
}
/** @internal */
export const oitFinalSimpleBlendPixelShader = { name, shader };
//# sourceMappingURL=oitFinalSimpleBlend.fragment.js.map