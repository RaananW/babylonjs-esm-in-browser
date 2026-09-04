/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphPlayAnimationBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphPlayAnimationBlock.pure.js";
import { RegisterFlowGraphPlayAnimationBlock } from "./flowGraphPlayAnimationBlock.pure.js";
RegisterFlowGraphPlayAnimationBlock();
import "../../../../Animations/animationGroup.js";
//# sourceMappingURL=flowGraphPlayAnimationBlock.js.map