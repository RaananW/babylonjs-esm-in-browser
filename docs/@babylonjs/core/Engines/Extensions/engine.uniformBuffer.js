export * from "./engine.uniformBuffer.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import engine.uniformBuffer.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./engine.uniformBuffer.pure.js";
import { RegisterEngineUniformBuffer } from "./engine.uniformBuffer.pure.js";
RegisterEngineUniformBuffer();
//# sourceMappingURL=engine.uniformBuffer.js.map