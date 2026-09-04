export * from "./spriteSceneComponent.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import spriteSceneComponent.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./spriteSceneComponent.pure.js";
import { RegisterSpriteSceneComponent } from "./spriteSceneComponent.pure.js";
RegisterSpriteSceneComponent();
//# sourceMappingURL=spriteSceneComponent.js.map