/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import ssrRenderingPipeline.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./ssrRenderingPipeline.pure.js";
export * from "./ssrRenderingPipeline.types.js";
import { RegisterSsrRenderingPipeline } from "./ssrRenderingPipeline.pure.js";
RegisterSsrRenderingPipeline();
//# sourceMappingURL=ssrRenderingPipeline.js.map