export * from "./depthPeelingSceneComponent.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import depthPeelingSceneComponent.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./depthPeelingSceneComponent.pure.js";
import { DepthPeelingRenderer } from "./depthPeelingRenderer.js";
import { RegisterDepthPeelingSceneComponent } from "./depthPeelingSceneComponent.pure.js";
RegisterDepthPeelingSceneComponent(DepthPeelingRenderer);
//# sourceMappingURL=depthPeelingSceneComponent.js.map