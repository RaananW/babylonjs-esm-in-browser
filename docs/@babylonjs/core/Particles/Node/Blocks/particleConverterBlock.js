/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import particleConverterBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./particleConverterBlock.pure.js";
import { RegisterParticleConverterBlock } from "./particleConverterBlock.pure.js";
RegisterParticleConverterBlock();
//# sourceMappingURL=particleConverterBlock.js.map