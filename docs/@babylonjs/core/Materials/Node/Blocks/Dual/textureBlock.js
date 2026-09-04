/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import textureBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./textureBlock.pure.js";
import { RegisterTextureBlock } from "./textureBlock.pure.js";
RegisterTextureBlock();
//# sourceMappingURL=textureBlock.js.map