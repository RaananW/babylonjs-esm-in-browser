/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import imageProcessingConfiguration.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./imageProcessingConfiguration.pure.js";
export * from "./imageProcessingConfiguration.types.js";
import { RegisterImageProcessingConfiguration } from "./imageProcessingConfiguration.pure.js";
RegisterImageProcessingConfiguration();
import "./colorCurves.js";
//# sourceMappingURL=imageProcessingConfiguration.js.map