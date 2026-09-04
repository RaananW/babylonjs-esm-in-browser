/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import geometryTrigonometryBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./geometryTrigonometryBlock.pure.js";
import { RegisterGeometryTrigonometryBlock } from "./geometryTrigonometryBlock.pure.js";
RegisterGeometryTrigonometryBlock();
//# sourceMappingURL=geometryTrigonometryBlock.js.map