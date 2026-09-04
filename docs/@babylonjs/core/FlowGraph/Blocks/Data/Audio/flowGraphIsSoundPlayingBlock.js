/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphIsSoundPlayingBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphIsSoundPlayingBlock.pure.js";
import { RegisterFlowGraphIsSoundPlayingBlock } from "./flowGraphIsSoundPlayingBlock.pure.js";
RegisterFlowGraphIsSoundPlayingBlock();
//# sourceMappingURL=flowGraphIsSoundPlayingBlock.js.map