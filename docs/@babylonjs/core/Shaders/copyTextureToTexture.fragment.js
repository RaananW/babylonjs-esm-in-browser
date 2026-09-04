// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { helperFunctions } from "./ShadersInclude/helperFunctions.js";
const name = "copyTextureToTexturePixelShader";
const shader = `uniform float conversion;uniform sampler2D textureSampler;uniform float lodLevel;varying vec2 vUV;
#include<helperFunctions>
void main(void) 
{
#ifdef NO_SAMPLER
vec4 color=texelFetch(textureSampler,ivec2(gl_FragCoord.xy),0);
#else
vec4 color=textureLod(textureSampler,vUV,lodLevel);
#endif
#ifdef DEPTH_TEXTURE
gl_FragDepth=color.r;
#else
if (conversion==1.) {color=toLinearSpace(color);} else if (conversion==2.) {color=toGammaSpace(color);}
gl_FragColor=color;
#endif
}
`;
// Sideeffect
if (!ShaderStore.ShadersStore[name]) {
    ShaderStore.ShadersStore[name] = shader;
}
const includes = [helperFunctions];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStore[inc.name]) {
        ShaderStore.IncludesShadersStore[inc.name] = inc.shader;
    }
}
/** @internal */
export const copyTextureToTexturePixelShader = { name, shader };
//# sourceMappingURL=copyTextureToTexture.fragment.js.map