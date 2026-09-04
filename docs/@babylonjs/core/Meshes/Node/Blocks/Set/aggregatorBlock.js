/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import aggregatorBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./aggregatorBlock.pure.js";
import { RegisterAggregatorBlock } from "./aggregatorBlock.pure.js";
RegisterAggregatorBlock();
//# sourceMappingURL=aggregatorBlock.js.map