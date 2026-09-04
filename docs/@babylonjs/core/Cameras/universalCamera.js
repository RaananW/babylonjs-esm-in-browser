/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import universalCamera.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./universalCamera.pure.js";
import { RegisterUniversalCamera } from "./universalCamera.pure.js";
RegisterUniversalCamera();
//# sourceMappingURL=universalCamera.js.map