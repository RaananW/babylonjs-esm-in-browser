// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "lightVxFragmentDeclaration";
const shader = `#ifdef LIGHT{X}
uniform vec4 vLightData{X};
uniform vec4 vLightSpecular{X};
vec4 vLightSpecular{X}=vec4(0.);
#ifdef SHADOW{X}
#ifdef SHADOWCSM{X}
uniform mat4 lightMatrix{X}[SHADOWCSMNUM_CASCADES{X}];
#else
varying vec4 vPositionFromLight{X};
uniform vec4 shadowsInfo{X};
#ifdef SPOTLIGHT{X}
uniform vec4 vLightDirection{X};
uniform vec4 vLightFalloff{X};
uniform vec3 vLightGround{X};
#endif
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const lightVxFragmentDeclaration = { name, shader };
//# sourceMappingURL=lightVxFragmentDeclaration.js.map