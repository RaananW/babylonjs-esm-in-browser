/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import particleRandomBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./particleRandomBlock.pure.js";
import { RegisterParticleRandomBlock } from "./particleRandomBlock.pure.js";
RegisterParticleRandomBlock();
//# sourceMappingURL=particleRandomBlock.js.map