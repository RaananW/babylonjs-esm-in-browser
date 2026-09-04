/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphPlaySoundBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphPlaySoundBlock.pure.js";
import { RegisterFlowGraphPlaySoundBlock } from "./flowGraphPlaySoundBlock.pure.js";
RegisterFlowGraphPlaySoundBlock();
//# sourceMappingURL=flowGraphPlaySoundBlock.js.map