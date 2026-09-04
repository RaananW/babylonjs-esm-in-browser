/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./bvhFileLoader.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./bvhFileLoader.types.js";
export * from "./bvhFileLoader.pure.js";
import { RegisterBVHFileLoader } from "./bvhFileLoader.pure.js";
RegisterBVHFileLoader();
//# sourceMappingURL=bvhFileLoader.js.map