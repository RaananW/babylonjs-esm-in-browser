/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import tubeBuilder.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./tubeBuilder.pure.js";
import { RegisterTubeBuilder } from "./tubeBuilder.pure.js";
RegisterTubeBuilder();
//# sourceMappingURL=tubeBuilder.js.map