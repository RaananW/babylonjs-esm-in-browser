// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "glowMapMergePixelShader";
const shader = `varying vec2 vUV;
uniform sampler2D textureSampler2;
uniform float offset;
void main(void) {
vec4 baseColor=texture2D(textureSampler,vUV);
baseColor+=texture2D(textureSampler2,vUV);
baseColor.a=abs(offset-baseColor.a);
float alpha=smoothstep(.0,.1,baseColor.a);
#endif
#if LDR
baseColor=clamp(baseColor,0.,1.0);
gl_FragColor=baseColor;
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const glowMapMergePixelShader = { name, shader };
//# sourceMappingURL=glowMapMerge.fragment.js.map