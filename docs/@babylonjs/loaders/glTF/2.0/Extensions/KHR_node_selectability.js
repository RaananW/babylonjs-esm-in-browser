/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./KHR_node_selectability.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./KHR_node_selectability.types.js";
export * from "./KHR_node_selectability.pure.js";
import { RegisterKHR_node_selectability } from "./KHR_node_selectability.pure.js";
RegisterKHR_node_selectability();
//# sourceMappingURL=KHR_node_selectability.js.map