/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import gaussianBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./gaussianBlock.pure.js";
import { RegisterGaussianBlock } from "./gaussianBlock.pure.js";
RegisterGaussianBlock();
//# sourceMappingURL=gaussianBlock.js.map