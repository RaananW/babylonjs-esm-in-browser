/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import particleConditionBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./particleConditionBlock.pure.js";
import { RegisterParticleConditionBlock } from "./particleConditionBlock.pure.js";
RegisterParticleConditionBlock();
//# sourceMappingURL=particleConditionBlock.js.map