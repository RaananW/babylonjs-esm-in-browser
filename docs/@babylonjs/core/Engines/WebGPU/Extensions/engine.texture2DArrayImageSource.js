/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import engine.texture2DArrayImageSource.pure for tree-shakeable, side-effect-free usage.
 */
export * from "../../Extensions/engine.texture2DArrayImageSource.types.js";
export * from "./engine.texture2DArrayImageSource.pure.js";
import { RegisterEnginesWebGPUExtensionsEngineTexture2DArrayImageSource } from "./engine.texture2DArrayImageSource.pure.js";
RegisterEnginesWebGPUExtensionsEngineTexture2DArrayImageSource();
//# sourceMappingURL=engine.texture2DArrayImageSource.js.map