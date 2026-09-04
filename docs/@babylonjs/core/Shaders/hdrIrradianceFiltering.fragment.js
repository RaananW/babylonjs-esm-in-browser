// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { helperFunctions } from "./ShadersInclude/helperFunctions.js";
import { importanceSampling } from "./ShadersInclude/importanceSampling.js";
import { pbrBRDFFunctions } from "./ShadersInclude/pbrBRDFFunctions.js";
import { hdrFilteringFunctions } from "./ShadersInclude/hdrFilteringFunctions.js";
const name = "hdrIrradianceFilteringPixelShader";
const shader = `#include<helperFunctions>
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
uniform samplerCube inputTexture;
#ifdef IBL_CDF_FILTERING
uniform sampler2D icdfTexture;
#endif
uniform vec2 vFilteringInfo;uniform float hdrScale;varying vec3 direction;void main() {vec3 color=irradiance(inputTexture,direction,vFilteringInfo,0.0,vec3(1.0),direction
#ifdef IBL_CDF_FILTERING
,icdfTexture
#endif
);gl_FragColor=vec4(color*hdrScale,1.0);}`;
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
export const hdrIrradianceFilteringPixelShader = { name, shader };
//# sourceMappingURL=hdrIrradianceFiltering.fragment.js.map