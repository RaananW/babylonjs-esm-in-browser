/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import particleLocalVariableBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./particleLocalVariableBlock.pure.js";
import { RegisterParticleLocalVariableBlock } from "./particleLocalVariableBlock.pure.js";
RegisterParticleLocalVariableBlock();
//# sourceMappingURL=particleLocalVariableBlock.js.map