/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import polyhedronBuilder.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./polyhedronBuilder.pure.js";
import { RegisterPolyhedronBuilder } from "./polyhedronBuilder.pure.js";
RegisterPolyhedronBuilder();
//# sourceMappingURL=polyhedronBuilder.js.map