/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import proceduralTexture.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./proceduralTexture.pure.js";
import { RegisterProceduralTexture } from "./proceduralTexture.pure.js";
RegisterProceduralTexture();
//# sourceMappingURL=proceduralTexture.js.map