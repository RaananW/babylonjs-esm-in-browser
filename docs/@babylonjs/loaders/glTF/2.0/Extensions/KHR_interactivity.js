/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./KHR_interactivity.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./KHR_interactivity.types.js";
export * from "./KHR_interactivity.pure.js";
import { RegisterKHR_interactivity } from "./KHR_interactivity.pure.js";
RegisterKHR_interactivity();
//# sourceMappingURL=KHR_interactivity.js.map