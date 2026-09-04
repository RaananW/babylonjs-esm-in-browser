/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./KHR_texture_basisu.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./KHR_texture_basisu.types.js";
export * from "./KHR_texture_basisu.pure.js";
import { RegisterKHR_texture_basisu } from "./KHR_texture_basisu.pure.js";
RegisterKHR_texture_basisu();
//# sourceMappingURL=KHR_texture_basisu.js.map