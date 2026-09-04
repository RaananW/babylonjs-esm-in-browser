export * from "./gamepadSceneComponent.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import gamepadSceneComponent.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./gamepadSceneComponent.pure.js";
import { GamepadManager } from "./gamepadManager.js";
import { RegisterGamepadSceneComponent } from "./gamepadSceneComponent.pure.js";
RegisterGamepadSceneComponent(GamepadManager);
//# sourceMappingURL=gamepadSceneComponent.js.map