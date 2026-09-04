export * from "./glowLayer.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import glowLayer.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./glowLayer.pure.js";
import { RegisterGlowLayer } from "./glowLayer.pure.js";
RegisterGlowLayer();
//# sourceMappingURL=glowLayer.js.map