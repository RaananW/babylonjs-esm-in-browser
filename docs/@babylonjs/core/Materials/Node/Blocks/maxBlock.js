/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import maxBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./maxBlock.pure.js";
import { RegisterMaxBlock } from "./maxBlock.pure.js";
RegisterMaxBlock();
//# sourceMappingURL=maxBlock.js.map