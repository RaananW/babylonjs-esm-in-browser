// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "instancesDeclaration";
const shader = `#ifdef INSTANCES
attribute world0 : vec4<f32>;
attribute instanceColor : vec4<f32>;
#if defined(THIN_INSTANCES) && !defined(WORLD_UBO)
uniform world : mat4x4<f32>;
#if defined(VELOCITY) || defined(PREPASS_VELOCITY)
attribute previousWorld0 : vec4<f32>;
uniform previousWorld : mat4x4<f32>;
#endif
#else
#if !defined(WORLD_UBO)
uniform world : mat4x4<f32>;
#if defined(VELOCITY) || defined(PREPASS_VELOCITY)
uniform previousWorld : mat4x4<f32>;
#endif
`;
// Sideeffect
ShaderStore.IncludesShadersStoreWGSL[name] = shader;
/** @internal */
export const instancesDeclaration = { name, shader };
//# sourceMappingURL=instancesDeclaration.js.map