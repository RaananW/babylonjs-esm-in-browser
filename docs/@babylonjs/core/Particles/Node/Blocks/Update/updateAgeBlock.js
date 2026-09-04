/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import updateAgeBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./updateAgeBlock.pure.js";
import { RegisterUpdateAgeBlock } from "./updateAgeBlock.pure.js";
RegisterUpdateAgeBlock();
//# sourceMappingURL=updateAgeBlock.js.map