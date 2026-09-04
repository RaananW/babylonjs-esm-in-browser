/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import cylinderBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./cylinderBlock.pure.js";
import { RegisterCylinderBlock } from "./cylinderBlock.pure.js";
RegisterCylinderBlock();
//# sourceMappingURL=cylinderBlock.js.map