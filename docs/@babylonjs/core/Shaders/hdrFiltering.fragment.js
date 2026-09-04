// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { helperFunctions } from "./ShadersInclude/helperFunctions.js";
import { importanceSampling } from "./ShadersInclude/importanceSampling.js";
import { pbrBRDFFunctions } from "./ShadersInclude/pbrBRDFFunctions.js";
import { hdrFilteringFunctions } from "./ShadersInclude/hdrFilteringFunctions.js";
const name = "hdrFilteringPixelShader";
const shader = `#include<helperFunctions>
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
uniform float alphaG;uniform samplerCube inputTexture;uniform vec2 vFilteringInfo;uniform float hdrScale;varying vec3 direction;void main() {vec3 color=radiance(alphaG,inputTexture,direction,vFilteringInfo);gl_FragColor=vec4(color*hdrScale,1.0);}`;
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
export const hdrFilteringPixelShader = { name, shader };
//# sourceMappingURL=hdrFiltering.fragment.js.map