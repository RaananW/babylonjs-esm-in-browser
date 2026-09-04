/** This file must only contain pure code and pure imports */
import { FlowGraphBlock } from "../../../flowGraphBlock.js";
import { RichTypeVector3, RichTypeNumber, RichTypeAny, RichTypeVector2, RichTypeMatrix, getRichTypeByFlowGraphType, RichTypeQuaternion, RichTypeBoolean, } from "../../../flowGraphRichTypes.pure.js";
import { FlowGraphBinaryOperationBlock } from "../flowGraphBinaryOperationBlock.js";
import { FlowGraphUnaryOperationBlock } from "../flowGraphUnaryOperationBlock.js";
import { FlowGraphTernaryOperationBlock } from "../flowGraphTernaryOperationBlock.js";
import { FlowGraphCachedOperationBlock } from "../flowGraphCachedOperationBlock.js";
import { Quaternion, Vector2, Vector3, Vector4 } from "../../../../Maths/math.vector.pure.js";
import { _GetClassNameOf } from "../../../utils.js";
import { GetAngleBetweenQuaternions, GetQuaternionFromDirections, GetQuaternionFromEulerAngles, GetQuaternionFromUpForward, GetVector2Slerp, GetVector3Slerp, QuaternionEulerAngleOrders, } from "../../../flowGraphMath.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
const AxisCacheName = "cachedOperationAxis";
const AngleCacheName = "cachedOperationAngle";
const CacheExecIdName = "cachedExecutionId";
/**
 * Vector length block.
 */
export class FlowGraphLengthBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeNumber, (a) => this._polymorphicLength(a), "FlowGraphLengthBlock" /* FlowGraphBlockNames.Length */, config);
    }
    _polymorphicLength(a) {
        const aClassName = _GetClassNameOf(a);
        switch (aClassName) {
            case "Vector2" /* FlowGraphTypes.Vector2 */:
            case "Vector3" /* FlowGraphTypes.Vector3 */:
            case "Vector4" /* FlowGraphTypes.Vector4 */:
            case "Quaternion" /* FlowGraphTypes.Quaternion */:
                return a.length();
            default:
                throw new Error(`Cannot compute length of value ${a}`);
        }
    }
}
/**
 * Vector normalize block.
 */
export class FlowGraphNormalizeBlock extends FlowGraphCachedOperationBlock {
    constructor(config) {
        super(RichTypeAny, config);
        this.a = this.registerDataInput("a", RichTypeAny);
    }
    _doOperation(context) {
        return this._polymorphicNormalize(this.a.getValue(context));
    }
    /**
     * A vector that cannot be normalized reports a vector of the same type with every component set
     * to zero, so the output stays type-consistent with the input instead of being left undefined.
     * @param context the graph context
     * @returns a zero vector matching the input's type
     */
    _getInvalidOutputValue(context) {
        const a = this.a.getValue(context);
        switch (_GetClassNameOf(a)) {
            case "Vector2" /* FlowGraphTypes.Vector2 */:
                return new Vector2(0, 0);
            case "Vector4" /* FlowGraphTypes.Vector4 */:
                return new Vector4(0, 0, 0, 0);
            case "Quaternion" /* FlowGraphTypes.Quaternion */:
                return new Quaternion(0, 0, 0, 0);
            default:
                return new Vector3(0, 0, 0);
        }
    }
    _polymorphicNormalize(a) {
        const aClassName = _GetClassNameOf(a);
        switch (aClassName) {
            case "Vector2" /* FlowGraphTypes.Vector2 */:
            case "Vector3" /* FlowGraphTypes.Vector3 */:
            case "Vector4" /* FlowGraphTypes.Vector4 */:
            case "Quaternion" /* FlowGraphTypes.Quaternion */: {
                // Normalization is only valid when the length is a positive finite number. For zero, NaN, or
                // +Infinity length the operation is invalid: returning undefined makes the cached base report
                // isValid = false and deliver a zero vector of the same type on `value`.
                const length = a.length();
                if (length === 0 || !Number.isFinite(length)) {
                    if (this.config?.nanOnZeroLength) {
                        // Legacy behavior preserved for consumers that opt into NaN output.
                        const nanVector = a.normalizeToNew();
                        nanVector.setAll(NaN);
                        return nanVector;
                    }
                    return undefined;
                }
                return a.normalizeToNew();
            }
            default:
                throw new Error(`Cannot normalize value ${a}`);
        }
    }
    getClassName() {
        return "FlowGraphNormalizeBlock" /* FlowGraphBlockNames.Normalize */;
    }
}
/**
 * Dot product block.
 */
