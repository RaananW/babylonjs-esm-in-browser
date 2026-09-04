/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import boxShapeBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./boxShapeBlock.pure.js";
import { RegisterBoxShapeBlock } from "./boxShapeBlock.pure.js";
RegisterBoxShapeBlock();
//# sourceMappingURL=boxShapeBlock.js.map