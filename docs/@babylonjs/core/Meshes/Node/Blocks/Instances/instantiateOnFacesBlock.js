/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import instantiateOnFacesBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./instantiateOnFacesBlock.pure.js";
import { RegisterInstantiateOnFacesBlock } from "./instantiateOnFacesBlock.pure.js";
RegisterInstantiateOnFacesBlock();
//# sourceMappingURL=instantiateOnFacesBlock.js.map