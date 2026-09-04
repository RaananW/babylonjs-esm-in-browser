import { FlowGraphBlock } from "../flowGraphBlock.js";
/**
 * Any external module that wishes to add a new block to the flow graph can add to this object using the helper function.
 */
const CustomBlocks = {};
/**
 * Reverse lookup: short block name → full "module/blockName" key, for O(1) fallback.
 */
const ShortNameToFullKey = {};
/**
 * If you want to add a new block to the block factory, you should use this function.
 * Please be sure to choose a unique name and define the responsible module.
 * @param module the name of the module that is responsible for the block
 * @param blockName the name of the block. This should be unique.
 * @param factory an async factory function to generate the block
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function addToBlockFactory(module, blockName, factory) {
    const fullKey = `${module}/${blockName}`;
    CustomBlocks[fullKey] = factory;
    ShortNameToFullKey[blockName] = fullKey;
}
function _IsFlowGraphBlockConstructor(value) {
    return typeof value === "function" && value.prototype instanceof FlowGraphBlock;
}
async function _LoadBlock(modulePromise, blockName) {
    const module = await modulePromise;
    let block;
    let register;
    for (const [exportName, value] of Object.entries(module)) {
        if (exportName === blockName && _IsFlowGraphBlockConstructor(value)) {
            block = value;
        }
        else if (exportName.startsWith("RegisterFlowGraph") && typeof value === "function") {
            register = value;
        }
    }
    if (!block || !register) {
        throw new Error(`Invalid FlowGraph block module for ${blockName}`);
    }
    register();
    if (blockName === "FlowGraphPlayAnimationBlock") {
        const { RegisterAnimationGroup } = await import("../../Animations/animationGroup.pure.js");
        RegisterAnimationGroup();
    }
    return block;
}
/**
 * a function to get a factory function for a block.
 * @param blockName the block name to initialize. If the block comes from an external module, the name should be in the format "module/blockName"
 * @returns an async factory function that will return the block class when called.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function blockFactory(blockName) {
    switch (blockName) {
        case "FlowGraphPlayAnimationBlock" /* FlowGraphBlockNames.PlayAnimation */:
            return async () => await _LoadBlock(import("./Execution/Animation/flowGraphPlayAnimationBlock.pure.js"), "FlowGraphPlayAnimationBlock");
        case "FlowGraphStopAnimationBlock" /* FlowGraphBlockNames.StopAnimation */:
            return async () => await _LoadBlock(import("./Execution/Animation/flowGraphStopAnimationBlock.pure.js"), "FlowGraphStopAnimationBlock");
        case "FlowGraphPauseAnimationBlock" /* FlowGraphBlockNames.PauseAnimation */:
            return async () => await _LoadBlock(import("./Execution/Animation/flowGraphPauseAnimationBlock.pure.js"), "FlowGraphPauseAnimationBlock");
        case "FlowGraphInterpolationBlock" /* FlowGraphBlockNames.ValueInterpolation */:
            return async () => await _LoadBlock(import("./Execution/Animation/flowGraphInterpolationBlock.pure.js"), "FlowGraphInterpolationBlock");
        case "FlowGraphSceneReadyEventBlock" /* FlowGraphBlockNames.SceneReadyEvent */:
            return async () => await _LoadBlock(import("./Event/flowGraphSceneReadyEventBlock.pure.js"), "FlowGraphSceneReadyEventBlock");
        case "FlowGraphSceneTickEventBlock" /* FlowGraphBlockNames.SceneTickEvent */:
            return async () => await _LoadBlock(import("./Event/flowGraphSceneTickEventBlock.pure.js"), "FlowGraphSceneTickEventBlock");
        case "FlowGraphSendCustomEventBlock" /* FlowGraphBlockNames.SendCustomEvent */:
            return async () => await _LoadBlock(import("./Event/flowGraphSendCustomEventBlock.pure.js"), "FlowGraphSendCustomEventBlock");
        case "FlowGraphReceiveCustomEventBlock" /* FlowGraphBlockNames.ReceiveCustomEvent */:
            return async () => await _LoadBlock(import("./Event/flowGraphReceiveCustomEventBlock.pure.js"), "FlowGraphReceiveCustomEventBlock");
        case "FlowGraphStopEventPropagationBlock" /* FlowGraphBlockNames.StopEventPropagation */:
            return async () => await _LoadBlock(import("./Event/flowGraphStopEventPropagationBlock.pure.js"), "FlowGraphStopEventPropagationBlock");
        case "FlowGraphMeshPickEventBlock" /* FlowGraphBlockNames.MeshPickEvent */:
            return async () => await _LoadBlock(import("./Event/flowGraphMeshPickEventBlock.pure.js"), "FlowGraphMeshPickEventBlock");
        case "FlowGraphEBlock" /* FlowGraphBlockNames.E */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphEBlock");
        case "FlowGraphPIBlock" /* FlowGraphBlockNames.PI */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphPiBlock");
        case "FlowGraphTauBlock" /* FlowGraphBlockNames.Tau */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphTauBlock");
        case "FlowGraphInfBlock" /* FlowGraphBlockNames.Inf */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphInfBlock");
        case "FlowGraphNaNBlock" /* FlowGraphBlockNames.NaN */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphNaNBlock");
        case "FlowGraphRandomBlock" /* FlowGraphBlockNames.Random */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphRandomBlock");
        case "FlowGraphAddBlock" /* FlowGraphBlockNames.Add */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphAddBlock");
        case "FlowGraphSubtractBlock" /* FlowGraphBlockNames.Subtract */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphSubtractBlock");
        case "FlowGraphMultiplyBlock" /* FlowGraphBlockNames.Multiply */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphMultiplyBlock");
        case "FlowGraphDivideBlock" /* FlowGraphBlockNames.Divide */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphDivideBlock");
        case "FlowGraphAbsBlock" /* FlowGraphBlockNames.Abs */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphAbsBlock");
        case "FlowGraphSignBlock" /* FlowGraphBlockNames.Sign */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphSignBlock");
        case "FlowGraphTruncBlock" /* FlowGraphBlockNames.Trunc */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphTruncBlock");
        case "FlowGraphFloorBlock" /* FlowGraphBlockNames.Floor */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphFloorBlock");
        case "FlowGraphCeilBlock" /* FlowGraphBlockNames.Ceil */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphCeilBlock");
        case "FlowGraphRoundBlock" /* FlowGraphBlockNames.Round */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphRoundBlock");
        case "FlowGraphFractBlock" /* FlowGraphBlockNames.Fraction */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphFractionBlock");
        case "FlowGraphNegationBlock" /* FlowGraphBlockNames.Negation */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphNegationBlock");
        case "FlowGraphModuloBlock" /* FlowGraphBlockNames.Modulo */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphModuloBlock");
        case "FlowGraphMinBlock" /* FlowGraphBlockNames.Min */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphMinBlock");
        case "FlowGraphMaxBlock" /* FlowGraphBlockNames.Max */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphMaxBlock");
        case "FlowGraphClampBlock" /* FlowGraphBlockNames.Clamp */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphClampBlock");
        case "FlowGraphSaturateBlock" /* FlowGraphBlockNames.Saturate */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphSaturateBlock");
        case "FlowGraphMathInterpolationBlock" /* FlowGraphBlockNames.MathInterpolation */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphMathInterpolationBlock");
        case "FlowGraphMathSlerpBlock" /* FlowGraphBlockNames.MathSlerp */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphMathSlerpBlock");
        case "FlowGraphSmoothStepBlock" /* FlowGraphBlockNames.SmoothStep */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphMathSmoothStepBlock");
        case "FlowGraphRGBToOkLChBlock" /* FlowGraphBlockNames.RGBToOkLCh */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphRGBToOkLChBlock");
        case "FlowGraphRGBFromOkLChBlock" /* FlowGraphBlockNames.RGBFromOkLCh */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphRGBFromOkLChBlock");
        case "FlowGraphEqualityBlock" /* FlowGraphBlockNames.Equality */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphEqualityBlock");
        case "FlowGraphLessThanBlock" /* FlowGraphBlockNames.LessThan */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphLessThanBlock");
        case "FlowGraphLessThanOrEqualBlock" /* FlowGraphBlockNames.LessThanOrEqual */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphLessThanOrEqualBlock");
        case "FlowGraphGreaterThanBlock" /* FlowGraphBlockNames.GreaterThan */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphGreaterThanBlock");
        case "FlowGraphGreaterThanOrEqualBlock" /* FlowGraphBlockNames.GreaterThanOrEqual */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphGreaterThanOrEqualBlock");
        case "FlowGraphIsNaNBlock" /* FlowGraphBlockNames.IsNaN */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphIsNanBlock");
        case "FlowGraphIsInfBlock" /* FlowGraphBlockNames.IsInfinity */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphIsInfinityBlock");
        case "FlowGraphDegToRadBlock" /* FlowGraphBlockNames.DegToRad */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphDegToRadBlock");
        case "FlowGraphRadToDegBlock" /* FlowGraphBlockNames.RadToDeg */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphRadToDegBlock");
        case "FlowGraphSinBlock" /* FlowGraphBlockNames.Sin */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphSinBlock");
        case "FlowGraphCosBlock" /* FlowGraphBlockNames.Cos */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphCosBlock");
        case "FlowGraphTanBlock" /* FlowGraphBlockNames.Tan */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphTanBlock");
        case "FlowGraphASinBlock" /* FlowGraphBlockNames.Asin */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphAsinBlock");
        case "FlowGraphACosBlock" /* FlowGraphBlockNames.Acos */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphAcosBlock");
        case "FlowGraphATanBlock" /* FlowGraphBlockNames.Atan */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphAtanBlock");
        case "FlowGraphATan2Block" /* FlowGraphBlockNames.Atan2 */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphAtan2Block");
        case "FlowGraphSinhBlock" /* FlowGraphBlockNames.Sinh */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphSinhBlock");
        case "FlowGraphCoshBlock" /* FlowGraphBlockNames.Cosh */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphCoshBlock");
        case "FlowGraphTanhBlock" /* FlowGraphBlockNames.Tanh */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphTanhBlock");
        case "FlowGraphASinhBlock" /* FlowGraphBlockNames.Asinh */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphAsinhBlock");
        case "FlowGraphACoshBlock" /* FlowGraphBlockNames.Acosh */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphAcoshBlock");
        case "FlowGraphATanhBlock" /* FlowGraphBlockNames.Atanh */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphAtanhBlock");
        case "FlowGraphExponentialBlock" /* FlowGraphBlockNames.Exponential */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphExpBlock");
        case "FlowGraphLogBlock" /* FlowGraphBlockNames.Log */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphLogBlock");
        case "FlowGraphLog2Block" /* FlowGraphBlockNames.Log2 */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphLog2Block");
        case "FlowGraphLog10Block" /* FlowGraphBlockNames.Log10 */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphLog10Block");
        case "FlowGraphSquareRootBlock" /* FlowGraphBlockNames.SquareRoot */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphSquareRootBlock");
        case "FlowGraphPowerBlock" /* FlowGraphBlockNames.Power */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphPowerBlock");
        case "FlowGraphCubeRootBlock" /* FlowGraphBlockNames.CubeRoot */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphCubeRootBlock");
        case "FlowGraphBitwiseAndBlock" /* FlowGraphBlockNames.BitwiseAnd */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphBitwiseAndBlock");
        case "FlowGraphBitwiseOrBlock" /* FlowGraphBlockNames.BitwiseOr */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphBitwiseOrBlock");
        case "FlowGraphBitwiseNotBlock" /* FlowGraphBlockNames.BitwiseNot */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphBitwiseNotBlock");
        case "FlowGraphBitwiseXorBlock" /* FlowGraphBlockNames.BitwiseXor */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphBitwiseXorBlock");
        case "FlowGraphBitwiseLeftShiftBlock" /* FlowGraphBlockNames.BitwiseLeftShift */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphBitwiseLeftShiftBlock");
        case "FlowGraphBitwiseRightShiftBlock" /* FlowGraphBlockNames.BitwiseRightShift */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphBitwiseRightShiftBlock");
        case "FlowGraphLengthBlock" /* FlowGraphBlockNames.Length */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphVectorMathBlocks.pure.js"), "FlowGraphLengthBlock");
        case "FlowGraphNormalizeBlock" /* FlowGraphBlockNames.Normalize */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphVectorMathBlocks.pure.js"), "FlowGraphNormalizeBlock");
        case "FlowGraphDotBlock" /* FlowGraphBlockNames.Dot */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphVectorMathBlocks.pure.js"), "FlowGraphDotBlock");
        case "FlowGraphCrossBlock" /* FlowGraphBlockNames.Cross */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphVectorMathBlocks.pure.js"), "FlowGraphCrossBlock");
        case "FlowGraphRotate2DBlock" /* FlowGraphBlockNames.Rotate2D */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphVectorMathBlocks.pure.js"), "FlowGraphRotate2DBlock");
        case "FlowGraphRotate3DBlock" /* FlowGraphBlockNames.Rotate3D */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphVectorMathBlocks.pure.js"), "FlowGraphRotate3DBlock");
        case "FlowGraphTransposeBlock" /* FlowGraphBlockNames.Transpose */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMatrixMathBlocks.pure.js"), "FlowGraphTransposeBlock");
        case "FlowGraphDeterminantBlock" /* FlowGraphBlockNames.Determinant */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMatrixMathBlocks.pure.js"), "FlowGraphDeterminantBlock");
        case "FlowGraphInvertMatrixBlock" /* FlowGraphBlockNames.InvertMatrix */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMatrixMathBlocks.pure.js"), "FlowGraphInvertMatrixBlock");
        case "FlowGraphMatrixMultiplicationBlock" /* FlowGraphBlockNames.MatrixMultiplication */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMatrixMathBlocks.pure.js"), "FlowGraphMatrixMultiplicationBlock");
        case "FlowGraphBranchBlock" /* FlowGraphBlockNames.Branch */:
            return async () => await _LoadBlock(import("./Execution/ControlFlow/flowGraphBranchBlock.pure.js"), "FlowGraphBranchBlock");
        case "FlowGraphSetDelayBlock" /* FlowGraphBlockNames.SetDelay */:
            return async () => await _LoadBlock(import("./Execution/ControlFlow/flowGraphSetDelayBlock.pure.js"), "FlowGraphSetDelayBlock");
        case "FlowGraphCancelDelayBlock" /* FlowGraphBlockNames.CancelDelay */:
            return async () => await _LoadBlock(import("./Execution/ControlFlow/flowGraphCancelDelayBlock.pure.js"), "FlowGraphCancelDelayBlock");
        case "FlowGraphCallCounterBlock" /* FlowGraphBlockNames.CallCounter */:
            return async () => await _LoadBlock(import("./Execution/ControlFlow/flowGraphCounterBlock.pure.js"), "FlowGraphCallCounterBlock");
        case "FlowGraphDebounceBlock" /* FlowGraphBlockNames.Debounce */:
            return async () => await _LoadBlock(import("./Execution/ControlFlow/flowGraphDebounceBlock.pure.js"), "FlowGraphDebounceBlock");
        case "FlowGraphThrottleBlock" /* FlowGraphBlockNames.Throttle */:
            return async () => await _LoadBlock(import("./Execution/ControlFlow/flowGraphThrottleBlock.pure.js"), "FlowGraphThrottleBlock");
        case "FlowGraphDoNBlock" /* FlowGraphBlockNames.DoN */:
            return async () => await _LoadBlock(import("./Execution/ControlFlow/flowGraphDoNBlock.pure.js"), "FlowGraphDoNBlock");
        case "FlowGraphFlipFlopBlock" /* FlowGraphBlockNames.FlipFlop */:
            return async () => await _LoadBlock(import("./Execution/ControlFlow/flowGraphFlipFlopBlock.pure.js"), "FlowGraphFlipFlopBlock");
        case "FlowGraphForLoopBlock" /* FlowGraphBlockNames.ForLoop */:
            return async () => await _LoadBlock(import("./Execution/ControlFlow/flowGraphForLoopBlock.pure.js"), "FlowGraphForLoopBlock");
        case "FlowGraphMultiGateBlock" /* FlowGraphBlockNames.MultiGate */:
            return async () => await _LoadBlock(import("./Execution/ControlFlow/flowGraphMultiGateBlock.pure.js"), "FlowGraphMultiGateBlock");
        case "FlowGraphSequenceBlock" /* FlowGraphBlockNames.Sequence */:
            return async () => await _LoadBlock(import("./Execution/ControlFlow/flowGraphSequenceBlock.pure.js"), "FlowGraphSequenceBlock");
        case "FlowGraphSwitchBlock" /* FlowGraphBlockNames.Switch */:
            return async () => await _LoadBlock(import("./Execution/ControlFlow/flowGraphSwitchBlock.pure.js"), "FlowGraphSwitchBlock");
        case "FlowGraphWaitAllBlock" /* FlowGraphBlockNames.WaitAll */:
            return async () => await _LoadBlock(import("./Execution/ControlFlow/flowGraphWaitAllBlock.pure.js"), "FlowGraphWaitAllBlock");
        case "FlowGraphWhileLoopBlock" /* FlowGraphBlockNames.WhileLoop */:
            return async () => await _LoadBlock(import("./Execution/ControlFlow/flowGraphWhileLoopBlock.pure.js"), "FlowGraphWhileLoopBlock");
        case "FlowGraphConsoleLogBlock" /* FlowGraphBlockNames.ConsoleLog */:
            return async () => await _LoadBlock(import("./Execution/flowGraphConsoleLogBlock.pure.js"), "FlowGraphConsoleLogBlock");
        case "FlowGraphConditionalBlock" /* FlowGraphBlockNames.Conditional */:
            return async () => await _LoadBlock(import("./Data/flowGraphConditionalDataBlock.pure.js"), "FlowGraphConditionalDataBlock");
        case "FlowGraphConstantBlock" /* FlowGraphBlockNames.Constant */:
            return async () => await _LoadBlock(import("./Data/flowGraphConstantBlock.pure.js"), "FlowGraphConstantBlock");
        case "FlowGraphTransformCoordinatesSystemBlock" /* FlowGraphBlockNames.TransformCoordinatesSystem */:
            return async () => await _LoadBlock(import("./Data/flowGraphTransformCoordinatesSystemBlock.pure.js"), "FlowGraphTransformCoordinatesSystemBlock");
        case "FlowGraphGetAssetBlock" /* FlowGraphBlockNames.GetAsset */:
            return async () => await _LoadBlock(import("./Data/flowGraphGetAssetBlock.pure.js"), "FlowGraphGetAssetBlock");
        case "FlowGraphGetPropertyBlock" /* FlowGraphBlockNames.GetProperty */:
            return async () => await _LoadBlock(import("./Data/flowGraphGetPropertyBlock.pure.js"), "FlowGraphGetPropertyBlock");
        case "FlowGraphSetPropertyBlock" /* FlowGraphBlockNames.SetProperty */:
            return async () => await _LoadBlock(import("./Execution/flowGraphSetPropertyBlock.pure.js"), "FlowGraphSetPropertyBlock");
        case "FlowGraphGetVariableBlock" /* FlowGraphBlockNames.GetVariable */:
            return async () => await _LoadBlock(import("./Data/flowGraphGetVariableBlock.pure.js"), "FlowGraphGetVariableBlock");
        case "FlowGraphSetVariableBlock" /* FlowGraphBlockNames.SetVariable */:
            return async () => await _LoadBlock(import("./Execution/flowGraphSetVariableBlock.pure.js"), "FlowGraphSetVariableBlock");
        case "FlowGraphJsonPointerParserBlock" /* FlowGraphBlockNames.JsonPointerParser */:
            return async () => await _LoadBlock(import("./Data/Transformers/flowGraphJsonPointerParserBlock.pure.js"), "FlowGraphJsonPointerParserBlock");
        case "FlowGraphLeadingZerosBlock" /* FlowGraphBlockNames.LeadingZeros */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphLeadingZerosBlock");
        case "FlowGraphTrailingZerosBlock" /* FlowGraphBlockNames.TrailingZeros */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphTrailingZerosBlock");
        case "FlowGraphOneBitsCounterBlock" /* FlowGraphBlockNames.OneBitsCounter */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathBlocks.pure.js"), "FlowGraphOneBitsCounterBlock");
        case "FlowGraphCombineVector2Block" /* FlowGraphBlockNames.CombineVector2 */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathCombineExtractBlocks.pure.js"), "FlowGraphCombineVector2Block");
        case "FlowGraphCombineVector3Block" /* FlowGraphBlockNames.CombineVector3 */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathCombineExtractBlocks.pure.js"), "FlowGraphCombineVector3Block");
        case "FlowGraphCombineVector4Block" /* FlowGraphBlockNames.CombineVector4 */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathCombineExtractBlocks.pure.js"), "FlowGraphCombineVector4Block");
        case "FlowGraphCombineMatrixBlock" /* FlowGraphBlockNames.CombineMatrix */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathCombineExtractBlocks.pure.js"), "FlowGraphCombineMatrixBlock");
        case "FlowGraphCombineMatrix2DBlock" /* FlowGraphBlockNames.CombineMatrix2D */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathCombineExtractBlocks.pure.js"), "FlowGraphCombineMatrix2DBlock");
        case "FlowGraphCombineMatrix3DBlock" /* FlowGraphBlockNames.CombineMatrix3D */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathCombineExtractBlocks.pure.js"), "FlowGraphCombineMatrix3DBlock");
        case "FlowGraphExtractVector2Block" /* FlowGraphBlockNames.ExtractVector2 */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathCombineExtractBlocks.pure.js"), "FlowGraphExtractVector2Block");
        case "FlowGraphExtractVector3Block" /* FlowGraphBlockNames.ExtractVector3 */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathCombineExtractBlocks.pure.js"), "FlowGraphExtractVector3Block");
        case "FlowGraphExtractVector4Block" /* FlowGraphBlockNames.ExtractVector4 */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathCombineExtractBlocks.pure.js"), "FlowGraphExtractVector4Block");
        case "FlowGraphExtractMatrixBlock" /* FlowGraphBlockNames.ExtractMatrix */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathCombineExtractBlocks.pure.js"), "FlowGraphExtractMatrixBlock");
        case "FlowGraphExtractMatrix2DBlock" /* FlowGraphBlockNames.ExtractMatrix2D */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathCombineExtractBlocks.pure.js"), "FlowGraphExtractMatrix2DBlock");
        case "FlowGraphExtractMatrix3DBlock" /* FlowGraphBlockNames.ExtractMatrix3D */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMathCombineExtractBlocks.pure.js"), "FlowGraphExtractMatrix3DBlock");
        case "FlowGraphTransformVectorBlock" /* FlowGraphBlockNames.TransformVector */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphVectorMathBlocks.pure.js"), "FlowGraphTransformBlock");
        case "FlowGraphTransformCoordinatesBlock" /* FlowGraphBlockNames.TransformCoordinates */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphVectorMathBlocks.pure.js"), "FlowGraphTransformCoordinatesBlock");
        case "FlowGraphConjugateBlock" /* FlowGraphBlockNames.Conjugate */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphVectorMathBlocks.pure.js"), "FlowGraphConjugateBlock");
        case "FlowGraphAngleBetweenBlock" /* FlowGraphBlockNames.AngleBetween */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphVectorMathBlocks.pure.js"), "FlowGraphAngleBetweenBlock");
        case "FlowGraphQuaternionFromAxisAngleBlock" /* FlowGraphBlockNames.QuaternionFromAxisAngle */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphVectorMathBlocks.pure.js"), "FlowGraphQuaternionFromAxisAngleBlock");
        case "FlowGraphAxisAngleFromQuaternionBlock" /* FlowGraphBlockNames.AxisAngleFromQuaternion */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphVectorMathBlocks.pure.js"), "FlowGraphAxisAngleFromQuaternionBlock");
        case "FlowGraphQuaternionFromDirectionsBlock" /* FlowGraphBlockNames.QuaternionFromDirections */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphVectorMathBlocks.pure.js"), "FlowGraphQuaternionFromDirectionsBlock");
        case "FlowGraphQuaternionFromUpForwardBlock" /* FlowGraphBlockNames.QuaternionFromUpForward */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphVectorMathBlocks.pure.js"), "FlowGraphQuaternionFromUpForwardBlock");
        case "FlowGraphQuaternionFromAnglesBlock" /* FlowGraphBlockNames.QuaternionFromAngles */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphVectorMathBlocks.pure.js"), "FlowGraphQuaternionFromAnglesBlock");
        case "FlowGraphVectorSlerpBlock" /* FlowGraphBlockNames.VectorSlerp */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphVectorMathBlocks.pure.js"), "FlowGraphVectorSlerpBlock");
        case "FlowGraphMatrixDecompose" /* FlowGraphBlockNames.MatrixDecompose */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMatrixMathBlocks.pure.js"), "FlowGraphMatrixDecomposeBlock");
        case "FlowGraphMatrixCompose" /* FlowGraphBlockNames.MatrixCompose */:
            return async () => await _LoadBlock(import("./Data/Math/flowGraphMatrixMathBlocks.pure.js"), "FlowGraphMatrixComposeBlock");
        case "FlowGraphBooleanToFloat" /* FlowGraphBlockNames.BooleanToFloat */:
            return async () => await _LoadBlock(import("./Data/Transformers/flowGraphTypeToTypeBlocks.pure.js"), "FlowGraphBooleanToFloat");
        case "FlowGraphBooleanToInt" /* FlowGraphBlockNames.BooleanToInt */:
            return async () => await _LoadBlock(import("./Data/Transformers/flowGraphTypeToTypeBlocks.pure.js"), "FlowGraphBooleanToInt");
        case "FlowGraphFloatToBoolean" /* FlowGraphBlockNames.FloatToBoolean */:
            return async () => await _LoadBlock(import("./Data/Transformers/flowGraphTypeToTypeBlocks.pure.js"), "FlowGraphFloatToBoolean");
        case "FlowGraphIntToBoolean" /* FlowGraphBlockNames.IntToBoolean */:
            return async () => await _LoadBlock(import("./Data/Transformers/flowGraphTypeToTypeBlocks.pure.js"), "FlowGraphIntToBoolean");
        case "FlowGraphIntToFloat" /* FlowGraphBlockNames.IntToFloat */:
            return async () => await _LoadBlock(import("./Data/Transformers/flowGraphTypeToTypeBlocks.pure.js"), "FlowGraphIntToFloat");
        case "FlowGraphFloatToInt" /* FlowGraphBlockNames.FloatToInt */:
            return async () => await _LoadBlock(import("./Data/Transformers/flowGraphTypeToTypeBlocks.pure.js"), "FlowGraphFloatToInt");
        case "FlowGraphEasingBlock" /* FlowGraphBlockNames.Easing */:
            return async () => await _LoadBlock(import("./Execution/Animation/flowGraphEasingBlock.pure.js"), "FlowGraphEasingBlock");
        case "FlowGraphBezierCurveEasing" /* FlowGraphBlockNames.BezierCurveEasing */:
            return async () => await _LoadBlock(import("./Execution/Animation/flowGraphBezierCurveEasingBlock.pure.js"), "FlowGraphBezierCurveEasingBlock");
        case "FlowGraphPointerOverEventBlock" /* FlowGraphBlockNames.PointerOverEvent */:
            return async () => await _LoadBlock(import("./Event/flowGraphPointerOverEventBlock.pure.js"), "FlowGraphPointerOverEventBlock");
        case "FlowGraphPointerOutEventBlock" /* FlowGraphBlockNames.PointerOutEvent */:
            return async () => await _LoadBlock(import("./Event/flowGraphPointerOutEventBlock.pure.js"), "FlowGraphPointerOutEventBlock");
        case "FlowGraphPointerDownEventBlock" /* FlowGraphBlockNames.PointerDownEvent */:
            return async () => await _LoadBlock(import("./Event/flowGraphPointerDownEventBlock.pure.js"), "FlowGraphPointerDownEventBlock");
        case "FlowGraphPointerUpEventBlock" /* FlowGraphBlockNames.PointerUpEvent */:
            return async () => await _LoadBlock(import("./Event/flowGraphPointerUpEventBlock.pure.js"), "FlowGraphPointerUpEventBlock");
        case "FlowGraphPointerMoveEventBlock" /* FlowGraphBlockNames.PointerMoveEvent */:
            return async () => await _LoadBlock(import("./Event/flowGraphPointerMoveEventBlock.pure.js"), "FlowGraphPointerMoveEventBlock");
        // Keyboard
        case "FlowGraphKeyDownEventBlock" /* FlowGraphBlockNames.KeyDownEvent */:
            return async () => await _LoadBlock(import("./Event/flowGraphKeyDownEventBlock.pure.js"), "FlowGraphKeyDownEventBlock");
        case "FlowGraphKeyUpEventBlock" /* FlowGraphBlockNames.KeyUpEvent */:
            return async () => await _LoadBlock(import("./Event/flowGraphKeyUpEventBlock.pure.js"), "FlowGraphKeyUpEventBlock");
        case "FlowGraphIsKeyPressedBlock" /* FlowGraphBlockNames.IsKeyPressed */:
            return async () => await _LoadBlock(import("./Data/flowGraphIsKeyPressedBlock.pure.js"), "FlowGraphIsKeyPressedBlock");
        case "FlowGraphContextBlock" /* FlowGraphBlockNames.Context */:
            return async () => await _LoadBlock(import("./Data/Utils/flowGraphContextBlock.pure.js"), "FlowGraphContextBlock");
        case "FlowGraphArrayIndexBlock" /* FlowGraphBlockNames.ArrayIndex */:
            return async () => await _LoadBlock(import("./Data/Utils/flowGraphArrayIndexBlock.pure.js"), "FlowGraphArrayIndexBlock");
        case "FlowGraphCodeExecutionBlock" /* FlowGraphBlockNames.CodeExecution */:
            return async () => (await import("./Data/Utils/flowGraphCodeExecutionBlock.js")).FlowGraphCodeExecutionBlock;
        case "FlowGraphIndexOfBlock" /* FlowGraphBlockNames.IndexOf */:
            return async () => await _LoadBlock(import("./Data/Utils/flowGraphIndexOfBlock.pure.js"), "FlowGraphIndexOfBlock");
        case "FlowGraphFunctionReference" /* FlowGraphBlockNames.FunctionReference */:
            return async () => await _LoadBlock(import("./Data/Utils/flowGraphFunctionReferenceBlock.pure.js"), "FlowGraphFunctionReferenceBlock");
        case "FlowGraphDataSwitchBlock" /* FlowGraphBlockNames.DataSwitch */:
            return async () => await _LoadBlock(import("./Data/flowGraphDataSwitchBlock.pure.js"), "FlowGraphDataSwitchBlock");
        case "FlowGraphDebugBlock" /* FlowGraphBlockNames.DebugBlock */:
            return async () => await _LoadBlock(import("./Data/flowGraphDebugBlock.pure.js"), "FlowGraphDebugBlock");
        // Physics
        case "FlowGraphPhysicsCollisionEventBlock" /* FlowGraphBlockNames.PhysicsCollisionEvent */:
            return async () => await _LoadBlock(import("./Event/flowGraphPhysicsCollisionEventBlock.pure.js"), "FlowGraphPhysicsCollisionEventBlock");
        case "FlowGraphApplyForceBlock" /* FlowGraphBlockNames.PhysicsApplyForce */:
            return async () => await _LoadBlock(import("./Execution/Physics/flowGraphApplyForceBlock.pure.js"), "FlowGraphApplyForceBlock");
        case "FlowGraphApplyImpulseBlock" /* FlowGraphBlockNames.PhysicsApplyImpulse */:
            return async () => await _LoadBlock(import("./Execution/Physics/flowGraphApplyImpulseBlock.pure.js"), "FlowGraphApplyImpulseBlock");
        case "FlowGraphSetLinearVelocityBlock" /* FlowGraphBlockNames.PhysicsSetLinearVelocity */:
            return async () => await _LoadBlock(import("./Execution/Physics/flowGraphSetLinearVelocityBlock.pure.js"), "FlowGraphSetLinearVelocityBlock");
        case "FlowGraphSetAngularVelocityBlock" /* FlowGraphBlockNames.PhysicsSetAngularVelocity */:
            return async () => await _LoadBlock(import("./Execution/Physics/flowGraphSetAngularVelocityBlock.pure.js"), "FlowGraphSetAngularVelocityBlock");
        case "FlowGraphSetPhysicsMotionTypeBlock" /* FlowGraphBlockNames.PhysicsSetMotionType */:
            return async () => await _LoadBlock(import("./Execution/Physics/flowGraphSetPhysicsMotionTypeBlock.pure.js"), "FlowGraphSetPhysicsMotionTypeBlock");
        case "FlowGraphGetLinearVelocityBlock" /* FlowGraphBlockNames.PhysicsGetLinearVelocity */:
            return async () => await _LoadBlock(import("./Data/Physics/flowGraphGetLinearVelocityBlock.pure.js"), "FlowGraphGetLinearVelocityBlock");
        case "FlowGraphGetAngularVelocityBlock" /* FlowGraphBlockNames.PhysicsGetAngularVelocity */:
            return async () => await _LoadBlock(import("./Data/Physics/flowGraphGetAngularVelocityBlock.pure.js"), "FlowGraphGetAngularVelocityBlock");
        case "FlowGraphGetPhysicsMassPropertiesBlock" /* FlowGraphBlockNames.PhysicsGetMassProperties */:
            return async () => await _LoadBlock(import("./Data/Physics/flowGraphGetPhysicsMassPropertiesBlock.pure.js"), "FlowGraphGetPhysicsMassPropertiesBlock");
        // Audio
        case "FlowGraphPlaySoundBlock" /* FlowGraphBlockNames.AudioPlaySound */:
            return async () => await _LoadBlock(import("./Execution/Audio/flowGraphPlaySoundBlock.pure.js"), "FlowGraphPlaySoundBlock");
        case "FlowGraphStopSoundBlock" /* FlowGraphBlockNames.AudioStopSound */:
            return async () => await _LoadBlock(import("./Execution/Audio/flowGraphStopSoundBlock.pure.js"), "FlowGraphStopSoundBlock");
        case "FlowGraphPauseSoundBlock" /* FlowGraphBlockNames.AudioPauseSound */:
            return async () => await _LoadBlock(import("./Execution/Audio/flowGraphPauseSoundBlock.pure.js"), "FlowGraphPauseSoundBlock");
        case "FlowGraphSetSoundVolumeBlock" /* FlowGraphBlockNames.AudioSetVolume */:
            return async () => await _LoadBlock(import("./Execution/Audio/flowGraphSetSoundVolumeBlock.pure.js"), "FlowGraphSetSoundVolumeBlock");
        case "FlowGraphSoundEndedEventBlock" /* FlowGraphBlockNames.AudioSoundEndedEvent */:
            return async () => await _LoadBlock(import("./Event/flowGraphSoundEndedEventBlock.pure.js"), "FlowGraphSoundEndedEventBlock");
        case "FlowGraphGetSoundVolumeBlock" /* FlowGraphBlockNames.AudioGetVolume */:
            return async () => await _LoadBlock(import("./Data/Audio/flowGraphGetSoundVolumeBlock.pure.js"), "FlowGraphGetSoundVolumeBlock");
        case "FlowGraphIsSoundPlayingBlock" /* FlowGraphBlockNames.AudioIsSoundPlaying */:
            return async () => await _LoadBlock(import("./Data/Audio/flowGraphIsSoundPlayingBlock.pure.js"), "FlowGraphIsSoundPlayingBlock");
        default:
            // check if the block is a custom block
            if (CustomBlocks[blockName]) {
                return CustomBlocks[blockName];
            }
            // Fallback: O(1) reverse lookup by short name (e.g. "FlowGraphGLTFDataProvider" → "KHR_interactivity/FlowGraphGLTFDataProvider")
            if (!blockName.includes("/")) {
                const fullKey = ShortNameToFullKey[blockName];
                if (fullKey && CustomBlocks[fullKey]) {
                    return CustomBlocks[fullKey];
                }
            }
            throw new Error(`Unknown block name ${blockName}`);
    }
}
//# sourceMappingURL=flowGraphBlockFactory.js.map