/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import baseParticleSystem.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./baseParticleSystem.pure.js";
import { RegisterBaseParticleSystem } from "./baseParticleSystem.pure.js";
RegisterBaseParticleSystem();
//# sourceMappingURL=baseParticleSystem.js.map