/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import gaussianSplattingCompoundMesh.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./gaussianSplattingCompoundMesh.pure.js";
import { RegisterGaussianSplattingCompoundMesh } from "./gaussianSplattingCompoundMesh.pure.js";
RegisterGaussianSplattingCompoundMesh();
//# sourceMappingURL=gaussianSplattingCompoundMesh.js.map