export * from "./engine.dynamicBuffer.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import engine.dynamicBuffer.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./engine.dynamicBuffer.pure.js";
import { RegisterEngineDynamicBuffer } from "./engine.dynamicBuffer.pure.js";
RegisterEngineDynamicBuffer();
//# sourceMappingURL=engine.dynamicBuffer.js.map