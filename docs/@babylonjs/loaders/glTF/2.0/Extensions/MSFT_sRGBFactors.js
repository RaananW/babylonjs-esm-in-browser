/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./MSFT_sRGBFactors.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./MSFT_sRGBFactors.types.js";
export * from "./MSFT_sRGBFactors.pure.js";
import { RegisterMSFT_sRGBFactors } from "./MSFT_sRGBFactors.pure.js";
RegisterMSFT_sRGBFactors();
//# sourceMappingURL=MSFT_sRGBFactors.js.map