/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import waveBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./waveBlock.pure.js";
import { RegisterWaveBlock } from "./waveBlock.pure.js";
RegisterWaveBlock();
//# sourceMappingURL=waveBlock.js.map