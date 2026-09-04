/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import particleDebugBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./particleDebugBlock.pure.js";
import { RegisterParticleDebugBlock } from "./particleDebugBlock.pure.js";
RegisterParticleDebugBlock();
//# sourceMappingURL=particleDebugBlock.js.map