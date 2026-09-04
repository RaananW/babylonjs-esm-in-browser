export * from "./meshSimplificationSceneComponent.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import meshSimplificationSceneComponent.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./meshSimplificationSceneComponent.pure.js";
import { SimplificationQueue } from "./meshSimplification.js";
import { RegisterMeshSimplificationSceneComponent } from "./meshSimplificationSceneComponent.pure.js";
RegisterMeshSimplificationSceneComponent(SimplificationQueue);
//# sourceMappingURL=meshSimplificationSceneComponent.js.map