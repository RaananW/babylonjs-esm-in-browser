/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import cullObjectsBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./cullObjectsBlock.pure.js";
import { RegisterCullObjectsBlock } from "./cullObjectsBlock.pure.js";
RegisterCullObjectsBlock();
//# sourceMappingURL=cullObjectsBlock.js.map