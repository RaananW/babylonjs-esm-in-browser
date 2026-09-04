/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphInteger.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphInteger.pure.js";
import { RegisterFlowGraphInteger } from "./flowGraphInteger.pure.js";
RegisterFlowGraphInteger();
//# sourceMappingURL=flowGraphInteger.js.map