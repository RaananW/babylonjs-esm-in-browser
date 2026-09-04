export * from "./outlineRenderer.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import outlineRenderer.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./outlineRenderer.pure.js";
import { RegisterOutlineRenderer } from "./outlineRenderer.pure.js";
RegisterOutlineRenderer();
//# sourceMappingURL=outlineRenderer.js.map