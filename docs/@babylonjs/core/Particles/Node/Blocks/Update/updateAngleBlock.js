/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import updateAngleBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./updateAngleBlock.pure.js";
import { RegisterUpdateAngleBlock } from "./updateAngleBlock.pure.js";
RegisterUpdateAngleBlock();
//# sourceMappingURL=updateAngleBlock.js.map