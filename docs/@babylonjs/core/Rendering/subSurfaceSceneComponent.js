export * from "./subSurfaceSceneComponent.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import subSurfaceSceneComponent.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./subSurfaceSceneComponent.pure.js";
import { SubSurfaceConfiguration } from "./subSurfaceConfiguration.js";
import { RegisterSubSurfaceSceneComponent } from "./subSurfaceSceneComponent.pure.js";
RegisterSubSurfaceSceneComponent(SubSurfaceConfiguration);
//# sourceMappingURL=subSurfaceSceneComponent.js.map