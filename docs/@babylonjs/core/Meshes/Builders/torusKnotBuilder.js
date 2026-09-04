/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import torusKnotBuilder.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./torusKnotBuilder.pure.js";
import { RegisterTorusKnotBuilder } from "./torusKnotBuilder.pure.js";
RegisterTorusKnotBuilder();
//# sourceMappingURL=torusKnotBuilder.js.map