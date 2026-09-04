/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import standardRenderingPipeline.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./standardRenderingPipeline.pure.js";
export * from "./standardRenderingPipeline.types.js";
import "../../../Shaders/standard.fragment.js";
