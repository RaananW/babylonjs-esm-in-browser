// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "lightUboDeclaration";
const shader = `#ifdef LIGHT{X}
uniform Light{X}
vec4 vLightDirection;
vec4 vLightFalloff;
vec3 vLightGround;
vec4 shadowsInfo;
uniform mat4 textureProjectionMatrix{X};
#ifdef SHADOW{X}
#ifdef SHADOWCSM{X}
uniform mat4 lightMatrix{X}[SHADOWCSMNUM_CASCADES{X}];
uniform highp sampler2DArrayShadow shadowSampler{X};
uniform highp sampler2DArrayShadow shadowSampler{X};
uniform highp sampler2DArray shadowSampler{X};
#ifdef SHADOWCSMDEBUG{X}
const vec3 vCascadeColorsMultiplier{X}[8]=vec3[8]
#ifdef SHADOWCSMUSESHADOWMAXZ{X}
int index{X}=-1;
int index{X}=SHADOWCSMNUM_CASCADES{X}-1;
float diff{X}=0.;
uniform samplerCube shadowSampler{X}; 
varying vec4 vPositionFromLight{X};
uniform highp sampler2DShadow shadowSampler{X};
uniform highp sampler2DShadow shadowSampler{X};
uniform sampler2D shadowSampler{X};
uniform mat4 lightMatrix{X};
#endif
#endif
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const lightUboDeclaration = { name, shader };
//# sourceMappingURL=lightUboDeclaration.js.map