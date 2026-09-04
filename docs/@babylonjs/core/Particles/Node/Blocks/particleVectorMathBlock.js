/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import particleVectorMathBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./particleVectorMathBlock.pure.js";
import { RegisterParticleVectorMathBlock } from "./particleVectorMathBlock.pure.js";
RegisterParticleVectorMathBlock();
//# sourceMappingURL=particleVectorMathBlock.js.map