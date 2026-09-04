// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrBlockReflectance0";
const shader = `float reflectanceF0=reflectivityOut.reflectanceF0;vec3 specularEnvironmentR0=reflectivityOut.colorReflectanceF0;vec3 specularEnvironmentR90=reflectivityOut.colorReflectanceF90;
#ifdef ALPHAFRESNEL
float reflectance90=fresnelGrazingReflectance(reflectanceF0);specularEnvironmentR90=specularEnvironmentR90*reflectance90;
#endif
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStore[name]) {
    ShaderStore.IncludesShadersStore[name] = shader;
}
/** @internal */
export const pbrBlockReflectance0 = { name, shader };
//# sourceMappingURL=pbrBlockReflectance0.js.map