// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/fibonacci.js";
import "./ShadersInclude/helperFunctions.js";
import "./ShadersInclude/subSurfaceScatteringFunctions.js";
import "./ShadersInclude/diffusionProfile.js";
const name = "subSurfaceScatteringPixelShader";
const shader = `#include<fibonacci>
#include<helperFunctions>
#include<subSurfaceScatteringFunctions>
#include<diffusionProfile>
varying vec2 vUV;
#define Sq(x) x*x
#define SSS_BILATERAL_FILTER true
vec3 EvalBurleyDiffusionProfile(float r,vec3 S)
z=0.;
float r=sqrt(xy2+(z*mmPerUnit)*(z*mmPerUnit));
return clamp(EvalBurleyDiffusionProfile(r,S)*area,0.0,1.0);
return EvalBurleyDiffusionProfile(r,S)*area;
}
void main(void) 
vec3 green=vec3(0.,1.,0.);
gl_FragColor=vec4(inputColor.rgb+albedo*centerIrradiance,1.0);
vec3 red =vec3(1.,0.,0.);
float phase=0.;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const subSurfaceScatteringPixelShader = { name, shader };
//# sourceMappingURL=subSurfaceScattering.fragment.js.map