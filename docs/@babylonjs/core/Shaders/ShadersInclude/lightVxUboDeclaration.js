// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "lightVxUboDeclaration";
const shader = `#ifdef LIGHT{X}
uniform Light{X}
vec4 vLightDirection;
vec4 vLightFalloff;
vec3 vLightGround;
vec4 shadowsInfo;
#ifdef SHADOWCSM{X}
uniform mat4 lightMatrix{X}[SHADOWCSMNUM_CASCADES{X}];
#else
varying vec4 vPositionFromLight{X};
#endif
#endif
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const lightVxUboDeclaration = { name, shader };
//# sourceMappingURL=lightVxUboDeclaration.js.map