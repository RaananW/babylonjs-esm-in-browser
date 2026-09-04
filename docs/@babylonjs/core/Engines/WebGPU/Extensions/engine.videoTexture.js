export * from "./engine.videoTexture.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import engine.videoTexture.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./engine.videoTexture.pure.js";
import { RegisterEnginesWebGPUExtensionsEngineVideoTexture } from "./engine.videoTexture.pure.js";
RegisterEnginesWebGPUExtensionsEngineVideoTexture();
//# sourceMappingURL=engine.videoTexture.js.map