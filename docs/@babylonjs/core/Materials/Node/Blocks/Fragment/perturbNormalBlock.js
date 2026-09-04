/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import perturbNormalBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./perturbNormalBlock.pure.js";
import { RegisterPerturbNormalBlock } from "./perturbNormalBlock.pure.js";
RegisterPerturbNormalBlock();
//# sourceMappingURL=perturbNormalBlock.js.map