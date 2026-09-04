export * from "./depthRendererSceneComponent.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import depthRendererSceneComponent.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./depthRendererSceneComponent.pure.js";
import { DepthRenderer } from "./depthRenderer.pure.js";
import { RegisterDepthRendererSceneComponent } from "./depthRendererSceneComponent.pure.js";
RegisterDepthRendererSceneComponent(DepthRenderer);
//# sourceMappingURL=depthRendererSceneComponent.js.map