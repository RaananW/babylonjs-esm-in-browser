/** This file must only contain pure code and pure imports */
import { FlowGraphBlock } from "../../../flowGraphBlock.js";
import { getRichTypeByFlowGraphType, RichTypeBoolean, RichTypeMatrix, RichTypeNumber, RichTypeQuaternion, RichTypeVector3, } from "../../../flowGraphRichTypes.pure.js";
import { Matrix, Quaternion, Vector3 } from "../../../../Maths/math.vector.pure.js";
import { FlowGraphUnaryOperationBlock } from "../flowGraphUnaryOperationBlock.js";
import { FlowGraphCachedOperationBlock } from "../flowGraphCachedOperationBlock.js";
import { FlowGraphMatrix2D, FlowGraphMatrix3D } from "../../../CustomTypes/flowGraphMatrix.js";
import { FlowGraphBinaryOperationBlock } from "../flowGraphBinaryOperationBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Threshold below which the determinant of the normalized 3x3 of a matrix is treated as zero, indicating a
 * degenerate (non-decomposable) matrix whose columns are linearly dependent.
 */
const MatrixDecomposeDegenerateEpsilon = 1e-6;
/**
 * Builds a matrix of the given flow graph matrix type with every element set to zero.
 * @param matrixType the matrix type to build
 * @returns the zero matrix
 */
