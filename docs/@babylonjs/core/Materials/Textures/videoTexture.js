/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import videoTexture.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./videoTexture.pure.js";
import { RegisterVideoTexture } from "./videoTexture.pure.js";
RegisterVideoTexture();
//# sourceMappingURL=videoTexture.js.map