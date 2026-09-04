/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import torusBuilder.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./torusBuilder.pure.js";
import { RegisterTorusBuilder } from "./torusBuilder.pure.js";
RegisterTorusBuilder();
//# sourceMappingURL=torusBuilder.js.map