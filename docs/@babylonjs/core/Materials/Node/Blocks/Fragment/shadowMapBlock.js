/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import shadowMapBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./shadowMapBlock.pure.js";
import { RegisterShadowMapBlock } from "./shadowMapBlock.pure.js";
RegisterShadowMapBlock();
//# sourceMappingURL=shadowMapBlock.js.map