/** This file must only contain pure code and pure imports */
import { type IFlowGraphBlockConfiguration } from "../../flowGraphBlock.js";
import { type FlowGraphContext } from "../../flowGraphContext.js";
import { FlowGraphExecutionBlockWithOutSignal } from "../../flowGraphExecutionBlockWithOutSignal.js";
import { type FlowGraphSignalConnection } from "../../flowGraphSignalConnection.pure.js";
/**
 * The configuration of the FlowGraphGetVariableBlock.
 */
export interface IFlowGraphSetVariableBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * The name of the variable to set.
     */
    variable?: string;
    /**
     * The name of the variables to set.
     */
    variables?: string[];
}
/**
 * This block will set a variable on the context.
 */
export declare class FlowGraphSetVariableBlock<T> extends FlowGraphExecutionBlockWithOutSignal {
    constructor(config: IFlowGraphSetVariableBlockConfiguration);
    _execute(context: FlowGraphContext, _callingSignal: FlowGraphSignalConnection): void;
    private _saveVariable;
    getClassName(): string;
    serialize(serializationObject?: any): void;
}
/**
 * Register side effects for flowGraphSetVariableBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphSetVariableBlock(): void;
