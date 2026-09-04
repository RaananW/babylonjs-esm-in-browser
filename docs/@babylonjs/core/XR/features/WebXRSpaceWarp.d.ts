/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import WebXRSpaceWarp.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./WebXRSpaceWarp.pure.js";
import "../../Shaders/velocity.fragment.js";
import "../../Shaders/velocity.vertex.js";
