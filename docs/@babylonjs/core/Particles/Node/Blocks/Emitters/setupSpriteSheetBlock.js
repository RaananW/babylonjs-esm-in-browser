/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import setupSpriteSheetBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./setupSpriteSheetBlock.pure.js";
import { RegisterSetupSpriteSheetBlock } from "./setupSpriteSheetBlock.pure.js";
RegisterSetupSpriteSheetBlock();
//# sourceMappingURL=setupSpriteSheetBlock.js.map