/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import triPlanarBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./triPlanarBlock.pure.js";
import { RegisterTriPlanarBlock } from "./triPlanarBlock.pure.js";
RegisterTriPlanarBlock();
//# sourceMappingURL=triPlanarBlock.js.map