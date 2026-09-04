export * from "./abstractEngine.stencil.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import abstractEngine.stencil.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./abstractEngine.stencil.pure.js";
import { RegisterAbstractEngineStencil } from "./abstractEngine.stencil.pure.js";
RegisterAbstractEngineStencil();
//# sourceMappingURL=abstractEngine.stencil.js.map