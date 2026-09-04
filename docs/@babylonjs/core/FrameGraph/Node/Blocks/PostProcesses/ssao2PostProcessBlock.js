/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import ssao2PostProcessBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./ssao2PostProcessBlock.pure.js";
import { RegisterSsao2PostProcessBlock } from "./ssao2PostProcessBlock.pure.js";
RegisterSsao2PostProcessBlock();
//# sourceMappingURL=ssao2PostProcessBlock.js.map