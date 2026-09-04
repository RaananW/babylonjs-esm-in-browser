/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import planeBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./planeBlock.pure.js";
import { RegisterPlaneBlock } from "./planeBlock.pure.js";
RegisterPlaneBlock();
//# sourceMappingURL=planeBlock.js.map