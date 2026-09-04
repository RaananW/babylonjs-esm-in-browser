/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphJsonPointerParserBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphJsonPointerParserBlock.pure.js";
import { RegisterFlowGraphJsonPointerParserBlock } from "./flowGraphJsonPointerParserBlock.pure.js";
RegisterFlowGraphJsonPointerParserBlock();
//# sourceMappingURL=flowGraphJsonPointerParserBlock.js.map