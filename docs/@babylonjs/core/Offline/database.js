/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import database.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./database.pure.js";
import { RegisterDatabase } from "./database.pure.js";
RegisterDatabase();
//# sourceMappingURL=database.js.map