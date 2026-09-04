/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import refractionBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./refractionBlock.pure.js";
import { RegisterRefractionBlock } from "./refractionBlock.pure.js";
RegisterRefractionBlock();
//# sourceMappingURL=refractionBlock.js.map