/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import geometryInterceptorBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./geometryInterceptorBlock.pure.js";
import { RegisterGeometryInterceptorBlock } from "./geometryInterceptorBlock.pure.js";
RegisterGeometryInterceptorBlock();
//# sourceMappingURL=geometryInterceptorBlock.js.map