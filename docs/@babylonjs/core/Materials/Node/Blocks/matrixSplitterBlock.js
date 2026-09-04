/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import matrixSplitterBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./matrixSplitterBlock.pure.js";
import { RegisterMatrixSplitterBlock } from "./matrixSplitterBlock.pure.js";
RegisterMatrixSplitterBlock();
//# sourceMappingURL=matrixSplitterBlock.js.map