/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import particleSystem.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./particleSystem.pure.js";
import { RegisterParticleSystem } from "./particleSystem.pure.js";
RegisterParticleSystem();
//# sourceMappingURL=particleSystem.js.map