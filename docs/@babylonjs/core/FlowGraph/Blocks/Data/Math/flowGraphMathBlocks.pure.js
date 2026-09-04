/** This file must only contain pure code and pure imports */
import { FlowGraphBlock } from "../../../flowGraphBlock.js";
import { getRichTypeByFlowGraphType, RichTypeAny, RichTypeBoolean, RichTypeFlowGraphInteger, RichTypeNumber } from "../../../flowGraphRichTypes.pure.js";
import { FlowGraphBinaryOperationBlock } from "../flowGraphBinaryOperationBlock.js";
import { FlowGraphConstantOperationBlock } from "../flowGraphConstantOperationBlock.js";
import { Quaternion, Matrix, Vector2, Vector3, Vector4 } from "../../../../Maths/math.vector.pure.js";
import { FlowGraphUnaryOperationBlock } from "../flowGraphUnaryOperationBlock.js";
import { FlowGraphTernaryOperationBlock } from "../flowGraphTernaryOperationBlock.js";
import { FlowGraphInteger } from "../../../CustomTypes/flowGraphInteger.pure.js";
import { FlowGraphMatrix2D, FlowGraphMatrix3D } from "../../../CustomTypes/flowGraphMatrix.js";
import { _AreSameIntegerClass, _AreSameMatrixClass, _AreSameVectorOrQuaternionClass, _GetClassNameOf, getNumericValue, isNumeric, } from "../../../utils.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Polymorphic add block.
 */
export class FlowGraphAddBlock extends FlowGraphBinaryOperationBlock {
    /**
     * Construct a new add block.
     * @param config optional configuration
     */
    constructor(config) {
        super(getRichTypeByFlowGraphType(config?.type), getRichTypeByFlowGraphType(config?.type), getRichTypeByFlowGraphType(config?.type), (a, b) => this._polymorphicAdd(a, b), "FlowGraphAddBlock" /* FlowGraphBlockNames.Add */, config);
    }
    _polymorphicAdd(a, b) {
        const aClassName = _GetClassNameOf(a);
        const bClassName = _GetClassNameOf(b);
        if (_AreSameVectorOrQuaternionClass(aClassName, bClassName) || _AreSameMatrixClass(aClassName, bClassName) || _AreSameIntegerClass(aClassName, bClassName)) {
            // cast to vector3, but any other cast will be fine
            return a.add(b);
        }
        else if (aClassName === "Quaternion" /* FlowGraphTypes.Quaternion */ || bClassName === "Vector4" /* FlowGraphTypes.Vector4 */) {
            return new Vector4(a.x, a.y, a.z, a.w).addInPlace(b);
        }
        else if (aClassName === "Vector4" /* FlowGraphTypes.Vector4 */ || bClassName === "Quaternion" /* FlowGraphTypes.Quaternion */) {
            return a.add(b);
        }
        else {
            // at this point at least one of the variables is a number.
            if (this.config?.preventIntegerFloatArithmetic && typeof a !== typeof b) {
                throw new Error("Cannot add different types of numbers.");
            }
            return getNumericValue(a) + getNumericValue(b);
        }
    }
}
/**
 * Polymorphic subtract block.
 */
export class FlowGraphSubtractBlock extends FlowGraphBinaryOperationBlock {
    /**
     * Construct a new subtract block.
     * @param config optional configuration
     */
    constructor(config) {
        super(getRichTypeByFlowGraphType(config?.type), getRichTypeByFlowGraphType(config?.type), getRichTypeByFlowGraphType(config?.type), (a, b) => this._polymorphicSubtract(a, b), "FlowGraphSubtractBlock" /* FlowGraphBlockNames.Subtract */, config);
    }
    _polymorphicSubtract(a, b) {
        const aClassName = _GetClassNameOf(a);
        const bClassName = _GetClassNameOf(b);
        if (_AreSameVectorOrQuaternionClass(aClassName, bClassName) || _AreSameIntegerClass(aClassName, bClassName) || _AreSameMatrixClass(aClassName, bClassName)) {
            // cast to vector3, but it can be casted to any vector type
            return a.subtract(b);
        }
        else if (aClassName === "Quaternion" /* FlowGraphTypes.Quaternion */ || bClassName === "Vector4" /* FlowGraphTypes.Vector4 */) {
            return new Vector4(a.x, a.y, a.z, a.w).subtractInPlace(b);
        }
        else if (aClassName === "Vector4" /* FlowGraphTypes.Vector4 */ || bClassName === "Quaternion" /* FlowGraphTypes.Quaternion */) {
            return a.subtract(b);
        }
        else {
            // at this point at least one of the variables is a number.
            if (this.config?.preventIntegerFloatArithmetic && typeof a !== typeof b) {
                throw new Error("Cannot add different types of numbers.");
            }
            return getNumericValue(a) - getNumericValue(b);
        }
    }
}
/**
 * Polymorphic multiply block.
 * In case of matrix, it is configurable whether the multiplication is done per component.
 */
export class FlowGraphMultiplyBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(getRichTypeByFlowGraphType(config?.type), getRichTypeByFlowGraphType(config?.type), getRichTypeByFlowGraphType(config?.type), (a, b) => this._polymorphicMultiply(a, b), "FlowGraphMultiplyBlock" /* FlowGraphBlockNames.Multiply */, config);
    }
    _polymorphicMultiply(a, b) {
        const aClassName = _GetClassNameOf(a);
        const bClassName = _GetClassNameOf(b);
        if (_AreSameVectorOrQuaternionClass(aClassName, bClassName) || _AreSameIntegerClass(aClassName, bClassName)) {
            // cast to vector3, but it can be casted to any vector type
            return a.multiply(b);
        }
        else if (aClassName === "Quaternion" /* FlowGraphTypes.Quaternion */ || bClassName === "Vector4" /* FlowGraphTypes.Vector4 */) {
            return new Vector4(a.x, a.y, a.z, a.w).multiplyInPlace(b);
        }
        else if (aClassName === "Vector4" /* FlowGraphTypes.Vector4 */ || bClassName === "Quaternion" /* FlowGraphTypes.Quaternion */) {
            return a.multiply(b);
        }
        else if (_AreSameMatrixClass(aClassName, bClassName)) {
            if (this.config?.useMatrixPerComponent) {
                // this is the definition of multiplication of glTF interactivity
                // get a's m as array, and multiply each component with b's m
                const aM = a.m;
                for (let i = 0; i < aM.length; i++) {
                    aM[i] *= b.m[i];
                }
                if (aClassName === "Matrix2D" /* FlowGraphTypes.Matrix2D */) {
                    return new FlowGraphMatrix2D(aM);
                }
                else if (aClassName === "Matrix3D" /* FlowGraphTypes.Matrix3D */) {
                    return new FlowGraphMatrix3D(aM);
                }
                else {
                    return Matrix.FromArray(aM);
                }
            }
            else {
                a = a;
                b = b;
                return b.multiply(a);
            }
        }
        else {
            // at this point at least one of the variables is a number.
            if (this.config?.preventIntegerFloatArithmetic && typeof a !== typeof b) {
                throw new Error("Cannot add different types of numbers.");
            }
            return getNumericValue(a) * getNumericValue(b);
        }
    }
}
/**
 * Polymorphic division block.
 */
