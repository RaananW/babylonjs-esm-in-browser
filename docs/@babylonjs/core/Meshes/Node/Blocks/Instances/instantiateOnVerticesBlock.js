/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import instantiateOnVerticesBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./instantiateOnVerticesBlock.pure.js";
import { RegisterInstantiateOnVerticesBlock } from "./instantiateOnVerticesBlock.pure.js";
RegisterInstantiateOnVerticesBlock();
//# sourceMappingURL=instantiateOnVerticesBlock.js.map