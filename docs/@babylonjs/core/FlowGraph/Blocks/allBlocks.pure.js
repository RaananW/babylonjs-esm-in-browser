// Event blocks
import { RegisterFlowGraphMeshPickEventBlock } from "./Event/flowGraphMeshPickEventBlock.pure.js";
import { RegisterFlowGraphPointerOutEventBlock } from "./Event/flowGraphPointerOutEventBlock.pure.js";
import { RegisterFlowGraphPointerOverEventBlock } from "./Event/flowGraphPointerOverEventBlock.pure.js";
import { RegisterFlowGraphReceiveCustomEventBlock } from "./Event/flowGraphReceiveCustomEventBlock.pure.js";
import { RegisterFlowGraphSceneReadyEventBlock } from "./Event/flowGraphSceneReadyEventBlock.pure.js";
import { RegisterFlowGraphSceneTickEventBlock } from "./Event/flowGraphSceneTickEventBlock.pure.js";
import { RegisterFlowGraphSendCustomEventBlock } from "./Event/flowGraphSendCustomEventBlock.pure.js";
// Execution blocks
import { RegisterFlowGraphBezierCurveEasingBlock } from "./Execution/Animation/flowGraphBezierCurveEasingBlock.pure.js";
import { RegisterFlowGraphEasingBlock } from "./Execution/Animation/flowGraphEasingBlock.pure.js";
import { RegisterFlowGraphInterpolationBlock } from "./Execution/Animation/flowGraphInterpolationBlock.pure.js";
import { RegisterFlowGraphPauseAnimationBlock } from "./Execution/Animation/flowGraphPauseAnimationBlock.pure.js";
import { RegisterFlowGraphPlayAnimationBlock } from "./Execution/Animation/flowGraphPlayAnimationBlock.pure.js";
import { RegisterFlowGraphStopAnimationBlock } from "./Execution/Animation/flowGraphStopAnimationBlock.pure.js";
import { RegisterFlowGraphBranchBlock } from "./Execution/ControlFlow/flowGraphBranchBlock.pure.js";
import { RegisterFlowGraphCancelDelayBlock } from "./Execution/ControlFlow/flowGraphCancelDelayBlock.pure.js";
import { RegisterFlowGraphCounterBlock } from "./Execution/ControlFlow/flowGraphCounterBlock.pure.js";
import { RegisterFlowGraphDebounceBlock } from "./Execution/ControlFlow/flowGraphDebounceBlock.pure.js";
import { RegisterFlowGraphDoNBlock } from "./Execution/ControlFlow/flowGraphDoNBlock.pure.js";
import { RegisterFlowGraphFlipFlopBlock } from "./Execution/ControlFlow/flowGraphFlipFlopBlock.pure.js";
import { RegisterFlowGraphForLoopBlock } from "./Execution/ControlFlow/flowGraphForLoopBlock.pure.js";
import { RegisterFlowGraphMultiGateBlock } from "./Execution/ControlFlow/flowGraphMultiGateBlock.pure.js";
import { RegisterFlowGraphSequenceBlock } from "./Execution/ControlFlow/flowGraphSequenceBlock.pure.js";
import { RegisterFlowGraphSetDelayBlock } from "./Execution/ControlFlow/flowGraphSetDelayBlock.pure.js";
import { RegisterFlowGraphSwitchBlock } from "./Execution/ControlFlow/flowGraphSwitchBlock.pure.js";
import { RegisterFlowGraphThrottleBlock } from "./Execution/ControlFlow/flowGraphThrottleBlock.pure.js";
import { RegisterFlowGraphWaitAllBlock } from "./Execution/ControlFlow/flowGraphWaitAllBlock.pure.js";
import { RegisterFlowGraphWhileLoopBlock } from "./Execution/ControlFlow/flowGraphWhileLoopBlock.pure.js";
import { RegisterFlowGraphConsoleLogBlock } from "./Execution/flowGraphConsoleLogBlock.pure.js";
import { RegisterFlowGraphSetPropertyBlock } from "./Execution/flowGraphSetPropertyBlock.pure.js";
import { RegisterFlowGraphSetVariableBlock } from "./Execution/flowGraphSetVariableBlock.pure.js";
// Data blocks
import { RegisterFlowGraphArrayIndexBlock } from "./Data/Utils/flowGraphArrayIndexBlock.pure.js";
import { RegisterFlowGraphContextBlock } from "./Data/Utils/flowGraphContextBlock.pure.js";
import { RegisterFlowGraphFunctionReferenceBlock } from "./Data/Utils/flowGraphFunctionReferenceBlock.pure.js";
import { RegisterFlowGraphIndexOfBlock } from "./Data/Utils/flowGraphIndexOfBlock.pure.js";
import { RegisterFlowGraphJsonPointerParserBlock } from "./Data/Transformers/flowGraphJsonPointerParserBlock.pure.js";
import { RegisterFlowGraphTypeToTypeBlocks } from "./Data/Transformers/flowGraphTypeToTypeBlocks.pure.js";
import { RegisterFlowGraphMathBlocks } from "./Data/Math/flowGraphMathBlocks.pure.js";
import { RegisterFlowGraphMathCombineExtractBlocks } from "./Data/Math/flowGraphMathCombineExtractBlocks.pure.js";
import { RegisterFlowGraphMatrixMathBlocks } from "./Data/Math/flowGraphMatrixMathBlocks.pure.js";
import { RegisterFlowGraphVectorMathBlocks } from "./Data/Math/flowGraphVectorMathBlocks.pure.js";
import { RegisterFlowGraphConditionalDataBlock } from "./Data/flowGraphConditionalDataBlock.pure.js";
import { RegisterFlowGraphConstantBlock } from "./Data/flowGraphConstantBlock.pure.js";
import { RegisterFlowGraphDataSwitchBlock } from "./Data/flowGraphDataSwitchBlock.pure.js";
import { RegisterFlowGraphGetAssetBlock } from "./Data/flowGraphGetAssetBlock.pure.js";
import { RegisterFlowGraphGetPropertyBlock } from "./Data/flowGraphGetPropertyBlock.pure.js";
import { RegisterFlowGraphGetVariableBlock } from "./Data/flowGraphGetVariableBlock.pure.js";
import { RegisterFlowGraphTransformCoordinatesSystemBlock } from "./Data/flowGraphTransformCoordinatesSystemBlock.pure.js";
/**
 * Registers all event flow graph blocks for deserialization.
 */
