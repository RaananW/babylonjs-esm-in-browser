/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./KHR_animation_pointer.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./KHR_animation_pointer.types.js";
export * from "./KHR_animation_pointer.pure.js";
import { _RegisterKHRAnimationPointerData } from "./KHR_animation_pointer.data.pure.js";
import { RegisterKHR_animation_pointer } from "./KHR_animation_pointer.pure.js";
_RegisterKHRAnimationPointerData();
RegisterKHR_animation_pointer();
//# sourceMappingURL=KHR_animation_pointer.js.map