/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import updatePositionBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./updatePositionBlock.pure.js";
import { RegisterUpdatePositionBlock } from "./updatePositionBlock.pure.js";
RegisterUpdatePositionBlock();
//# sourceMappingURL=updatePositionBlock.js.map