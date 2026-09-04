/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import deviceOrientationCamera.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./deviceOrientationCamera.pure.js";
import { RegisterDeviceOrientationCamera } from "./deviceOrientationCamera.pure.js";
RegisterDeviceOrientationCamera();
//# sourceMappingURL=deviceOrientationCamera.js.map