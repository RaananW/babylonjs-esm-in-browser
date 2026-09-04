// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "areaLightTextureProcessingPixelShader";
const shader = `uniform sampler2D textureSampler;uniform vec2 scalingRange;varying vec2 vUV;void main(void)
{float x=(vUV.x-scalingRange.x)/(scalingRange.y-scalingRange.x);float y=(vUV.y-scalingRange.x)/(scalingRange.y-scalingRange.x);vec2 scaledUV=vec2(x,y);gl_FragColor=texture2D(textureSampler,scaledUV);}
`;
// Sideeffect
if (!ShaderStore.ShadersStore[name]) {
    ShaderStore.ShadersStore[name] = shader;
}
/** @internal */
export const areaLightTextureProcessingPixelShader = { name, shader };
//# sourceMappingURL=areaLightTextureProcessing.fragment.js.map