export class FlowGraphDotBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeAny, RichTypeNumber, (a, b) => this._polymorphicDot(a, b), "FlowGraphDotBlock" /* FlowGraphBlockNames.Dot */, config);
    }
    _polymorphicDot(a, b) {
        const className = _GetClassNameOf(a);
        switch (className) {
            case "Vector2" /* FlowGraphTypes.Vector2 */:
            case "Vector3" /* FlowGraphTypes.Vector3 */:
            case "Vector4" /* FlowGraphTypes.Vector4 */:
            case "Quaternion" /* FlowGraphTypes.Quaternion */:
                // casting is needed because dot requires both to be the same type
                return a.dot(b);
            default:
                throw new Error(`Cannot get dot product of ${a} and ${b}`);
        }
    }
}
/**
 * Cross product block.
 */
export class FlowGraphCrossBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeVector3, RichTypeVector3, RichTypeVector3, (a, b) => Vector3.Cross(a, b), "FlowGraphCrossBlock" /* FlowGraphBlockNames.Cross */, config);
    }
}
/**
 * 2D rotation block.
 */
export class FlowGraphRotate2DBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeVector2, RichTypeNumber, RichTypeVector2, (a, b) => a.rotate(b), "FlowGraphRotate2DBlock" /* FlowGraphBlockNames.Rotate2D */, config);
    }
}
/**
 * 3D rotation block.
 */
export class FlowGraphRotate3DBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeVector3, RichTypeQuaternion, RichTypeVector3, (a, b) => a.applyRotationQuaternion(b), "FlowGraphRotate3DBlock" /* FlowGraphBlockNames.Rotate3D */, config);
    }
}
function TransformVector(a, b) {
    const className = _GetClassNameOf(a);
    switch (className) {
        case "Vector2" /* FlowGraphTypes.Vector2 */:
            return b.transformVector(a);
        case "Vector3" /* FlowGraphTypes.Vector3 */:
            return b.transformVector(a);
        case "Vector4" /* FlowGraphTypes.Vector4 */:
            a = a;
            // transform the vector 4 with the matrix here. Vector4.TransformCoordinates transforms a 3D coordinate, not Vector4.
            // Babylon's Matrix stores its elements column-major (m[0..3] is the first column), and the incoming
            // float4x4 values are column-major as well, so M * a reads down the columns: value[i] = sum_j M[i][j] * a[j]
            // with M[i][j] = m[j * 4 + i].
            return new Vector4(a.x * b.m[0] + a.y * b.m[4] + a.z * b.m[8] + a.w * b.m[12], a.x * b.m[1] + a.y * b.m[5] + a.z * b.m[9] + a.w * b.m[13], a.x * b.m[2] + a.y * b.m[6] + a.z * b.m[10] + a.w * b.m[14], a.x * b.m[3] + a.y * b.m[7] + a.z * b.m[11] + a.w * b.m[15]);
        default:
            throw new Error(`Cannot transform value ${a}`);
    }
}
/**
 * Transform a vector3 by a matrix.
 */
export class FlowGraphTransformBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        const vectorType = config?.vectorType || "Vector3" /* FlowGraphTypes.Vector3 */;
        const matrixType = vectorType === "Vector2" /* FlowGraphTypes.Vector2 */ ? "Matrix2D" /* FlowGraphTypes.Matrix2D */ : vectorType === "Vector3" /* FlowGraphTypes.Vector3 */ ? "Matrix3D" /* FlowGraphTypes.Matrix3D */ : "Matrix" /* FlowGraphTypes.Matrix */;
        super(getRichTypeByFlowGraphType(vectorType), getRichTypeByFlowGraphType(matrixType), getRichTypeByFlowGraphType(vectorType), TransformVector, "FlowGraphTransformVectorBlock" /* FlowGraphBlockNames.TransformVector */, config);
    }
}
/**
 * Transform a vector3 by a matrix.
 */
export class FlowGraphTransformCoordinatesBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeVector3, RichTypeMatrix, RichTypeVector3, (a, b) => Vector3.TransformCoordinates(a, b), "FlowGraphTransformCoordinatesBlock" /* FlowGraphBlockNames.TransformCoordinates */, config);
    }
}
/**
 * Conjugate the quaternion.
 */
export class FlowGraphConjugateBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeQuaternion, RichTypeQuaternion, (a) => a.conjugate(), "FlowGraphConjugateBlock" /* FlowGraphBlockNames.Conjugate */, config);
    }
}
/**
 * Get the angle between two quaternions.
 */
export class FlowGraphAngleBetweenBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeQuaternion, RichTypeQuaternion, RichTypeNumber, (a, b) => GetAngleBetweenQuaternions(a, b), "FlowGraphAngleBetweenBlock" /* FlowGraphBlockNames.AngleBetween */, config);
    }
}
/**
 * Get the quaternion from an axis and an angle.
 */
export class FlowGraphQuaternionFromAxisAngleBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeVector3, RichTypeNumber, RichTypeQuaternion, (a, b) => Quaternion.RotationAxis(a, b), "FlowGraphQuaternionFromAxisAngleBlock" /* FlowGraphBlockNames.QuaternionFromAxisAngle */, config);
    }
}
/**
 * Get the axis and angle from a quaternion.
 */
export class FlowGraphAxisAngleFromQuaternionBlock extends FlowGraphBlock {
    constructor(config) {
        super(config);
        this.a = this.registerDataInput("a", RichTypeQuaternion);
        this.axis = this.registerDataOutput("axis", RichTypeVector3);
        this.angle = this.registerDataOutput("angle", RichTypeNumber);
        this.isValid = this.registerDataOutput("isValid", RichTypeBoolean);
    }
    /** @override */
    _updateOutputs(context) {
        const cachedExecutionId = context._getExecutionVariable(this, CacheExecIdName, -1);
        const cachedAxis = context._getExecutionVariable(this, AxisCacheName, null);
        const cachedAngle = context._getExecutionVariable(this, AngleCacheName, null);
        if (cachedAxis !== undefined && cachedAxis !== null && cachedAngle !== undefined && cachedAngle !== null && cachedExecutionId === context.executionId) {
            this.axis.setValue(cachedAxis, context);
            this.angle.setValue(cachedAngle, context);
        }
        else {
            try {
                const { axis, angle } = this.a.getValue(context).toAxisAngle();
                context._setExecutionVariable(this, AxisCacheName, axis);
                context._setExecutionVariable(this, AngleCacheName, angle);
                context._setExecutionVariable(this, CacheExecIdName, context.executionId);
                this.axis.setValue(axis, context);
                this.angle.setValue(angle, context);
                this.isValid.setValue(true, context);
            }
            catch (e) {
                this.isValid.setValue(false, context);
            }
        }
    }
    /**
     * Gets the class name
     * @override
     * @returns the class name
     */
    getClassName() {
        return "FlowGraphAxisAngleFromQuaternionBlock" /* FlowGraphBlockNames.AxisAngleFromQuaternion */;
    }
}
/**
 * Get the quaternion from two direction vectors.
 */
export class FlowGraphQuaternionFromDirectionsBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeVector3, RichTypeVector3, RichTypeQuaternion, (a, b) => GetQuaternionFromDirections(a, b), "FlowGraphQuaternionFromDirectionsBlock" /* FlowGraphBlockNames.QuaternionFromDirections */, config);
    }
}
/**
 * Get a rotation quaternion from the specified up and forward directions.
 */
export class FlowGraphQuaternionFromUpForwardBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeVector3, RichTypeVector3, RichTypeQuaternion, (up, forward) => GetQuaternionFromUpForward(up, forward), "FlowGraphQuaternionFromUpForwardBlock" /* FlowGraphBlockNames.QuaternionFromUpForward */, config);
    }
}
/**
 * Spherical linear interpolation between two vectors.
 * Supports float2 and float3 vectors; the interpolation coefficient is a number.
 */
