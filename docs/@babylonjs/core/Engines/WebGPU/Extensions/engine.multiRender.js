export * from "./engine.multiRender.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import engine.multiRender.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./engine.multiRender.pure.js";
import { RegisterEnginesWebGPUExtensionsEngineMultiRender } from "./engine.multiRender.pure.js";
RegisterEnginesWebGPUExtensionsEngineMultiRender();
//# sourceMappingURL=engine.multiRender.js.map