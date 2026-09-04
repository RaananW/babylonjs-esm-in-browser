/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import mappingBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./mappingBlock.pure.js";
import { RegisterMappingBlock } from "./mappingBlock.pure.js";
RegisterMappingBlock();
//# sourceMappingURL=mappingBlock.js.map