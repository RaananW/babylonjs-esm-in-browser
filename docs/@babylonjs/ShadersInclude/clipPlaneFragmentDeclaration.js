// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "clipPlaneFragmentDeclaration";
const shader = `#ifdef CLIPPLANE
varying fClipDistance: f32;
#ifdef CLIPPLANE2
varying fClipDistance2: f32;
#ifdef CLIPPLANE3
varying fClipDistance3: f32;
#ifdef CLIPPLANE4
varying fClipDistance4: f32;
#ifdef CLIPPLANE5
varying fClipDistance5: f32;
#ifdef CLIPPLANE6
varying fClipDistance6: f32;
`;
// Sideeffect
ShaderStore.IncludesShadersStoreWGSL[name] = shader;
/** @internal */
export const clipPlaneFragmentDeclaration = { name, shader };
//# sourceMappingURL=clipPlaneFragmentDeclaration.js.map