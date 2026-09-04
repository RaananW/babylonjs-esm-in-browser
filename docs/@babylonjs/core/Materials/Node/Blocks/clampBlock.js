/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import clampBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./clampBlock.pure.js";
import { RegisterClampBlock } from "./clampBlock.pure.js";
RegisterClampBlock();
//# sourceMappingURL=clampBlock.js.map