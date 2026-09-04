export * from "./abstractEngine.renderPass.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import abstractEngine.renderPass.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./abstractEngine.renderPass.pure.js";
import { RegisterAbstractEngineRenderPass } from "./abstractEngine.renderPass.pure.js";
RegisterAbstractEngineRenderPass();
//# sourceMappingURL=abstractEngine.renderPass.js.map