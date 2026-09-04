export * from "./prePassRendererSceneComponent.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import prePassRendererSceneComponent.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./prePassRendererSceneComponent.pure.js";
import { PrePassRenderer } from "./prePassRenderer.pure.js";
import { RegisterPrePassRendererSceneComponent } from "./prePassRendererSceneComponent.pure.js";
RegisterPrePassRendererSceneComponent(PrePassRenderer);
//# sourceMappingURL=prePassRendererSceneComponent.js.map