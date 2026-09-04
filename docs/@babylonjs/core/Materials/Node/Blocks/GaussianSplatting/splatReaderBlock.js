/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import splatReaderBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./splatReaderBlock.pure.js";
import { RegisterSplatReaderBlock } from "./splatReaderBlock.pure.js";
RegisterSplatReaderBlock();
//# sourceMappingURL=splatReaderBlock.js.map