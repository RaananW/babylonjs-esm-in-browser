// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "clipPlaneFragmentDeclaration";
const shader = `#ifdef CLIPPLANE
varying float fClipDistance;
#ifdef CLIPPLANE2
varying float fClipDistance2;
#ifdef CLIPPLANE3
varying float fClipDistance3;
#ifdef CLIPPLANE4
varying float fClipDistance4;
#ifdef CLIPPLANE5
varying float fClipDistance5;
#ifdef CLIPPLANE6
varying float fClipDistance6;
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const clipPlaneFragmentDeclaration = { name, shader };
//# sourceMappingURL=clipPlaneFragmentDeclaration.js.map