export class FlowGraphDivideBlock extends FlowGraphBinaryOperationBlock {
    /**
     * Construct a new divide block.
     * @param config - Optional configuration
     */
    constructor(config) {
        super(getRichTypeByFlowGraphType(config?.type), getRichTypeByFlowGraphType(config?.type), getRichTypeByFlowGraphType(config?.type), (a, b) => this._polymorphicDivide(a, b), "FlowGraphDivideBlock" /* FlowGraphBlockNames.Divide */, config);
    }
    _polymorphicDivide(a, b) {
        const aClassName = _GetClassNameOf(a);
        const bClassName = _GetClassNameOf(b);
        if (_AreSameVectorOrQuaternionClass(aClassName, bClassName) || _AreSameIntegerClass(aClassName, bClassName)) {
            // cast to vector3, but it can be casted to any vector type
            return a.divide(b);
        }
        else if (aClassName === "Quaternion" /* FlowGraphTypes.Quaternion */ || bClassName === "Quaternion" /* FlowGraphTypes.Quaternion */) {
            // this is a simple division (per component!), and should be also supported between Quat and Vector4. Therefore -
            const aClone = a.clone();
            aClone.x /= b.x;
            aClone.y /= b.y;
            aClone.z /= b.z;
            aClone.w /= b.w;
            return aClone;
        }
        else if (aClassName === "Quaternion" /* FlowGraphTypes.Quaternion */ || bClassName === "Vector4" /* FlowGraphTypes.Vector4 */) {
            return new Vector4(a.x, a.y, a.z, a.w).divideInPlace(b);
        }
        else if (aClassName === "Vector4" /* FlowGraphTypes.Vector4 */ || bClassName === "Quaternion" /* FlowGraphTypes.Quaternion */) {
            return a.divide(b);
        }
        else if (_AreSameMatrixClass(aClassName, bClassName)) {
            if (this.config?.useMatrixPerComponent) {
                // get a's m as array, and divide each component with b's m
                const aM = a.m;
                for (let i = 0; i < aM.length; i++) {
                    aM[i] /= b.m[i];
                }
                if (aClassName === "Matrix2D" /* FlowGraphTypes.Matrix2D */) {
                    return new FlowGraphMatrix2D(aM);
                }
                else if (aClassName === "Matrix3D" /* FlowGraphTypes.Matrix3D */) {
                    return new FlowGraphMatrix3D(aM);
                }
                else {
                    return Matrix.FromArray(aM);
                }
            }
            else {
                a = a;
                b = b;
                return a.divide(b);
            }
        }
        else {
            // at this point at least one of the variables is a number.
            if (this.config?.preventIntegerFloatArithmetic && typeof a !== typeof b) {
                throw new Error("Cannot add different types of numbers.");
            }
            return getNumericValue(a) / getNumericValue(b);
        }
    }
}
/**
 * Random number between min and max (defaults to 0 to 1)
 *
 * This node will cache the result for he same node reference. i.e., a Math.eq that references the SAME random node will always return true.
 */
export class FlowGraphRandomBlock extends FlowGraphConstantOperationBlock {
    /**
     * Construct a new random block.
     * @param config optional configuration
     */
    constructor(config) {
        super(RichTypeNumber, (context) => this._random(context), "FlowGraphRandomBlock" /* FlowGraphBlockNames.Random */, config);
        this.min = this.registerDataInput("min", RichTypeNumber, config?.min ?? 0);
        this.max = this.registerDataInput("max", RichTypeNumber, config?.max ?? 1);
        if (config?.seed) {
            this._seed = config.seed;
        }
    }
    _isSeed(seed = this._seed) {
        return seed !== undefined;
    }
    _getRandomValue() {
        if (this._isSeed(this._seed)) {
            // compute seed-based random number, deterministic randomness!
            const x = Math.sin(this._seed++) * 10000;
            return x - Math.floor(x);
        }
        return Math.random();
    }
    _random(context) {
        const min = this.min.getValue(context);
        const max = this.max.getValue(context);
        return this._getRandomValue() * (max - min) + min;
    }
}
/**
 * E constant.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class FlowGraphEBlock extends FlowGraphConstantOperationBlock {
    constructor(config) {
        super(RichTypeNumber, () => Math.E, "FlowGraphEBlock" /* FlowGraphBlockNames.E */, config);
    }
}
/**
 * Pi constant.
 */
export class FlowGraphPiBlock extends FlowGraphConstantOperationBlock {
    constructor(config) {
        super(RichTypeNumber, () => Math.PI, "FlowGraphPIBlock" /* FlowGraphBlockNames.PI */, config);
    }
}
/**
 * Tau constant (2 * Pi), the ratio of a circle's circumference to its radius.
 */
export class FlowGraphTauBlock extends FlowGraphConstantOperationBlock {
    constructor(config) {
        super(RichTypeNumber, () => 2 * Math.PI, "FlowGraphTauBlock" /* FlowGraphBlockNames.Tau */, config);
    }
}
/**
 * Positive inf constant.
 */
export class FlowGraphInfBlock extends FlowGraphConstantOperationBlock {
    constructor(config) {
        super(RichTypeNumber, () => Number.POSITIVE_INFINITY, "FlowGraphInfBlock" /* FlowGraphBlockNames.Inf */, config);
    }
}
/**
 * NaN constant.
 */
export class FlowGraphNaNBlock extends FlowGraphConstantOperationBlock {
    constructor(config) {
        super(RichTypeNumber, () => Number.NaN, "FlowGraphNaNBlock" /* FlowGraphBlockNames.NaN */, config);
    }
}
function ComponentWiseUnaryOperation(a, op) {
    const aClassName = _GetClassNameOf(a);
    switch (aClassName) {
        case "FlowGraphInteger":
            a = a;
            return new FlowGraphInteger(op(a.value));
        case "Vector2" /* FlowGraphTypes.Vector2 */:
            a = a;
            return new Vector2(op(a.x), op(a.y));
        case "Vector3" /* FlowGraphTypes.Vector3 */:
            a = a;
            return new Vector3(op(a.x), op(a.y), op(a.z));
        case "Vector4" /* FlowGraphTypes.Vector4 */:
            a = a;
            return new Vector4(op(a.x), op(a.y), op(a.z), op(a.w));
        case "Quaternion" /* FlowGraphTypes.Quaternion */:
            a = a;
            return new Quaternion(op(a.x), op(a.y), op(a.z), op(a.w));
        case "Matrix" /* FlowGraphTypes.Matrix */:
            a = a;
            return Matrix.FromArray(a.m.map(op));
        case "Matrix2D" /* FlowGraphTypes.Matrix2D */:
            a = a;
            // reason for not using .map is performance
            return new FlowGraphMatrix2D(a.m.map(op));
        case "Matrix3D" /* FlowGraphTypes.Matrix3D */:
            a = a;
            return new FlowGraphMatrix3D(a.m.map(op));
        default:
            a = a;
            return op(a);
    }
}
/**
 * Absolute value block.
 */
export class FlowGraphAbsBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeNumber, RichTypeNumber, (a) => this._polymorphicAbs(a), "FlowGraphAbsBlock" /* FlowGraphBlockNames.Abs */, config);
    }
    _polymorphicAbs(a) {
        return ComponentWiseUnaryOperation(a, Math.abs);
    }
}
/**
 * Sign block.
 */
