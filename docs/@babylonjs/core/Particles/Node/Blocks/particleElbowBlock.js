/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import particleElbowBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./particleElbowBlock.pure.js";
import { RegisterParticleElbowBlock } from "./particleElbowBlock.pure.js";
RegisterParticleElbowBlock();
//# sourceMappingURL=particleElbowBlock.js.map