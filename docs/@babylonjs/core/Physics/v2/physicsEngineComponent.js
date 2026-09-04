export * from "./physicsEngineComponent.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import physicsEngineComponent.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./physicsEngineComponent.pure.js";
import { RegisterPhysicsV2PhysicsEngineComponent } from "./physicsEngineComponent.pure.js";
RegisterPhysicsV2PhysicsEngineComponent();
//# sourceMappingURL=physicsEngineComponent.js.map