function CreateZeroMatrix(matrixType) {
    if (matrixType === "Matrix2D" /* FlowGraphTypes.Matrix2D */) {
        return new FlowGraphMatrix2D([0, 0, 0, 0]);
    }
    if (matrixType === "Matrix3D" /* FlowGraphTypes.Matrix3D */) {
        return new FlowGraphMatrix3D([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
    return Matrix.FromArray(new Array(16).fill(0));
}
/**
 * Transposes a matrix.
 */
export class FlowGraphTransposeBlock extends FlowGraphUnaryOperationBlock {
    /**
     * Creates a new instance of the block.
     * @param config the configuration of the block
     */
    constructor(config) {
        super(getRichTypeByFlowGraphType(config?.matrixType || "Matrix" /* FlowGraphTypes.Matrix */), getRichTypeByFlowGraphType(config?.matrixType || "Matrix" /* FlowGraphTypes.Matrix */), (a) => (a.transpose ? a.transpose() : Matrix.Transpose(a)), "FlowGraphTransposeBlock" /* FlowGraphBlockNames.Transpose */, config);
    }
}
/**
 * Gets the determinant of a matrix.
 */
export class FlowGraphDeterminantBlock extends FlowGraphUnaryOperationBlock {
    /**
     * Creates a new instance of the block.
     * @param config the configuration of the block
     */
    constructor(config) {
        super(getRichTypeByFlowGraphType(config?.matrixType || "Matrix" /* FlowGraphTypes.Matrix */), RichTypeNumber, (a) => a.determinant(), "FlowGraphDeterminantBlock" /* FlowGraphBlockNames.Determinant */, config);
    }
}
/**
 * Inverts a matrix.
 */
export class FlowGraphInvertMatrixBlock extends FlowGraphCachedOperationBlock {
    /**
     * Creates a new instance of the inverse block.
     * @param config the configuration of the block
     */
    constructor(config) {
        super(getRichTypeByFlowGraphType(config?.matrixType || "Matrix" /* FlowGraphTypes.Matrix */), config);
        this._matrixType = config?.matrixType || "Matrix" /* FlowGraphTypes.Matrix */;
        this.a = this.registerDataInput("a", getRichTypeByFlowGraphType(config?.matrixType || "Matrix" /* FlowGraphTypes.Matrix */));
    }
    _doOperation(context) {
        const a = this.a.getValue(context);
        // A matrix is only invertible when its determinant is a finite, non-zero number. For a zero, NaN, or
        // infinite determinant, returning undefined makes the cached base report isValid = false.
        const determinant = a.determinant();
        if (determinant === 0 || !Number.isFinite(determinant)) {
            return undefined;
        }
        return a.inverse ? a.inverse() : Matrix.Invert(a);
    }
    /**
     * A matrix with no inverse reports an all-zero matrix rather than the identity default of the
     * matrix type, so the output is not mistaken for a meaningful transform.
     * @returns a matrix of the block's type with every element set to zero
     */
    _getInvalidOutputValue() {
        return CreateZeroMatrix(this._matrixType);
    }
    getClassName() {
        return "FlowGraphInvertMatrixBlock" /* FlowGraphBlockNames.InvertMatrix */;
    }
}
/**
 * Multiplies two matrices.
 */
export class FlowGraphMatrixMultiplicationBlock extends FlowGraphBinaryOperationBlock {
    /**
     * Creates a new instance of the multiplication block.
     * Note - this is similar to the math multiplication if not using matrix per-component multiplication.
     * @param config the configuration of the block
     */
    constructor(config) {
        super(getRichTypeByFlowGraphType(config?.matrixType || "Matrix" /* FlowGraphTypes.Matrix */), getRichTypeByFlowGraphType(config?.matrixType || "Matrix" /* FlowGraphTypes.Matrix */), getRichTypeByFlowGraphType(config?.matrixType || "Matrix" /* FlowGraphTypes.Matrix */), (a, b) => b.multiply(a), "FlowGraphMatrixMultiplicationBlock" /* FlowGraphBlockNames.MatrixMultiplication */, config);
    }
}
/**
 * Matrix decompose block
 */
export class FlowGraphMatrixDecomposeBlock extends FlowGraphBlock {
    constructor(config) {
        super(config);
        this.input = this.registerDataInput("input", RichTypeMatrix);
        this.position = this.registerDataOutput("position", RichTypeVector3);
        this.rotationQuaternion = this.registerDataOutput("rotationQuaternion", RichTypeQuaternion);
        this.scaling = this.registerDataOutput("scaling", RichTypeVector3);
        this.isValid = this.registerDataOutput("isValid", RichTypeBoolean, false);
    }
    _updateOutputs(context) {
        // _updateOutputs runs on every read of any of this block's four outputs. Cache the decomposition
        // per executionId (matching FlowGraphMatrixComposeBlock below) so reading all four outputs in one
        // frame does the work once instead of four times.
        const cachedExecutionId = context._getExecutionVariable(this, "executionId", -1);
        const cachedPosition = context._getExecutionVariable(this, "cachedPosition", null);
        const cachedRotation = context._getExecutionVariable(this, "cachedRotation", null);
        const cachedScaling = context._getExecutionVariable(this, "cachedScaling", null);
        const cachedIsValid = context._getExecutionVariable(this, "cachedIsValid", null);
        if (cachedExecutionId === context.executionId && cachedPosition && cachedRotation && cachedScaling && cachedIsValid !== null) {
            this.isValid.setValue(cachedIsValid, context);
            this.position.setValue(cachedPosition, context);
            this.rotationQuaternion.setValue(cachedRotation, context);
            this.scaling.setValue(cachedScaling, context);
            return;
        }
        const matrix = this.input.getValue(context);
        const m = matrix.m;
        const keepDegenerateComponents = !!this.config?.keepDegenerateComponents;
        // The fourth row of the matrix is ignored: the translation comes from the first three elements of the
        // fourth column, the scale from the lengths of the first three columns of the upper-left 3x3, and the
        // rotation from that 3x3 once normalized.
        const translation = new Vector3(m[12], m[13], m[14]);
        const scaleX = Math.sqrt(m[0] * m[0] + m[1] * m[1] + m[2] * m[2]);
        const scaleY = Math.sqrt(m[4] * m[4] + m[5] * m[5] + m[6] * m[6]);
        const scaleZ = Math.sqrt(m[8] * m[8] + m[9] * m[9] + m[10] * m[10]);
        // The matrix cannot be decomposed: the rotation is undefined, so report an identity rotation and either the
        // components that were extracted from the matrix or the type defaults.
        const degenerateOutputs = (keepComponents) => ({
            isValid: false,
            rotationQuaternion: Quaternion.Identity(),
            position: keepComponents ? translation : Vector3.Zero(),
            scaling: keepComponents ? new Vector3(scaleX, scaleY, scaleZ) : Vector3.One(),
        });
        let result;
        const areScalesFinite = Number.isFinite(scaleX) && Number.isFinite(scaleY) && Number.isFinite(scaleZ);
        const isTranslationFinite = Number.isFinite(m[12]) && Number.isFinite(m[13]) && Number.isFinite(m[14]);
        if (!areScalesFinite || (!keepDegenerateComponents && !isTranslationFinite)) {
            result = degenerateOutputs(keepDegenerateComponents);
        }
        else if (scaleX === 0 || scaleY === 0 || scaleZ === 0) {
            // A zero scale component leaves the rotation undefined, but the translation and the (degenerate) scale
            // are still well-defined, so they are reported as-is.
            result = degenerateOutputs(true);
        }
        else {
            // The determinant of the upper-left 3x3 (the fourth row is ignored) gives the handedness; dividing by the
            // product of the scales yields the determinant of the normalized 3x3, which is (close to) zero only when the
            // columns are linearly dependent — a degenerate matrix that cannot represent a rotation.
            const determinant = m[0] * (m[5] * m[10] - m[6] * m[9]) - m[4] * (m[1] * m[10] - m[2] * m[9]) + m[8] * (m[1] * m[6] - m[2] * m[5]);
            const normalizedDeterminant = determinant / (scaleX * scaleY * scaleZ);
            if (Math.abs(normalizedDeterminant) < MatrixDecomposeDegenerateEpsilon) {
                result = degenerateOutputs(keepDegenerateComponents);
            }
            else {
                // The remaining matrix is well-formed, so the actual translation/rotation/scale extraction is delegated
                // to the shared Matrix.decompose. That keeps the rotation and the handedness-sign convention identical to
                // the rest of Babylon (a left-handed matrix negates the same scale component everywhere). The fourth row is
                // reset to (0, 0, 0, 1) first because this operation ignores it, whereas Matrix.decompose's internal
                // determinant would otherwise let a non-standard fourth row flip the handedness.
                const normalized = Matrix.FromValues(m[0], m[1], m[2], 0, m[4], m[5], m[6], 0, m[8], m[9], m[10], 0, m[12], m[13], m[14], 1);
                const outScaling = new Vector3();
                const outRotation = new Quaternion();
                const outPosition = new Vector3();
                normalized.decompose(outScaling, outRotation, outPosition);
                result = { isValid: true, position: outPosition, rotationQuaternion: outRotation, scaling: outScaling };
            }
        }
        this.isValid.setValue(result.isValid, context);
        this.position.setValue(result.position, context);
        this.rotationQuaternion.setValue(result.rotationQuaternion, context);
        this.scaling.setValue(result.scaling, context);
        context._setExecutionVariable(this, "cachedIsValid", result.isValid);
        context._setExecutionVariable(this, "cachedPosition", result.position);
        context._setExecutionVariable(this, "cachedRotation", result.rotationQuaternion);
        context._setExecutionVariable(this, "cachedScaling", result.scaling);
        context._setExecutionVariable(this, "executionId", context.executionId);
    }
    getClassName() {
        return "FlowGraphMatrixDecompose" /* FlowGraphBlockNames.MatrixDecompose */;
    }
}
/**
 * Matrix compose block
 */
export class FlowGraphMatrixComposeBlock extends FlowGraphBlock {
    constructor(config) {
        super(config);
        this.position = this.registerDataInput("position", RichTypeVector3);
        this.rotationQuaternion = this.registerDataInput("rotationQuaternion", RichTypeQuaternion);
        this.scaling = this.registerDataInput("scaling", RichTypeVector3);
        this.value = this.registerDataOutput("value", RichTypeMatrix);
    }
    _updateOutputs(context) {
        const cachedExecutionId = context._getExecutionVariable(this, "executionId", -1);
        const cachedMatrix = context._getExecutionVariable(this, "cachedMatrix", null);
        if (cachedExecutionId === context.executionId && cachedMatrix) {
            this.value.setValue(cachedMatrix, context);
        }
        else {
            const matrix = Matrix.Compose(this.scaling.getValue(context), this.rotationQuaternion.getValue(context), this.position.getValue(context));
            this.value.setValue(matrix, context);
            context._setExecutionVariable(this, "cachedMatrix", matrix);
            context._setExecutionVariable(this, "executionId", context.executionId);
        }
    }
    getClassName() {
        return "FlowGraphMatrixCompose" /* FlowGraphBlockNames.MatrixCompose */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphMatrixMathBlocks.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphMatrixMathBlocks() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphTransposeBlock" /* FlowGraphBlockNames.Transpose */, FlowGraphTransposeBlock);
    RegisterClass("FlowGraphDeterminantBlock" /* FlowGraphBlockNames.Determinant */, FlowGraphDeterminantBlock);
    RegisterClass("FlowGraphInvertMatrixBlock" /* FlowGraphBlockNames.InvertMatrix */, FlowGraphInvertMatrixBlock);
    RegisterClass("FlowGraphMatrixMultiplicationBlock" /* FlowGraphBlockNames.MatrixMultiplication */, FlowGraphMatrixMultiplicationBlock);
    RegisterClass("FlowGraphMatrixDecompose" /* FlowGraphBlockNames.MatrixDecompose */, FlowGraphMatrixDecomposeBlock);
    RegisterClass("FlowGraphMatrixCompose" /* FlowGraphBlockNames.MatrixCompose */, FlowGraphMatrixComposeBlock);
}
//# sourceMappingURL=flowGraphMatrixMathBlocks.pure.js.map