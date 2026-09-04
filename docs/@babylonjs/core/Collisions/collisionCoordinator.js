/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import collisionCoordinator.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./collisionCoordinator.pure.js";
import { RegisterCollisionCoordinator } from "./collisionCoordinator.pure.js";
RegisterCollisionCoordinator();
//# sourceMappingURL=collisionCoordinator.js.map