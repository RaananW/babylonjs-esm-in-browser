/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import particleMathBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./particleMathBlock.pure.js";
import { RegisterParticleMathBlock } from "./particleMathBlock.pure.js";
RegisterParticleMathBlock();
//# sourceMappingURL=particleMathBlock.js.map