/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import screenSpaceReflectionPostProcess.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./screenSpaceReflectionPostProcess.pure.js";
import "../Shaders/screenSpaceReflection.fragment.js";
