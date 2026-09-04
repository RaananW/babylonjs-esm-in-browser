/** This file must only contain pure code and pure imports */
import { FlowGraphCachedOperationBlock } from "../flowGraphCachedOperationBlock.js";
import { RichTypeMatrix, RichTypeMatrix2D, RichTypeMatrix3D, RichTypeNumber, RichTypeVector2, RichTypeVector3, RichTypeVector4, } from "../../../flowGraphRichTypes.pure.js";
import { FlowGraphBlock } from "../../../flowGraphBlock.js";
import { Matrix, Vector2, Vector3, Vector4 } from "../../../../Maths/math.vector.pure.js";
import { FlowGraphMatrix2D, FlowGraphMatrix3D } from "../../../CustomTypes/flowGraphMatrix.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
class FlowGraphMathCombineBlock extends FlowGraphCachedOperationBlock {
    /**
     * Base class for blocks that combine multiple numeric inputs into a single result.
     * Handles registering data inputs and managing cached outputs.
     * @param numberOfInputs The number of input values to combine.
     * @param type The type of the result.
     * @param config The block configuration.
     */
    constructor(numberOfInputs, type, config) {
        super(type, config);
        for (let i = 0; i < numberOfInputs; i++) {
            this.registerDataInput(`input_${i}`, RichTypeNumber, 0);
        }
    }
}
/**
 * Abstract class representing a flow graph block that extracts multiple outputs from a single input.
 */
class FlowGraphMathExtractBlock extends FlowGraphBlock {
    /**
     * Creates an instance of FlowGraphMathExtractBlock.
     *
     * @param numberOfOutputs - The number of outputs to be extracted from the input.
     * @param type - The type of the input data.
     * @param config - Optional configuration for the flow graph block.
     */
    constructor(numberOfOutputs, type, config) {
        super(config);
        this.registerDataInput("input", type);
        for (let i = 0; i < numberOfOutputs; i++) {
            this.registerDataOutput(`output_${i}`, RichTypeNumber, 0);
        }
    }
}
/**
 * Combines two floats into a new Vector2
 */
export class FlowGraphCombineVector2Block extends FlowGraphMathCombineBlock {
    constructor(config) {
        super(2, RichTypeVector2, config);
    }
    /**
     * @internal
     * Combines two floats into a new Vector2
     */
    _doOperation(context) {
        if (!context._hasExecutionVariable(this, "cachedVector")) {
            context._setExecutionVariable(this, "cachedVector", new Vector2());
        }
        const vector = context._getExecutionVariable(this, "cachedVector", null);
        vector.set(this.getDataInput("input_0").getValue(context), this.getDataInput("input_1").getValue(context));
        return vector;
    }
    getClassName() {
        return "FlowGraphCombineVector2Block" /* FlowGraphBlockNames.CombineVector2 */;
    }
}
/**
 * Combines three floats into a new Vector3
 */
export class FlowGraphCombineVector3Block extends FlowGraphMathCombineBlock {
    constructor(config) {
        super(3, RichTypeVector3, config);
    }
    _doOperation(context) {
        if (!context._hasExecutionVariable(this, "cachedVector")) {
            context._setExecutionVariable(this, "cachedVector", new Vector3());
        }
        const vector = context._getExecutionVariable(this, "cachedVector", null);
        vector.set(this.getDataInput("input_0").getValue(context), this.getDataInput("input_1").getValue(context), this.getDataInput("input_2").getValue(context));
        return vector;
    }
    getClassName() {
        return "FlowGraphCombineVector3Block" /* FlowGraphBlockNames.CombineVector3 */;
    }
}
/**
 * Combines four floats into a new Vector4
 */
