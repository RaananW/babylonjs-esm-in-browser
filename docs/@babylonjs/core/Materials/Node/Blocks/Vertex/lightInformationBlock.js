/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import lightInformationBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./lightInformationBlock.pure.js";
import { RegisterLightInformationBlock } from "./lightInformationBlock.pure.js";
RegisterLightInformationBlock();
//# sourceMappingURL=lightInformationBlock.js.map