/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import particleGradientValueBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./particleGradientValueBlock.pure.js";
import { RegisterParticleGradientValueBlock } from "./particleGradientValueBlock.pure.js";
RegisterParticleGradientValueBlock();
//# sourceMappingURL=particleGradientValueBlock.js.map