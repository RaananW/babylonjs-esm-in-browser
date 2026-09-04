/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import cubeTexture.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./cubeTexture.pure.js";
export * from "./cubeTexture.types.js";
import { RegisterCubeTexture } from "./cubeTexture.pure.js";
RegisterCubeTexture();
//# sourceMappingURL=cubeTexture.js.map