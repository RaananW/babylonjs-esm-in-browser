import { type FlowGraphDataConnection } from "../../flowGraphDataConnection.js";
import { type RichType } from "../../flowGraphRichTypes.js";
import { type FlowGraphContext } from "../../flowGraphContext.js";
import { type IFlowGraphBlockConfiguration } from "../../flowGraphBlock.js";
import { FlowGraphCachedOperationBlock } from "./flowGraphCachedOperationBlock.js";
/**
 * The base block for all binary operation blocks. Receives an input of type
 * LeftT, one of type RightT, and outputs a value of type ResultT.
 */
export declare class FlowGraphBinaryOperationBlock<LeftT, RightT, ResultT> extends FlowGraphCachedOperationBlock<ResultT> {
    private _operation;
    private _className;
    /**
     * First input of this block
     */
    a: FlowGraphDataConnection<LeftT>;
    /**
     * Second input of this block
     */
    b: FlowGraphDataConnection<RightT>;
    constructor(leftRichType: RichType<LeftT>, rightRichType: RichType<RightT>, resultRichType: RichType<ResultT>, _operation: (left: LeftT, right: RightT) => ResultT, _className: string, config?: IFlowGraphBlockConfiguration);
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
