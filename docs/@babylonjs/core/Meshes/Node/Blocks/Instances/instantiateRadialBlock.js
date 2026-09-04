/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import instantiateRadialBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./instantiateRadialBlock.pure.js";
import { RegisterInstantiateRadialBlock } from "./instantiateRadialBlock.pure.js";
RegisterInstantiateRadialBlock();
//# sourceMappingURL=instantiateRadialBlock.js.map