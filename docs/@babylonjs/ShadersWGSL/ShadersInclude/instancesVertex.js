// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "instancesVertex";
const shader = `#ifdef INSTANCES
var finalWorld=mat4x4<f32>(world0,world1,world2,world3);
var finalPreviousWorld=mat4x4<f32>(previousWorld0,previousWorld1,previousWorld2,previousWorld3);
#ifdef THIN_INSTANCES
#if !defined(WORLD_UBO)
finalWorld=uniforms.world*finalWorld;
finalWorld=mesh.world*finalWorld;
#if defined(PREPASS_VELOCITY) || defined(VELOCITY)
finalPreviousWorld=previousWorld*finalPreviousWorld;
#endif
#else
#if !defined(WORLD_UBO)
var finalWorld=uniforms.world;
var finalWorld=mesh.world;
#if defined(PREPASS_VELOCITY) || defined(VELOCITY)
var finalPreviousWorld=previousWorld;
#endif
`;
// Sideeffect
ShaderStore.IncludesShadersStoreWGSL[name] = shader;
/** @internal */
export const instancesVertex = { name, shader };
//# sourceMappingURL=instancesVertex.js.map