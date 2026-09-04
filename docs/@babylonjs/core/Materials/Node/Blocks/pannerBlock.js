/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import pannerBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./pannerBlock.pure.js";
import { RegisterPannerBlock } from "./pannerBlock.pure.js";
RegisterPannerBlock();
//# sourceMappingURL=pannerBlock.js.map