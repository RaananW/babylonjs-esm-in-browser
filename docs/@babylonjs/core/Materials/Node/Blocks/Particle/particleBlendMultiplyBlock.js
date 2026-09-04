/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import particleBlendMultiplyBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./particleBlendMultiplyBlock.pure.js";
import { RegisterParticleBlendMultiplyBlock } from "./particleBlendMultiplyBlock.pure.js";
RegisterParticleBlendMultiplyBlock();
//# sourceMappingURL=particleBlendMultiplyBlock.js.map