export class FlowGraphSignBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeNumber, RichTypeNumber, (a) => this._polymorphicSign(a), "FlowGraphSignBlock" /* FlowGraphBlockNames.Sign */, config);
    }
    _polymorphicSign(a) {
        return ComponentWiseUnaryOperation(a, Math.sign);
    }
}
/**
 * Truncation block.
 */
export class FlowGraphTruncBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeNumber, RichTypeNumber, (a) => this._polymorphicTrunc(a), "FlowGraphTruncBlock" /* FlowGraphBlockNames.Trunc */, config);
    }
    _polymorphicTrunc(a) {
        return ComponentWiseUnaryOperation(a, Math.trunc);
    }
}
/**
 * Floor block.
 */
export class FlowGraphFloorBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeNumber, RichTypeNumber, (a) => this._polymorphicFloor(a), "FlowGraphFloorBlock" /* FlowGraphBlockNames.Floor */, config);
    }
    _polymorphicFloor(a) {
        return ComponentWiseUnaryOperation(a, Math.floor);
    }
}
/**
 * Ceiling block.
 */
export class FlowGraphCeilBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeAny, (a) => this._polymorphicCeiling(a), "FlowGraphCeilBlock" /* FlowGraphBlockNames.Ceil */, config);
    }
    _polymorphicCeiling(a) {
        return ComponentWiseUnaryOperation(a, Math.ceil);
    }
}
/**
 * Round block.
 */
export class FlowGraphRoundBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeAny, (a) => this._polymorphicRound(a), "FlowGraphRoundBlock" /* FlowGraphBlockNames.Round */, config);
    }
    _polymorphicRound(a) {
        return ComponentWiseUnaryOperation(a, (a) => (a < 0 && this.config?.roundHalfAwayFromZero ? -Math.round(-a) : Math.round(a)));
    }
}
/**
 * A block that returns the fractional part of a number.
 */
export class FlowGraphFractionBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeAny, (a) => this._polymorphicFraction(a), "FlowGraphFractBlock" /* FlowGraphBlockNames.Fraction */, config);
    }
    _polymorphicFraction(a) {
        return ComponentWiseUnaryOperation(a, (a) => a - Math.floor(a));
    }
}
/**
 * Negation block.
 */
export class FlowGraphNegationBlock extends FlowGraphUnaryOperationBlock {
    /**
     * construct a new negation block.
     * @param config optional configuration
     */
    constructor(config) {
        super(RichTypeAny, RichTypeAny, (a) => this._polymorphicNeg(a), "FlowGraphNegationBlock" /* FlowGraphBlockNames.Negation */, config);
    }
    _polymorphicNeg(a) {
        return ComponentWiseUnaryOperation(a, (a) => -a);
    }
}
function ComponentWiseBinaryOperation(a, b, op) {
    const aClassName = _GetClassNameOf(a);
    switch (aClassName) {
        case "FlowGraphInteger":
            a = a;
            b = b;
            return new FlowGraphInteger(op(a.value, b.value));
        case "Vector2" /* FlowGraphTypes.Vector2 */:
            a = a;
            b = b;
            return new Vector2(op(a.x, b.x), op(a.y, b.y));
        case "Vector3" /* FlowGraphTypes.Vector3 */:
            a = a;
            b = b;
            return new Vector3(op(a.x, b.x), op(a.y, b.y), op(a.z, b.z));
        case "Vector4" /* FlowGraphTypes.Vector4 */:
            a = a;
            b = b;
            return new Vector4(op(a.x, b.x), op(a.y, b.y), op(a.z, b.z), op(a.w, b.w));
        case "Quaternion" /* FlowGraphTypes.Quaternion */:
            a = a;
            b = b;
            return new Quaternion(op(a.x, b.x), op(a.y, b.y), op(a.z, b.z), op(a.w, b.w));
        case "Matrix" /* FlowGraphTypes.Matrix */:
            a = a;
            return Matrix.FromArray(a.m.map((v, i) => op(v, b.m[i])));
        case "Matrix2D" /* FlowGraphTypes.Matrix2D */:
            a = a;
            return new FlowGraphMatrix2D(a.m.map((v, i) => op(v, b.m[i])));
        case "Matrix3D" /* FlowGraphTypes.Matrix3D */:
            a = a;
            return new FlowGraphMatrix3D(a.m.map((v, i) => op(v, b.m[i])));
        default:
            return op(getNumericValue(a), getNumericValue(b));
    }
}
/**
 * Remainder block.
 */
export class FlowGraphModuloBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeAny, RichTypeAny, (a, b) => this._polymorphicRemainder(a, b), "FlowGraphModuloBlock" /* FlowGraphBlockNames.Modulo */, config);
    }
    _polymorphicRemainder(a, b) {
        return ComponentWiseBinaryOperation(a, b, (a, b) => a % b);
    }
}
/**
 * Min block.
 */
export class FlowGraphMinBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeAny, RichTypeAny, (a, b) => this._polymorphicMin(a, b), "FlowGraphMinBlock" /* FlowGraphBlockNames.Min */, config);
    }
    _polymorphicMin(a, b) {
        return ComponentWiseBinaryOperation(a, b, Math.min);
    }
}
/**
 * Max block
 */
export class FlowGraphMaxBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeAny, RichTypeAny, (a, b) => this._polymorphicMax(a, b), "FlowGraphMaxBlock" /* FlowGraphBlockNames.Max */, config);
    }
    _polymorphicMax(a, b) {
        return ComponentWiseBinaryOperation(a, b, Math.max);
    }
}
function Clamp(a, b, c) {
    return Math.min(Math.max(a, Math.min(b, c)), Math.max(b, c));
}
function ComponentWiseTernaryOperation(a, b, c, op) {
    const aClassName = _GetClassNameOf(a);
    switch (aClassName) {
        case "FlowGraphInteger":
            a = a;
            b = b;
            c = c;
            return new FlowGraphInteger(op(a.value, b.value, c.value));
        case "Vector2" /* FlowGraphTypes.Vector2 */:
            a = a;
            b = b;
            c = c;
            return new Vector2(op(a.x, b.x, c.x), op(a.y, b.y, c.y));
        case "Vector3" /* FlowGraphTypes.Vector3 */:
            a = a;
            b = b;
            c = c;
            return new Vector3(op(a.x, b.x, c.x), op(a.y, b.y, c.y), op(a.z, b.z, c.z));
        case "Vector4" /* FlowGraphTypes.Vector4 */:
            a = a;
            b = b;
            c = c;
            return new Vector4(op(a.x, b.x, c.x), op(a.y, b.y, c.y), op(a.z, b.z, c.z), op(a.w, b.w, c.w));
        case "Quaternion" /* FlowGraphTypes.Quaternion */:
            a = a;
            b = b;
            c = c;
            return new Quaternion(op(a.x, b.x, c.x), op(a.y, b.y, c.y), op(a.z, b.z, c.z), op(a.w, b.w, c.w));
        case "Matrix" /* FlowGraphTypes.Matrix */:
            return Matrix.FromArray(a.m.map((v, i) => op(v, b.m[i], c.m[i])));
        case "Matrix2D" /* FlowGraphTypes.Matrix2D */:
            return new FlowGraphMatrix2D(a.m.map((v, i) => op(v, b.m[i], c.m[i])));
        case "Matrix3D" /* FlowGraphTypes.Matrix3D */:
            return new FlowGraphMatrix3D(a.m.map((v, i) => op(v, b.m[i], c.m[i])));
        default:
            return op(getNumericValue(a), getNumericValue(b), getNumericValue(c));
    }
}
/**
 * Clamp block.
 */
