// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "clipPlaneVertexDeclaration";
const shader = `#ifdef CLIPPLANE
uniform vClipPlane: vec4<f32>;
#ifdef CLIPPLANE2
uniform vClipPlane2: vec4<f32>;
#ifdef CLIPPLANE3
uniform vClipPlane3: vec4<f32>;
#ifdef CLIPPLANE4
uniform vClipPlane4: vec4<f32>;
#ifdef CLIPPLANE5
uniform vClipPlane5: vec4<f32>;
#ifdef CLIPPLANE6
uniform vClipPlane6: vec4<f32>;
`;
// Sideeffect
ShaderStore.IncludesShadersStoreWGSL[name] = shader;
/** @internal */
export const clipPlaneVertexDeclaration = { name, shader };
//# sourceMappingURL=clipPlaneVertexDeclaration.js.map