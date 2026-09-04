/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./stlFileLoader.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./stlFileLoader.types.js";
export * from "./stlFileLoader.pure.js";
import "@babylonjs/core/Materials/standardMaterial.js";
