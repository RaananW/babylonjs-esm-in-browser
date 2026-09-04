/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import taaRenderingPipeline.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./taaRenderingPipeline.pure.js";
export * from "./taaRenderingPipeline.types.js";
import { RegisterTaaRenderingPipeline } from "./taaRenderingPipeline.pure.js";
RegisterTaaRenderingPipeline();
//# sourceMappingURL=taaRenderingPipeline.js.map