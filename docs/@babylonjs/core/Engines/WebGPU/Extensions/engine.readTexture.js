export * from "./engine.readTexture.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import engine.readTexture.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./engine.readTexture.pure.js";
import { RegisterEnginesWebGPUExtensionsEngineReadTexture } from "./engine.readTexture.pure.js";
RegisterEnginesWebGPUExtensionsEngineReadTexture();
//# sourceMappingURL=engine.readTexture.js.map