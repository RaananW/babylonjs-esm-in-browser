/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import hdrCubeTexture.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./hdrCubeTexture.pure.js";
import { RegisterHdrCubeTexture } from "./hdrCubeTexture.pure.js";
RegisterHdrCubeTexture();
//# sourceMappingURL=hdrCubeTexture.js.map