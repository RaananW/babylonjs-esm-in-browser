/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./MSFT_lod.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./MSFT_lod.types.js";
export * from "./MSFT_lod.pure.js";
import { RegisterMSFT_lod } from "./MSFT_lod.pure.js";
RegisterMSFT_lod();
//# sourceMappingURL=MSFT_lod.js.map