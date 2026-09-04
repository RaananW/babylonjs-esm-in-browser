/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphGetAssetBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphGetAssetBlock.pure.js";
import { RegisterFlowGraphGetAssetBlock } from "./flowGraphGetAssetBlock.pure.js";
RegisterFlowGraphGetAssetBlock();
//# sourceMappingURL=flowGraphGetAssetBlock.js.map