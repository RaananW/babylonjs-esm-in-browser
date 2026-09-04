/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import geometryPosterizeBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./geometryPosterizeBlock.pure.js";
import { RegisterGeometryPosterizeBlock } from "./geometryPosterizeBlock.pure.js";
RegisterGeometryPosterizeBlock();
//# sourceMappingURL=geometryPosterizeBlock.js.map