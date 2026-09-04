/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import meshShapeBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./meshShapeBlock.pure.js";
import { RegisterMeshShapeBlock } from "./meshShapeBlock.pure.js";
RegisterMeshShapeBlock();
//# sourceMappingURL=meshShapeBlock.js.map