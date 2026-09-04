/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import basis.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./basis.pure.js";
import { RegisterBasis } from "./basis.pure.js";
RegisterBasis();
//# sourceMappingURL=basis.js.map