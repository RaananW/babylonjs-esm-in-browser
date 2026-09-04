/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import extrudeGeometryBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./extrudeGeometryBlock.pure.js";
import { RegisterExtrudeGeometryBlock } from "./extrudeGeometryBlock.pure.js";
RegisterExtrudeGeometryBlock();
//# sourceMappingURL=extrudeGeometryBlock.js.map