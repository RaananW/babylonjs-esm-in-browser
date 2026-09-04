/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import particleLerpBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./particleLerpBlock.pure.js";
import { RegisterParticleLerpBlock } from "./particleLerpBlock.pure.js";
RegisterParticleLerpBlock();
//# sourceMappingURL=particleLerpBlock.js.map