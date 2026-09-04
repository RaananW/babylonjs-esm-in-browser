/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import gaussianSplattingMaterial.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./gaussianSplattingMaterial.pure.js";
import "../../Shaders/gaussianSplattingDepth.fragment.js";
import "../../Shaders/gaussianSplattingDepth.vertex.js";
import "../../ShadersWGSL/gaussianSplattingDepth.fragment.js";
import "../../ShadersWGSL/gaussianSplattingDepth.vertex.js";
