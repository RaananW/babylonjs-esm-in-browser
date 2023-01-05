// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
import "./packingFunctions.js";
import "./bayerDitherFunctions.js";
const name = "shadowMapFragmentExtraDeclaration";
const shader = `#if SM_FLOAT==0
#include<packingFunctions>
#endif
#if SM_SOFTTRANSPARENTSHADOW==1
#include<bayerDitherFunctions>
uniform float softTransparentShadowSM;
varying float vDepthMetricSM;
uniform vec3 lightDataSM;
uniform vec3 biasAndScaleSM;
varying float zSM;
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const shadowMapFragmentExtraDeclaration = { name, shader };
//# sourceMappingURL=shadowMapFragmentExtraDeclaration.js.map