/** This file must only contain pure code and pure imports */
import { FlowGraphAsyncExecutionBlock } from "../../../flowGraphAsyncExecutionBlock.js";
import { RichTypeFlowGraphInteger, RichTypeNumber } from "../../../flowGraphRichTypes.pure.js";
import { AdvancedTimer } from "../../../../Misc/timer.js";
import { Logger } from "../../../../Misc/logger.js";
import { FlowGraphInteger } from "../../../CustomTypes/flowGraphInteger.pure.js";
import { IsDelayActive, MarkDelayActive, MarkDelayInactive } from "../../../flowGraphDelayRegistry.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that sets a delay in seconds before activating the output signal.
 */
export class FlowGraphSetDelayBlock extends FlowGraphAsyncExecutionBlock {
    constructor(config) {
        super(config);
        this.cancel = this._registerSignalInput("cancel");
        this.duration = this.registerDataInput("duration", RichTypeNumber);
        this.lastDelayIndex = this.registerDataOutput("lastDelayIndex", RichTypeFlowGraphInteger, new FlowGraphInteger(-1));
    }
    _preparePendingTasks(context) {
        const duration = this.duration.getValue(context);
        if (duration < 0 || isNaN(duration) || !isFinite(duration)) {
            return this._reportError(context, "Invalid duration in SetDelay block");
        }
        // active delays are global to the context
        const activeDelays = context._getGlobalContextVariable("activeDelays", 0);
        if (activeDelays >= FlowGraphSetDelayBlock.MaxParallelDelayCount) {
            return this._reportError(context, "Max parallel delays reached");
        }
        // get the last global delay index
        const lastDelayIndex = context._getGlobalContextVariable("lastDelayIndex", -1);
        // these are block-specific and not global
        const timers = context._getExecutionVariable(this, "pendingDelays", []);
        const scene = context.configuration.scene;
        const timer = new AdvancedTimer({
            timeout: duration * 1000, // duration is in seconds
            contextObservable: scene.onBeforeRenderObservable,
            onEnded: () => this._onEnded(timer, context),
        });
        timer.start();
        const newIndex = lastDelayIndex + 1;
        this.lastDelayIndex.setValue(new FlowGraphInteger(newIndex), context);
        context._setGlobalContextVariable("lastDelayIndex", newIndex);
        // Track the delay as active so a host can report the handle as valid until it fires or
        // is cancelled.
        MarkDelayActive(context, newIndex);
        timers[newIndex] = timer;
        context._setExecutionVariable(this, "pendingDelays", timers);
        this._updateGlobalTimers(context);
    }
    _cancelPendingTasks(context) {
        const timers = context._getExecutionVariable(this, "pendingDelays", []);
        const globalTimers = context._getGlobalContextVariable("pendingDelays", []);
        for (let index = 0; index < timers.length; index++) {
            const timer = timers[index];
            if (timer) {
                timer.dispose();
                // The delay is no longer scheduled, so drop it from the active set.
                MarkDelayInactive(context, index);
                delete globalTimers[index];
            }
        }
        context._setGlobalContextVariable("pendingDelays", globalTimers);
        context._deleteExecutionVariable(this, "pendingDelays");
        this.lastDelayIndex.setValue(new FlowGraphInteger(-1), context);
        this._updateGlobalTimers(context);
    }
    _execute(context, callingSignal) {
        if (callingSignal === this.cancel) {
            this._cancelPendingTasks(context);
            return;
        }
        else {
            this._preparePendingTasks(context);
            this.out._activateSignal(context);
        }
    }
    getClassName() {
        return "FlowGraphSetDelayBlock" /* FlowGraphBlockNames.SetDelay */;
    }
    _onEnded(timer, context) {
        const timers = context._getExecutionVariable(this, "pendingDelays", []);
        const index = timers.indexOf(timer);
        if (index !== -1) {
            delete timers[index];
            const globalTimers = context._getGlobalContextVariable("pendingDelays", []);
            delete globalTimers[index];
            context._setGlobalContextVariable("pendingDelays", globalTimers);
            // The delay has fired and is no longer scheduled.
            MarkDelayInactive(context, index);
        }
        else {
            Logger.Warn("FlowGraphTimerBlock: Timer ended but was not found in the running timers list");
        }
        context._removePendingBlock(this);
        this.done._activateSignal(context);
        this._updateGlobalTimers(context);
    }
    _updateGlobalTimers(context) {
        const timers = context._getExecutionVariable(this, "pendingDelays", []);
        const globalTimers = context._getGlobalContextVariable("pendingDelays", []);
        // there should NEVER be the same index in the global and local timers, unless they are equal
        for (let i = 0; i < timers.length; i++) {
            // A hole in this block's local timers array (an index owned by a different delay block) or an
            // index whose delay is no longer active must be skipped. Only `continue` here — never
            // `delete globalTimers[i]`, because for a hole index `i` the global slot belongs to another
            // block and deleting it would silently drop that block's still-pending delay.
            if (!timers[i] || !IsDelayActive(context, i)) {
                continue;
            }
            const timer = timers[i];
            if (globalTimers[i] && globalTimers[i] !== timer) {
                Logger.Warn("FlowGraphTimerBlock: Timer ended but was not found in the running timers list");
            }
            else {
                globalTimers[i] = timer;
            }
        }
        context._setGlobalContextVariable("pendingDelays", globalTimers);
    }
}
/**
 * The maximum number of parallel delays that can be set per node.
 */
FlowGraphSetDelayBlock.MaxParallelDelayCount = 100;
let _Registered = false;
/**
 * Register side effects for flowGraphSetDelayBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphSetDelayBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphSetDelayBlock" /* FlowGraphBlockNames.SetDelay */, FlowGraphSetDelayBlock);
}
//# sourceMappingURL=flowGraphSetDelayBlock.pure.js.map