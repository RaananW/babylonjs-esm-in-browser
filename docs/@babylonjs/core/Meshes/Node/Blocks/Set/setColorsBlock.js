/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import setColorsBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./setColorsBlock.pure.js";
import { RegisterSetColorsBlock } from "./setColorsBlock.pure.js";
RegisterSetColorsBlock();
//# sourceMappingURL=setColorsBlock.js.map