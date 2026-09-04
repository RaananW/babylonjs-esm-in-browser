/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import clusteredLightContainer.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./clusteredLightContainer.pure.js";
import { RegisterClusteredLightContainer } from "./clusteredLightContainer.pure.js";
RegisterClusteredLightContainer();
//# sourceMappingURL=clusteredLightContainer.js.map