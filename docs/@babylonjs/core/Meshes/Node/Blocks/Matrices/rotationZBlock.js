/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import rotationZBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./rotationZBlock.pure.js";
import { RegisterRotationZBlock } from "./rotationZBlock.pure.js";
RegisterRotationZBlock();
//# sourceMappingURL=rotationZBlock.js.map