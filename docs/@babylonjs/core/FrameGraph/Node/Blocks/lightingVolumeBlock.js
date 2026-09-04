/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import lightingVolumeBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./lightingVolumeBlock.pure.js";
import { RegisterLightingVolumeBlock } from "./lightingVolumeBlock.pure.js";
RegisterLightingVolumeBlock();
//# sourceMappingURL=lightingVolumeBlock.js.map