/** This file must only contain pure code and pure imports */
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { type FlowGraphSignalConnection } from "../../../flowGraphSignalConnection.pure.js";
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
/**
 * A block that throttles the execution of its output flow.
 */
export declare class FlowGraphThrottleBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * Input connection: The duration of the throttle, in seconds.
     */
    readonly duration: FlowGraphDataConnection<number>;
    /**
     * Input connection: Resets the throttle.
     */
    readonly reset: FlowGraphSignalConnection;
    /**
     * Output connection: The time remaining before the throttle is triggering again, in seconds.
     */
    readonly lastRemainingTime: FlowGraphDataConnection<number>;
    constructor(config?: IFlowGraphBlockConfiguration);
    _execute(context: FlowGraphContext, callingSignal: FlowGraphSignalConnection): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
/**
 * Register side effects for flowGraphThrottleBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphThrottleBlock(): void;
