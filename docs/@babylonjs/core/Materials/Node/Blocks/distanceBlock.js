/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import distanceBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./distanceBlock.pure.js";
import { RegisterDistanceBlock } from "./distanceBlock.pure.js";
RegisterDistanceBlock();
//# sourceMappingURL=distanceBlock.js.map