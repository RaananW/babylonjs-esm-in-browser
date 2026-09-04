/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./glTFFileLoader.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./glTFFileLoader.types.js";
export * from "./glTFFileLoader.pure.js";
import "./glTFFileLoader.pure.js";
