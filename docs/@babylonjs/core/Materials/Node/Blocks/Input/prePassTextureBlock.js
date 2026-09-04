/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import prePassTextureBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./prePassTextureBlock.pure.js";
import { RegisterPrePassTextureBlock } from "./prePassTextureBlock.pure.js";
RegisterPrePassTextureBlock();
//# sourceMappingURL=prePassTextureBlock.js.map