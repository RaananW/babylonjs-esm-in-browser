/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import clusteredLightingSceneComponent.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./clusteredLightingSceneComponent.pure.js";
import { ClusteredLightContainer } from "./clusteredLightContainer.pure.js";
import { RegisterClusteredLightingSceneComponent } from "./clusteredLightingSceneComponent.pure.js";
RegisterClusteredLightingSceneComponent(ClusteredLightContainer);
//# sourceMappingURL=clusteredLightingSceneComponent.js.map