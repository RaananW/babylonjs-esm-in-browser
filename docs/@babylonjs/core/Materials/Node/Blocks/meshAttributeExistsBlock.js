/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import meshAttributeExistsBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./meshAttributeExistsBlock.pure.js";
import { RegisterMeshAttributeExistsBlock } from "./meshAttributeExistsBlock.pure.js";
RegisterMeshAttributeExistsBlock();
//# sourceMappingURL=meshAttributeExistsBlock.js.map