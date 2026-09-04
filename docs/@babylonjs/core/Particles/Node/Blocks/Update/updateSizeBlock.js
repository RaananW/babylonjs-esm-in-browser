/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import updateSizeBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./updateSizeBlock.pure.js";
import { RegisterUpdateSizeBlock } from "./updateSizeBlock.pure.js";
RegisterUpdateSizeBlock();
//# sourceMappingURL=updateSizeBlock.js.map