/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import biPlanarBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./biPlanarBlock.pure.js";
import { RegisterBiPlanarBlock } from "./biPlanarBlock.pure.js";
RegisterBiPlanarBlock();
//# sourceMappingURL=biPlanarBlock.js.map