export class FlowGraphCombineVector4Block extends FlowGraphMathCombineBlock {
    constructor(config) {
        super(4, RichTypeVector4, config);
    }
    _doOperation(context) {
        if (!context._hasExecutionVariable(this, "cachedVector")) {
            context._setExecutionVariable(this, "cachedVector", new Vector4());
        }
        const vector = context._getExecutionVariable(this, "cachedVector", null);
        vector.set(this.getDataInput("input_0").getValue(context), this.getDataInput("input_1").getValue(context), this.getDataInput("input_2").getValue(context), this.getDataInput("input_3").getValue(context));
        return vector;
    }
    getClassName() {
        return "FlowGraphCombineVector4Block" /* FlowGraphBlockNames.CombineVector4 */;
    }
}
/**
 * Combines 16 floats into a new Matrix.
 *
 * The inputs are in column-major order, matching Babylon's {@link Matrix} storage and the order used
 * by `Matrix.FromArray`, `Matrix.FromValues` and {@link FlowGraphExtractMatrixBlock}, so combining
 * and extracting round-trip.
 */
export class FlowGraphCombineMatrixBlock extends FlowGraphMathCombineBlock {
    constructor(config) {
        super(16, RichTypeMatrix, config);
    }
    _doOperation(context) {
        if (!context._hasExecutionVariable(this, "cachedMatrix")) {
            context._setExecutionVariable(this, "cachedMatrix", new Matrix());
        }
        const matrix = context._getExecutionVariable(this, "cachedMatrix", null);
        if (this.config?.inputIsColumnMajor === false) {
            // Legacy row-major input: transpose into the matrix's column-major storage.
            matrix.set(this.getDataInput("input_0").getValue(context), this.getDataInput("input_4").getValue(context), this.getDataInput("input_8").getValue(context), this.getDataInput("input_12").getValue(context), this.getDataInput("input_1").getValue(context), this.getDataInput("input_5").getValue(context), this.getDataInput("input_9").getValue(context), this.getDataInput("input_13").getValue(context), this.getDataInput("input_2").getValue(context), this.getDataInput("input_6").getValue(context), this.getDataInput("input_10").getValue(context), this.getDataInput("input_14").getValue(context), this.getDataInput("input_3").getValue(context), this.getDataInput("input_7").getValue(context), this.getDataInput("input_11").getValue(context), this.getDataInput("input_15").getValue(context));
            return matrix;
        }
        matrix.set(this.getDataInput("input_0").getValue(context), this.getDataInput("input_1").getValue(context), this.getDataInput("input_2").getValue(context), this.getDataInput("input_3").getValue(context), this.getDataInput("input_4").getValue(context), this.getDataInput("input_5").getValue(context), this.getDataInput("input_6").getValue(context), this.getDataInput("input_7").getValue(context), this.getDataInput("input_8").getValue(context), this.getDataInput("input_9").getValue(context), this.getDataInput("input_10").getValue(context), this.getDataInput("input_11").getValue(context), this.getDataInput("input_12").getValue(context), this.getDataInput("input_13").getValue(context), this.getDataInput("input_14").getValue(context), this.getDataInput("input_15").getValue(context));
        return matrix;
    }
    getClassName() {
        return "FlowGraphCombineMatrixBlock" /* FlowGraphBlockNames.CombineMatrix */;
    }
}
/**
 * Combines 4 floats into a new Matrix2D, in column-major order.
 */
export class FlowGraphCombineMatrix2DBlock extends FlowGraphMathCombineBlock {
    constructor(config) {
        super(4, RichTypeMatrix2D, config);
    }
    _doOperation(context) {
        if (!context._hasExecutionVariable(this, "cachedMatrix")) {
            context._setExecutionVariable(this, "cachedMatrix", new FlowGraphMatrix2D());
        }
        const matrix = context._getExecutionVariable(this, "cachedMatrix", null);
        const columnMajor = this.config?.inputIsColumnMajor !== false;
        matrix.fromArray(columnMajor
            ? [
                this.getDataInput("input_0").getValue(context),
                this.getDataInput("input_1").getValue(context),
                this.getDataInput("input_2").getValue(context),
                this.getDataInput("input_3").getValue(context),
            ]
            : [
                // Legacy row-major input, transposed into column-major storage.
                this.getDataInput("input_0").getValue(context),
                this.getDataInput("input_2").getValue(context),
                this.getDataInput("input_1").getValue(context),
                this.getDataInput("input_3").getValue(context),
            ]);
        return matrix;
    }
    getClassName() {
        return "FlowGraphCombineMatrix2DBlock" /* FlowGraphBlockNames.CombineMatrix2D */;
    }
}
/**
 * Combines 9 floats into a new Matrix3D, in column-major order.
 */
