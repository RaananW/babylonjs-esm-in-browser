export * from "./physicsEngineComponent.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import physicsEngineComponent.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./physicsEngineComponent.pure.js";
import { RegisterPhysicsV1PhysicsEngineComponent } from "./physicsEngineComponent.pure.js";
RegisterPhysicsV1PhysicsEngineComponent();
//# sourceMappingURL=physicsEngineComponent.js.map