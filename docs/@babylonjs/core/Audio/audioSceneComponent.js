export * from "./audioSceneComponent.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import audioSceneComponent.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./audioSceneComponent.pure.js";
import { Sound } from "./sound.pure.js";
import { RegisterAudioSceneComponent } from "./audioSceneComponent.pure.js";
RegisterAudioSceneComponent(Sound);
//# sourceMappingURL=audioSceneComponent.js.map