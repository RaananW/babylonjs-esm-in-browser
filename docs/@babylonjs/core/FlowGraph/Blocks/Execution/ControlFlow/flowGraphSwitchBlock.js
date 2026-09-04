/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphSwitchBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphSwitchBlock.pure.js";
import { RegisterFlowGraphSwitchBlock } from "./flowGraphSwitchBlock.pure.js";
RegisterFlowGraphSwitchBlock();
//# sourceMappingURL=flowGraphSwitchBlock.js.map