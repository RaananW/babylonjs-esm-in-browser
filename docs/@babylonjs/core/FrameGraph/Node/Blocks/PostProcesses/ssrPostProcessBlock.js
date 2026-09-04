/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import ssrPostProcessBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./ssrPostProcessBlock.pure.js";
import { RegisterSsrPostProcessBlock } from "./ssrPostProcessBlock.pure.js";
RegisterSsrPostProcessBlock();
//# sourceMappingURL=ssrPostProcessBlock.js.map