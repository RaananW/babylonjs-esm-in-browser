import { FlowGraphCachedOperationBlock } from "./flowGraphCachedOperationBlock.js";
/**
 * Block that outputs a value of type ResultT, resulting of an operation with no inputs.
 * This block is being extended by some math operations and should not be used directly.
 * @internal
 */
export class FlowGraphConstantOperationBlock extends FlowGraphCachedOperationBlock {
    constructor(richType, _operation, _className, config) {
        super(richType, config);
        this._operation = _operation;
        this._className = _className;
    }
    /**
     * the operation performed by this block
     * @param context the graph context
     * @returns the result of the operation
     */
    _doOperation(context) {
        return this._operation(context);
    }
    /**
     * Gets the class name of this block
     * @returns the class name
     */
    getClassName() {
        return this._className;
    }
}
//# sourceMappingURL=flowGraphConstantOperationBlock.js.map