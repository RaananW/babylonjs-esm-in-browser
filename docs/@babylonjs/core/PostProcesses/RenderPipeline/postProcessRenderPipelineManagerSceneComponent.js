export * from "./postProcessRenderPipelineManagerSceneComponent.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import postProcessRenderPipelineManagerSceneComponent.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./postProcessRenderPipelineManagerSceneComponent.pure.js";
import { PostProcessRenderPipelineManager } from "./postProcessRenderPipelineManager.js";
import { RegisterPostProcessRenderPipelineManagerSceneComponent } from "./postProcessRenderPipelineManagerSceneComponent.pure.js";
RegisterPostProcessRenderPipelineManagerSceneComponent(PostProcessRenderPipelineManager);
//# sourceMappingURL=postProcessRenderPipelineManagerSceneComponent.js.map