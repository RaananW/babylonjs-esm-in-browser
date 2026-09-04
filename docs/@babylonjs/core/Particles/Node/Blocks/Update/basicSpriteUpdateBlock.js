/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import basicSpriteUpdateBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./basicSpriteUpdateBlock.pure.js";
import { RegisterBasicSpriteUpdateBlock } from "./basicSpriteUpdateBlock.pure.js";
RegisterBasicSpriteUpdateBlock();
//# sourceMappingURL=basicSpriteUpdateBlock.js.map