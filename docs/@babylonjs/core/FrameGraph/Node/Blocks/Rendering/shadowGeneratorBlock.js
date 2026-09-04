/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import shadowGeneratorBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./shadowGeneratorBlock.pure.js";
import { RegisterShadowGeneratorBlock } from "./shadowGeneratorBlock.pure.js";
RegisterShadowGeneratorBlock();
//# sourceMappingURL=shadowGeneratorBlock.js.map