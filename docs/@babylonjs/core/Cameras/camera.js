/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import camera.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./camera.pure.js";
export * from "./camera.types.js";
import { RegisterCamera } from "./camera.pure.js";
RegisterCamera();
//# sourceMappingURL=camera.js.map