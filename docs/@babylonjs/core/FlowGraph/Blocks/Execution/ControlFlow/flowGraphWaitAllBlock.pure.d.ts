/** This file must only contain pure code and pure imports */
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphSignalConnection } from "../../../flowGraphSignalConnection.pure.js";
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { FlowGraphInteger } from "../../../CustomTypes/flowGraphInteger.pure.js";
/**
 * Configuration for the wait all block.
 */
export interface IFlowGraphWaitAllBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * The number of input signals. There will always be at least one input flow.
     * glTF interactivity has a max of 64 input flows.
     */
    inputSignalCount: number;
}
/**
 * A block that waits for all input flows to be activated before activating its output flow.
 */
export declare class FlowGraphWaitAllBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * the configuration of the block
     */
    config: IFlowGraphWaitAllBlockConfiguration;
    /**
     * Input connection: Resets the block.
     */
    reset: FlowGraphSignalConnection;
    /**
     * Output connection:When the last missing flow is activated
     */
    completed: FlowGraphSignalConnection;
    /**
     * Output connection: The number of remaining inputs to be activated.
     */
    remainingInputs: FlowGraphDataConnection<FlowGraphInteger>;
    /**
     * An array of input signals
     */
    readonly inFlows: FlowGraphSignalConnection[];
    private _cachedActivationState;
    constructor(
    /**
     * the configuration of the block
     */
    config: IFlowGraphWaitAllBlockConfiguration);
    private _getCurrentActivationState;
    _execute(context: FlowGraphContext, callingSignal: FlowGraphSignalConnection): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
    /**
     * Serializes this block into a object
     * @param serializationObject the object to serialize to
     */
    serialize(serializationObject?: any): void;
}
/**
 * Register side effects for flowGraphWaitAllBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphWaitAllBlock(): void;
