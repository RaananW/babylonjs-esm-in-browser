/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import directActions.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./directActions.pure.js";
import { RegisterDirectActions } from "./directActions.pure.js";
RegisterDirectActions();
//# sourceMappingURL=directActions.js.map