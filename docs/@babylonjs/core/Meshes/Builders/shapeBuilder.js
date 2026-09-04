/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import shapeBuilder.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./shapeBuilder.pure.js";
import { RegisterShapeBuilder } from "./shapeBuilder.pure.js";
RegisterShapeBuilder();
//# sourceMappingURL=shapeBuilder.js.map