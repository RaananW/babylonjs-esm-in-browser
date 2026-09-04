/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import taaPostProcessBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./taaPostProcessBlock.pure.js";
import { RegisterTaaPostProcessBlock } from "./taaPostProcessBlock.pure.js";
RegisterTaaPostProcessBlock();
//# sourceMappingURL=taaPostProcessBlock.js.map