export class FlowGraphVectorSlerpBlock extends FlowGraphTernaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeAny, RichTypeNumber, RichTypeAny, (a, b, c) => this._polymorphicSlerp(a, b, c), "FlowGraphVectorSlerpBlock" /* FlowGraphBlockNames.VectorSlerp */, config);
    }
    _polymorphicSlerp(a, b, c) {
        const className = _GetClassNameOf(a);
        switch (className) {
            case "Vector2" /* FlowGraphTypes.Vector2 */:
                return GetVector2Slerp(a, b, c);
            case "Vector3" /* FlowGraphTypes.Vector3 */:
                return GetVector3Slerp(a, b, c);
            default:
                throw new Error(`Cannot slerp value ${a}`);
        }
    }
}
/**
 * Creates a rotation quaternion from three Tait–Bryan intrinsic Euler angles applied in a
 * configurable order.
 *
 * Inputs `a`, `b`, `c` are the rotations (in radians) around the X, Y and Z axes respectively.
 * The `order` configuration selects the intrinsic rotation order; NaN and infinite inputs
 * propagate into the resulting quaternion components.
 */
export class FlowGraphQuaternionFromAnglesBlock extends FlowGraphTernaryOperationBlock {
    constructor(config) {
        super(RichTypeNumber, RichTypeNumber, RichTypeNumber, RichTypeQuaternion, (a, b, c) => GetQuaternionFromEulerAngles(this._order, a, b, c), "FlowGraphQuaternionFromAnglesBlock" /* FlowGraphBlockNames.QuaternionFromAngles */, config);
        const order = config?.order;
        // A missing, non-string or unrecognized order falls back to the default `yxz`.
        this._order = typeof order === "string" && QuaternionEulerAngleOrders.indexOf(order) !== -1 ? order : "yxz";
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphVectorMathBlocks.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphVectorMathBlocks() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphLengthBlock" /* FlowGraphBlockNames.Length */, FlowGraphLengthBlock);
    RegisterClass("FlowGraphNormalizeBlock" /* FlowGraphBlockNames.Normalize */, FlowGraphNormalizeBlock);
    RegisterClass("FlowGraphDotBlock" /* FlowGraphBlockNames.Dot */, FlowGraphDotBlock);
    RegisterClass("FlowGraphCrossBlock" /* FlowGraphBlockNames.Cross */, FlowGraphCrossBlock);
    RegisterClass("FlowGraphRotate2DBlock" /* FlowGraphBlockNames.Rotate2D */, FlowGraphRotate2DBlock);
    RegisterClass("FlowGraphRotate3DBlock" /* FlowGraphBlockNames.Rotate3D */, FlowGraphRotate3DBlock);
    RegisterClass("FlowGraphTransformVectorBlock" /* FlowGraphBlockNames.TransformVector */, FlowGraphTransformBlock);
    RegisterClass("FlowGraphTransformCoordinatesBlock" /* FlowGraphBlockNames.TransformCoordinates */, FlowGraphTransformCoordinatesBlock);
    RegisterClass("FlowGraphConjugateBlock" /* FlowGraphBlockNames.Conjugate */, FlowGraphConjugateBlock);
    RegisterClass("FlowGraphAngleBetweenBlock" /* FlowGraphBlockNames.AngleBetween */, FlowGraphAngleBetweenBlock);
    RegisterClass("FlowGraphQuaternionFromAxisAngleBlock" /* FlowGraphBlockNames.QuaternionFromAxisAngle */, FlowGraphQuaternionFromAxisAngleBlock);
    RegisterClass("FlowGraphAxisAngleFromQuaternionBlock" /* FlowGraphBlockNames.AxisAngleFromQuaternion */, FlowGraphAxisAngleFromQuaternionBlock);
    RegisterClass("FlowGraphQuaternionFromDirectionsBlock" /* FlowGraphBlockNames.QuaternionFromDirections */, FlowGraphQuaternionFromDirectionsBlock);
    RegisterClass("FlowGraphQuaternionFromUpForwardBlock" /* FlowGraphBlockNames.QuaternionFromUpForward */, FlowGraphQuaternionFromUpForwardBlock);
    RegisterClass("FlowGraphQuaternionFromAnglesBlock" /* FlowGraphBlockNames.QuaternionFromAngles */, FlowGraphQuaternionFromAnglesBlock);
    RegisterClass("FlowGraphVectorSlerpBlock" /* FlowGraphBlockNames.VectorSlerp */, FlowGraphVectorSlerpBlock);
}
//# sourceMappingURL=flowGraphVectorMathBlocks.pure.js.map