export function RegisterFlowGraphEventBlocks() {
    RegisterFlowGraphMeshPickEventBlock();
    RegisterFlowGraphPointerOutEventBlock();
    RegisterFlowGraphPointerOverEventBlock();
    RegisterFlowGraphReceiveCustomEventBlock();
    RegisterFlowGraphSceneReadyEventBlock();
    RegisterFlowGraphSceneTickEventBlock();
    RegisterFlowGraphSendCustomEventBlock();
}
/**
 * Registers all execution flow graph blocks for deserialization.
 */
export function RegisterFlowGraphExecutionBlocks() {
    // Animation
    RegisterFlowGraphBezierCurveEasingBlock();
    RegisterFlowGraphEasingBlock();
    RegisterFlowGraphInterpolationBlock();
    RegisterFlowGraphPauseAnimationBlock();
    RegisterFlowGraphPlayAnimationBlock();
    RegisterFlowGraphStopAnimationBlock();
    // Control flow
    RegisterFlowGraphBranchBlock();
    RegisterFlowGraphCancelDelayBlock();
    RegisterFlowGraphCounterBlock();
    RegisterFlowGraphDebounceBlock();
    RegisterFlowGraphDoNBlock();
    RegisterFlowGraphFlipFlopBlock();
    RegisterFlowGraphForLoopBlock();
    RegisterFlowGraphMultiGateBlock();
    RegisterFlowGraphSequenceBlock();
    RegisterFlowGraphSetDelayBlock();
    RegisterFlowGraphSwitchBlock();
    RegisterFlowGraphThrottleBlock();
    RegisterFlowGraphWaitAllBlock();
    RegisterFlowGraphWhileLoopBlock();
    // Other execution
    RegisterFlowGraphConsoleLogBlock();
    RegisterFlowGraphSetPropertyBlock();
    RegisterFlowGraphSetVariableBlock();
}
/**
 * Registers all data flow graph blocks for deserialization.
 */
export function RegisterFlowGraphDataBlocks() {
    // Utils
    RegisterFlowGraphArrayIndexBlock();
    RegisterFlowGraphContextBlock();
    RegisterFlowGraphFunctionReferenceBlock();
    RegisterFlowGraphIndexOfBlock();
    // Transformers
    RegisterFlowGraphJsonPointerParserBlock();
    RegisterFlowGraphTypeToTypeBlocks();
    // Math
    RegisterFlowGraphMathBlocks();
    RegisterFlowGraphMathCombineExtractBlocks();
    RegisterFlowGraphMatrixMathBlocks();
    RegisterFlowGraphVectorMathBlocks();
    // Other data
    RegisterFlowGraphConditionalDataBlock();
    RegisterFlowGraphConstantBlock();
    RegisterFlowGraphDataSwitchBlock();
    RegisterFlowGraphGetAssetBlock();
    RegisterFlowGraphGetPropertyBlock();
    RegisterFlowGraphGetVariableBlock();
    RegisterFlowGraphTransformCoordinatesSystemBlock();
}
let _Registered = false;
/**
 * Registers all flow graph blocks in the type store.
 *
 * Note: Unlike other block systems, FlowGraph deserialization uses dynamic `import()` via
 * `blockFactory()` and does NOT require pre-registration. This function is provided for
 * architectural consistency and for scenarios where eager class registration is needed
 * (e.g., external tooling that queries the type store).
 */
export function RegisterAllFlowGraphBlocks() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterFlowGraphEventBlocks();
    RegisterFlowGraphExecutionBlocks();
    RegisterFlowGraphDataBlocks();
}
//# sourceMappingURL=allBlocks.pure.js.map