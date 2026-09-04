/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import noiseBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./noiseBlock.pure.js";
import { RegisterNoiseBlock } from "./noiseBlock.pure.js";
RegisterNoiseBlock();
//# sourceMappingURL=noiseBlock.js.map