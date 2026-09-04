/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import WebXRNearInteraction.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./WebXRNearInteraction.pure.js";
export * from "./WebXRNearInteraction.types.js";
import { RegisterWebXRNearInteraction } from "./WebXRNearInteraction.pure.js";
RegisterWebXRNearInteraction();
//# sourceMappingURL=WebXRNearInteraction.js.map