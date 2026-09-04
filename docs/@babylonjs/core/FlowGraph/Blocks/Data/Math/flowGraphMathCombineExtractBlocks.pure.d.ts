/** This file must only contain pure code and pure imports */
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { FlowGraphCachedOperationBlock } from "../flowGraphCachedOperationBlock.js";
import { type RichType } from "../../../flowGraphRichTypes.pure.js";
import { FlowGraphBlock, type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
import { Matrix, Vector2, Vector3, Vector4 } from "../../../../Maths/math.vector.pure.js";
import { FlowGraphMatrix2D, FlowGraphMatrix3D } from "../../../CustomTypes/flowGraphMatrix.js";
declare abstract class FlowGraphMathCombineBlock<ResultT> extends FlowGraphCachedOperationBlock<ResultT> {
    /**
     * Base class for blocks that combine multiple numeric inputs into a single result.
     * Handles registering data inputs and managing cached outputs.
     * @param numberOfInputs The number of input values to combine.
     * @param type The type of the result.
     * @param config The block configuration.
     */
    constructor(numberOfInputs: number, type: RichType<ResultT>, config?: IFlowGraphBlockConfiguration);
}
/**
 * Abstract class representing a flow graph block that extracts multiple outputs from a single input.
 */
declare abstract class FlowGraphMathExtractBlock<InputT> extends FlowGraphBlock {
    /**
     * Creates an instance of FlowGraphMathExtractBlock.
     *
     * @param numberOfOutputs - The number of outputs to be extracted from the input.
     * @param type - The type of the input data.
     * @param config - Optional configuration for the flow graph block.
     */
    constructor(numberOfOutputs: number, type: RichType<InputT>, config?: IFlowGraphBlockConfiguration);
}
/**
 * Combines two floats into a new Vector2
 */
export declare class FlowGraphCombineVector2Block extends FlowGraphMathCombineBlock<Vector2> {
    constructor(config?: IFlowGraphBlockConfiguration);
    /**
     * @internal
     * Combines two floats into a new Vector2
     */
    _doOperation(context: FlowGraphContext): Vector2;
    getClassName(): string;
}
/**
 * Combines three floats into a new Vector3
 */
export declare class FlowGraphCombineVector3Block extends FlowGraphMathCombineBlock<Vector3> {
    constructor(config?: IFlowGraphBlockConfiguration);
    _doOperation(context: FlowGraphContext): Vector3;
    getClassName(): string;
}
/**
 * Combines four floats into a new Vector4
 */
export declare class FlowGraphCombineVector4Block extends FlowGraphMathCombineBlock<Vector4> {
    constructor(config?: IFlowGraphBlockConfiguration);
    _doOperation(context: FlowGraphContext): Vector4;
    getClassName(): string;
}
/**
 * Configuration for the matrix combine blocks.
 * @deprecated The matrix combine blocks now default to column-major input, matching Babylon's
 * {@link Matrix} storage and the glTF/KHR_interactivity convention. This interface is retained so the
 * `inputIsColumnMajor` option keeps being honoured; set it to `false` to feed row-major input.
 *
 * BREAKING: the meaning of `inputIsColumnMajor` is inverted from previous releases, not just its
 * default. Previously `inputIsColumnMajor: true` took the transposing path and the default (unset)
 * treated input as row-major. Now the default (unset) is column-major, `inputIsColumnMajor: false`
 * takes the transposing path, and `inputIsColumnMajor: true` is the straight (non-transposing) path.
 * The unset behaviour is unchanged for graphs that never set the flag, but anyone who explicitly set
 * `true` or `false` before now gets the opposite transform and should drop the flag (or flip it).
 */
export interface IFlowGraphCombineMatrixBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * Whether the input is already in column-major order. Defaults to `true`.
     * @deprecated Provide column-major input (the default) and omit this flag. Set to `false` only to
     * keep feeding legacy row-major input, which is transposed into the matrix's column-major storage.
     * Note the inverted meaning versus previous releases (see the interface deprecation note): a former
     * `inputIsColumnMajor: true` no longer transposes, and a former `false` now does.
     */
    inputIsColumnMajor?: boolean;
}
/**
 * Combines 16 floats into a new Matrix.
 *
 * The inputs are in column-major order, matching Babylon's {@link Matrix} storage and the order used
 * by `Matrix.FromArray`, `Matrix.FromValues` and {@link FlowGraphExtractMatrixBlock}, so combining
 * and extracting round-trip.
 */
export declare class FlowGraphCombineMatrixBlock extends FlowGraphMathCombineBlock<Matrix> {
    constructor(config?: IFlowGraphCombineMatrixBlockConfiguration);
    _doOperation(context: FlowGraphContext): Matrix;
    getClassName(): string;
}
/**
 * Combines 4 floats into a new Matrix2D, in column-major order.
 */
export declare class FlowGraphCombineMatrix2DBlock extends FlowGraphMathCombineBlock<FlowGraphMatrix2D> {
    constructor(config?: IFlowGraphCombineMatrixBlockConfiguration);
    _doOperation(context: FlowGraphContext): FlowGraphMatrix2D;
    getClassName(): string;
}
/**
 * Combines 9 floats into a new Matrix3D, in column-major order.
 */
export declare class FlowGraphCombineMatrix3DBlock extends FlowGraphMathCombineBlock<FlowGraphMatrix3D> {
    constructor(config?: IFlowGraphCombineMatrixBlockConfiguration);
    _doOperation(context: FlowGraphContext): FlowGraphMatrix3D;
    getClassName(): string;
}
/**
 * Extracts two floats from a Vector2
 */
export declare class FlowGraphExtractVector2Block extends FlowGraphMathExtractBlock<Vector2> {
    constructor(config?: IFlowGraphBlockConfiguration);
    _updateOutputs(context: FlowGraphContext): void;
    getClassName(): string;
}
/**
 * Extracts three floats from a Vector3
 */
export declare class FlowGraphExtractVector3Block extends FlowGraphMathExtractBlock<Vector3> {
    constructor(config?: IFlowGraphBlockConfiguration);
    _updateOutputs(context: FlowGraphContext): void;
    getClassName(): string;
}
/**
 * Extracts four floats from a Vector4
 */
export declare class FlowGraphExtractVector4Block extends FlowGraphMathExtractBlock<Vector4> {
    constructor(config?: IFlowGraphBlockConfiguration);
    _updateOutputs(context: FlowGraphContext): void;
    getClassName(): string;
}
/**
 * Extracts 16 floats from a Matrix
 */
export declare class FlowGraphExtractMatrixBlock extends FlowGraphMathExtractBlock<Matrix> {
    constructor(config?: IFlowGraphBlockConfiguration);
    _updateOutputs(context: FlowGraphContext): void;
    getClassName(): string;
}
/**
 * Extracts 4 floats from a Matrix2D
 */
export declare class FlowGraphExtractMatrix2DBlock extends FlowGraphMathExtractBlock<FlowGraphMatrix2D> {
    constructor(config?: IFlowGraphBlockConfiguration);
    _updateOutputs(context: FlowGraphContext): void;
    getClassName(): string;
}
/**
 * Extracts 4 floats from a Matrix2D
 */
export declare class FlowGraphExtractMatrix3DBlock extends FlowGraphMathExtractBlock<FlowGraphMatrix3D> {
    constructor(config?: IFlowGraphBlockConfiguration);
    _updateOutputs(context: FlowGraphContext): void;
    getClassName(): string;
}
/**
 * Register side effects for flowGraphMathCombineExtractBlocks.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphMathCombineExtractBlocks(): void;
export {};
