// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "bumpFragmentMainFunctions";
const shader = `#if defined(BUMP) || defined(CLEARCOAT_BUMP) || defined(ANISOTROPIC) || defined(DETAIL)
#if defined(TANGENT) && defined(NORMAL) 
varying mat3 vTBN;#endif
#ifdef OBJECTSPACE_NORMALMAP
uniform mat4 normalMatrix;#endif
vec3 perturbNormalBase(mat3 cotangentFrame,vec3 normal,float scale){#ifdef NORMALXYSCALE
normal=normalize(normal*vec3(scale,scale,1.0));#endif
return normalize(cotangentFrame*normal);}vec3 perturbNormal(mat3 cotangentFrame,vec3 textureSample,float scale){return perturbNormalBase(cotangentFrame,textureSample*2.0-1.0,scale);}mat3 cotangent_frame(vec3 normal,vec3 p,vec2 uv,vec2 tangentSpaceParams){vec3 dp1=dFdx(p);vec3 dp2=dFdy(p);vec2 duv1=dFdx(uv);vec2 duv2=dFdy(uv);vec3 dp2perp=cross(dp2,normal);vec3 dp1perp=cross(normal,dp1);vec3 tangent=dp2perp*duv1.x+dp1perp*duv2.x;vec3 bitangent=dp2perp*duv1.y+dp1perp*duv2.y;tangent*=tangentSpaceParams.x;bitangent*=tangentSpaceParams.y;float det=max(dot(tangent,tangent),dot(bitangent,bitangent));float invmax=det==0.0 ? 0.0 : inversesqrt(det);return mat3(tangent*invmax,bitangent*invmax,normal);}#endif
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const bumpFragmentMainFunctions = { name, shader };
//# sourceMappingURL=bumpFragmentMainFunctions.js.map