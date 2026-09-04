/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import setMaterialIDBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./setMaterialIDBlock.pure.js";
import { RegisterSetMaterialIDBlock } from "./setMaterialIDBlock.pure.js";
RegisterSetMaterialIDBlock();
//# sourceMappingURL=setMaterialIDBlock.js.map