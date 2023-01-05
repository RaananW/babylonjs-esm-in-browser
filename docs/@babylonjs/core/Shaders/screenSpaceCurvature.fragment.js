// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "screenSpaceCurvaturePixelShader";
const shader = `precision highp float;
#define CURVATURE_OFFSET 1
#endif
float curvature_soft_clamp(float curvature,float control)
void main(void) 
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const screenSpaceCurvaturePixelShader = { name, shader };
//# sourceMappingURL=screenSpaceCurvature.fragment.js.map