/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import texture.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./texture.pure.js";
import { RegisterTexture } from "./texture.pure.js";
RegisterTexture();
//# sourceMappingURL=texture.js.map