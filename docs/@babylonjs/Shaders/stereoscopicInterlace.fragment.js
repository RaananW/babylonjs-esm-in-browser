// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "stereoscopicInterlacePixelShader";
const shader = `const vec3 TWO=vec3(2.0,2.0,2.0);
void main(void)
useCamB=vUV.x>0.5;
#ifdef IS_STEREOSCOPIC_INTERLACED
float rowNum=floor(vUV.y/stepSize.y);
useCamB=vUV.y>0.5;
#endif
if (useCamB){
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const stereoscopicInterlacePixelShader = { name, shader };
//# sourceMappingURL=stereoscopicInterlace.fragment.js.map