export class FlowGraphClampBlock extends FlowGraphTernaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeAny, RichTypeAny, RichTypeAny, (a, b, c) => this._polymorphicClamp(a, b, c), "FlowGraphClampBlock" /* FlowGraphBlockNames.Clamp */, config);
    }
    _polymorphicClamp(a, b, c) {
        return ComponentWiseTernaryOperation(a, b, c, Clamp);
    }
}
function Saturate(a) {
    return Math.min(Math.max(a, 0), 1);
}
/**
 * Saturate block.
 */
export class FlowGraphSaturateBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeAny, (a) => this._polymorphicSaturate(a), "FlowGraphSaturateBlock" /* FlowGraphBlockNames.Saturate */, config);
    }
    _polymorphicSaturate(a) {
        return ComponentWiseUnaryOperation(a, Saturate);
    }
}
function Interpolate(a, b, c) {
    return (1 - c) * a + c * b;
}
/**
 * Smooth step (Hermite interpolation) coefficient.
 * Given the edges `a`/`b` and the value `c`, computes the smooth interpolation
 * coefficient `t * t * (3 - 2 * t)` where `t = saturate((c - min(a, b)) / |b - a|)`.
 * Note that this returns the coefficient in [0, 1]; it does not interpolate between `a` and `b`.
 * @param a first edge
 * @param b second edge
 * @param c value to interpolate
 * @returns the smooth-step interpolation coefficient
 */
function SmoothStep(a, b, c) {
    // Degenerate edges: with a === b the transition is instantaneous, so return a step rather than
    // dividing by zero (which would yield NaN and poison downstream math).
    if (a === b) {
        return c < a ? 0 : 1;
    }
    const t = Saturate((c - Math.min(a, b)) / Math.abs(b - a));
    return t * t * (3 - 2 * t);
}
/**
 * Interpolate block.
 */
export class FlowGraphMathInterpolationBlock extends FlowGraphTernaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeAny, RichTypeAny, RichTypeAny, (a, b, c) => this._polymorphicInterpolate(a, b, c), "FlowGraphMathInterpolationBlock" /* FlowGraphBlockNames.MathInterpolation */, config);
    }
    _polymorphicInterpolate(a, b, c) {
        return ComponentWiseTernaryOperation(a, b, c, Interpolate);
    }
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
export class FlowGraphMathSlerpBlock extends FlowGraphTernaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeAny, RichTypeNumber, RichTypeAny, (a, b, c) => Quaternion.Slerp(a, b, c), "FlowGraphMathSlerpBlock" /* FlowGraphBlockNames.MathSlerp */, config);
    }
}
/**
 * Smooth-step block, returning the Hermite interpolation coefficient.
 * Operates component-wise over floatN inputs (the two edges `a`/`b` and the
 * value `c`).
 */
export class FlowGraphMathSmoothStepBlock extends FlowGraphTernaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeAny, RichTypeAny, RichTypeAny, (a, b, c) => this._polymorphicSmoothStep(a, b, c), "FlowGraphSmoothStepBlock" /* FlowGraphBlockNames.SmoothStep */, config);
    }
    _polymorphicSmoothStep(a, b, c) {
        return ComponentWiseTernaryOperation(a, b, c, SmoothStep);
    }
}
/**
 * Equals block.
 */
export class FlowGraphEqualityBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeAny, RichTypeBoolean, (a, b) => this._polymorphicEq(a, b), "FlowGraphEqualityBlock" /* FlowGraphBlockNames.Equality */, config);
    }
    _polymorphicEq(a, b) {
        const aClassName = _GetClassNameOf(a);
        const bClassName = _GetClassNameOf(b);
        // A rotation may arrive either as a Quaternion or as a four-component vector, so treat Quaternion and
        // Vector4 (both four-component) as comparable so that, for example, a decomposed rotation can be compared
        // against a float4 literal.
        const isFourComponent = (className) => className === "Vector4" /* FlowGraphTypes.Vector4 */ || className === "Quaternion" /* FlowGraphTypes.Quaternion */;
        if (isFourComponent(aClassName) && isFourComponent(bClassName)) {
            return a.equals(b);
        }
        if (_AreSameVectorOrQuaternionClass(aClassName, bClassName) || _AreSameMatrixClass(aClassName, bClassName) || _AreSameIntegerClass(aClassName, bClassName)) {
            return a.equals(b);
        }
        // Handle mixed number/FlowGraphInteger comparison
        if (isNumeric(a) && isNumeric(b)) {
            return getNumericValue(a) === getNumericValue(b);
        }
        if (typeof a !== typeof b) {
            return false;
        }
        return a === b;
    }
}
function ComparisonOperators(a, b, op) {
    if (isNumeric(a) && isNumeric(b)) {
        return op(getNumericValue(a), getNumericValue(b));
    }
    else {
        throw new Error(`Cannot compare ${a} and ${b}`);
    }
}
/**
 * Less than block.
 */
export class FlowGraphLessThanBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeAny, RichTypeBoolean, (a, b) => this._polymorphicLessThan(a, b), "FlowGraphLessThanBlock" /* FlowGraphBlockNames.LessThan */, config);
    }
    _polymorphicLessThan(a, b) {
        return ComparisonOperators(a, b, (a, b) => a < b);
    }
}
/**
 * Less than or equal block.
 */
export class FlowGraphLessThanOrEqualBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeAny, RichTypeBoolean, (a, b) => this._polymorphicLessThanOrEqual(a, b), "FlowGraphLessThanOrEqualBlock" /* FlowGraphBlockNames.LessThanOrEqual */, config);
    }
    _polymorphicLessThanOrEqual(a, b) {
        return ComparisonOperators(a, b, (a, b) => a <= b);
    }
}
/**
 * Greater than block.
 */
export class FlowGraphGreaterThanBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeAny, RichTypeBoolean, (a, b) => this._polymorphicGreaterThan(a, b), "FlowGraphGreaterThanBlock" /* FlowGraphBlockNames.GreaterThan */, config);
    }
    _polymorphicGreaterThan(a, b) {
        return ComparisonOperators(a, b, (a, b) => a > b);
    }
}
/**
 * Greater than or equal block.
 */
export class FlowGraphGreaterThanOrEqualBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeAny, RichTypeBoolean, (a, b) => this._polymorphicGreaterThanOrEqual(a, b), "FlowGraphGreaterThanOrEqualBlock" /* FlowGraphBlockNames.GreaterThanOrEqual */, config);
    }
    _polymorphicGreaterThanOrEqual(a, b) {
        return ComparisonOperators(a, b, (a, b) => a >= b);
    }
}
/**
 * Is NaN block.
 */
