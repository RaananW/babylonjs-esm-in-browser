/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import voronoiNoiseBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./voronoiNoiseBlock.pure.js";
import { RegisterVoronoiNoiseBlock } from "./voronoiNoiseBlock.pure.js";
RegisterVoronoiNoiseBlock();
//# sourceMappingURL=voronoiNoiseBlock.js.map