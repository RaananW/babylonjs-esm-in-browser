/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import colorGradingTexture.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./colorGradingTexture.pure.js";
export * from "./colorGradingTexture.types.js";
import { RegisterColorGradingTexture } from "./colorGradingTexture.pure.js";
RegisterColorGradingTexture();
//# sourceMappingURL=colorGradingTexture.js.map