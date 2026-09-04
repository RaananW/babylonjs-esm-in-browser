export * from "./engine.transformFeedback.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import engine.transformFeedback.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./engine.transformFeedback.pure.js";
import { RegisterEngineTransformFeedback } from "./engine.transformFeedback.pure.js";
RegisterEngineTransformFeedback();
//# sourceMappingURL=engine.transformFeedback.js.map