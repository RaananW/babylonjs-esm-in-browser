/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphDataConnection.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphDataConnection.pure.js";
import { RegisterFlowGraphDataConnection } from "./flowGraphDataConnection.pure.js";
RegisterFlowGraphDataConnection();
//# sourceMappingURL=flowGraphDataConnection.js.map