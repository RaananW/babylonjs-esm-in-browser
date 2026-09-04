/** This file must only contain pure code and pure imports */
import { FlowGraphBlock, type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
import { FlowGraphTypes } from "../../../flowGraphRichTypes.pure.js";
import { FlowGraphBinaryOperationBlock } from "../flowGraphBinaryOperationBlock.js";
import { FlowGraphConstantOperationBlock } from "../flowGraphConstantOperationBlock.js";
import { Quaternion } from "../../../../Maths/math.vector.pure.js";
import { FlowGraphUnaryOperationBlock } from "../flowGraphUnaryOperationBlock.js";
import { FlowGraphTernaryOperationBlock } from "../flowGraphTernaryOperationBlock.js";
import { FlowGraphInteger } from "../../../CustomTypes/flowGraphInteger.pure.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphMathOperationType, type FlowGraphNumber } from "../../../utils.js";
/**
 * A configuration interface for math blocks
 */
export interface IFlowGraphMathBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * If true, the multiplication is done per component.
     * This is the behavior in glTF interactivity.
     */
    useMatrixPerComponent?: boolean;
    /**
     * The type of the variable.
     */
    type?: FlowGraphTypes;
    /**
     * If true, the block will not allow integer and float arithmetic.
     * This is the behavior in glTF interactivity.
     */
    preventIntegerFloatArithmetic?: boolean;
}
/**
 * Polymorphic add block.
 */
export declare class FlowGraphAddBlock extends FlowGraphBinaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType, FlowGraphMathOperationType> {
    /**
     * Construct a new add block.
     * @param config optional configuration
     */
    constructor(config?: IFlowGraphMathBlockConfiguration);
    private _polymorphicAdd;
}
/**
 * Polymorphic subtract block.
 */
export declare class FlowGraphSubtractBlock extends FlowGraphBinaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType, FlowGraphMathOperationType> {
    /**
     * Construct a new subtract block.
     * @param config optional configuration
     */
    constructor(config?: IFlowGraphMathBlockConfiguration);
    private _polymorphicSubtract;
}
/**
 * Polymorphic multiply block.
 * In case of matrix, it is configurable whether the multiplication is done per component.
 */
export declare class FlowGraphMultiplyBlock extends FlowGraphBinaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphMathBlockConfiguration);
    private _polymorphicMultiply;
}
/**
 * Polymorphic division block.
 */
export declare class FlowGraphDivideBlock extends FlowGraphBinaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType, FlowGraphMathOperationType> {
    /**
     * Construct a new divide block.
     * @param config - Optional configuration
     */
    constructor(config?: IFlowGraphMathBlockConfiguration);
    private _polymorphicDivide;
}
/**
 * Configuration interface for the random block.
 */
export interface IFlowGraphRandomBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * The minimum value. defaults to 0.
     */
    min?: number;
    /**
     * The maximum value. defaults to 1.
     */
    max?: number;
    /**
     * The seed for the random number generator for deterministic random values.
     * If not set, Math.random() is used.
     */
    seed?: number;
}
/**
 * Random number between min and max (defaults to 0 to 1)
 *
 * This node will cache the result for he same node reference. i.e., a Math.eq that references the SAME random node will always return true.
 */
export declare class FlowGraphRandomBlock extends FlowGraphConstantOperationBlock<FlowGraphMathOperationType> {
    /**
     * The minimum value. defaults to 0.
     */
    readonly min: FlowGraphDataConnection<number>;
    /**
     * The maximum value. defaults to 1.
     */
    readonly max: FlowGraphDataConnection<number>;
    private _seed?;
    /**
     * Construct a new random block.
     * @param config optional configuration
     */
    constructor(config?: IFlowGraphRandomBlockConfiguration);
    private _isSeed;
    private _getRandomValue;
    private _random;
}
/**
 * E constant.
 */
export declare class FlowGraphEBlock extends FlowGraphConstantOperationBlock<number> {
    constructor(config?: IFlowGraphBlockConfiguration);
}
/**
 * Pi constant.
 */
export declare class FlowGraphPiBlock extends FlowGraphConstantOperationBlock<number> {
    constructor(config?: IFlowGraphBlockConfiguration);
}
/**
 * Tau constant (2 * Pi), the ratio of a circle's circumference to its radius.
 */
