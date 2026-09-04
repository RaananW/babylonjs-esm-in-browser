export * from "./engine.rawTexture.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import engine.rawTexture.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./engine.rawTexture.pure.js";
import { RegisterEnginesExtensionsEngineRawTexture } from "./engine.rawTexture.pure.js";
RegisterEnginesExtensionsEngineRawTexture();
//# sourceMappingURL=engine.rawTexture.js.map