export class FlowGraphIsNanBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeBoolean, (a) => this._polymorphicIsNan(a), "FlowGraphIsNaNBlock" /* FlowGraphBlockNames.IsNaN */, config);
    }
    _polymorphicIsNan(a) {
        if (isNumeric(a, true)) {
            return isNaN(getNumericValue(a));
        }
        else {
            throw new Error(`Cannot get NaN of ${a}`);
        }
    }
}
/**
 * Is Inf block.
 */
export class FlowGraphIsInfinityBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeBoolean, (a) => this._polymorphicIsInf(a), "FlowGraphIsInfBlock" /* FlowGraphBlockNames.IsInfinity */, config);
    }
    _polymorphicIsInf(a) {
        if (isNumeric(a)) {
            return !isFinite(getNumericValue(a));
        }
        else {
            throw new Error(`Cannot get isInf of ${a}`);
        }
    }
}
/**
 * Convert degrees to radians block.
 */
export class FlowGraphDegToRadBlock extends FlowGraphUnaryOperationBlock {
    /**
     * Constructs a new instance of the flow graph math block.
     * @param config - Optional configuration for the flow graph block.
     */
    constructor(config) {
        super(RichTypeAny, RichTypeAny, (a) => this._polymorphicDegToRad(a), "FlowGraphDegToRadBlock" /* FlowGraphBlockNames.DegToRad */, config);
    }
    _degToRad(a) {
        return (a * Math.PI) / 180;
    }
    _polymorphicDegToRad(a) {
        return ComponentWiseUnaryOperation(a, this._degToRad);
    }
}
/**
 * Convert radians to degrees block.
 */
export class FlowGraphRadToDegBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeAny, (a) => this._polymorphicRadToDeg(a), "FlowGraphRadToDegBlock" /* FlowGraphBlockNames.RadToDeg */, config);
    }
    _radToDeg(a) {
        return (a * 180) / Math.PI;
    }
    _polymorphicRadToDeg(a) {
        return ComponentWiseUnaryOperation(a, this._radToDeg);
    }
}
/**
 * Sin block.
 */
export class FlowGraphSinBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeNumber, RichTypeNumber, (a) => this._polymorphicSin(a), "FlowGraphSinBlock" /* FlowGraphBlockNames.Sin */, config);
    }
    _polymorphicSin(a) {
        return ComponentWiseUnaryOperation(a, Math.sin);
    }
}
/**
 * Cos block.
 */
export class FlowGraphCosBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeNumber, RichTypeNumber, (a) => this._polymorphicCos(a), "FlowGraphCosBlock" /* FlowGraphBlockNames.Cos */, config);
    }
    _polymorphicCos(a) {
        return ComponentWiseUnaryOperation(a, Math.cos);
    }
}
/**
 * Tan block.
 */
export class FlowGraphTanBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeNumber, RichTypeNumber, (a) => this._polymorphicTan(a), "FlowGraphTanBlock" /* FlowGraphBlockNames.Tan */, config);
    }
    _polymorphicTan(a) {
        return ComponentWiseUnaryOperation(a, Math.tan);
    }
}
/**
 * Arcsin block.
 */
export class FlowGraphAsinBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeNumber, RichTypeNumber, (a) => this._polymorphicAsin(a), "FlowGraphASinBlock" /* FlowGraphBlockNames.Asin */, config);
    }
    _polymorphicAsin(a) {
        return ComponentWiseUnaryOperation(a, Math.asin);
    }
}
/**
 * Arccos block.
 */
export class FlowGraphAcosBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeNumber, RichTypeNumber, (a) => this._polymorphicAcos(a), "FlowGraphACosBlock" /* FlowGraphBlockNames.Acos */, config);
    }
    _polymorphicAcos(a) {
        return ComponentWiseUnaryOperation(a, Math.acos);
    }
}
/**
 * Arctan block.
 */
export class FlowGraphAtanBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeNumber, RichTypeNumber, (a) => this._polymorphicAtan(a), "FlowGraphATanBlock" /* FlowGraphBlockNames.Atan */, config);
    }
    _polymorphicAtan(a) {
        return ComponentWiseUnaryOperation(a, Math.atan);
    }
}
/**
 * Arctan2 block.
 */
export class FlowGraphAtan2Block extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeAny, RichTypeAny, (a, b) => this._polymorphicAtan2(a, b), "FlowGraphATan2Block" /* FlowGraphBlockNames.Atan2 */, config);
    }
    _polymorphicAtan2(a, b) {
        return ComponentWiseBinaryOperation(a, b, Math.atan2);
    }
}
/**
 * Hyperbolic sin block.
 */
export class FlowGraphSinhBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeAny, (a) => this._polymorphicSinh(a), "FlowGraphSinhBlock" /* FlowGraphBlockNames.Sinh */, config);
    }
    _polymorphicSinh(a) {
        return ComponentWiseUnaryOperation(a, Math.sinh);
    }
}
/**
 * Hyperbolic cos block.
 */
export class FlowGraphCoshBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeAny, (a) => this._polymorphicCosh(a), "FlowGraphCoshBlock" /* FlowGraphBlockNames.Cosh */, config);
    }
    _polymorphicCosh(a) {
        return ComponentWiseUnaryOperation(a, Math.cosh);
    }
}
/**
 * Hyperbolic tan block.
 */
export class FlowGraphTanhBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeAny, (a) => this._polymorphicTanh(a), "FlowGraphTanhBlock" /* FlowGraphBlockNames.Tanh */, config);
    }
    _polymorphicTanh(a) {
        return ComponentWiseUnaryOperation(a, Math.tanh);
    }
}
/**
 * Hyperbolic arcsin block.
 */
export class FlowGraphAsinhBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeNumber, (a) => this._polymorphicAsinh(a), "FlowGraphASinhBlock" /* FlowGraphBlockNames.Asinh */, config);
    }
    _polymorphicAsinh(a) {
        return ComponentWiseUnaryOperation(a, Math.asinh);
    }
}
/**
 * Hyperbolic arccos block.
 */
export class FlowGraphAcoshBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeNumber, (a) => this._polymorphicAcosh(a), "FlowGraphACoshBlock" /* FlowGraphBlockNames.Acosh */, config);
    }
    _polymorphicAcosh(a) {
        return ComponentWiseUnaryOperation(a, Math.acosh);
    }
}
/**
 * Hyperbolic arctan block.
 */
export class FlowGraphAtanhBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeNumber, (a) => this._polymorphicAtanh(a), "FlowGraphATanhBlock" /* FlowGraphBlockNames.Atanh */, config);
    }
    _polymorphicAtanh(a) {
        return ComponentWiseUnaryOperation(a, Math.atanh);
    }
}
/**
 * Exponential block.
 */
export class FlowGraphExpBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeNumber, (a) => this._polymorphicExp(a), "FlowGraphExponentialBlock" /* FlowGraphBlockNames.Exponential */, config);
    }
    _polymorphicExp(a) {
        return ComponentWiseUnaryOperation(a, Math.exp);
    }
}
/**
 * Logarithm block.
 */
export class FlowGraphLogBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeNumber, (a) => this._polymorphicLog(a), "FlowGraphLogBlock" /* FlowGraphBlockNames.Log */, config);
    }
    _polymorphicLog(a) {
        return ComponentWiseUnaryOperation(a, Math.log);
    }
}
/**
 * Base 2 logarithm block.
 */
