/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphDebounceBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphDebounceBlock.pure.js";
import { RegisterFlowGraphDebounceBlock } from "./flowGraphDebounceBlock.pure.js";
RegisterFlowGraphDebounceBlock();
//# sourceMappingURL=flowGraphDebounceBlock.js.map