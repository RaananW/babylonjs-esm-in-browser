/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./splatFileLoader.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./splatFileLoader.types.js";
export * from "./splatFileLoader.pure.js";
import "@babylonjs/core/Engines/Extensions/engine.dynamicTexture.js";
