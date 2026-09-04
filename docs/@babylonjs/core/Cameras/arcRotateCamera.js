/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import arcRotateCamera.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./arcRotateCamera.pure.js";
import { RegisterArcRotateCamera } from "./arcRotateCamera.pure.js";
RegisterArcRotateCamera();
//# sourceMappingURL=arcRotateCamera.js.map