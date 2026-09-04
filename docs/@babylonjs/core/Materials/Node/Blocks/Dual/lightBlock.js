/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import lightBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./lightBlock.pure.js";
import { RegisterLightBlock } from "./lightBlock.pure.js";
RegisterLightBlock();
//# sourceMappingURL=lightBlock.js.map