import { type FlowGraphDataConnection } from "../../flowGraphDataConnection.js";
import { type IFlowGraphBlockConfiguration } from "../../flowGraphBlock.js";
import { type RichType } from "../../flowGraphRichTypes.js";
import { type FlowGraphContext } from "../../flowGraphContext.js";
import { FlowGraphCachedOperationBlock } from "./flowGraphCachedOperationBlock.js";
/**
 * @internal
 * The base block for all unary operation blocks. Receives an input of type InputT, and outputs a value of type ResultT.
 */
export declare class FlowGraphUnaryOperationBlock<InputT, ResultT> extends FlowGraphCachedOperationBlock<ResultT> {
    private _operation;
    private _className;
    /**
     * the input of this block
     */
    a: FlowGraphDataConnection<InputT>;
    constructor(inputRichType: RichType<InputT>, resultRichType: RichType<ResultT>, _operation: (input: InputT) => ResultT, _className: string, config?: IFlowGraphBlockConfiguration);
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
