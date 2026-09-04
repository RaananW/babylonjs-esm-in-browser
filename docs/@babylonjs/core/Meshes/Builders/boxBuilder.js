/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import boxBuilder.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./boxBuilder.pure.js";
import { RegisterBoxBuilder } from "./boxBuilder.pure.js";
RegisterBoxBuilder();
//# sourceMappingURL=boxBuilder.js.map