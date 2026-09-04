/** This file must only contain pure code and pure imports */
import { type IFlowGraphBlockConfiguration, FlowGraphBlock } from "../../../flowGraphBlock.js";
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { FlowGraphInteger } from "../../../CustomTypes/flowGraphInteger.pure.js";
/**
 * This block takes an object as input and an array and returns the index of the object in the array.
 */
export declare class FlowGraphIndexOfBlock<T = any> extends FlowGraphBlock {
    config: IFlowGraphBlockConfiguration;
    /**
     * Input connection: The object to find in the array.
     */
    readonly object: FlowGraphDataConnection<T>;
    /**
     * Input connection: The array to search in.
     */
    readonly array: FlowGraphDataConnection<T[]>;
    /**
     * Output connection: The index of the object in the array.
     * -1 if not found!
     */
    readonly index: FlowGraphDataConnection<FlowGraphInteger>;
    /**
     * Construct a FlowGraphIndexOfBlock.
     * @param config construction parameters
     */
    constructor(config: IFlowGraphBlockConfiguration);
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
 * Register side effects for flowGraphIndexOfBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphIndexOfBlock(): void;
