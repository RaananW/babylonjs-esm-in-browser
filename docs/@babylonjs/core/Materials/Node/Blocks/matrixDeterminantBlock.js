/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import matrixDeterminantBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./matrixDeterminantBlock.pure.js";
import { RegisterMatrixDeterminantBlock } from "./matrixDeterminantBlock.pure.js";
RegisterMatrixDeterminantBlock();
//# sourceMappingURL=matrixDeterminantBlock.js.map