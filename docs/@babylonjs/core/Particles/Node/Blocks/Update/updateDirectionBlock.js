/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import updateDirectionBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./updateDirectionBlock.pure.js";
import { RegisterUpdateDirectionBlock } from "./updateDirectionBlock.pure.js";
RegisterUpdateDirectionBlock();
//# sourceMappingURL=updateDirectionBlock.js.map