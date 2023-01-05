// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "clipPlaneFragmentDeclaration2";
const shader = `#ifdef CLIPPLANE
in float fClipDistance;
#ifdef CLIPPLANE2
in float fClipDistance2;
#ifdef CLIPPLANE3
in float fClipDistance3;
#ifdef CLIPPLANE4
in float fClipDistance4;
#ifdef CLIPPLANE5
in float fClipDistance5;
#ifdef CLIPPLANE6
in float fClipDistance6;
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const clipPlaneFragmentDeclaration2 = { name, shader };
//# sourceMappingURL=clipPlaneFragmentDeclaration2.js.map