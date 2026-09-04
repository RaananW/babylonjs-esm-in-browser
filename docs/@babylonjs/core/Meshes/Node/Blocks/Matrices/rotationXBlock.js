/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import rotationXBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./rotationXBlock.pure.js";
import { RegisterRotationXBlock } from "./rotationXBlock.pure.js";
RegisterRotationXBlock();
//# sourceMappingURL=rotationXBlock.js.map