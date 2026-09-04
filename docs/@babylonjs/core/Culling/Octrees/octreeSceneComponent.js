export * from "./octreeSceneComponent.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import octreeSceneComponent.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./octreeSceneComponent.pure.js";
import { RegisterOctreeSceneComponent } from "./octreeSceneComponent.pure.js";
RegisterOctreeSceneComponent();
//# sourceMappingURL=octreeSceneComponent.js.map