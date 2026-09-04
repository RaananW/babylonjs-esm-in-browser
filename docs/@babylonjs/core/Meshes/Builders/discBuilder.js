/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import discBuilder.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./discBuilder.pure.js";
import { RegisterDiscBuilder } from "./discBuilder.pure.js";
RegisterDiscBuilder();
//# sourceMappingURL=discBuilder.js.map