/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import cleanGeometryBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./cleanGeometryBlock.pure.js";
import { RegisterCleanGeometryBlock } from "./cleanGeometryBlock.pure.js";
RegisterCleanGeometryBlock();
//# sourceMappingURL=cleanGeometryBlock.js.map