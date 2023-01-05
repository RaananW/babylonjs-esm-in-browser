// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "lightsFragmentFunctions";
const shader = `struct lightingInfo
vec3 specular;
#ifdef NDOTL
float ndl;
};
result.ndl=ndl;
result.diffuse=ndl*diffuseColor*attenuation;
vec3 angleW=normalize(viewDirectionW+lightVectorW);
return result;
result.ndl=ndl;
result.diffuse=ndl*diffuseColor*attenuation;
vec3 angleW=normalize(viewDirectionW+lightVectorW);
return result;
result.specular=vec3(0.);
#ifdef NDOTL
result.ndl=0.;
return result;
result.ndl=ndl;
result.diffuse=mix(groundColor,diffuseColor,ndl);
vec3 angleW=normalize(viewDirectionW+lightData.xyz);
return result;
vec3 computeProjectionTextureDiffuseLighting(sampler2D projectionLightSampler,mat4 textureProjectionMatrix){
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const lightsFragmentFunctions = { name, shader };
//# sourceMappingURL=lightsFragmentFunctions.js.map