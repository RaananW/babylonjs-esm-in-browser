/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import touchCamera.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./touchCamera.pure.js";
import { RegisterTouchCamera } from "./touchCamera.pure.js";
RegisterTouchCamera();
//# sourceMappingURL=touchCamera.js.map