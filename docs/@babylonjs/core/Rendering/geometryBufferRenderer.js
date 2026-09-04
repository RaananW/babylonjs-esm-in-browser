/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import geometryBufferRenderer.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./geometryBufferRenderer.pure.js";
import { RegisterGeometryBufferRenderer } from "./geometryBufferRenderer.pure.js";
RegisterGeometryBufferRenderer();
//# sourceMappingURL=geometryBufferRenderer.js.map