/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphRichTypes.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphRichTypes.pure.js";
import { RegisterFlowGraphRichTypes } from "./flowGraphRichTypes.pure.js";
RegisterFlowGraphRichTypes();
//# sourceMappingURL=flowGraphRichTypes.js.map