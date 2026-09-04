import { type FlowGraphContext } from "../../flowGraphContext.js";
import { type RichType } from "../../flowGraphRichTypes.js";
import { type IFlowGraphBlockConfiguration } from "../../flowGraphBlock.js";
import { FlowGraphCachedOperationBlock } from "./flowGraphCachedOperationBlock.js";
/**
 * Block that outputs a value of type ResultT, resulting of an operation with no inputs.
 * This block is being extended by some math operations and should not be used directly.
 * @internal
 */
export declare class FlowGraphConstantOperationBlock<ResultT> extends FlowGraphCachedOperationBlock<ResultT> {
    private _operation;
    private _className;
    constructor(richType: RichType<ResultT>, _operation: (context: FlowGraphContext) => ResultT, _className: string, config?: IFlowGraphBlockConfiguration);
    /**
     * the operation performed by this block
     * @param context the graph context
     * @returns the result of the operation
     */
    _doOperation(context: FlowGraphContext): ResultT;
    /**
     * Gets the class name of this block
     * @returns the class name
     */
    getClassName(): string;
}
