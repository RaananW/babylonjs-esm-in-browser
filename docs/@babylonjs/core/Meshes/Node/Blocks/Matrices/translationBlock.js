/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import translationBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./translationBlock.pure.js";
import { RegisterTranslationBlock } from "./translationBlock.pure.js";
RegisterTranslationBlock();
//# sourceMappingURL=translationBlock.js.map