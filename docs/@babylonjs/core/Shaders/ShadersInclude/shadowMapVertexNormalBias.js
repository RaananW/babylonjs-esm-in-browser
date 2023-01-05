// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "shadowMapVertexNormalBias";
const shader = `#if SM_NORMALBIAS==1
#if SM_DIRECTIONINLIGHTDATA==1
vec3 worldLightDirSM=normalize(-lightDataSM.xyz);
vec3 directionToLightSM=lightDataSM.xyz-worldPos.xyz;
float ndlSM=dot(vNormalW,worldLightDirSM);
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const shadowMapVertexNormalBias = { name, shader };
//# sourceMappingURL=shadowMapVertexNormalBias.js.map