/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./EXT_texture_avif.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./EXT_texture_avif.types.js";
export * from "./EXT_texture_avif.pure.js";
import { RegisterEXT_texture_avif } from "./EXT_texture_avif.pure.js";
RegisterEXT_texture_avif();
//# sourceMappingURL=EXT_texture_avif.js.map