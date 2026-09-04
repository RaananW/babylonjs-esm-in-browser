/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./MSFT_minecraftMesh.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./MSFT_minecraftMesh.types.js";
export * from "./MSFT_minecraftMesh.pure.js";
import { RegisterMSFT_minecraftMesh } from "./MSFT_minecraftMesh.pure.js";
RegisterMSFT_minecraftMesh();
//# sourceMappingURL=MSFT_minecraftMesh.js.map