export declare class FlowGraphTauBlock extends FlowGraphConstantOperationBlock<number> {
    constructor(config?: IFlowGraphBlockConfiguration);
}
/**
 * Positive inf constant.
 */
export declare class FlowGraphInfBlock extends FlowGraphConstantOperationBlock<number> {
    constructor(config?: IFlowGraphBlockConfiguration);
}
/**
 * NaN constant.
 */
export declare class FlowGraphNaNBlock extends FlowGraphConstantOperationBlock<number> {
    constructor(config?: IFlowGraphBlockConfiguration);
}
/**
 * Absolute value block.
 */
export declare class FlowGraphAbsBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicAbs;
}
/**
 * Sign block.
 */
export declare class FlowGraphSignBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicSign;
}
/**
 * Truncation block.
 */
export declare class FlowGraphTruncBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicTrunc;
}
/**
 * Floor block.
 */
export declare class FlowGraphFloorBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicFloor;
}
/**
 * Ceiling block.
 */
export declare class FlowGraphCeilBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicCeiling;
}
/**
 * Configuration for the round block.
 */
export interface IFlowGraphRoundBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * If true, the rounding is away from zero, even when negative. i.e. -7.5 goes to -8, and not -7 as Math.round does (it rounds up).
     * This is the default when using glTF
     */
    roundHalfAwayFromZero?: boolean;
}
/**
 * Round block.
 */
export declare class FlowGraphRoundBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphRoundBlockConfiguration);
    private _polymorphicRound;
}
/**
 * A block that returns the fractional part of a number.
 */
export declare class FlowGraphFractionBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicFraction;
}
/**
 * Negation block.
 */
export declare class FlowGraphNegationBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    /**
     * construct a new negation block.
     * @param config optional configuration
     */
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicNeg;
}
/**
 * Remainder block.
 */
export declare class FlowGraphModuloBlock extends FlowGraphBinaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicRemainder;
}
/**
 * Min block.
 */
export declare class FlowGraphMinBlock extends FlowGraphBinaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicMin;
}
/**
 * Max block
 */
export declare class FlowGraphMaxBlock extends FlowGraphBinaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicMax;
}
/**
 * Clamp block.
 */
export declare class FlowGraphClampBlock extends FlowGraphTernaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType, FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicClamp;
}
/**
 * Saturate block.
 */
export declare class FlowGraphSaturateBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicSaturate;
}
/**
 * Interpolate block.
 */
export declare class FlowGraphMathInterpolationBlock extends FlowGraphTernaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType, FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicInterpolate;
}
/**
 * Spherical linear interpolation between two unit quaternions, matching the
 * quaternion slerp operation. The two inputs are treated as
 * Babylon `Quaternion` values regardless of their concrete class (the spec
 * defines them as `float4`), and the output is a `Quaternion`.
 *
 * The underlying implementation is `Quaternion.Slerp`, whose algorithm matches
 * the spec step-for-step (dot product, conditional sign-flip on `b`, sin-based
 * weighting, and a near-identity short-circuit to a linear blend).
 */
export declare class FlowGraphMathSlerpBlock extends FlowGraphTernaryOperationBlock<Quaternion, Quaternion, number, Quaternion> {
    constructor(config?: IFlowGraphBlockConfiguration);
}
/**
 * Smooth-step block, returning the Hermite interpolation coefficient.
 * Operates component-wise over floatN inputs (the two edges `a`/`b` and the
 * value `c`).
 */
export declare class FlowGraphMathSmoothStepBlock extends FlowGraphTernaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType, FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicSmoothStep;
}
/**
 * Equals block.
 */
export declare class FlowGraphEqualityBlock extends FlowGraphBinaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType, boolean> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicEq;
}
/**
 * Less than block.
 */
export declare class FlowGraphLessThanBlock extends FlowGraphBinaryOperationBlock<FlowGraphNumber, FlowGraphNumber, boolean> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicLessThan;
}
/**
 * Less than or equal block.
 */
export declare class FlowGraphLessThanOrEqualBlock extends FlowGraphBinaryOperationBlock<FlowGraphNumber, FlowGraphNumber, boolean> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicLessThanOrEqual;
}
/**
 * Greater than block.
 */
export declare class FlowGraphGreaterThanBlock extends FlowGraphBinaryOperationBlock<FlowGraphNumber, FlowGraphNumber, boolean> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicGreaterThan;
}
/**
 * Greater than or equal block.
 */
