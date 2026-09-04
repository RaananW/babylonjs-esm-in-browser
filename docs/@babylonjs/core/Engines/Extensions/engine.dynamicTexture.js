export * from "./engine.dynamicTexture.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import engine.dynamicTexture.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./engine.dynamicTexture.pure.js";
import { RegisterEnginesExtensionsEngineDynamicTexture } from "./engine.dynamicTexture.pure.js";
RegisterEnginesExtensionsEngineDynamicTexture();
//# sourceMappingURL=engine.dynamicTexture.js.map