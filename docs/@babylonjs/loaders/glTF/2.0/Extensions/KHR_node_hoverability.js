/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./KHR_node_hoverability.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./KHR_node_hoverability.types.js";
export * from "./KHR_node_hoverability.pure.js";
import { RegisterKHR_node_hoverability } from "./KHR_node_hoverability.pure.js";
RegisterKHR_node_hoverability();
//# sourceMappingURL=KHR_node_hoverability.js.map