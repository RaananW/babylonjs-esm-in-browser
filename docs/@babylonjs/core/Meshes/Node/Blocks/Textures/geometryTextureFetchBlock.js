/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import geometryTextureFetchBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./geometryTextureFetchBlock.pure.js";
import { RegisterGeometryTextureFetchBlock } from "./geometryTextureFetchBlock.pure.js";
RegisterGeometryTextureFetchBlock();
//# sourceMappingURL=geometryTextureFetchBlock.js.map