export class FlowGraphLog2Block extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeNumber, (a) => this._polymorphicLog2(a), "FlowGraphLog2Block" /* FlowGraphBlockNames.Log2 */, config);
    }
    _polymorphicLog2(a) {
        return ComponentWiseUnaryOperation(a, Math.log2);
    }
}
/**
 * Base 10 logarithm block.
 */
export class FlowGraphLog10Block extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeNumber, (a) => this._polymorphicLog10(a), "FlowGraphLog10Block" /* FlowGraphBlockNames.Log10 */, config);
    }
    _polymorphicLog10(a) {
        return ComponentWiseUnaryOperation(a, Math.log10);
    }
}
/**
 * Square root block.
 */
export class FlowGraphSquareRootBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeNumber, (a) => this._polymorphicSqrt(a), "FlowGraphSquareRootBlock" /* FlowGraphBlockNames.SquareRoot */, config);
    }
    _polymorphicSqrt(a) {
        return ComponentWiseUnaryOperation(a, Math.sqrt);
    }
}
/**
 * Cube root block.
 */
export class FlowGraphCubeRootBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeNumber, (a) => this._polymorphicCubeRoot(a), "FlowGraphCubeRootBlock" /* FlowGraphBlockNames.CubeRoot */, config);
    }
    _polymorphicCubeRoot(a) {
        return ComponentWiseUnaryOperation(a, Math.cbrt);
    }
}
/**
 * Power block.
 */
export class FlowGraphPowerBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeNumber, RichTypeNumber, (a, b) => this._polymorphicPow(a, b), "FlowGraphPowerBlock" /* FlowGraphBlockNames.Power */, config);
    }
    _polymorphicPow(a, b) {
        return ComponentWiseBinaryOperation(a, b, Math.pow);
    }
}
/**
 * Bitwise NOT operation
 */
export class FlowGraphBitwiseNotBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(getRichTypeByFlowGraphType(config?.valueType || "FlowGraphInteger" /* FlowGraphTypes.Integer */), getRichTypeByFlowGraphType(config?.valueType || "FlowGraphInteger" /* FlowGraphTypes.Integer */), (a) => {
            if (typeof a === "boolean") {
                return !a;
            }
            else if (typeof a === "number") {
                return ~a;
            }
            return new FlowGraphInteger(~a.value);
        }, "FlowGraphBitwiseNotBlock" /* FlowGraphBlockNames.BitwiseNot */, config);
    }
}
/**
 * Bitwise AND operation
 */
export class FlowGraphBitwiseAndBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(getRichTypeByFlowGraphType(config?.valueType || "FlowGraphInteger" /* FlowGraphTypes.Integer */), getRichTypeByFlowGraphType(config?.valueType || "FlowGraphInteger" /* FlowGraphTypes.Integer */), getRichTypeByFlowGraphType(config?.valueType || "FlowGraphInteger" /* FlowGraphTypes.Integer */), (a, b) => {
            if (typeof a === "boolean" && typeof b === "boolean") {
                return a && b;
            }
            else if (typeof a === "number" && typeof b === "number") {
                return a & b;
            }
            else if (typeof a === "object" && typeof b === "object") {
                return new FlowGraphInteger(a.value & b.value);
            }
            else {
                throw new Error(`Cannot perform bitwise AND on ${a} and ${b}`);
            }
        }, "FlowGraphBitwiseAndBlock" /* FlowGraphBlockNames.BitwiseAnd */, config);
    }
}
/**
 * Bitwise OR operation
 */
export class FlowGraphBitwiseOrBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(getRichTypeByFlowGraphType(config?.valueType || "FlowGraphInteger" /* FlowGraphTypes.Integer */), getRichTypeByFlowGraphType(config?.valueType || "FlowGraphInteger" /* FlowGraphTypes.Integer */), getRichTypeByFlowGraphType(config?.valueType || "FlowGraphInteger" /* FlowGraphTypes.Integer */), (a, b) => {
            if (typeof a === "boolean" && typeof b === "boolean") {
                return a || b;
            }
            else if (typeof a === "number" && typeof b === "number") {
                return a | b;
            }
            else if (typeof a === "object" && typeof b === "object") {
                return new FlowGraphInteger(a.value | b.value);
            }
            else {
                throw new Error(`Cannot perform bitwise OR on ${a} and ${b}`);
            }
        }, "FlowGraphBitwiseOrBlock" /* FlowGraphBlockNames.BitwiseOr */, config);
    }
}
/**
 * Bitwise XOR operation
 */
export class FlowGraphBitwiseXorBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(getRichTypeByFlowGraphType(config?.valueType || "FlowGraphInteger" /* FlowGraphTypes.Integer */), getRichTypeByFlowGraphType(config?.valueType || "FlowGraphInteger" /* FlowGraphTypes.Integer */), getRichTypeByFlowGraphType(config?.valueType || "FlowGraphInteger" /* FlowGraphTypes.Integer */), (a, b) => {
            if (typeof a === "boolean" && typeof b === "boolean") {
                return a !== b;
            }
            else if (typeof a === "number" && typeof b === "number") {
                return a ^ b;
            }
            else if (typeof a === "object" && typeof b === "object") {
                return new FlowGraphInteger(a.value ^ b.value);
            }
            else {
                throw new Error(`Cannot perform bitwise XOR on ${a} and ${b}`);
            }
        }, "FlowGraphBitwiseXorBlock" /* FlowGraphBlockNames.BitwiseXor */, config);
    }
}
/**
 * Bitwise left shift operation
 */
export class FlowGraphBitwiseLeftShiftBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeFlowGraphInteger, RichTypeFlowGraphInteger, RichTypeFlowGraphInteger, (a, b) => new FlowGraphInteger(a.value << b.value), "FlowGraphBitwiseLeftShiftBlock" /* FlowGraphBlockNames.BitwiseLeftShift */, config);
    }
}
/**
 * Bitwise right shift operation
 */
export class FlowGraphBitwiseRightShiftBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeFlowGraphInteger, RichTypeFlowGraphInteger, RichTypeFlowGraphInteger, (a, b) => new FlowGraphInteger(a.value >> b.value), "FlowGraphBitwiseRightShiftBlock" /* FlowGraphBlockNames.BitwiseRightShift */, config);
    }
}
/**
 * Count leading zeros operation
 */
export class FlowGraphLeadingZerosBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeFlowGraphInteger, RichTypeFlowGraphInteger, (a) => new FlowGraphInteger(Math.clz32(a.value)), "FlowGraphLeadingZerosBlock" /* FlowGraphBlockNames.LeadingZeros */, config);
    }
}
/**
 * Count trailing zeros operation
 */
export class FlowGraphTrailingZerosBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeFlowGraphInteger, RichTypeFlowGraphInteger, (a) => new FlowGraphInteger(a.value ? 31 - Math.clz32(a.value & -a.value) : 32), "FlowGraphTrailingZerosBlock" /* FlowGraphBlockNames.TrailingZeros */, config);
    }
}
/**
 * Given a number (which is converted to a 32-bit integer), return the
 * number of bits set to one on that number.
 * @param n the number to run the op on
 * @returns the number of bits set to one on that number
 */
