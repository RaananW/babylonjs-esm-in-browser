export * from "./animatable.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import animatable.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./animatable.pure.js";
import { RegisterAnimatable } from "./animatable.pure.js";
RegisterAnimatable();
//# sourceMappingURL=animatable.js.map