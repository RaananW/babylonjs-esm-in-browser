/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import intFloatConverterBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./intFloatConverterBlock.pure.js";
import { RegisterIntFloatConverterBlock } from "./intFloatConverterBlock.pure.js";
RegisterIntFloatConverterBlock();
//# sourceMappingURL=intFloatConverterBlock.js.map