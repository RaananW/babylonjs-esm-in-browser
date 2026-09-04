/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import fogBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./fogBlock.pure.js";
import { RegisterFogBlock } from "./fogBlock.pure.js";
RegisterFogBlock();
//# sourceMappingURL=fogBlock.js.map