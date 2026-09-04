export * from "./engine.renderTarget.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import engine.renderTarget.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./engine.renderTarget.pure.js";
import { RegisterEnginesExtensionsEngineRenderTarget } from "./engine.renderTarget.pure.js";
RegisterEnginesExtensionsEngineRenderTarget();
//# sourceMappingURL=engine.renderTarget.js.map