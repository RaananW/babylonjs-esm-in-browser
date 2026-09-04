/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import fileTools.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./fileTools.pure.js";
import { RegisterFileTools } from "./fileTools.pure.js";
RegisterFileTools();
//# sourceMappingURL=fileTools.js.map