/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import particleTriggerBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./particleTriggerBlock.pure.js";
import { RegisterParticleTriggerBlock } from "./particleTriggerBlock.pure.js";
RegisterParticleTriggerBlock();
//# sourceMappingURL=particleTriggerBlock.js.map