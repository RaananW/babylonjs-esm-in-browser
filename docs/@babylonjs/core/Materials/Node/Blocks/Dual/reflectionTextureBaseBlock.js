/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import reflectionTextureBaseBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./reflectionTextureBaseBlock.pure.js";
import { RegisterReflectionTextureBaseBlock } from "./reflectionTextureBaseBlock.pure.js";
RegisterReflectionTextureBaseBlock();
//# sourceMappingURL=reflectionTextureBaseBlock.js.map