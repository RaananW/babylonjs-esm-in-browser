/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphSignalConnection.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphSignalConnection.pure.js";
import { RegisterFlowGraphSignalConnection } from "./flowGraphSignalConnection.pure.js";
RegisterFlowGraphSignalConnection();
//# sourceMappingURL=flowGraphSignalConnection.js.map