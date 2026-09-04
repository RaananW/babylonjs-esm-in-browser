/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import groundBuilder.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./groundBuilder.pure.js";
import { RegisterGroundBuilder } from "./groundBuilder.pure.js";
RegisterGroundBuilder();
//# sourceMappingURL=groundBuilder.js.map