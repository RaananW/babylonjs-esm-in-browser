/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import webgl2ParticleSystem.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./webgl2ParticleSystem.pure.js";
import "../Shaders/gpuUpdateParticles.fragment.js";
import "../Shaders/gpuUpdateParticles.vertex.js";
import { RegisterWebgl2ParticleSystem } from "./webgl2ParticleSystem.pure.js";
RegisterWebgl2ParticleSystem();
//# sourceMappingURL=webgl2ParticleSystem.js.map