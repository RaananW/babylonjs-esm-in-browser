/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import polygonBuilder.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./polygonBuilder.pure.js";
import { RegisterPolygonBuilder } from "./polygonBuilder.pure.js";
RegisterPolygonBuilder();
//# sourceMappingURL=polygonBuilder.js.map