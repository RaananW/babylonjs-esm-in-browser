// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/helperFunctions.js";
import "./ShadersInclude/importanceSampling.js";
import "./ShadersInclude/pbrBRDFFunctions.js";
import "./ShadersInclude/hdrFilteringFunctions.js";
const name = "hdrFilteringPixelShader";
const shader = `#include<helperFunctions>
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
uniform float alphaG;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const hdrFilteringPixelShader = { name, shader };
//# sourceMappingURL=hdrFiltering.fragment.js.map