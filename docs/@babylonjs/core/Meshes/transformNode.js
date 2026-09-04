/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import transformNode.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./transformNode.pure.js";
export * from "./transformNode.types.js";
import { RegisterTransformNode } from "./transformNode.pure.js";
RegisterTransformNode();
//# sourceMappingURL=transformNode.js.map