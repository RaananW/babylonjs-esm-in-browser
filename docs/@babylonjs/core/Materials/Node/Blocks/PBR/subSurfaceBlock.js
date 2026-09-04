/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import subSurfaceBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./subSurfaceBlock.pure.js";
import { RegisterSubSurfaceBlock } from "./subSurfaceBlock.pure.js";
RegisterSubSurfaceBlock();
//# sourceMappingURL=subSurfaceBlock.js.map