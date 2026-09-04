/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import geometryCrossBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./geometryCrossBlock.pure.js";
import { RegisterGeometryCrossBlock } from "./geometryCrossBlock.pure.js";
RegisterGeometryCrossBlock();
//# sourceMappingURL=geometryCrossBlock.js.map