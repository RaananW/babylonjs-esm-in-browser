// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrBlockDirectLighting";
const shader = `vec3 diffuseBase=vec3(0.,0.,0.);
vec3 specularBase=vec3(0.,0.,0.);
#ifdef CLEARCOAT
vec3 clearCoatBase=vec3(0.,0.,0.);
#ifdef SHEEN
vec3 sheenBase=vec3(0.,0.,0.);
preLightingInfo preInfo;
vec3 absorption=vec3(0.);
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrBlockDirectLighting = { name, shader };
//# sourceMappingURL=pbrBlockDirectLighting.js.map