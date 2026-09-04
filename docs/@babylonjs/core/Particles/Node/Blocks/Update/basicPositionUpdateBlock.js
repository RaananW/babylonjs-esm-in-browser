/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import basicPositionUpdateBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./basicPositionUpdateBlock.pure.js";
import { RegisterBasicPositionUpdateBlock } from "./basicPositionUpdateBlock.pure.js";
RegisterBasicPositionUpdateBlock();
//# sourceMappingURL=basicPositionUpdateBlock.js.map