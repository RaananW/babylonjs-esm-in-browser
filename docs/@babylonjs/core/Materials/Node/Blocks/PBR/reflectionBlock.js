/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import reflectionBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./reflectionBlock.pure.js";
import { RegisterReflectionBlock } from "./reflectionBlock.pure.js";
RegisterReflectionBlock();
//# sourceMappingURL=reflectionBlock.js.map