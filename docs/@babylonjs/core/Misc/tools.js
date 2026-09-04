/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import tools.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./tools.pure.js";
import { RegisterTools } from "./tools.pure.js";
RegisterTools();
//# sourceMappingURL=tools.js.map