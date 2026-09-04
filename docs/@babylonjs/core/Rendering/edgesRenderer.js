export * from "./edgesRenderer.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import edgesRenderer.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./edgesRenderer.pure.js";
import { RegisterEdgesRenderer } from "./edgesRenderer.pure.js";
RegisterEdgesRenderer();
//# sourceMappingURL=edgesRenderer.js.map