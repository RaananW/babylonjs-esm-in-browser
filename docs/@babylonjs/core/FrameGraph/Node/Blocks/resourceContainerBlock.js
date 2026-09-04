/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import resourceContainerBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./resourceContainerBlock.pure.js";
import { RegisterResourceContainerBlock } from "./resourceContainerBlock.pure.js";
RegisterResourceContainerBlock();
//# sourceMappingURL=resourceContainerBlock.js.map