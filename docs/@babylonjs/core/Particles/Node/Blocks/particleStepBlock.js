/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import particleStepBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./particleStepBlock.pure.js";
import { RegisterParticleStepBlock } from "./particleStepBlock.pure.js";
RegisterParticleStepBlock();
//# sourceMappingURL=particleStepBlock.js.map