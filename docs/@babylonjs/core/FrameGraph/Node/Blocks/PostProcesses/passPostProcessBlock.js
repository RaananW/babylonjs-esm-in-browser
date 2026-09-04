/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import passPostProcessBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./passPostProcessBlock.pure.js";
import { RegisterPassPostProcessBlock } from "./passPostProcessBlock.pure.js";
RegisterPassPostProcessBlock();
//# sourceMappingURL=passPostProcessBlock.js.map