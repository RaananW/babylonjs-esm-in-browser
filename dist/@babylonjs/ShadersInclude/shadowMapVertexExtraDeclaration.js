// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "shadowMapVertexExtraDeclaration";
const shader = `#if SM_NORMALBIAS==1
uniform vec3 lightDataSM;
uniform vec3 biasAndScaleSM;
varying vec3 vPositionWSM;
#if defined(SM_DEPTHCLAMP) && SM_DEPTHCLAMP==1
varying float zSM;
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const shadowMapVertexExtraDeclaration = { name, shader };
//# sourceMappingURL=shadowMapVertexExtraDeclaration.js.map