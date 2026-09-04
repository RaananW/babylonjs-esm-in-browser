/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import particleNumberMathBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./particleNumberMathBlock.pure.js";
import { RegisterParticleNumberMathBlock } from "./particleNumberMathBlock.pure.js";
RegisterParticleNumberMathBlock();
//# sourceMappingURL=particleNumberMathBlock.js.map