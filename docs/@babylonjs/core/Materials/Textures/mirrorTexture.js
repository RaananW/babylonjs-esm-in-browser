/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import mirrorTexture.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./mirrorTexture.pure.js";
import { RegisterMirrorTexture } from "./mirrorTexture.pure.js";
RegisterMirrorTexture();
//# sourceMappingURL=mirrorTexture.js.map