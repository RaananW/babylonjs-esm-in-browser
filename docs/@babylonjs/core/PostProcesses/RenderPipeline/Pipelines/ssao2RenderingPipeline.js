/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import ssao2RenderingPipeline.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./ssao2RenderingPipeline.pure.js";
export * from "./ssao2RenderingPipeline.types.js";
import { RegisterSsao2RenderingPipeline } from "./ssao2RenderingPipeline.pure.js";
RegisterSsao2RenderingPipeline();
//# sourceMappingURL=ssao2RenderingPipeline.js.map