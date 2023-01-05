// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "fxaaPixelShader";
const shader = `#if defined(WEBGL2) || defined(WEBGPU) || defined(NATIVE)
#define TEXTUREFUNC(s,c,l) texture2DLodEXT(s,c,l)
#else
#define TEXTUREFUNC(s,c,b) texture2D(s,c,b)
#endif
uniform sampler2D textureSampler;
void main(){
if(range<rangeMaxClamped) 
float lumaNW=FxaaLuma(TEXTUREFUNC(textureSampler,sampleCoordNW,0.0));
if(range<rangeMaxClamped) 
gl_FragColor=TEXTUREFUNC(textureSampler,posM,0.0);
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const fxaaPixelShader = { name, shader };
//# sourceMappingURL=fxaa.fragment.js.map