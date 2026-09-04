/** This file must only contain pure code and pure imports */
import { FlowGraphBlock, type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
import { FlowGraphTypes } from "../../../flowGraphRichTypes.pure.js";
import { FlowGraphBinaryOperationBlock } from "../flowGraphBinaryOperationBlock.js";
import { FlowGraphUnaryOperationBlock } from "../flowGraphUnaryOperationBlock.js";
import { FlowGraphTernaryOperationBlock } from "../flowGraphTernaryOperationBlock.js";
import { FlowGraphCachedOperationBlock } from "../flowGraphCachedOperationBlock.js";
import { Quaternion, Vector2, Vector3, type Matrix } from "../../../../Maths/math.vector.pure.js";
import { type FlowGraphMatrix, type FlowGraphVector } from "../../../utils.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { type FlowGraphContext } from "../../../flowGraphContext.js";
/**
 * Vector length block.
 */
export declare class FlowGraphLengthBlock extends FlowGraphUnaryOperationBlock<FlowGraphVector, number> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicLength;
}
/**
 * Configuration for normalized vector
 */
export interface IFlowGraphNormalizeBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * If true, the block will return NaN if the input vector has a length of 0.
     * This is the expected behavior for glTF interactivity graphs.
     */
    nanOnZeroLength?: boolean;
}
/**
 * Vector normalize block.
 */
export declare class FlowGraphNormalizeBlock extends FlowGraphCachedOperationBlock<FlowGraphVector> {
    /**
     * The vector to normalize.
     */
    readonly a: FlowGraphDataConnection<FlowGraphVector>;
    constructor(config?: IFlowGraphNormalizeBlockConfiguration);
    _doOperation(context: FlowGraphContext): FlowGraphVector | undefined;
    /**
     * A vector that cannot be normalized reports a vector of the same type with every component set
     * to zero, so the output stays type-consistent with the input instead of being left undefined.
     * @param context the graph context
     * @returns a zero vector matching the input's type
     */
    protected _getInvalidOutputValue(context: FlowGraphContext): FlowGraphVector;
    private _polymorphicNormalize;
    getClassName(): string;
}
/**
 * Dot product block.
 */
export declare class FlowGraphDotBlock extends FlowGraphBinaryOperationBlock<FlowGraphVector, FlowGraphVector, number> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicDot;
}
/**
 * Cross product block.
 */
export declare class FlowGraphCrossBlock extends FlowGraphBinaryOperationBlock<Vector3, Vector3, Vector3> {
    constructor(config?: IFlowGraphBlockConfiguration);
}
/**
 * 2D rotation block.
 */
export declare class FlowGraphRotate2DBlock extends FlowGraphBinaryOperationBlock<Vector2, number, Vector2> {
    constructor(config?: IFlowGraphBlockConfiguration);
}
/**
 * 3D rotation block.
 */
export declare class FlowGraphRotate3DBlock extends FlowGraphBinaryOperationBlock<Vector3, Quaternion, Vector3> {
    constructor(config?: IFlowGraphBlockConfiguration);
}
/**
 * Configuration for the transform block.
 */
export interface IFlowGraphTransformBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * The vector type
     */
    vectorType: FlowGraphTypes;
}
/**
 * Transform a vector3 by a matrix.
 */
export declare class FlowGraphTransformBlock extends FlowGraphBinaryOperationBlock<FlowGraphVector, FlowGraphMatrix, FlowGraphVector> {
    constructor(config?: IFlowGraphTransformBlockConfiguration);
}
/**
 * Transform a vector3 by a matrix.
 */
export declare class FlowGraphTransformCoordinatesBlock extends FlowGraphBinaryOperationBlock<Vector3, Matrix, Vector3> {
    constructor(config?: IFlowGraphBlockConfiguration);
}
/**
 * Conjugate the quaternion.
 */
export declare class FlowGraphConjugateBlock extends FlowGraphUnaryOperationBlock<Quaternion, Quaternion> {
    constructor(config?: IFlowGraphBlockConfiguration);
}
/**
 * Get the angle between two quaternions.
 */
export declare class FlowGraphAngleBetweenBlock extends FlowGraphBinaryOperationBlock<Quaternion, Quaternion, number> {
    constructor(config?: IFlowGraphBlockConfiguration);
}
/**
 * Get the quaternion from an axis and an angle.
 */
export declare class FlowGraphQuaternionFromAxisAngleBlock extends FlowGraphBinaryOperationBlock<Vector3, number, Quaternion> {
    constructor(config?: IFlowGraphBlockConfiguration);
}
/**
 * Get the axis and angle from a quaternion.
 */
export declare class FlowGraphAxisAngleFromQuaternionBlock extends FlowGraphBlock {
    /**
     * The input of this block.
     */
    readonly a: FlowGraphDataConnection<Quaternion>;
    /**
     * The output axis of rotation.
     */
    readonly axis: FlowGraphDataConnection<Vector3>;
    /**
     * The output angle of rotation.
     */
    readonly angle: FlowGraphDataConnection<number>;
    /**
     * Output connection: Whether the value is valid.
     */
    readonly isValid: FlowGraphDataConnection<boolean>;
    constructor(config?: IFlowGraphBlockConfiguration);
    /** @override */
    _updateOutputs(context: FlowGraphContext): void;
    /**
     * Gets the class name
     * @override
     * @returns the class name
     */
    getClassName(): string;
}
/**
 * Get the quaternion from two direction vectors.
 */
export declare class FlowGraphQuaternionFromDirectionsBlock extends FlowGraphBinaryOperationBlock<Vector3, Vector3, Quaternion> {
    constructor(config?: IFlowGraphBlockConfiguration);
}
/**
 * Get a rotation quaternion from the specified up and forward directions.
 */
export declare class FlowGraphQuaternionFromUpForwardBlock extends FlowGraphBinaryOperationBlock<Vector3, Vector3, Quaternion> {
    constructor(config?: IFlowGraphBlockConfiguration);
}
/**
 * Spherical linear interpolation between two vectors.
 * Supports float2 and float3 vectors; the interpolation coefficient is a number.
 */
export declare class FlowGraphVectorSlerpBlock extends FlowGraphTernaryOperationBlock<FlowGraphVector, FlowGraphVector, number, FlowGraphVector> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicSlerp;
}
/**
 * The configuration of the FlowGraphQuaternionFromAnglesBlock.
 */
export interface IFlowGraphQuaternionFromAnglesBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * The intrinsic Tait–Bryan rotation order, one of `xyz`, `xzy`, `yxz`, `yzx`, `zxy`, `zyx`.
     * Any other (or missing) value falls back to the spec default `yxz`.
     */
    order?: string;
}
/**
 * Creates a rotation quaternion from three Tait–Bryan intrinsic Euler angles applied in a
 * configurable order.
 *
 * Inputs `a`, `b`, `c` are the rotations (in radians) around the X, Y and Z axes respectively.
 * The `order` configuration selects the intrinsic rotation order; NaN and infinite inputs
 * propagate into the resulting quaternion components.
 */
export declare class FlowGraphQuaternionFromAnglesBlock extends FlowGraphTernaryOperationBlock<number, number, number, Quaternion> {
    /**
     * The validated intrinsic rotation order used to compose the quaternion.
     */
    private readonly _order;
    constructor(config?: IFlowGraphQuaternionFromAnglesBlockConfiguration);
}
/**
 * Register side effects for flowGraphVectorMathBlocks.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphVectorMathBlocks(): void;
