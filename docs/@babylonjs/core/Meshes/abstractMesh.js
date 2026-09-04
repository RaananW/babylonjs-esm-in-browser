/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import abstractMesh.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./abstractMesh.pure.js";
import { RegisterAbstractMesh } from "./abstractMesh.pure.js";
RegisterAbstractMesh();
//# sourceMappingURL=abstractMesh.js.map