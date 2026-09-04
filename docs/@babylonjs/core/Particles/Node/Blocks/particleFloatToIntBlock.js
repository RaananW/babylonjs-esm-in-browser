/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import particleFloatToIntBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./particleFloatToIntBlock.pure.js";
import { RegisterParticleFloatToIntBlock } from "./particleFloatToIntBlock.pure.js";
RegisterParticleFloatToIntBlock();
//# sourceMappingURL=particleFloatToIntBlock.js.map