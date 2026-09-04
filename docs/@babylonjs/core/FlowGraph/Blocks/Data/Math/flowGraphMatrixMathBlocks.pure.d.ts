/** This file must only contain pure code and pure imports */
import { type IFlowGraphBlockConfiguration, FlowGraphBlock } from "../../../flowGraphBlock.js";
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { FlowGraphTypes } from "../../../flowGraphRichTypes.pure.js";
import { Matrix, Quaternion, Vector3 } from "../../../../Maths/math.vector.pure.js";
import { FlowGraphUnaryOperationBlock } from "../flowGraphUnaryOperationBlock.js";
import { FlowGraphCachedOperationBlock } from "../flowGraphCachedOperationBlock.js";
import { FlowGraphBinaryOperationBlock } from "../flowGraphBinaryOperationBlock.js";
import { type FlowGraphMatrix } from "../../../utils.js";
/**
 * Configuration for the matrix blocks.
 */
export interface IFlowGraphMatrixBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * The type of the matrix. Default is Matrix (which is 4x4)
     */
    matrixType: FlowGraphTypes;
}
/**
 * Configuration for the matrix decompose block.
 */
export interface IFlowGraphMatrixDecomposeBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * When a matrix cannot be decomposed, output the translation and the raw column lengths that were
     * extracted from the matrix instead of the type-default translation and scale. `isValid` is reported
     * as `false` either way. Defaults to `false`.
     *
     * A host whose specification requires those components to be preserved can turn this on; it is
     * opt-in so that the default block behaviour stays unchanged.
     */
    keepDegenerateComponents?: boolean;
}
/**
 * Transposes a matrix.
 */
export declare class FlowGraphTransposeBlock extends FlowGraphUnaryOperationBlock<FlowGraphMatrix, FlowGraphMatrix> {
    /**
     * Creates a new instance of the block.
     * @param config the configuration of the block
     */
    constructor(config?: IFlowGraphMatrixBlockConfiguration);
}
/**
 * Gets the determinant of a matrix.
 */
export declare class FlowGraphDeterminantBlock extends FlowGraphUnaryOperationBlock<FlowGraphMatrix, number> {
    /**
     * Creates a new instance of the block.
     * @param config the configuration of the block
     */
    constructor(config?: IFlowGraphMatrixBlockConfiguration);
}
/**
 * Inverts a matrix.
 */
export declare class FlowGraphInvertMatrixBlock extends FlowGraphCachedOperationBlock<FlowGraphMatrix> {
    /**
     * The matrix to invert.
     */
    readonly a: FlowGraphDataConnection<FlowGraphMatrix>;
    private readonly _matrixType;
    /**
     * Creates a new instance of the inverse block.
     * @param config the configuration of the block
     */
    constructor(config?: IFlowGraphMatrixBlockConfiguration);
    _doOperation(context: FlowGraphContext): FlowGraphMatrix | undefined;
    /**
     * A matrix with no inverse reports an all-zero matrix rather than the identity default of the
     * matrix type, so the output is not mistaken for a meaningful transform.
     * @returns a matrix of the block's type with every element set to zero
     */
    protected _getInvalidOutputValue(): FlowGraphMatrix;
    getClassName(): string;
}
/**
 * Multiplies two matrices.
 */
export declare class FlowGraphMatrixMultiplicationBlock extends FlowGraphBinaryOperationBlock<FlowGraphMatrix, FlowGraphMatrix, FlowGraphMatrix> {
    /**
     * Creates a new instance of the multiplication block.
     * Note - this is similar to the math multiplication if not using matrix per-component multiplication.
     * @param config the configuration of the block
     */
    constructor(config?: IFlowGraphMatrixBlockConfiguration);
}
/**
 * Matrix decompose block
 */
export declare class FlowGraphMatrixDecomposeBlock extends FlowGraphBlock {
    /**
     * The input of this block
     */
    readonly input: FlowGraphDataConnection<Matrix>;
    /**
     * The position output of this block
     */
    readonly position: FlowGraphDataConnection<Vector3>;
    /**
     * The rotation output of this block
     */
    readonly rotationQuaternion: FlowGraphDataConnection<Quaternion>;
    /**
     * The scaling output of this block
     */
    readonly scaling: FlowGraphDataConnection<Vector3>;
    /**
     * Is the matrix valid
     */
    readonly isValid: FlowGraphDataConnection<boolean>;
    constructor(config?: IFlowGraphMatrixDecomposeBlockConfiguration);
    _updateOutputs(context: FlowGraphContext): void;
    getClassName(): string;
}
/**
 * Matrix compose block
 */
export declare class FlowGraphMatrixComposeBlock extends FlowGraphBlock {
    /**
     * The position input of this block
     */
    readonly position: FlowGraphDataConnection<Vector3>;
    /**
     * The rotation input of this block
     */
    readonly rotationQuaternion: FlowGraphDataConnection<Quaternion>;
    /**
     * The scaling input of this block
     */
    readonly scaling: FlowGraphDataConnection<Vector3>;
    /**
     * The output of this block
     */
    readonly value: FlowGraphDataConnection<Matrix>;
    constructor(config?: IFlowGraphBlockConfiguration);
    _updateOutputs(context: FlowGraphContext): void;
    getClassName(): string;
}
/**
 * Register side effects for flowGraphMatrixMathBlocks.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphMatrixMathBlocks(): void;
