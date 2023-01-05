// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrBlockNormalGeometric";
const shader = `vec3 viewDirectionW=normalize(vEyePosition.xyz-vPositionW);
vec3 normalW=normalize(vNormalW);
vec3 normalW=normalize(cross(dFdx(vPositionW),dFdy(vPositionW)))*vEyePosition.w;
vec3 geometricNormalW=normalW;
geometricNormalW=gl_FrontFacing ? geometricNormalW : -geometricNormalW;
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrBlockNormalGeometric = { name, shader };
//# sourceMappingURL=pbrBlockNormalGeometric.js.map