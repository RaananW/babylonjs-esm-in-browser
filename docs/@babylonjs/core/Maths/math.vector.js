/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import math.vector.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./math.vector.pure.js";
import { RegisterMathVector } from "./math.vector.pure.js";
RegisterMathVector();
//# sourceMappingURL=math.vector.js.map