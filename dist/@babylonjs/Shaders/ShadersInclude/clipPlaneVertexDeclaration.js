// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "clipPlaneVertexDeclaration";
const shader = `#ifdef CLIPPLANE
uniform vec4 vClipPlane;
#ifdef CLIPPLANE2
uniform vec4 vClipPlane2;
#ifdef CLIPPLANE3
uniform vec4 vClipPlane3;
#ifdef CLIPPLANE4
uniform vec4 vClipPlane4;
#ifdef CLIPPLANE5
uniform vec4 vClipPlane5;
#ifdef CLIPPLANE6
uniform vec4 vClipPlane6;
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const clipPlaneVertexDeclaration = { name, shader };
//# sourceMappingURL=clipPlaneVertexDeclaration.js.map