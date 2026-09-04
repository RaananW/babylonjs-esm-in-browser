/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import bonesBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./bonesBlock.pure.js";
import { RegisterBonesBlock } from "./bonesBlock.pure.js";
RegisterBonesBlock();
//# sourceMappingURL=bonesBlock.js.map