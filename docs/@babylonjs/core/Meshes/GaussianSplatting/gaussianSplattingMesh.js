/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import gaussianSplattingMesh.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./gaussianSplattingMesh.pure.js";
import { RegisterGaussianSplattingMesh } from "./gaussianSplattingMesh.pure.js";
RegisterGaussianSplattingMesh();
import "../thinInstanceMesh.js";
import "./gaussianSplattingPartProxyMesh.js";
//# sourceMappingURL=gaussianSplattingMesh.js.map