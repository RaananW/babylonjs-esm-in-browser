/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import ambientOcclusionBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./ambientOcclusionBlock.pure.js";
import { RegisterAmbientOcclusionBlock } from "./ambientOcclusionBlock.pure.js";
RegisterAmbientOcclusionBlock();
//# sourceMappingURL=ambientOcclusionBlock.js.map