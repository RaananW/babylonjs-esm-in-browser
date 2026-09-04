/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import math.color.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./math.color.pure.js";
import { RegisterMathColor } from "./math.color.pure.js";
RegisterMathColor();
//# sourceMappingURL=math.color.js.map