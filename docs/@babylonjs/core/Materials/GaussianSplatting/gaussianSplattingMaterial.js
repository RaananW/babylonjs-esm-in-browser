/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import gaussianSplattingMaterial.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./gaussianSplattingMaterial.pure.js";
// Depth shaders used synchronously by makeDepthRenderingMaterial / shadow depth wrapper
import "../../Shaders/gaussianSplattingDepth.fragment.js";
import "../../Shaders/gaussianSplattingDepth.vertex.js";
import "../../ShadersWGSL/gaussianSplattingDepth.fragment.js";
import "../../ShadersWGSL/gaussianSplattingDepth.vertex.js";
import { RegisterGaussianSplattingMaterial } from "./gaussianSplattingMaterial.pure.js";
RegisterGaussianSplattingMaterial();
//# sourceMappingURL=gaussianSplattingMaterial.js.map