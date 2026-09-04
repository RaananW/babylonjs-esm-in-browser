/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import followCamera.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./followCamera.pure.js";
import { RegisterFollowCamera } from "./followCamera.pure.js";
RegisterFollowCamera();
//# sourceMappingURL=followCamera.js.map