// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "instancesDeclaration";
const shader = `#ifdef INSTANCES
attribute vec4 world0;
attribute vec4 instanceColor;
#if defined(THIN_INSTANCES) && !defined(WORLD_UBO)
uniform mat4 world;
#if defined(VELOCITY) || defined(PREPASS_VELOCITY)
attribute vec4 previousWorld0;
uniform mat4 previousWorld;
#endif
#else
#if !defined(WORLD_UBO)
uniform mat4 world;
#if defined(VELOCITY) || defined(PREPASS_VELOCITY)
uniform mat4 previousWorld;
#endif
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const instancesDeclaration = { name, shader };
//# sourceMappingURL=instancesDeclaration.js.map