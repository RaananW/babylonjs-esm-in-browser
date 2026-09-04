/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./splatFileLoader.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./splatFileLoader.types.js";
export * from "./splatFileLoader.pure.js";
// The SOG-with-textures path in the pure implementation relies on the prototype-augmented
// updateDynamicTexture engine extension; import its side effect here so it is present at runtime.
import "@babylonjs/core/Engines/Extensions/engine.dynamicTexture.js";
import { RegisterSPLATFileLoader } from "./splatFileLoader.pure.js";
RegisterSPLATFileLoader();
//# sourceMappingURL=splatFileLoader.js.map