export declare class FlowGraphGreaterThanOrEqualBlock extends FlowGraphBinaryOperationBlock<FlowGraphNumber, FlowGraphNumber, boolean> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicGreaterThanOrEqual;
}
/**
 * Is NaN block.
 */
export declare class FlowGraphIsNanBlock extends FlowGraphUnaryOperationBlock<FlowGraphNumber, boolean> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicIsNan;
}
/**
 * Is Inf block.
 */
export declare class FlowGraphIsInfinityBlock extends FlowGraphUnaryOperationBlock<FlowGraphNumber, boolean> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicIsInf;
}
/**
 * Convert degrees to radians block.
 */
export declare class FlowGraphDegToRadBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    /**
     * Constructs a new instance of the flow graph math block.
     * @param config - Optional configuration for the flow graph block.
     */
    constructor(config?: IFlowGraphBlockConfiguration);
    private _degToRad;
    private _polymorphicDegToRad;
}
/**
 * Convert radians to degrees block.
 */
export declare class FlowGraphRadToDegBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _radToDeg;
    private _polymorphicRadToDeg;
}
/**
 * Sin block.
 */
export declare class FlowGraphSinBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicSin;
}
/**
 * Cos block.
 */
export declare class FlowGraphCosBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicCos;
}
/**
 * Tan block.
 */
export declare class FlowGraphTanBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicTan;
}
/**
 * Arcsin block.
 */
export declare class FlowGraphAsinBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicAsin;
}
/**
 * Arccos block.
 */
export declare class FlowGraphAcosBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicAcos;
}
/**
 * Arctan block.
 */
export declare class FlowGraphAtanBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicAtan;
}
/**
 * Arctan2 block.
 */
export declare class FlowGraphAtan2Block extends FlowGraphBinaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicAtan2;
}
/**
 * Hyperbolic sin block.
 */
export declare class FlowGraphSinhBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicSinh;
}
/**
 * Hyperbolic cos block.
 */
export declare class FlowGraphCoshBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicCosh;
}
/**
 * Hyperbolic tan block.
 */
export declare class FlowGraphTanhBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicTanh;
}
/**
 * Hyperbolic arcsin block.
 */
export declare class FlowGraphAsinhBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicAsinh;
}
/**
 * Hyperbolic arccos block.
 */
export declare class FlowGraphAcoshBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicAcosh;
}
/**
 * Hyperbolic arctan block.
 */
export declare class FlowGraphAtanhBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicAtanh;
}
/**
 * Exponential block.
 */
export declare class FlowGraphExpBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicExp;
}
/**
 * Logarithm block.
 */
export declare class FlowGraphLogBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicLog;
}
/**
 * Base 2 logarithm block.
 */
export declare class FlowGraphLog2Block extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicLog2;
}
/**
 * Base 10 logarithm block.
 */
export declare class FlowGraphLog10Block extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicLog10;
}
/**
 * Square root block.
 */
export declare class FlowGraphSquareRootBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicSqrt;
}
/**
 * Cube root block.
 */
export declare class FlowGraphCubeRootBlock extends FlowGraphUnaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicCubeRoot;
}
/**
 * Power block.
 */
export declare class FlowGraphPowerBlock extends FlowGraphBinaryOperationBlock<FlowGraphMathOperationType, FlowGraphMathOperationType, FlowGraphMathOperationType> {
    constructor(config?: IFlowGraphBlockConfiguration);
    private _polymorphicPow;
}
/**
 * Configuration for bitwise operators
 */
export interface IFlowGraphBitwiseBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * The type of the values that will be operated on
     * Defaults to FlowGraphInteger, but can be a number or boolean as well.
     */
    valueType: FlowGraphTypes;
}
type FlowGraphBitwiseTypes = FlowGraphInteger | FlowGraphNumber | boolean;
/**
 * Bitwise NOT operation
 */
export declare class FlowGraphBitwiseNotBlock extends FlowGraphUnaryOperationBlock<FlowGraphBitwiseTypes, FlowGraphBitwiseTypes> {
    constructor(config?: IFlowGraphBitwiseBlockConfiguration);
}
/**
 * Bitwise AND operation
 */
export declare class FlowGraphBitwiseAndBlock extends FlowGraphBinaryOperationBlock<FlowGraphBitwiseTypes, FlowGraphBitwiseTypes, FlowGraphBitwiseTypes> {
    constructor(config?: IFlowGraphBitwiseBlockConfiguration);
}
/**
 * Bitwise OR operation
 */
