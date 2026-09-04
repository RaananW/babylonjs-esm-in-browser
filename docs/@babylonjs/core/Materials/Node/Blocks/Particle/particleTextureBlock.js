/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import particleTextureBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./particleTextureBlock.pure.js";
import { RegisterParticleTextureBlock } from "./particleTextureBlock.pure.js";
RegisterParticleTextureBlock();
//# sourceMappingURL=particleTextureBlock.js.map