function CountOnes(n) {
    let result = 0;
    while (n) {
        // This zeroes out all bits except for the least significant one.
        // So if the bit is set, it will be 1, otherwise it will be 0.
        result += n & 1;
        // This shifts n's bits to the right by one
        n >>= 1;
    }
    return result;
}
/**
 * Count one bits operation
 */
export class FlowGraphOneBitsCounterBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeFlowGraphInteger, RichTypeFlowGraphInteger, (a) => new FlowGraphInteger(CountOnes(a.value)), "FlowGraphOneBitsCounterBlock" /* FlowGraphBlockNames.OneBitsCounter */, config);
    }
}
/**
 * Converts a linear sRGB color to OkLCh (the polar form of the Oklab color space).
 * Uses Ottosson's original single-precision matrices.
 * The RGB inputs are treated as linear; hue is returned in radians.
 * @param r linear red component
 * @param g linear green component
 * @param b linear blue component
 * @returns the OkLCh lightness (l), chroma (c) and hue (h, radians)
 */
function RgbToOkLch(r, g, b) {
    // Linear sRGB -> LMS cone responses.
    const long = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
    const medium = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
    const short = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
    // Non-linearity (cube root) then LMS' -> Oklab.
    const lRoot = Math.cbrt(long);
    const mRoot = Math.cbrt(medium);
    const sRoot = Math.cbrt(short);
    const okL = 0.2104542553 * lRoot + 0.793617785 * mRoot - 0.0040720468 * sRoot;
    const okA = 1.9779984951 * lRoot - 2.428592205 * mRoot + 0.4505937099 * sRoot;
    const okB = 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot;
    // Oklab -> OkLCh (polar form).
    return { l: okL, c: Math.hypot(okA, okB), h: Math.atan2(okB, okA) };
}
/**
 * Converts an OkLCh color to linear sRGB. Inverse of {@link RgbToOkLch}; hue is in radians.
 * @param l OkLCh lightness
 * @param c OkLCh chroma
 * @param h OkLCh hue in radians
 * @returns the linear sRGB red (r), green (g) and blue (b) components
 */
function OkLchToRgb(l, c, h) {
    // OkLCh -> Oklab.
    const okA = c * Math.cos(h);
    const okB = c * Math.sin(h);
    // Oklab -> LMS' then cube to LMS.
    const lPrime = l + 0.3963377774 * okA + 0.2158037573 * okB;
    const mPrime = l - 0.1055613458 * okA - 0.0638541728 * okB;
    const sPrime = l - 0.0894841775 * okA - 1.291485548 * okB;
    const long = lPrime * lPrime * lPrime;
    const medium = mPrime * mPrime * mPrime;
    const short = sPrime * sPrime * sPrime;
    // LMS -> linear sRGB.
    return {
        r: 4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short,
        g: -1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short,
        b: -0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short,
    };
}
/**
 * Block that converts a linear sRGB color (r, g, b) to OkLCh (l, c, h). Hue is in radians.
 */
export class FlowGraphRGBToOkLChBlock extends FlowGraphBlock {
    constructor(config) {
        super(config);
        this.r = this.registerDataInput("r", RichTypeNumber, 0);
        this.g = this.registerDataInput("g", RichTypeNumber, 0);
        this.b = this.registerDataInput("b", RichTypeNumber, 0);
        this.l = this.registerDataOutput("l", RichTypeNumber, 0);
        this.c = this.registerDataOutput("c", RichTypeNumber, 0);
        this.h = this.registerDataOutput("h", RichTypeNumber, 0);
    }
    _updateOutputs(context) {
        const { l, c, h } = RgbToOkLch(this.r.getValue(context), this.g.getValue(context), this.b.getValue(context));
        this.l.setValue(l, context);
        this.c.setValue(c, context);
        this.h.setValue(h, context);
    }
    getClassName() {
        return "FlowGraphRGBToOkLChBlock" /* FlowGraphBlockNames.RGBToOkLCh */;
    }
}
/**
 * Block that converts an OkLCh color (l, c, h) to linear sRGB (r, g, b). Hue is in radians.
 */
