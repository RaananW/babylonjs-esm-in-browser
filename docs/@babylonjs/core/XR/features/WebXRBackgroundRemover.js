/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import WebXRBackgroundRemover.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./WebXRBackgroundRemover.pure.js";
import { RegisterWebXRBackgroundRemover } from "./WebXRBackgroundRemover.pure.js";
RegisterWebXRBackgroundRemover();
//# sourceMappingURL=WebXRBackgroundRemover.js.map