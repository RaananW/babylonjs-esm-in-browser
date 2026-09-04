import { FlowGraphExecutionBlockWithOutSignal } from "./flowGraphExecutionBlockWithOutSignal.js";
/**
 * An async execution block can start tasks that will be executed asynchronously.
 * It should also be responsible for clearing it in _cancelPendingTasks.
 */
export class FlowGraphAsyncExecutionBlock extends FlowGraphExecutionBlockWithOutSignal {
    constructor(config, events) {
        super(config);
        this._eventsSignalOutputs = {};
        this.done = this._registerSignalOutput("done");
        if (events) {
            for (const eventName of events) {
                this._eventsSignalOutputs[eventName] = this._registerSignalOutput(eventName + "Event");
            }
        }
    }
    /**
     * @internal
     * This function can be overridden to execute any
     * logic that should be executed on every frame
     * while the async task is pending.
     * @param context the context in which it is running
     */
    _executeOnTick(_context) { }
    /**
     * @internal
     * @param context
     */
    _startPendingTasks(context) {
        if (context._getExecutionVariable(this, "_initialized", false)) {
            this._cancelPendingTasks(context);
            this._resetAfterCanceled(context);
        }
        this._preparePendingTasks(context);
        context._addPendingBlock(this);
        this.out._activateSignal(context);
        context._setExecutionVariable(this, "_initialized", true);
    }
    _resetAfterCanceled(context) {
        context._deleteExecutionVariable(this, "_initialized");
        context._removePendingBlock(this);
    }
}
//# sourceMappingURL=flowGraphAsyncExecutionBlock.js.map