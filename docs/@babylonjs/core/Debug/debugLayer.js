export * from "./debugLayer.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import debugLayer.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./debugLayer.pure.js";
import { RegisterDebugLayer } from "./debugLayer.pure.js";
RegisterDebugLayer();
//# sourceMappingURL=debugLayer.js.map