/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import setNormalsBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./setNormalsBlock.pure.js";
import { RegisterSetNormalsBlock } from "./setNormalsBlock.pure.js";
RegisterSetNormalsBlock();
//# sourceMappingURL=setNormalsBlock.js.map