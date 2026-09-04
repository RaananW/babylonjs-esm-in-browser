import { FlowGraphAsyncExecutionBlock } from "./flowGraphAsyncExecutionBlock.js";
/**
 * A type of block that listens to an event observable and activates
 * its output signal when the event is triggered.
 */
export class FlowGraphEventBlock extends FlowGraphAsyncExecutionBlock {
    /**
     * Creates a new event block.
     * @param config optional configuration
     */
    constructor(config) {
        super(config);
        /**
         * the priority of initialization of this block.
         * For example, scene start should have a negative priority because it should be initialized last.
         */
        this.initPriority = 0;
        /**
         * The type of the event
         */
        this.type = "NoTrigger" /* FlowGraphEventType.NoTrigger */;
        // Event blocks are driven by scene events, not by an incoming signal.
        // Remove the inherited `in` port so it is not shown in the editor UI
        // and cannot be accidentally wired.
        this._unregisterSignalInput("in");
    }
    /**
     * Deserializes from an object.
     * Filters out the legacy "in" signal input that existed before event blocks
     * stopped exposing it, so old serialized graphs load without error.
     * @param serializationObject the object to deserialize from
     */
    deserialize(serializationObject) {
        const filtered = { ...serializationObject };
        filtered.signalInputs = (serializationObject.signalInputs ?? []).filter((s) => s.name !== "in");
        super.deserialize(filtered);
    }
    /**
     * @internal
     */
    _execute(context) {
        context._notifyExecuteNode(this);
        // Fire both signals: KHR_interactivity graphs connect to `done`,
        // while editor-authored graphs typically connect to `out`.
        // Both must fire so that either wiring style works correctly.
        this.done._activateSignal(context);
        this.out._activateSignal(context);
    }
    /**
     * @internal
     * Override _startPendingTasks so that event blocks do NOT fire the
     * `out` signal at graph-start time.  The base FlowGraphAsyncExecutionBlock
     * fires `out` immediately in _startPendingTasks (useful for async blocks
     * like PlayAnimation that start a task and let sync flow continue).
     * Event blocks should only fire their output signals when the actual
     * event occurs, which is handled by _execute.
     */
    _startPendingTasks(context) {
        if (context._getExecutionVariable(this, "_initialized", false)) {
            this._cancelPendingTasks(context);
            this._resetAfterCanceled(context);
        }
        this._preparePendingTasks(context);
        context._addPendingBlock(this);
        // Do NOT fire out._activateSignal — event blocks fire both out and
        // done in _execute when the actual event triggers.
        context._setExecutionVariable(this, "_initialized", true);
    }
}
//# sourceMappingURL=flowGraphEventBlock.js.map