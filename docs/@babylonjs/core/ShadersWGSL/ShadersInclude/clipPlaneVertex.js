// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "clipPlaneVertex";
const shader = `#ifdef CLIPPLANE
fClipDistance=dot(worldPos,uniforms.vClipPlane);
#ifdef CLIPPLANE2
fClipDistance2=dot(worldPos,uniforms.vClipPlane2);
#ifdef CLIPPLANE3
fClipDistance3=dot(worldPos,uniforms.vClipPlane3);
#ifdef CLIPPLANE4
fClipDistance4=dot(worldPos,uniforms.vClipPlane4);
#ifdef CLIPPLANE5
fClipDistance5=dot(worldPos,uniforms.vClipPlane5);
#ifdef CLIPPLANE6
fClipDistance6=dot(worldPos,uniforms.vClipPlane6);
`;
// Sideeffect
ShaderStore.IncludesShadersStoreWGSL[name] = shader;
/** @internal */
export const clipPlaneVertex = { name, shader };
//# sourceMappingURL=clipPlaneVertex.js.map