export class FlowGraphRGBFromOkLChBlock extends FlowGraphBlock {
    constructor(config) {
        super(config);
        this.l = this.registerDataInput("l", RichTypeNumber, 0);
        this.c = this.registerDataInput("c", RichTypeNumber, 0);
        this.h = this.registerDataInput("h", RichTypeNumber, 0);
        this.r = this.registerDataOutput("r", RichTypeNumber, 0);
        this.g = this.registerDataOutput("g", RichTypeNumber, 0);
        this.b = this.registerDataOutput("b", RichTypeNumber, 0);
    }
    _updateOutputs(context) {
        const { r, g, b } = OkLchToRgb(this.l.getValue(context), this.c.getValue(context), this.h.getValue(context));
        this.r.setValue(r, context);
        this.g.setValue(g, context);
        this.b.setValue(b, context);
    }
    getClassName() {
        return "FlowGraphRGBFromOkLChBlock" /* FlowGraphBlockNames.RGBFromOkLCh */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphMathBlocks.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphMathBlocks() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphAddBlock" /* FlowGraphBlockNames.Add */, FlowGraphAddBlock);
    RegisterClass("FlowGraphSubtractBlock" /* FlowGraphBlockNames.Subtract */, FlowGraphSubtractBlock);
    RegisterClass("FlowGraphMultiplyBlock" /* FlowGraphBlockNames.Multiply */, FlowGraphMultiplyBlock);
    RegisterClass("FlowGraphDivideBlock" /* FlowGraphBlockNames.Divide */, FlowGraphDivideBlock);
    RegisterClass("FlowGraphRandomBlock" /* FlowGraphBlockNames.Random */, FlowGraphRandomBlock);
    RegisterClass("FlowGraphEBlock" /* FlowGraphBlockNames.E */, FlowGraphEBlock);
    RegisterClass("FlowGraphPIBlock" /* FlowGraphBlockNames.PI */, FlowGraphPiBlock);
    RegisterClass("FlowGraphTauBlock" /* FlowGraphBlockNames.Tau */, FlowGraphTauBlock);
    RegisterClass("FlowGraphInfBlock" /* FlowGraphBlockNames.Inf */, FlowGraphInfBlock);
    RegisterClass("FlowGraphNaNBlock" /* FlowGraphBlockNames.NaN */, FlowGraphNaNBlock);
    RegisterClass("FlowGraphAbsBlock" /* FlowGraphBlockNames.Abs */, FlowGraphAbsBlock);
    RegisterClass("FlowGraphSignBlock" /* FlowGraphBlockNames.Sign */, FlowGraphSignBlock);
    RegisterClass("FlowGraphTruncBlock" /* FlowGraphBlockNames.Trunc */, FlowGraphTruncBlock);
    RegisterClass("FlowGraphFloorBlock" /* FlowGraphBlockNames.Floor */, FlowGraphFloorBlock);
    RegisterClass("FlowGraphCeilBlock" /* FlowGraphBlockNames.Ceil */, FlowGraphCeilBlock);
    RegisterClass("FlowGraphRoundBlock" /* FlowGraphBlockNames.Round */, FlowGraphRoundBlock);
    RegisterClass("FlowGraphFractBlock" /* FlowGraphBlockNames.Fraction */, FlowGraphFractionBlock);
    RegisterClass("FlowGraphNegationBlock" /* FlowGraphBlockNames.Negation */, FlowGraphNegationBlock);
    RegisterClass("FlowGraphModuloBlock" /* FlowGraphBlockNames.Modulo */, FlowGraphModuloBlock);
    RegisterClass("FlowGraphMinBlock" /* FlowGraphBlockNames.Min */, FlowGraphMinBlock);
    RegisterClass("FlowGraphMaxBlock" /* FlowGraphBlockNames.Max */, FlowGraphMaxBlock);
    RegisterClass("FlowGraphClampBlock" /* FlowGraphBlockNames.Clamp */, FlowGraphClampBlock);
    RegisterClass("FlowGraphSaturateBlock" /* FlowGraphBlockNames.Saturate */, FlowGraphSaturateBlock);
    RegisterClass("FlowGraphMathInterpolationBlock" /* FlowGraphBlockNames.MathInterpolation */, FlowGraphMathInterpolationBlock);
    RegisterClass("FlowGraphMathSlerpBlock" /* FlowGraphBlockNames.MathSlerp */, FlowGraphMathSlerpBlock);
    RegisterClass("FlowGraphSmoothStepBlock" /* FlowGraphBlockNames.SmoothStep */, FlowGraphMathSmoothStepBlock);
    RegisterClass("FlowGraphRGBToOkLChBlock" /* FlowGraphBlockNames.RGBToOkLCh */, FlowGraphRGBToOkLChBlock);
    RegisterClass("FlowGraphRGBFromOkLChBlock" /* FlowGraphBlockNames.RGBFromOkLCh */, FlowGraphRGBFromOkLChBlock);
    RegisterClass("FlowGraphEqualityBlock" /* FlowGraphBlockNames.Equality */, FlowGraphEqualityBlock);
    RegisterClass("FlowGraphLessThanBlock" /* FlowGraphBlockNames.LessThan */, FlowGraphLessThanBlock);
    RegisterClass("FlowGraphLessThanOrEqualBlock" /* FlowGraphBlockNames.LessThanOrEqual */, FlowGraphLessThanOrEqualBlock);
    RegisterClass("FlowGraphGreaterThanBlock" /* FlowGraphBlockNames.GreaterThan */, FlowGraphGreaterThanBlock);
    RegisterClass("FlowGraphGreaterThanOrEqualBlock" /* FlowGraphBlockNames.GreaterThanOrEqual */, FlowGraphGreaterThanOrEqualBlock);
    RegisterClass("FlowGraphIsNaNBlock" /* FlowGraphBlockNames.IsNaN */, FlowGraphIsNanBlock);
    RegisterClass("FlowGraphIsInfBlock" /* FlowGraphBlockNames.IsInfinity */, FlowGraphIsInfinityBlock);
    RegisterClass("FlowGraphDegToRadBlock" /* FlowGraphBlockNames.DegToRad */, FlowGraphDegToRadBlock);
    RegisterClass("FlowGraphRadToDegBlock" /* FlowGraphBlockNames.RadToDeg */, FlowGraphRadToDegBlock);
    RegisterClass("FlowGraphASinBlock" /* FlowGraphBlockNames.Asin */, FlowGraphAsinBlock);
    RegisterClass("FlowGraphACosBlock" /* FlowGraphBlockNames.Acos */, FlowGraphAcosBlock);
    RegisterClass("FlowGraphATanBlock" /* FlowGraphBlockNames.Atan */, FlowGraphAtanBlock);
    RegisterClass("FlowGraphATan2Block" /* FlowGraphBlockNames.Atan2 */, FlowGraphAtan2Block);
    RegisterClass("FlowGraphSinhBlock" /* FlowGraphBlockNames.Sinh */, FlowGraphSinhBlock);
    RegisterClass("FlowGraphCoshBlock" /* FlowGraphBlockNames.Cosh */, FlowGraphCoshBlock);
    RegisterClass("FlowGraphTanhBlock" /* FlowGraphBlockNames.Tanh */, FlowGraphTanhBlock);
    RegisterClass("FlowGraphASinhBlock" /* FlowGraphBlockNames.Asinh */, FlowGraphAsinhBlock);
    RegisterClass("FlowGraphACoshBlock" /* FlowGraphBlockNames.Acosh */, FlowGraphAcoshBlock);
    RegisterClass("FlowGraphATanhBlock" /* FlowGraphBlockNames.Atanh */, FlowGraphAtanhBlock);
    RegisterClass("FlowGraphExponentialBlock" /* FlowGraphBlockNames.Exponential */, FlowGraphExpBlock);
    RegisterClass("FlowGraphLogBlock" /* FlowGraphBlockNames.Log */, FlowGraphLogBlock);
    RegisterClass("FlowGraphLog2Block" /* FlowGraphBlockNames.Log2 */, FlowGraphLog2Block);
    RegisterClass("FlowGraphLog10Block" /* FlowGraphBlockNames.Log10 */, FlowGraphLog10Block);
    RegisterClass("FlowGraphSquareRootBlock" /* FlowGraphBlockNames.SquareRoot */, FlowGraphSquareRootBlock);
    RegisterClass("FlowGraphCubeRootBlock" /* FlowGraphBlockNames.CubeRoot */, FlowGraphCubeRootBlock);
    RegisterClass("FlowGraphPowerBlock" /* FlowGraphBlockNames.Power */, FlowGraphPowerBlock);
    RegisterClass("FlowGraphBitwiseNotBlock" /* FlowGraphBlockNames.BitwiseNot */, FlowGraphBitwiseNotBlock);
    RegisterClass("FlowGraphBitwiseAndBlock" /* FlowGraphBlockNames.BitwiseAnd */, FlowGraphBitwiseAndBlock);
    RegisterClass("FlowGraphBitwiseOrBlock" /* FlowGraphBlockNames.BitwiseOr */, FlowGraphBitwiseOrBlock);
    RegisterClass("FlowGraphBitwiseXorBlock" /* FlowGraphBlockNames.BitwiseXor */, FlowGraphBitwiseXorBlock);
    RegisterClass("FlowGraphBitwiseLeftShiftBlock" /* FlowGraphBlockNames.BitwiseLeftShift */, FlowGraphBitwiseLeftShiftBlock);
    RegisterClass("FlowGraphBitwiseRightShiftBlock" /* FlowGraphBlockNames.BitwiseRightShift */, FlowGraphBitwiseRightShiftBlock);
    RegisterClass("FlowGraphLeadingZerosBlock" /* FlowGraphBlockNames.LeadingZeros */, FlowGraphLeadingZerosBlock);
    RegisterClass("FlowGraphTrailingZerosBlock" /* FlowGraphBlockNames.TrailingZeros */, FlowGraphTrailingZerosBlock);
    RegisterClass("FlowGraphOneBitsCounterBlock" /* FlowGraphBlockNames.OneBitsCounter */, FlowGraphOneBitsCounterBlock);
}
//# sourceMappingURL=flowGraphMathBlocks.pure.js.map