/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import sphereBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./sphereBlock.pure.js";
import { RegisterSphereBlock } from "./sphereBlock.pure.js";
RegisterSphereBlock();
//# sourceMappingURL=sphereBlock.js.map