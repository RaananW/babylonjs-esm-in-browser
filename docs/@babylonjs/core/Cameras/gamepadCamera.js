/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import gamepadCamera.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./gamepadCamera.pure.js";
import { RegisterGamepadCamera } from "./gamepadCamera.pure.js";
RegisterGamepadCamera();
//# sourceMappingURL=gamepadCamera.js.map