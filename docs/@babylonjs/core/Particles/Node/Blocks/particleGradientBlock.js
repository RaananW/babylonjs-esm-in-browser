/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import particleGradientBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./particleGradientBlock.pure.js";
import { RegisterParticleGradientBlock } from "./particleGradientBlock.pure.js";
RegisterParticleGradientBlock();
//# sourceMappingURL=particleGradientBlock.js.map