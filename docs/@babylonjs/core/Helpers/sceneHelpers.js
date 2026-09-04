export * from "./sceneHelpers.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import sceneHelpers.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./sceneHelpers.pure.js";
import { RegisterSceneHelpers } from "./sceneHelpers.pure.js";
RegisterSceneHelpers();
import "../Cameras/VR/vrExperienceHelper.js";
//# sourceMappingURL=sceneHelpers.js.map