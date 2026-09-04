/** This file must only contain pure code and pure imports */
import { type IFlowGraphBlockConfiguration, FlowGraphBlock } from "../../../flowGraphBlock.js";
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { type FlowGraphNumber } from "../../../utils.js";
import { type Nullable } from "../../../../types.js";
/**
 * This simple Util block takes an array as input and selects a single element from it.
 */
export declare class FlowGraphArrayIndexBlock<T = any> extends FlowGraphBlock {
    config: IFlowGraphBlockConfiguration;
    /**
     * Input connection: The array to select from.
     */
    readonly array: FlowGraphDataConnection<T[]>;
    /**
     * Input connection: The index to select.
     */
    readonly index: FlowGraphDataConnection<FlowGraphNumber>;
    /**
     * Output connection: The selected element.
     */
    readonly value: FlowGraphDataConnection<Nullable<T>>;
    /**
     * Construct a FlowGraphArrayIndexBlock.
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
 * Register side effects for flowGraphArrayIndexBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphArrayIndexBlock(): void;