export class FlowGraphCombineMatrix3DBlock extends FlowGraphMathCombineBlock {
    constructor(config) {
        super(9, RichTypeMatrix3D, config);
    }
    _doOperation(context) {
        if (!context._hasExecutionVariable(this, "cachedMatrix")) {
            context._setExecutionVariable(this, "cachedMatrix", new FlowGraphMatrix3D());
        }
        const matrix = context._getExecutionVariable(this, "cachedMatrix", null);
        const columnMajor = this.config?.inputIsColumnMajor !== false;
        matrix.fromArray(columnMajor
            ? [
                this.getDataInput("input_0").getValue(context),
                this.getDataInput("input_1").getValue(context),
                this.getDataInput("input_2").getValue(context),
                this.getDataInput("input_3").getValue(context),
                this.getDataInput("input_4").getValue(context),
                this.getDataInput("input_5").getValue(context),
                this.getDataInput("input_6").getValue(context),
                this.getDataInput("input_7").getValue(context),
                this.getDataInput("input_8").getValue(context),
            ]
            : [
                // Legacy row-major input, transposed into column-major storage.
                this.getDataInput("input_0").getValue(context),
                this.getDataInput("input_3").getValue(context),
                this.getDataInput("input_6").getValue(context),
                this.getDataInput("input_1").getValue(context),
                this.getDataInput("input_4").getValue(context),
                this.getDataInput("input_7").getValue(context),
                this.getDataInput("input_2").getValue(context),
                this.getDataInput("input_5").getValue(context),
                this.getDataInput("input_8").getValue(context),
            ]);
        return matrix;
    }
    getClassName() {
        return "FlowGraphCombineMatrix3DBlock" /* FlowGraphBlockNames.CombineMatrix3D */;
    }
}
/**
 * Extracts two floats from a Vector2
 */
export class FlowGraphExtractVector2Block extends FlowGraphMathExtractBlock {
    constructor(config) {
        super(2, RichTypeVector2, config);
    }
    _updateOutputs(context) {
        let input = this.getDataInput("input")?.getValue(context);
        if (!input) {
            input = Vector2.Zero();
            this.getDataInput("input").setValue(input, context);
        }
        this.getDataOutput("output_0").setValue(input.x, context);
        this.getDataOutput("output_1").setValue(input.y, context);
    }
    getClassName() {
        return "FlowGraphExtractVector2Block" /* FlowGraphBlockNames.ExtractVector2 */;
    }
}
/**
 * Extracts three floats from a Vector3
 */
export class FlowGraphExtractVector3Block extends FlowGraphMathExtractBlock {
    constructor(config) {
        super(3, RichTypeVector3, config);
    }
    _updateOutputs(context) {
        let input = this.getDataInput("input")?.getValue(context);
        if (!input) {
            input = Vector3.Zero();
            this.getDataInput("input").setValue(input, context);
        }
        this.getDataOutput("output_0").setValue(input.x, context);
        this.getDataOutput("output_1").setValue(input.y, context);
        this.getDataOutput("output_2").setValue(input.z, context);
    }
    getClassName() {
        return "FlowGraphExtractVector3Block" /* FlowGraphBlockNames.ExtractVector3 */;
    }
}
/**
 * Extracts four floats from a Vector4
 */
export class FlowGraphExtractVector4Block extends FlowGraphMathExtractBlock {
    constructor(config) {
        super(4, RichTypeVector4, config);
    }
    _updateOutputs(context) {
        let input = this.getDataInput("input")?.getValue(context);
        if (!input) {
            input = Vector4.Zero();
            this.getDataInput("input").setValue(input, context);
        }
        this.getDataOutput("output_0").setValue(input.x, context);
        this.getDataOutput("output_1").setValue(input.y, context);
        this.getDataOutput("output_2").setValue(input.z, context);
        this.getDataOutput("output_3").setValue(input.w, context);
    }
    getClassName() {
        return "FlowGraphExtractVector4Block" /* FlowGraphBlockNames.ExtractVector4 */;
    }
}
/**
 * Extracts 16 floats from a Matrix
 */
