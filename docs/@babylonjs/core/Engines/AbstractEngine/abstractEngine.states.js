export * from "./abstractEngine.states.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import abstractEngine.states.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./abstractEngine.states.pure.js";
import { RegisterAbstractEngineStates } from "./abstractEngine.states.pure.js";
RegisterAbstractEngineStates();
//# sourceMappingURL=abstractEngine.states.js.map