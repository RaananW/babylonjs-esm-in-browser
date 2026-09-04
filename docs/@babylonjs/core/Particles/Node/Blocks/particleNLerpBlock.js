/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import particleNLerpBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./particleNLerpBlock.pure.js";
import { RegisterParticleNLerpBlock } from "./particleNLerpBlock.pure.js";
RegisterParticleNLerpBlock();
//# sourceMappingURL=particleNLerpBlock.js.map