/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import abstractEngine.textureLoaders.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./abstractEngine.textureLoaders.pure.js";
import { RegisterAbstractEngineTextureLoaders } from "./abstractEngine.textureLoaders.pure.js";
RegisterAbstractEngineTextureLoaders();
//# sourceMappingURL=abstractEngine.textureLoaders.js.map