/** This file must only contain pure code and pure imports */
import { FlowGraphAsyncExecutionBlock } from "../../../flowGraphAsyncExecutionBlock.js";
import { type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { type FlowGraphSignalConnection } from "../../../flowGraphSignalConnection.pure.js";
import { FlowGraphInteger } from "../../../CustomTypes/flowGraphInteger.pure.js";
/**
 * Block that sets a delay in seconds before activating the output signal.
 */
export declare class FlowGraphSetDelayBlock extends FlowGraphAsyncExecutionBlock {
    /**
     * The maximum number of parallel delays that can be set per node.
     */
    static MaxParallelDelayCount: number;
    /**
     * Input signal: If activated the delayed activations set by this block will be canceled.
     */
    readonly cancel: FlowGraphSignalConnection;
    /**
     * Input connection: The duration of the delay in seconds.
     */
    readonly duration: FlowGraphDataConnection<number>;
    /**
     * Output connection: The last delay index that was set.
     */
    readonly lastDelayIndex: FlowGraphDataConnection<FlowGraphInteger>;
    constructor(config?: IFlowGraphBlockConfiguration);
    _preparePendingTasks(context: FlowGraphContext): void;
    _cancelPendingTasks(context: FlowGraphContext): void;
    _execute(context: FlowGraphContext, callingSignal: FlowGraphSignalConnection): void;
    getClassName(): string;
    private _onEnded;
    private _updateGlobalTimers;
}
/**
 * Register side effects for flowGraphSetDelayBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphSetDelayBlock(): void;
