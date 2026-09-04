export * from "./lensFlareSystemSceneComponent.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import lensFlareSystemSceneComponent.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./lensFlareSystemSceneComponent.pure.js";
import { LensFlareSystem } from "./lensFlareSystem.js";
import { RegisterLensFlareSystemSceneComponent } from "./lensFlareSystemSceneComponent.pure.js";
RegisterLensFlareSystemSceneComponent(LensFlareSystem);
//# sourceMappingURL=lensFlareSystemSceneComponent.js.map