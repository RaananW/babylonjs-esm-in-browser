// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrBlockReflectance0";
const shader = `float reflectance=max(max(reflectivityOut.surfaceReflectivityColor.r,reflectivityOut.surfaceReflectivityColor.g),reflectivityOut.surfaceReflectivityColor.b);
vec3 specularEnvironmentR90=vec3(metallicReflectanceFactors.a);
vec3 specularEnvironmentR90=vec3(1.0,1.0,1.0);
#ifdef ALPHAFRESNEL
float reflectance90=fresnelGrazingReflectance(reflectance);
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrBlockReflectance0 = { name, shader };
//# sourceMappingURL=pbrBlockReflectance0.js.map