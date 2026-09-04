/** This file must only contain pure code and pure imports */
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { type FlowGraphSignalConnection } from "../../../flowGraphSignalConnection.pure.js";
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
import { FlowGraphInteger } from "../../../CustomTypes/flowGraphInteger.pure.js";
/**
 * Configuration for the DoN block.
 */
export interface IFlowGraphDoNBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * The start index for the counter.
     */
    startIndex?: FlowGraphInteger;
}
/**
 * A block that executes a branch a set number of times.
 */
export declare class FlowGraphDoNBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * [Object] the configuration of the block
     */
    config: IFlowGraphDoNBlockConfiguration;
    /**
     * Input connection: Resets the counter
     */
    readonly reset: FlowGraphSignalConnection;
    /**
     * Input connection: The maximum number of times the block can be executed.
     */
    readonly maxExecutions: FlowGraphDataConnection<FlowGraphInteger>;
    /**
     * Output connection: The number of times the block has been executed.
     */
    readonly executionCount: FlowGraphDataConnection<FlowGraphInteger>;
    constructor(
    /**
     * [Object] the configuration of the block
     */
    config?: IFlowGraphDoNBlockConfiguration);
    _execute(context: FlowGraphContext, callingSignal: FlowGraphSignalConnection): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
/**
 * Register side effects for flowGraphDoNBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphDoNBlock(): void;
