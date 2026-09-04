/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import defaultRenderingPipeline.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./defaultRenderingPipeline.pure.js";
export * from "./defaultRenderingPipeline.types.js";
import { RegisterDefaultRenderingPipeline } from "./defaultRenderingPipeline.pure.js";
RegisterDefaultRenderingPipeline();
//# sourceMappingURL=defaultRenderingPipeline.js.map