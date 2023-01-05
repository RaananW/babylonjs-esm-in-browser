// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "harmonicsFunctions";
const shader = `#ifdef USESPHERICALFROMREFLECTIONMAP
#ifdef SPHERICAL_HARMONICS
vec3 computeEnvironmentIrradiance(vec3 normal) {
 vSphericalL1_1*(normal.y)
 vSphericalL10*(normal.z)
 vSphericalL11*(normal.x)
 vSphericalL2_2*(normal.y*normal.x)
 vSphericalL2_1*(normal.y*normal.z)
 vSphericalL20*((3.0*normal.z*normal.z)-1.0)
 vSphericalL21*(normal.z*normal.x)
 vSphericalL22*(normal.x*normal.x-(normal.y*normal.y));
vec3 computeEnvironmentIrradiance(vec3 normal) {
#endif
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const harmonicsFunctions = { name, shader };
//# sourceMappingURL=harmonicsFunctions.js.map