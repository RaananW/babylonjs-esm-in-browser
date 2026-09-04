export * from "./boundingBoxRenderer.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import boundingBoxRenderer.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./boundingBoxRenderer.pure.js";
import { RegisterBoundingBoxRenderer } from "./boundingBoxRenderer.pure.js";
RegisterBoundingBoxRenderer();
//# sourceMappingURL=boundingBoxRenderer.js.map