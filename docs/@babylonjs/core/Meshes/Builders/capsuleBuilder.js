/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import capsuleBuilder.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./capsuleBuilder.pure.js";
import { RegisterCapsuleBuilder } from "./capsuleBuilder.pure.js";
RegisterCapsuleBuilder();
//# sourceMappingURL=capsuleBuilder.js.map