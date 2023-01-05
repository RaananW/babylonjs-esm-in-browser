// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "clipPlaneVertex";
const shader = `#ifdef CLIPPLANE
fClipDistance=dot(worldPos,uniforms.vClipPlane);#endif
#ifdef CLIPPLANE2
fClipDistance2=dot(worldPos,uniforms.vClipPlane2);#endif
#ifdef CLIPPLANE3
fClipDistance3=dot(worldPos,uniforms.vClipPlane3);#endif
#ifdef CLIPPLANE4
fClipDistance4=dot(worldPos,uniforms.vClipPlane4);#endif
#ifdef CLIPPLANE5
fClipDistance5=dot(worldPos,uniforms.vClipPlane5);#endif
#ifdef CLIPPLANE6
fClipDistance6=dot(worldPos,uniforms.vClipPlane6);#endif
`;
// Sideeffect
ShaderStore.IncludesShadersStoreWGSL[name] = shader;
/** @internal */
export const clipPlaneVertex = { name, shader };
//# sourceMappingURL=clipPlaneVertex.js.map