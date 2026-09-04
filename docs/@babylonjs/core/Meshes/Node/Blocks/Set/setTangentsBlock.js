/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import setTangentsBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./setTangentsBlock.pure.js";
import { RegisterSetTangentsBlock } from "./setTangentsBlock.pure.js";
RegisterSetTangentsBlock();
//# sourceMappingURL=setTangentsBlock.js.map