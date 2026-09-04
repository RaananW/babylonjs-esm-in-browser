/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import nodeMaterial.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./nodeMaterial.pure.js";
export * from "./nodeMaterial.types.js";
import { RegisterNodeMaterial } from "./nodeMaterial.pure.js";
RegisterNodeMaterial();
//# sourceMappingURL=nodeMaterial.js.map