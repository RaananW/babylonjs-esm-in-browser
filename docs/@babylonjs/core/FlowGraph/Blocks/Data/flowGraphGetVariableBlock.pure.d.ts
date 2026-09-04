/** This file must only contain pure code and pure imports */
import { type FlowGraphContext } from "../../flowGraphContext.js";
import { type IFlowGraphBlockConfiguration, FlowGraphBlock } from "../../flowGraphBlock.js";
import { type FlowGraphDataConnection } from "../../flowGraphDataConnection.pure.js";
/**
 * The configuration of the FlowGraphGetVariableBlock.
 */
export interface IFlowGraphGetVariableBlockConfiguration<T> extends IFlowGraphBlockConfiguration {
    /**
     * The name of the variable to get.
     */
    variable: string;
    /**
     * The initial value of the variable.
     */
    initialValue?: T;
}
/**
 * A block that gets the value of a variable.
 * Variables are an stored in the context of the flow graph.
 */
export declare class FlowGraphGetVariableBlock<T> extends FlowGraphBlock {
    config: IFlowGraphGetVariableBlockConfiguration<T>;
    /**
     * Output connection: The value of the variable.
     */
    readonly value: FlowGraphDataConnection<T>;
    /**
     * Construct a FlowGraphGetVariableBlock.
     * @param config construction parameters
     */
    constructor(config: IFlowGraphGetVariableBlockConfiguration<T>);
    /**
     * @internal
     */
    _updateOutputs(context: FlowGraphContext): void;
    /**
     * Serializes this block
     * @param serializationObject the object to serialize to
     */
    serialize(serializationObject?: any): void;
    getClassName(): string;
}
/**
 * Register side effects for flowGraphGetVariableBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphGetVariableBlock(): void;
