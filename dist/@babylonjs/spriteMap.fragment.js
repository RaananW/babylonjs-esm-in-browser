// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "spriteMapPixelShader";
const shader = `#if defined(WEBGL2) || defined(WEBGPU) || defined(NATIVE)
#define TEXTUREFUNC(s,c,l) texture2DLodEXT(s,c,l)
#else
#define TEXTUREFUNC(s,c,b) texture2D(s,c,b)
#endif
precision highp float;
tileUV.y=1.0-tileUV.y;
vec2 tileID=floor(tUV);
vec4 animationData=TEXTUREFUNC(animationMap,vec2((frameID+0.5)/spriteCount,0.),0.);
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const spriteMapPixelShader = { name, shader };
//# sourceMappingURL=spriteMap.fragment.js.map