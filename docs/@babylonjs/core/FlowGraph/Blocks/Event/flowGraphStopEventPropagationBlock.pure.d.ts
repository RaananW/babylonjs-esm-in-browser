/** This file must only contain pure code and pure imports */
import { FlowGraphExecutionBlockWithOutSignal } from "../../flowGraphExecutionBlockWithOutSignal.js";
import { type FlowGraphContext } from "../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../flowGraphDataConnection.pure.js";
import { type IFlowGraphBlockConfiguration } from "../../flowGraphBlock.js";
/**
 * Stops the propagation of an in-flight custom event.
 *
 * When activated it asks the coordinator to skip the remaining handler nodes of
 * the currently-dispatching event referenced by the `event` input, then activates
 * its `out` flow. If the `event` input is not a valid, currently-dispatching event
 * reference, activating this block only fires `out` with no other effect.
 */
export declare class FlowGraphStopEventPropagationBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * Input: the event reference (produced by an event operation's `event` output)
     * whose propagation should be stopped.
     */
    readonly event: FlowGraphDataConnection<string>;
    /**
     * Input: whether to also stop remaining immediate handlers. See
     * `FlowGraphCoordinator.stopEventPropagation` for how this maps onto the
     * Babylon single-Observable dispatch model.
     */
    readonly stopImmediate: FlowGraphDataConnection<boolean>;
    constructor(config?: IFlowGraphBlockConfiguration);
    _execute(context: FlowGraphContext): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
/**
 * Register side effects for flowGraphStopEventPropagationBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphStopEventPropagationBlock(): void;
