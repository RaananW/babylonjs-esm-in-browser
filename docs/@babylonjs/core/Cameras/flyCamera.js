/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flyCamera.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flyCamera.pure.js";
import { RegisterFlyCamera } from "./flyCamera.pure.js";
RegisterFlyCamera();
//# sourceMappingURL=flyCamera.js.map