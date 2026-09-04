/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import colorCurves.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./colorCurves.pure.js";
export * from "./colorCurves.types.js";
import { RegisterColorCurves } from "./colorCurves.pure.js";
RegisterColorCurves();
//# sourceMappingURL=colorCurves.js.map