import { FlowGraphAsyncExecutionBlock } from "./flowGraphAsyncExecutionBlock.js";
import { type IFlowGraphBlockConfiguration } from "./flowGraphBlock.js";
import { type FlowGraphContext } from "./flowGraphContext.js";
import { FlowGraphEventType } from "./flowGraphEventType.js";
/**
 * A type of block that listens to an event observable and activates
 * its output signal when the event is triggered.
 */
export declare abstract class FlowGraphEventBlock extends FlowGraphAsyncExecutionBlock {
    /**
     * the priority of initialization of this block.
     * For example, scene start should have a negative priority because it should be initialized last.
     */
    initPriority: number;
    /**
     * Creates a new event block.
     * @param config optional configuration
     */
    constructor(config?: IFlowGraphBlockConfiguration);
    /**
     * Deserializes from an object.
     * Filters out the legacy "in" signal input that existed before event blocks
     * stopped exposing it, so old serialized graphs load without error.
     * @param serializationObject the object to deserialize from
     */
    deserialize(serializationObject: any): void;
    /**
     * The type of the event
     */
    readonly type: FlowGraphEventType;
    /**
     * @internal
     */
    _execute(context: FlowGraphContext): void;
    /**
     * @internal
     * Override _startPendingTasks so that event blocks do NOT fire the
     * `out` signal at graph-start time.  The base FlowGraphAsyncExecutionBlock
     * fires `out` immediately in _startPendingTasks (useful for async blocks
     * like PlayAnimation that start a task and let sync flow continue).
     * Event blocks should only fire their output signals when the actual
     * event occurs, which is handled by _execute.
     */
    _startPendingTasks(context: FlowGraphContext): void;
    /**
     * Execute the event. This function should be called by the flow graph when the event is triggered.
     * @param context the context in which the event is executed
     * @param payload the payload of the event
     * @returns a boolean indicating if the event should stop propagation. if false, the event will stop propagating.
     */
    abstract _executeEvent(context: FlowGraphContext, payload: any): boolean;
}
