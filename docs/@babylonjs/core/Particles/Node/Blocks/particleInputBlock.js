/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import particleInputBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./particleInputBlock.pure.js";
import { RegisterParticleInputBlock } from "./particleInputBlock.pure.js";
RegisterParticleInputBlock();
//# sourceMappingURL=particleInputBlock.js.map