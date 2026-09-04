/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import particleClampBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./particleClampBlock.pure.js";
import { RegisterParticleClampBlock } from "./particleClampBlock.pure.js";
RegisterParticleClampBlock();
//# sourceMappingURL=particleClampBlock.js.map