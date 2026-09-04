/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import geometryTextureBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./geometryTextureBlock.pure.js";
import { RegisterGeometryTextureBlock } from "./geometryTextureBlock.pure.js";
RegisterGeometryTextureBlock();
//# sourceMappingURL=geometryTextureBlock.js.map