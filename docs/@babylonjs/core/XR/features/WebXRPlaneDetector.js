/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import WebXRPlaneDetector.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./WebXRPlaneDetector.pure.js";
import { RegisterWebXRPlaneDetector } from "./WebXRPlaneDetector.pure.js";
RegisterWebXRPlaneDetector();
//# sourceMappingURL=WebXRPlaneDetector.js.map