export declare class FlowGraphBitwiseOrBlock extends FlowGraphBinaryOperationBlock<FlowGraphBitwiseTypes, FlowGraphBitwiseTypes, FlowGraphBitwiseTypes> {
    constructor(config?: IFlowGraphBitwiseBlockConfiguration);
}
/**
 * Bitwise XOR operation
 */
export declare class FlowGraphBitwiseXorBlock extends FlowGraphBinaryOperationBlock<FlowGraphBitwiseTypes, FlowGraphBitwiseTypes, FlowGraphBitwiseTypes> {
    constructor(config?: IFlowGraphBlockConfiguration);
}
/**
 * Bitwise left shift operation
 */
export declare class FlowGraphBitwiseLeftShiftBlock extends FlowGraphBinaryOperationBlock<FlowGraphInteger, FlowGraphInteger, FlowGraphInteger> {
    constructor(config?: IFlowGraphBlockConfiguration);
}
/**
 * Bitwise right shift operation
 */
export declare class FlowGraphBitwiseRightShiftBlock extends FlowGraphBinaryOperationBlock<FlowGraphInteger, FlowGraphInteger, FlowGraphInteger> {
    constructor(config?: IFlowGraphBlockConfiguration);
}
/**
 * Count leading zeros operation
 */
export declare class FlowGraphLeadingZerosBlock extends FlowGraphUnaryOperationBlock<FlowGraphInteger, FlowGraphInteger> {
    constructor(config?: IFlowGraphBlockConfiguration);
}
/**
 * Count trailing zeros operation
 */
export declare class FlowGraphTrailingZerosBlock extends FlowGraphUnaryOperationBlock<FlowGraphInteger, FlowGraphInteger> {
    constructor(config?: IFlowGraphBlockConfiguration);
}
/**
 * Count one bits operation
 */
export declare class FlowGraphOneBitsCounterBlock extends FlowGraphUnaryOperationBlock<FlowGraphInteger, FlowGraphInteger> {
    constructor(config?: IFlowGraphBlockConfiguration);
}
/**
 * Block that converts a linear sRGB color (r, g, b) to OkLCh (l, c, h). Hue is in radians.
 */
export declare class FlowGraphRGBToOkLChBlock extends FlowGraphBlock {
    /**
     * Input connection: the linear red component.
     */
    readonly r: FlowGraphDataConnection<number>;
    /**
     * Input connection: the linear green component.
     */
    readonly g: FlowGraphDataConnection<number>;
    /**
     * Input connection: the linear blue component.
     */
    readonly b: FlowGraphDataConnection<number>;
    /**
     * Output connection: the OkLCh lightness.
     */
    readonly l: FlowGraphDataConnection<number>;
    /**
     * Output connection: the OkLCh chroma.
     */
    readonly c: FlowGraphDataConnection<number>;
    /**
     * Output connection: the OkLCh hue, in radians.
     */
    readonly h: FlowGraphDataConnection<number>;
    constructor(config?: IFlowGraphBlockConfiguration);
    _updateOutputs(context: FlowGraphContext): void;
    getClassName(): string;
}
/**
 * Block that converts an OkLCh color (l, c, h) to linear sRGB (r, g, b). Hue is in radians.
 */
export declare class FlowGraphRGBFromOkLChBlock extends FlowGraphBlock {
    /**
     * Input connection: the OkLCh lightness.
     */
    readonly l: FlowGraphDataConnection<number>;
    /**
     * Input connection: the OkLCh chroma.
     */
    readonly c: FlowGraphDataConnection<number>;
    /**
     * Input connection: the OkLCh hue, in radians.
     */
    readonly h: FlowGraphDataConnection<number>;
    /**
     * Output connection: the linear red component.
     */
    readonly r: FlowGraphDataConnection<number>;
    /**
     * Output connection: the linear green component.
     */
    readonly g: FlowGraphDataConnection<number>;
    /**
     * Output connection: the linear blue component.
     */
    readonly b: FlowGraphDataConnection<number>;
    constructor(config?: IFlowGraphBlockConfiguration);
    _updateOutputs(context: FlowGraphContext): void;
    getClassName(): string;
}
/**
 * Register side effects for flowGraphMathBlocks.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphMathBlocks(): void;
export {};