export class FlowGraphExtractMatrixBlock extends FlowGraphMathExtractBlock {
    constructor(config) {
        super(16, RichTypeMatrix, config);
    }
    _updateOutputs(context) {
        let input = this.getDataInput("input")?.getValue(context);
        if (!input) {
            input = Matrix.Identity();
            this.getDataInput("input").setValue(input, context);
        }
        for (let i = 0; i < 16; i++) {
            this.getDataOutput(`output_${i}`).setValue(input.m[i], context);
        }
    }
    getClassName() {
        return "FlowGraphExtractMatrixBlock" /* FlowGraphBlockNames.ExtractMatrix */;
    }
}
/**
 * Extracts 4 floats from a Matrix2D
 */
export class FlowGraphExtractMatrix2DBlock extends FlowGraphMathExtractBlock {
    constructor(config) {
        super(4, RichTypeMatrix2D, config);
    }
    _updateOutputs(context) {
        let input = this.getDataInput("input")?.getValue(context);
        if (!input) {
            input = new FlowGraphMatrix2D();
            this.getDataInput("input").setValue(input, context);
        }
        for (let i = 0; i < 4; i++) {
            this.getDataOutput(`output_${i}`).setValue(input.m[i], context);
        }
    }
    getClassName() {
        return "FlowGraphExtractMatrix2DBlock" /* FlowGraphBlockNames.ExtractMatrix2D */;
    }
}
/**
 * Extracts 4 floats from a Matrix2D
 */
export class FlowGraphExtractMatrix3DBlock extends FlowGraphMathExtractBlock {
    constructor(config) {
        super(9, RichTypeMatrix3D, config);
    }
    _updateOutputs(context) {
        let input = this.getDataInput("input")?.getValue(context);
        if (!input) {
            input = new FlowGraphMatrix3D();
            this.getDataInput("input").setValue(input, context);
        }
        for (let i = 0; i < 9; i++) {
            this.getDataOutput(`output_${i}`).setValue(input.m[i], context);
        }
    }
    getClassName() {
        return "FlowGraphExtractMatrix3DBlock" /* FlowGraphBlockNames.ExtractMatrix3D */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphMathCombineExtractBlocks.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphMathCombineExtractBlocks() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphCombineVector2Block" /* FlowGraphBlockNames.CombineVector2 */, FlowGraphCombineVector2Block);
    RegisterClass("FlowGraphCombineVector3Block" /* FlowGraphBlockNames.CombineVector3 */, FlowGraphCombineVector3Block);
    RegisterClass("FlowGraphCombineVector4Block" /* FlowGraphBlockNames.CombineVector4 */, FlowGraphCombineVector4Block);
    RegisterClass("FlowGraphCombineMatrixBlock" /* FlowGraphBlockNames.CombineMatrix */, FlowGraphCombineMatrixBlock);
    RegisterClass("FlowGraphCombineMatrix2DBlock" /* FlowGraphBlockNames.CombineMatrix2D */, FlowGraphCombineMatrix2DBlock);
    RegisterClass("FlowGraphCombineMatrix3DBlock" /* FlowGraphBlockNames.CombineMatrix3D */, FlowGraphCombineMatrix3DBlock);
    RegisterClass("FlowGraphExtractVector2Block" /* FlowGraphBlockNames.ExtractVector2 */, FlowGraphExtractVector2Block);
    RegisterClass("FlowGraphExtractVector3Block" /* FlowGraphBlockNames.ExtractVector3 */, FlowGraphExtractVector3Block);
    RegisterClass("FlowGraphExtractVector4Block" /* FlowGraphBlockNames.ExtractVector4 */, FlowGraphExtractVector4Block);
    RegisterClass("FlowGraphExtractMatrixBlock" /* FlowGraphBlockNames.ExtractMatrix */, FlowGraphExtractMatrixBlock);
    RegisterClass("FlowGraphExtractMatrix2DBlock" /* FlowGraphBlockNames.ExtractMatrix2D */, FlowGraphExtractMatrix2DBlock);
    RegisterClass("FlowGraphExtractMatrix3DBlock" /* FlowGraphBlockNames.ExtractMatrix3D */, FlowGraphExtractMatrix3DBlock);
}
//# sourceMappingURL=flowGraphMathCombineExtractBlocks.pure.js.map