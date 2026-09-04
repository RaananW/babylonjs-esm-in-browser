/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import geometryModBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./geometryModBlock.pure.js";
import { RegisterGeometryModBlock } from "./geometryModBlock.pure.js";
RegisterGeometryModBlock();
//# sourceMappingURL=geometryModBlock.js.map