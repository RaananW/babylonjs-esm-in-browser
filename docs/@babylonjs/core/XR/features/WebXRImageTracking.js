/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import WebXRImageTracking.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./WebXRImageTracking.pure.js";
import { RegisterWebXRImageTracking } from "./WebXRImageTracking.pure.js";
RegisterWebXRImageTracking();
//# sourceMappingURL=WebXRImageTracking.js.map