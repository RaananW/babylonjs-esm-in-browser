/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import customShapeBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./customShapeBlock.pure.js";
import { RegisterCustomShapeBlock } from "./customShapeBlock.pure.js";
RegisterCustomShapeBlock();
//# sourceMappingURL=customShapeBlock.js.map