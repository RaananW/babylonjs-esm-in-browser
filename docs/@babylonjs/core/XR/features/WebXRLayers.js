/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import WebXRLayers.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./WebXRLayers.pure.js";
import { RegisterWebXRLayers } from "./WebXRLayers.pure.js";
RegisterWebXRLayers();
//# sourceMappingURL=WebXRLayers.js.map