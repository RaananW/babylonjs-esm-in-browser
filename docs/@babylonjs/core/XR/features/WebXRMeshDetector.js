/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import WebXRMeshDetector.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./WebXRMeshDetector.pure.js";
import { RegisterWebXRMeshDetector } from "./WebXRMeshDetector.pure.js";
RegisterWebXRMeshDetector();
//# sourceMappingURL=WebXRMeshDetector.js.map