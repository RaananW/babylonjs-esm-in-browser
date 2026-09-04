/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import createParticleBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./createParticleBlock.pure.js";
import { RegisterCreateParticleBlock } from "./createParticleBlock.pure.js";
RegisterCreateParticleBlock();
//# sourceMappingURL=createParticleBlock.js.map