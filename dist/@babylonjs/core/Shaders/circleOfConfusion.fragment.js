// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "circleOfConfusionPixelShader";
const shader = `uniform sampler2D depthSampler;
void main(void)
float pixelDistance=(cameraMinMaxZ.x+cameraMinMaxZ.y*depth)*1000.0; 
float coc=abs(cocPrecalculation*((focusDistance-pixelDistance)/pixelDistance));
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const circleOfConfusionPixelShader = { name, shader };
//# sourceMappingURL=circleOfConfusion.fragment.js.map