/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import executeBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./executeBlock.pure.js";
import { RegisterExecuteBlock } from "./executeBlock.pure.js";
RegisterExecuteBlock();
//# sourceMappingURL=executeBlock.js.map