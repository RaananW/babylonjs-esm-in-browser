/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import freeCamera.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./freeCamera.pure.js";
import { RegisterFreeCamera } from "./freeCamera.pure.js";
RegisterFreeCamera();
//# sourceMappingURL=freeCamera.js.map