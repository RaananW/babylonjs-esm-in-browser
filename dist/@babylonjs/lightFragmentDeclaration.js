// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "lightFragmentDeclaration";
const shader = `#ifdef LIGHT{X}
uniform vec4 vLightData{X};
uniform vec4 vLightSpecular{X};
vec4 vLightSpecular{X}=vec4(0.);
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
uniform vec4 shadowsInfo{X};
#ifdef SPOTLIGHT{X}
uniform vec4 vLightDirection{X};
uniform vec4 vLightFalloff{X};
uniform vec3 vLightGround{X};
#ifdef PROJECTEDLIGHTTEXTURE{X}
uniform mat4 textureProjectionMatrix{X};
#endif
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const lightFragmentDeclaration = { name, shader };
//# sourceMappingURL=lightFragmentDeclaration.js.map