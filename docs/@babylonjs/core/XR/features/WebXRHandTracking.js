/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import WebXRHandTracking.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./WebXRHandTracking.pure.js";
import { RegisterWebXRHandTracking } from "./WebXRHandTracking.pure.js";
RegisterWebXRHandTracking();
//# sourceMappingURL=WebXRHandTracking.js.map