// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "bumpVertex";
const shader = `#if defined(BUMP) || defined(PARALLAX) || defined(CLEARCOAT_BUMP) || defined(ANISOTROPIC)
#if defined(TANGENT) && defined(NORMAL)
vec3 tbnNormal=normalize(normalUpdated);
#endif
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const bumpVertex = { name, shader };
//# sourceMappingURL=bumpVertex.js.map