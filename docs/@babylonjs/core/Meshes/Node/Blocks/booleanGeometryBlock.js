/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import booleanGeometryBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./booleanGeometryBlock.pure.js";
import { RegisterBooleanGeometryBlock } from "./booleanGeometryBlock.pure.js";
RegisterBooleanGeometryBlock();
//# sourceMappingURL=booleanGeometryBlock.js.map