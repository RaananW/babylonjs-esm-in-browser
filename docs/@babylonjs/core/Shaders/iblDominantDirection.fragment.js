// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { helperFunctions } from "./ShadersInclude/helperFunctions.js";
import { importanceSampling } from "./ShadersInclude/importanceSampling.js";
import { pbrBRDFFunctions } from "./ShadersInclude/pbrBRDFFunctions.js";
import { hdrFilteringFunctions } from "./ShadersInclude/hdrFilteringFunctions.js";
const name = "iblDominantDirectionPixelShader";
const shader = `precision highp sampler2D;precision highp samplerCube;
#include<helperFunctions>
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
varying vec2 vUV;uniform sampler2D icdfSampler;void main(void) {vec3 lightDir=vec3(0.0,0.0,0.0);for(uint i=0u; i<NUM_SAMPLES; ++i)
{vec2 Xi=hammersley(i,NUM_SAMPLES);vec2 T;T.x=texture2D(icdfSampler,vec2(Xi.x,0.0)).x;T.y=texture2D(icdfSampler,vec2(T.x,Xi.y)).y;vec3 Ls=uv_to_normal(vec2(1.0-fract(T.x+0.25),T.y));lightDir+=Ls;}
lightDir/=float(NUM_SAMPLES);gl_FragColor=vec4(lightDir,1.0);}`;
// Sideeffect
if (!ShaderStore.ShadersStore[name]) {
    ShaderStore.ShadersStore[name] = shader;
}
const includes = [helperFunctions, importanceSampling, pbrBRDFFunctions, hdrFilteringFunctions];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStore[inc.name]) {
        ShaderStore.IncludesShadersStore[inc.name] = inc.shader;
    }
}
/** @internal */
export const iblDominantDirectionPixelShader = { name, shader };
//# sourceMappingURL=iblDominantDirection.fragment.js.map