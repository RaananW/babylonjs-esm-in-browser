/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import filterPostProcessBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./filterPostProcessBlock.pure.js";
import { RegisterFilterPostProcessBlock } from "./filterPostProcessBlock.pure.js";
RegisterFilterPostProcessBlock();
//# sourceMappingURL=filterPostProcessBlock.js.map