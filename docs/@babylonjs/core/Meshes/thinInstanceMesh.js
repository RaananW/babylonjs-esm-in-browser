export * from "./thinInstanceMesh.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import thinInstanceMesh.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./thinInstanceMesh.pure.js";
import { RegisterThinInstanceMesh } from "./thinInstanceMesh.pure.js";
RegisterThinInstanceMesh();
//# sourceMappingURL=thinInstanceMesh.js.map