/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import gridBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./gridBlock.pure.js";
import { RegisterGridBlock } from "./gridBlock.pure.js";
RegisterGridBlock();
//# sourceMappingURL=gridBlock.js.map