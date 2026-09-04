/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import imageProcessingConfiguration.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./imageProcessingConfiguration.pure.js";
export * from "./imageProcessingConfiguration.types.js";
import "./colorCurves.js";
