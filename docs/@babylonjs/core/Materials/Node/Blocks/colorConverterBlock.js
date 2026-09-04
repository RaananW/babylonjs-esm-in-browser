/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import colorConverterBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./colorConverterBlock.pure.js";
import { RegisterColorConverterBlock } from "./colorConverterBlock.pure.js";
RegisterColorConverterBlock();
//# sourceMappingURL=colorConverterBlock.js.map